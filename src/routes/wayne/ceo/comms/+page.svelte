<script lang="ts">
  import { onAuthStateChanged } from 'firebase/auth';
  import { auth, db } from '$lib/firebase.client';
  import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  let allowed = $state(false);

  onMount(() => {
    const params = new URLSearchParams(window.location.search);
    const codeFromQuery = params.get('code')?.trim().toUpperCase();

    if (codeFromQuery) {
      joinCode = codeFromQuery;
      history.replaceState({}, '', window.location.pathname);
    } else {
      const redirectCode = sessionStorage.getItem('roomRedirectCode');

      if (redirectCode) {
        joinCode = redirectCode.toUpperCase();
        sessionStorage.removeItem('roomRedirectCode');
      }
    }

    onAuthStateChanged(auth, (user) => {
        if (!user) {
            goto('/');
            return;
        }

        if (user.email === 'bruce@wayne.com') {
            allowed = true;
        } else {
            goto('/');
            return;
        }

        currentUser = user;
    });
});

  let currentUser;
  let joinCode = '';
  let errorMessage = '';


function generateRoomCode(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

async function createRoom(currentUser) {
  let code;
  let exists = true;

  while (exists) {
    code = generateRoomCode();
    const ref = doc(db, 'rooms', code);
    const snap = await getDoc(ref);
    exists = snap.exists();
  }

  await setDoc(doc(db, 'rooms', code), {
    createdAt: serverTimestamp(),
    createdBy: currentUser.uid,
    isActive: true
  });

  return code;
}

async function handleCreateRoom() {
  if (!currentUser) return;

  try {
    const code = await createRoom(currentUser);
    sessionStorage.setItem('lastRoomCode', code);
    window.location.assign(`/wayne/batman/comms/room/${code}`);
  } catch (e) {
    console.error(e);
    errorMessage = 'Failed to create room';
  }
}

async function handleJoinRoom() {
  if (!currentUser) return;

  const code = joinCode.trim().toUpperCase();
  if (code.length !== 8) {
    errorMessage = 'Room code must be 8 characters';
    return;
  }

  try {
    const ref = doc(db, 'rooms', code);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      errorMessage = 'Room not found';
      return;
    }

    sessionStorage.setItem('lastRoomCode', code);
    window.location.assign(`/wayne/batman/comms/room/${code}`);
  } catch (e) {
    console.error(e);
    errorMessage = 'Failed to join room';
  }
}

</script>

{#if allowed}
<main class="p-8">
	<h1>Wayne Internal Dashboard</h1>
	<p>
		Welcome, Bruce Wayne. Here you can access all internal resources and information related to
		Wayne Enterprises.
	</p>
	<h2>sitenav:</h2>
	<br /> <a href="/wayne/ceo" class="text-blue-500 hover:underline">CEO's Office</a> <br />
    <a href="/wayne/ceo/financials" class="text-blue-500 hover:underline">Financial Reports</a> <br />
	<p class="text-gray-400">Communication Center (You are here)</p>
	
    <br /> <br /> <br />

    <br />
    <div>
    <section>contacts:</section>
    <a href="/wayne/ceo/comms/alfred" class="text-blue-500 hover:underline">Alfred Pennyworth</a><br />
    <a href="/wayne/ceo/comms/william" class="text-blue-500 hover:underline">William Earle</a><br />
    <a href="/wayne/ceo/comms/miranda" class="text-blue-500 hover:underline">Miranda Tate</a><br />
    <a href="/wayne/ceo/comms/lucius" class="text-blue-500 hover:underline">Lucius Fox</a><br />
    <a href="/wayne/ceo/comms/philip" class="text-blue-500 hover:underline">Philip Kane</a><br />

    <br />

    <h2 class="text-xl">Create a room</h2>
    <button class="text-blue-500 hover:underline" onclick={handleCreateRoom}>
      Generate Room Code
    </button>

    <br /><br />

    <h2 class="text-xl">Join a room</h2>
    <input
      type="text"
      id="a"
      maxlength="8"
      bind:value={joinCode}
      placeholder="Enter 8-char code"
      style="text-transform: uppercase; padding: 0.5rem;"
    />

    <br />
    <button class="text-blue-500 hover:underline" onclick={handleJoinRoom}>
      Join Room
    </button>

    </div>

    {#if errorMessage}
      <p style="color: red; margin-top: 1rem;">{errorMessage}</p>
    {/if}
</main>
{/if}