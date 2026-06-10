<script lang="ts">
    import { onMount } from 'svelte';
    import { auth } from '$lib/firebase.client';
    import { onAuthStateChanged } from 'firebase/auth';
    import { goto } from '$app/navigation';
    import { doc, getDoc, setDoc } from 'firebase/firestore';
    import { db } from '$lib/firebase.client';

    let allowed = $state(false);
    let sidebarOpen = $state(true); 

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
            statee = saved;
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

    async function loadState() {
        const ref = doc(db, "batman", "arsenal");
        const snap = await getDoc(ref);
        if (snap.exists()) {
            return snap.data();
        }
        return null;
    }

    async function saveState() {
        await setDoc(
            doc(db, "batman", "arsenal"),
            statee
        );
    }

    let statee = $state({
        devices: {
            sonic: "OFFLINE",
            emp: "OFFLINE",
            gel: "OFFLINE",
            batmobile: "NOT READY",
            suit: "NOT READY"
        },
        inventory: {
            batarang: 100,
            smoke: 100,
            claw: 100,
            dart: 100,
            suit: 100
        }
    });

    async function toggleDevice(key: 'sonic' | 'emp' | 'gel') {
        statee.devices[key] = statee.devices[key] === 'OFFLINE' ? 'ONLINE' : 'OFFLINE';
        statee = { ...statee };
        await saveState();
    }

    async function toggleVehicleSuit(key: 'batmobile' | 'suit') {
        statee.devices[key] = statee.devices[key] === 'NOT READY' ? 'READY' : 'NOT READY';
        statee = { ...statee };
        await saveState();
    }

    async function change(item: string, delta: number) {
        const key = item as keyof typeof statee.inventory;
        statee.inventory[key] = Math.max(0, statee.inventory[key] + delta);
        statee = { ...statee };
        await saveState();
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
        <p class="text-gray-500 font-semibold mt-2">Arsenal</p>
        <a href="/wayne/batman/missions" class="text-blue-500 hover:underline">Access Missions</a>
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

      <section class="flex flex-col gap-4">
          <h2 class="text-2xl text-white">Devices:</h2>
          <div class="flex flex-wrap gap-4">
              <button class="{statee.devices.sonic === 'ONLINE' ? 'bg-green-500' : 'bg-red-500'} text-black rounded-xl p-5 shadow-lg border border-white/10 w-64 transition-colors" onclick={() => toggleDevice('sonic')}>
                  <h2 class="text-lg font-bold">Sonic Devices</h2>
                  <p class="text-sm font-semibold mt-1">State: {statee.devices.sonic}</p>
              </button>
              <button class="{statee.devices.emp === 'ONLINE' ? 'bg-green-500' : 'bg-red-500'} text-black rounded-xl p-5 shadow-lg border border-white/10 w-64 transition-colors" onclick={() => toggleDevice('emp')}>
                  <h2 class="text-lg font-bold">EMP Devices</h2>
                  <p class="text-sm font-semibold mt-1">State: {statee.devices.emp}</p>
              </button>
              <button class="{statee.devices.gel === 'ONLINE' ? 'bg-green-500' : 'bg-red-500'} text-black rounded-xl p-5 shadow-lg border border-white/10 w-64 transition-colors" onclick={() => toggleDevice('gel')}>
                  <h2 class="text-lg font-bold">Explosive Gel Blasters</h2>
                  <p class="text-sm font-semibold mt-1">State: {statee.devices.gel}</p>
              </button>
              <button class="{statee.devices.batmobile === 'READY' ? 'bg-green-500' : 'bg-red-500'} text-black rounded-xl p-5 shadow-lg border border-white/10 w-64 transition-colors" onclick={() => toggleVehicleSuit('batmobile')}>
                  <h2 class="text-lg font-bold">Batmobile</h2>
                  <p class="text-sm font-semibold mt-1">State: {statee.devices.batmobile}</p>
              </button>
              <button class="{statee.devices.suit === 'READY' ? 'bg-green-500' : 'bg-red-500'} text-black rounded-xl p-5 shadow-lg border border-white/10 w-64 transition-colors" onclick={() => toggleVehicleSuit('suit')}>
                  <h2 class="text-lg font-bold">Bat Suit</h2>
                  <p class="text-sm font-semibold mt-1">State: {statee.devices.suit}</p>
              </button>
          </div>
      </section>

      <section class="py-8 text-white">
          <h2 class="text-2xl mb-4">Tools Inventory</h2>
          <div class="flex flex-col gap-2">
              {#each Object.entries(statee.inventory) as [key, value]}
                  <div class="flex items-center justify-between w-80 border p-3 rounded-xl border-white/10 bg-black/30">
                      <div>
                          <p class="font-bold capitalize">{key}</p>
                          <p class="text-sm text-gray-400">Stock: {value}</p>
                      </div>
                      <div class="flex gap-2">
                          <button class="px-3 py-1 bg-red-500 rounded text-black font-bold active:scale-95 transition-transform" onclick={() => change(key, -1)}>-</button>
                          <button class="px-3 py-1 bg-green-500 rounded text-black font-bold active:scale-95 transition-transform" onclick={() => change(key, 1)}>+</button>
                      </div>
                  </div>
              {/each}
          </div>
      </section>
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
</style>