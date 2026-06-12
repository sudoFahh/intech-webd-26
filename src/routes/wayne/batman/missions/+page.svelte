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
    });

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
		todoList.splice(index, 1)
		todoList = todoList;
        saveState();
    }

    function removeCompleted(){
        todoList = todoList.filter(item => !item.status);
        saveState();
    }

    function makeClear(index) {
        todoList[index].status = !todoList[index].status;
        todoList = [...todoList];
        saveState();
    }
</script>

<svelte:head>
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
</svelte:head>

{#if allowed}
    <main class="bg-[#0e0b0b] min-h-screen flex overflow-hidden text-white">
  <div class={`grid overflow-hidden transition-all duration-300 shrink-0 ${sidebarOpen ? 'grid-cols-[300px]' : 'grid-cols-[0px]'}`}>
    <div class="overflow-hidden flex flex-col gap-3 p-6 border-r border-neutral-800 bg-[#0e0b0b]">
      <button onclick={() => sidebarOpen = !sidebarOpen} class="material-symbols-outlined self-end text-white cursor-pointer">close</button>
      <h1 class="text-2xl font-bold mb-2">The Batcave</h1>
      <p class="text-sm text-gray-400 mb-4">Welcome, Batman.</p>
      <nav class="flex flex-col gap-2">
        <a href="/wayne/batman" class="text-blue-500 hover:underline">Access Batcomputer</a>
        <a href="/wayne/batman/arsenal" class="text-blue-500 hover:underline">Access Arsenal</a>
        <p class="text-gray-500 font-semibold mt-2">Missions</p>
        <a href="/wayne/batman/comms" class="text-blue-500 hover:underline">Access Communication Center</a>
        <a href="/wayne/batman/maps" class="text-blue-500 hover:underline">Access the Map of Gotham</a>
        <a href="/wayne/batman/music" class="text-blue-500 hover:underline">Access the Bat Jukebox</a>
        <a href="/wayne/batman/notes" class="text-blue-500 hover:underline">Access Notes</a>
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
    <section class="p-8">
        <h2 class="text-3xl font-black tracking-tight mb-4 text-white">Missions</h2>
        <input bind:value={newItem} type="text" placeholder="New Mission...">
        <input type="date" class="text-black" bind:value={selectedDate} />
        <button class="text-white" onclick={addToList}>Add</button>
        <br/>
        {#each todoList as item, index}
        <button onclick={() => makeClear(index)} class="text-white text-2xl" class:checked={item.status}>{item.text}</button> <br />
        <sup class="text-white" onclick={() => removeFromList(index)}>remove</sup>
        <br/>
        {/each} 
        <button onclick={removeCompleted} class="text-white">Remove Completed</button>
    </section>
</div>
</main>
{/if}

<style> 
	.checked {
        text-decoration: line-through;
    }
</style> 