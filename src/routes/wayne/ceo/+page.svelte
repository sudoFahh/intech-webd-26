<script lang="ts">
  import { onMount } from 'svelte';
  import { auth } from '$lib/firebase.client';
  import { onAuthStateChanged, signOut } from 'firebase/auth';
  import { goto } from '$app/navigation';
  import { doc, getDoc, setDoc } from 'firebase/firestore';
  import { db } from '$lib/firebase.client';

  let allowed = $state(false);
  let sidebarOpen = $state(true);
  let newItem = $state('');
  let todoList = $state([]);
  let selectedDate = $state('');

  onMount(async () => {
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

  async function loadState() {
    const ref = doc(db, "batman", "missions");
    const snap = await getDoc(ref);
    if (snap.exists()) {
      return snap.data().missions ?? [];
    }
    return [];
  }

  async function saveState() {
    await setDoc(
      doc(db, "batman", "missions"),
      { missions: todoList }
    );
  }

  onMount(async () => {
    const saved = await loadState();
    if (saved) {
      todoList = saved;
    } else {
      await saveState();
    }
  });

  function getCookie(name: string): string {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || "";
    return "";
  }
	
  function addToList() {
    if(newItem != "" && selectedDate === "") {
      todoList = [...todoList, {text: newItem, status: false}];
      newItem = '';
    }
    if(selectedDate != "" && newItem != ""){
      todoList = [...todoList, {text: newItem + " by " + selectedDate, status: false}];
      newItem = '';
      selectedDate = '';
    }
    saveState();
  }
	
  function removeFromList(index) {
    todoList.splice(index, 1);
    todoList = todoList;
    saveState();
  }

  function removeCompleted(){
    todoList = todoList.filter(item => !item.status);
    saveState();
  }

  // Added index argument here so Svelte knows which mission you clicked
  function makeClear(index) {
    todoList[index].status = !todoList[index].status;
    todoList = [...todoList];
    saveState();
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
<main class="bg-[#fcfcfc] text-neutral-900 min-h-screen flex overflow-hidden">
  
  <!-- SIDEBAR -->
  <div class={`grid overflow-hidden transition-all duration-300 shrink-0 ${sidebarOpen ? 'grid-cols-[300px]' : 'grid-cols-[0px]'}`}>
    <div class="overflow-hidden flex flex-col gap-3 p-6 border-r border-neutral-200 bg-[#f5f5f5] h-full">
      <button onclick={() => sidebarOpen = !sidebarOpen} class="material-symbols-outlined self-end text-neutral-600 cursor-pointer hover:text-black">
        close
      </button>
      <h1 class="text-2xl font-bold mb-2 text-neutral-800">Wayne Enterprises</h1>
      <p class="text-sm text-neutral-600 mb-4">Welcome, Bruce Wayne.</p>
      <nav class="flex flex-col gap-2">
        <p class="text-neutral-500">CEO's Office</p>
        <a href="/wayne/ceo/financials" class="text-blue-600 hover:underline">Financial Reports</a>
        <a href="/wayne/ceo/comms" class="text-blue-600 hover:underline mb-2">Communication Center</a>
        <hr />
        <button class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition w-full mt-2" onclick={logout}>Log Out</button>
      </nav>
    </div>
  </div>

  <!-- MAIN CENTER AREA -->
  <div class="flex-1 overflow-y-auto p-8 relative">
    {#if !sidebarOpen}
      <div class="absolute top-6 left-6">
        <button onclick={() => sidebarOpen = !sidebarOpen} class="material-symbols-outlined text-neutral-700 cursor-pointer hover:text-black">
          menu
        </button>
      </div>
    {/if}

    <div class={sidebarOpen ? "" : "ml-10"}>
      <h1 class="text-3xl font-black tracking-tight mb-4">CEO's Office</h1>
      <p class="text-neutral-600 max-w-2xl mb-8">
        Welcome, Mr. Wayne. Here you can access all internal resources, financial reports, and operations details related to Wayne Enterprises.
      </p>

      <section>
        <h2 class="text-xl font-bold mb-4 tracking-wide">Events</h2>
        
        <div class="flex flex-wrap gap-2 mb-4">
          <input bind:value={newItem} type="text" placeholder="New Event...">
          <input type="date" bind:value={selectedDate} />
          <button onclick={addToList}>Add</button>
        </div>

        <div class="flex flex-col gap-3">
          {#each todoList as item, index}
            <div class="flex items-center justify-between bg-neutral-800 p-3 rounded border border-neutral-700">
              <button onclick={() => makeClear(index)} class="text-left font-medium transition-all" class:checked={item.status}>
                {item.text}
              </button>
              <button class="text-xs text-red-400 hover:text-red-300 underline uppercase tracking-wider" onclick={() => removeFromList(index)}>remove</button>
            </div>
          {/each} 
        </div>

        {#if todoList.length > 0}
          <button onclick={removeCompleted} class="mt-4 text-xs text-neutral-400 hover:text-white underline block ml-auto">Clear Completed Missions</button>
        {/if}
      </section>
    </div>
  </div>

  <div class="p-8 overflow-y-auto shrink-0 border-l border-neutral-200 bg-white min-h-screen">
    <div class="bg-white border border-neutral-200 rounded-lg p-4 w-full max-w-md">
      <div class="flex justify-between items-center mb-2">
        <div>
          <h2 class="font-bold">Wayne Enterprises</h2>
          <p class="text-sm text-neutral-500">NYSE: WAYN</p>
        </div>
        <span class="text-green-600 font-semibold">+$13.02</span>
      </div>

      <svg viewBox="0 0 100 40" class="w-full h-24">
        <polyline
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          class="text-green-600"
          points="0,35 10,32 20,28 30,30 40,24 50,20 60,22 70,15 80,12 90,14 100,5"
        />
      </svg>

      <p class="text-xs text-neutral-400 mt-2">
        5Y performance
      </p>

      <div class="grid grid-cols-2 gap-3 mt-6 text-sm">
        <div class="border border-neutral-200 rounded p-3">
          <p class="font-medium">Wayne Aerospace</p>
          <p class="text-neutral-500">WAYN-A</p>
          <p class="text-green-600 mt-1">▲ 3.2%</p>
        </div>

        <div class="border border-neutral-200 rounded p-3">
          <p class="font-medium">Wayne Biotech</p>
          <p class="text-neutral-500">WAYN-B</p>
          <p class="text-red-600 mt-1">▼ 0.8%</p>
        </div>

        <div class="border border-neutral-200 rounded p-3">
          <p class="font-medium">Wayne Energy</p>
          <p class="text-neutral-500">WAYN-E</p>
          <p class="text-green-600 mt-1">▲ 1.9%</p>
        </div>

        <div class="border border-neutral-200 rounded p-3">
          <p class="font-medium">Wayne Technologies</p>
          <p class="text-neutral-500">WAYN-T</p>
          <p class="text-green-600 mt-1">▲ 5.4%</p>
        </div>
      </div>
      <hr class="mb-2 mt-2"/>
      <p class="text-sm text-neutral-700 leading-relaxed"><b>Quarterly Summary (Generated with AI):</b> Wayne Enterprises and its subsidiaries continue to demonstrate strong long-term growth despite periodic market volatility. Wayne Aerospace has benefited from increased government and commercial contracts, while Wayne Applied Sciences remains a key driver of innovation-led expansion. Wayne Energy posted steady gains following infrastructure investments, and Wayne Biotech recovered after regulatory concerns earlier in the fiscal year. Overall, the Wayne portfolio maintains a positive outlook with diversified performance across strategic sectors. Analysts project moderate but stable growth over the next two quarters, supported by continued investment in research, infrastructure, and emerging technologies. Internal assessments indicate that the conglomerate's diversified structure has strengthened its resilience against sector-specific downturns and broader economic uncertainty.</p>
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
    'opsz' 24
  }
  .checked {
    text-decoration: line-through;
    opacity: 0.5;
  }
</style>