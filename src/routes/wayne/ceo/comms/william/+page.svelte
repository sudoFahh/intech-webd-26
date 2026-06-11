<script lang="ts">
  import './layout.css'
  import { browser } from '$app/environment';
  import { auth, db } from '$lib/firebase.client';
  import { onMount, onDestroy } from 'svelte';
  import { onAuthStateChanged } from 'firebase/auth';
  import {
    query,
    collection,
    orderBy,
    addDoc,
    serverTimestamp,
    onSnapshot
  } from 'firebase/firestore';

  let currentUser = $state(null);
  let authReady = $state(false);
  let posts = $state([]);
  let postText = $state('');
  let statusMessage = $state('');
  let unsubscribePosts = null;

  function listenToPosts() {
    if (!browser) return;

    const q = query(
      collection(db, 'william_ceo_chat'),
      orderBy('createdAt', 'asc')
    );

    unsubscribePosts = onSnapshot(q, (snapshot) => {
      posts = snapshot.docs.map((doc) => ({
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

    const userMessage = postText;

    try {
      await addDoc(collection(db, 'william_ceo_chat'), {
        text: userMessage,
        createdAt: serverTimestamp(),
        createdBy: currentUser.displayName ?? 'Bruce Wayne'
      });

      postText = '';

      const response = await fetch('/api/william_ceo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: userMessage
        })
      });

      const data = await response.json();

      await addDoc(collection(db, 'william_ceo_chat'), {
        text: data.reply,
        createdAt: serverTimestamp(),
        createdBy: 'William'
      });

    } catch (e) {
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
      onkeydown={(e) => e.key === 'Enter' && postMessage()}
    />
    <button onclick={postMessage}>Send</button>
  </div>
<a href="/wayne/ceo/comms">go back to comms</a>
{:else if authReady}
  <p>Sign in to send messages.</p>
{/if}