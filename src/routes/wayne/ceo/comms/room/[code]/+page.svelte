<script>
  import { browser } from '$app/environment';
  import { auth, db } from '$lib/firebase.client';
  import { onMount, onDestroy } from 'svelte';
  import { goto } from '$app/navigation';
  import { resolve } from '$app/paths';
  import { onAuthStateChanged } from 'firebase/auth';
  import { query, collection, orderBy, addDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';

  const { params } = $props();
  let roomCode = params.code;

  let currentUser = $state(null);
  let authReady = $state(false);
  let posts = $state([]);
  let postText = $state('');
  let statusMessage = $state('');
  let unsubscribePosts = null;

  function listenToPosts() {
    if (!browser) return;

    const q = query(
      collection(db, `rooms/${roomCode}/messages`),
      orderBy('createdAt', 'asc')
    );

    unsubscribePosts = onSnapshot(q, (snapshot) => {
      posts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    });
  }

  async function postMessage() {
    statusMessage = '';

    if (!postText.trim()) return;

    if (!currentUser) {
      statusMessage = 'You must be signed in to send messages.';
      return;
    }

    try {
      await addDoc(collection(db, `rooms/${roomCode}/messages`), {
        text: postText,
        createdAt: serverTimestamp(),
        createdBy: currentUser.displayName ?? 'Bruce Wayne'
      });

      postText = '';
    } 
     catch (e) {
    console.error(e);

    if (e instanceof Error) {
      statusMessage = e.message;
    } else {
      statusMessage = 'Unknown error';
    }
  }
  }

  onMount(() => {
    if (!browser) return;

    const allowedRoom = sessionStorage.getItem('lastRoomCode');

    if (allowedRoom !== roomCode) {
      sessionStorage.setItem('roomRedirectCode', roomCode);
      goto(resolve(`/?code=${roomCode}`), { replaceState: true });
      return;
    }

    onAuthStateChanged(auth, (u) => {
      currentUser = u;
      authReady = true;
    });

    listenToPosts();
  });

  onDestroy(() => {
    unsubscribePosts?.();
  });
</script>

<div class="chat-header">
  {#if !authReady}
    <div>Checking session…</div>
  {:else if currentUser}
    <div>{currentUser.displayName}</div>
  {:else}
    <div>Guest</div>
  {/if}

  <div>Room: {roomCode}</div>
</div>

{#if statusMessage}
  <div class="status-message">{statusMessage}</div>
{/if}

<div class="chat-feed">
  {#if posts.length === 0}
    <p>No messages yet</p>
  {/if}

  {#each posts as post (post.id)}
    <div class="chat-message">
      <div style="font-size: 0.8rem; color: #555;">
        {post.createdBy}
        @
        {post.createdAt?.seconds
          ? new Date(post.createdAt.seconds * 1000).toLocaleTimeString()
          : 'Just now'}
      </div>

      <div>{post.text}</div>
    </div>
  {/each}
</div>

{#if authReady && currentUser}
  <div class="chat-input">
    <input
      bind:value={postText}
      placeholder="Type your message..."
      on:keydown={(e) => e.key === 'Enter' && postMessage()}
    />
    <button on:click={postMessage}>Send</button>
  </div>
<a href="/wayne/ceo/comms">go back to comms</a>
{:else if authReady}
  <p>Sign in to send messages.</p>
{/if}