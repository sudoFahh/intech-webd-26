<script>
  import { onMount } from 'svelte';
  import { auth } from '$lib/firebase.client';
  import { onAuthStateChanged, signOut } from 'firebase/auth';
  import { goto } from '$app/navigation';

  let allowed = $state(false);
  let sidebarOpen = $state(true);
  let timestamp = $state("Loading...");
  let weather = $state("Loading...");

  onMount(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        goto('/');
        return;
      }

      if (user.email === 'batman@wayne.com' && getCookie("batman_key")) {
        allowed = true;
      } else {
        goto('/');
      }
    });

    timestamp = new Date().toLocaleString();

      const interval = setInterval(() => {
          timestamp = new Date().toLocaleString();
      }, 1000);

      return () => clearInterval(interval);
  });

  onMount(async () => {
      const data = await fetch("https://wttr.in/Ghaziabad?format=j1")
          .then(r => r.json());

      weather =
          `${data.current_condition[0].weatherDesc[0].value} •  ` +
          `${data.current_condition[0].temp_C}°C`;
  });

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return "";
    }

    async function logout() {
        await signOut(auth);
        goto('/');
  }
</script>

<svelte:head>
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
</svelte:head>

{#if allowed}
    <main class="bg-[#0e0b0b] min-h-screen flex overflow-hidden text-white">
  <div class={`grid overflow-hidden transition-all duration-300 shrink-0 ${sidebarOpen ? 'grid-cols-[300px]' : 'grid-cols-[0px]'}`}>
    <div class="overflow-hidden min-w-0 flex flex-col gap-3 p-6 border-r border-neutral-800 bg-[#0e0b0b]">
      <button onclick={() => sidebarOpen = !sidebarOpen} class="material-symbols-outlined self-end text-white cursor-pointer">close</button>
      <h1 class="text-2xl font-bold mb-2">The Batcave</h1>
      <p class="text-sm text-gray-400 mb-4">Welcome, Batman.</p>
      <nav class="flex flex-col gap-2">
        <p class="text-gray-500 font-semibold mt-2">Batcomputer</p>
        <a href="/wayne/batman/arsenal" class="text-blue-500 hover:underline">Access Arsenal</a>
        <a href="/wayne/batman/missions" class="text-blue-500 hover:underline">Access Missions</a>
        <a href="/wayne/batman/comms" class="text-blue-500 hover:underline">Access Communication Center</a>
        <a href="/wayne/batman/maps" class="text-blue-500 hover:underline">Access the Map of Gotham</a>
        <a href="/wayne/batman/music" class="text-blue-500 hover:underline">Access the Bat Jukebox</a>
        <a href="/wayne/batman/notes" class="text-blue-500 hover:underline mb-2">Access Notes</a>
        <hr />
        <button class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition w-full mt-2" onclick={logout}>Log Out</button>
      </nav>
    </div>
  </div>

  <div class="flex-1 overflow-y-auto relative p-8">
    {#if !sidebarOpen}
      <div class="absolute top-6 left-6">
        <button onclick={() => sidebarOpen = !sidebarOpen} class="material-symbols-outlined text-white cursor-pointer">menu</button>
      </div>
    {/if}

    <div class={sidebarOpen ? "" : "ml-10"}>
    <br />
<div class="flex flex-col items-center justify-center text-center gap-6">
<h2 class="font-black tracking-tight mb-4 text-white text-3xl">Hello, Batman.</h2>
<p>Hello Dark Knight. Are you ready for fighting crime? </p> <center> <br /> <br /> <div class="rounded-lg border p-4 w-full max-w-4xl"> <div class="rounded-lg border p-4 w-100"><span class="text-2xl">Time: {timestamp}</span> <br /> <span class="text-2xl">Weather: {weather}</span></div> <br /> 
<br />

<iframe src="https://intechwebd26news.wordpress.com/" height="500px" width="800px"></iframe> <br />
</div>
</center>
</div>
</main>
<style>
    html, body {
  background: #0e0b0b;
    }
</style>
{/if}