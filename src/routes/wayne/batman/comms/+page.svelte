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

        if (user.email === 'batman@wayne.com' && getCookie("batman_key")) {
            allowed = true;
        } else {
            goto('/');
            return;
        }

        currentUser = user;
    });
});

    function getCookie(name: string): string {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop()?.split(';').shift() || "";
            return "";
        }

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
<main class="bg-[#0e0b0b] min-h-screen">
<section class="p-8 text-white">
        <h1 class="text-3xl font-bold mb-4">The Batcave</h1>
        <p>Welcome to the Batcave, Batman. <br /> What tools would you like to use?</p> <br />
        <a href="/wayne/batman" class="text-blue-500 hover:underline">Access Batcomputer</a> <br />
        <a href="/wayne/batman/arsenal" class="text-blue-500 hover:underline">Access Arsenal</a> <br />
        <a href="/wayne/batman/missions" class="text-blue-500 hover:underline">Access Missions</a> <br />
        <p class="text-gray-400">Communications Center (You are here)</p>
        <a href="/wayne/batman/maps" class="text-blue-500 hover:underline">Access the Map of Gotham</a> <br />
        <a href="/wayne/batman/music" class="text-blue-500 hover:underline">Access the Bat Jukebox</a> <br />
        <a href="/wayne/batman/notes" class="text-blue-500 hover:underline">Access Notes</a> <br />
    </section>

    <br />
    <div class="p-8">
    <section class="text-white">contacts:</section>
    <a href="/wayne/batman/comms/alfred" class="text-blue-500 hover:underline">Alfred (Butler)</a><br />
    <a href="/wayne/batman/comms/gordon" class="text-blue-500 hover:underline">James Gordon (GCPD)</a><br />
    <a href="/wayne/batman/comms/oracle" class="text-blue-500 hover:underline">Oracle (Intel)</a><br />
    <a href="/wayne/batman/comms/lucius" class="text-blue-500 hover:underline">Lucius Fox (R&D)</a><br />
    <a href="/wayne/batman/comms/robin" class="text-blue-500 hover:underline">Robin (Partner)</a><br />

    <br />

    <h2 class="text-xl text-white">Create a room</h2>
    <button class="text-blue-500 hover:underline" onclick={handleCreateRoom}>
      Generate Room Code
    </button>

    <br /><br />

    <h2 class="text-xl text-white">Join a room</h2>
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