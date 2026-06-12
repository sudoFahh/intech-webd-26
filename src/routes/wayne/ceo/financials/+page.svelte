<script>
  import { onMount } from 'svelte';
  import { auth } from '$lib/firebase.client';
  import { onAuthStateChanged, signOut } from 'firebase/auth';
  import { goto } from '$app/navigation';

  let allowed = $state(false);
  let sidebarOpen = $state(true);

  onMount(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        goto('/');
        return;
      }

      if (user.email === 'bruce@wayne.com') {
        allowed = true;
      } else {
        goto('/');
      }
    });
  });

</script>

<svelte:head>
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
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
        <a href="/wayne/ceo" class="text-blue-600 hover:underline">CEO's Office</a>
		<p class="text-neutral-500">Financial Reports</p>
        <a href="/wayne/ceo/comms" class="text-blue-600 hover:underline">Communication Center</a>
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
	<a href="/pdfs/1.pdf" class="text-blue-500 hover:underline">First Financial Report</a> <br />
	<a href="/pdfs/2.pdf" class="text-blue-500 hover:underline">Second Financial Report</a> <br />
	<a href="/pdfs/3.pdf" class="text-blue-500 hover:underline">Third Financial Report</a> <br />
	<a href="/pdfs/4.pdf" class="text-blue-500 hover:underline">Fourth Financial Report</a> <br />
	<a href="/pdfs/5.pdf" class="text-blue-500 hover:underline">Fifth Financial Report</a> <br />
	<a href="/pdfs/6.pdf" class="text-blue-500 hover:underline">Sixth Financial Report</a> <br />
	<a href="/pdfs/7.pdf" class="text-blue-500 hover:underline">Seventh Financial Report</a> <br />
	<a href="/pdfs/8.pdf" class="text-blue-500 hover:underline">Eight Financial Report</a> <br />
	<a href="/pdfs/9.pdf" class="text-blue-500 hover:underline">Ninth Financial Report</a> <br />
	<a href="/pdfs/10.pdf" class="text-blue-500 hover:underline">Tenth Financial Report</a> <br />
</main>
{/if}