<script lang="ts">
  import { onAuthStateChanged } from 'firebase/auth';
  import { auth, db } from '$lib/firebase.client';
  import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  let allowed = $state(false);
  let sidebarOpen = $state(true);

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

<svelte:head>
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet"/>
</svelte:head>

{#if allowed}
<main class="bg-[#fcfcfc] text-neutral-900 min-h-screen flex overflow-hidden">

  <div class={`grid overflow-hidden transition-all duration-300 shrink-0 ${sidebarOpen ? 'grid-cols-[300px]' : 'grid-cols-[0px]'}`}>
    <div class="overflow-hidden flex flex-col gap-3 p-6 border-r border-neutral-200 bg-[#f5f5f5] h-full">
      <button onclick={() => sidebarOpen = !sidebarOpen} class="material-symbols-outlined self-end text-neutral-600 cursor-pointer hover:text-black">
        close
      </button>

      <h1 class="text-2xl font-bold mb-2 text-neutral-800">Wayne Enterprises</h1>
      <p class="text-sm text-neutral-600 mb-4">Welcome, Bruce Wayne.</p>

      <nav class="flex flex-col gap-2">
        <a href="/wayne/ceo" class="text-blue-500 hover:underline">CEO's Office</a>
        <a href="/wayne/ceo/financials" class="text-blue-600 hover:underline">Financial Reports</a>
        <p class="text-neutral-500">Communication Center</p>
      </nav>
    </div>
  </div>

  <div class="flex-1 overflow-y-auto p-8 relative">

    {#if !sidebarOpen}
      <div class="absolute top-6 left-6">
        <button onclick={() => sidebarOpen = !sidebarOpen} class="material-symbols-outlined text-neutral-700 cursor-pointer hover:text-black">
          menu
        </button>
      </div>
    {/if}

    <div class={sidebarOpen ? "" : "ml-10"}>
      <h2 class="text-3xl font-black tracking-tight mb-4">Communication Center</h2>
      <div> 
        <section>contacts:</section>
        <a href="/wayne/ceo/comms/alfred" class="text-blue-500 hover:underline">Alfred Pennyworth</a>
        <br /> 
        <a href="/wayne/ceo/comms/william" class="text-blue-500 hover:underline">William Earle</a>
        <br /> 
        <a href="/wayne/ceo/comms/miranda" class="text-blue-500 hover:underline">Miranda Tate</a>
        <br /> 
        <a href="/wayne/ceo/comms/lucius" class="text-blue-500 hover:underline">Lucius Fox</a>
        <br /> 
        <a href="/wayne/ceo/comms/philip" class="text-blue-500 hover:underline">Philip Kane</a>
        <br /> <br />
      <h2 class="text-xl">Create a room</h2>
      <button class="text-blue-500 hover:underline" onclick={handleCreateRoom}>Generate Room Code</button>
      <br /><br />
      <h2 class="text-xl">Join a room</h2>
      <input type="text" maxlength="8" bind:value={joinCode} placeholder="Enter 8-char code" class="border border-neutral-300 rounded px-3 py-2" style="text-transform: uppercase;"/>
      <br /><br />
      <button class="text-blue-500 hover:underline" onclick={handleJoinRoom}>Join Room</button>
      {#if errorMessage}
        <p class="text-red-500 mt-4">{errorMessage}</p>
      {/if}

    </div>
  </div>
  </div>

</main>
{/if}


<style>
.material-symbols-outlined {
  font-variation-settings:
    'FILL' 0,
    'wght' 400,
    'GRAD' 0,
    'opsz' 24;
}
</style>