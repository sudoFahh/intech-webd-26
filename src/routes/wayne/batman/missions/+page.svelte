<script lang="ts">
    import { onMount } from 'svelte';
    import { auth } from '$lib/firebase.client';
    import { onAuthStateChanged, signOut } from 'firebase/auth';
    import { goto } from '$app/navigation';
    import { doc, getDoc, setDoc } from 'firebase/firestore';
    import { db } from '$lib/firebase.client';

    let allowed = $state(false);
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

    function makeClear() {
        item.status = !item.status;
        todoList = [...todoList];
        saveState();
    }
</script>
{#if allowed}
<main class="bg-[#0e0b0b] min-h-screen">
    <section class="p-8 text-white">
        <h1 class="text-3xl font-bold mb-4">The Batcave</h1>
        <p>Welcome to the Batcave, Batman. <br /> What tools would you like to use?</p> <br />
        <a href="/wayne/batman" class="text-blue-500 hover:underline">Access Batcomputer</a> <br />
        <a href="/wayne/batman/arsenal" class="text-blue-500 hover:underline">Access Arsenal</a> <br />
        <p class="text-gray-400">Missions (You are here)</p>
        <a href="/wayne/batman/comms" class="text-blue-500 hover:underline">Access Communication Center</a> <br />
        <a href="/wayne/batman/maps" class="text-blue-500 hover:underline">Access the Map of Gotham</a> <br />
        <a href="/wayne/batman/music" class="text-blue-500 hover:underline">Access the Bat Jukebox</a> <br />
        <a href="/wayne/batman/notes" class="text-blue-500 hover:underline">Access Notes</a> <br />
    </section>
<section class="p-8">
    <input bind:value={newItem} type="text" placeholder="New Mission...">
    <input type="date" bind:value={selectedDate} />
    <button class="text-white" onclick={addToList}>Add</button>
    <br/>
    {#each todoList as item, index}
	<button onclick={makeClear} class="text-white text-2xl"class:checked={item.status}>{item.text}</button> <br />
	<sup class="text-white" onclick={() => removeFromList(index)}>remove</sup>
	<br/>
    {/each} 
    <button onclick={removeCompleted} class="text-white">remove completed</button>
</section>
</main>
{/if}

<style> 
	.checked {
        text-decoration: line-through;
    }
</style> 