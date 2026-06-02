<script lang="ts">
    import { onMount } from "svelte";

    function getCookie(name: string): string {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift() || "";
        return "";
    }

    function setCookie(name: string, value: any): void {
        document.cookie = `${name}=${JSON.stringify(value)}; path=/; max-age=86400`;
    }

    function loadState(): any {
        const data = getCookie("bat_inventory");
        if (data) {
            try {
                return JSON.parse(data);
            } catch {
                return null;
            }
        }
        return null;
    }

    // Single cohesive state block tracking everything
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

    // Helper functions to handle the toggles natively inside the state object
    function toggleDevice(key: 'sonic' | 'emp' | 'gel') {
        statee.devices[key] = statee.devices[key] === 'OFFLINE' ? 'ONLINE' : 'OFFLINE';
        setCookie("bat_inventory", statee);
    }

    function toggleVehicleSuit(key: 'batmobile' | 'suit') {
        statee.devices[key] = statee.devices[key] === 'NOT READY' ? 'READY' : 'NOT READY';
        setCookie("bat_inventory", statee);
    }

    function change(item: string, delta: number) {
        const currentStock = statee.inventory[item as keyof typeof statee.inventory] || 0;
        statee.inventory[item as keyof typeof statee.inventory] = Math.max(0, currentStock + delta);
        setCookie("bat_inventory", statee);
    }

    onMount(() => {
        const access = getCookie("wayne_access");
        if (access !== "true") {
            window.location.href = "/";
        }

        const saved = loadState();
        if (saved && saved.devices && saved.inventory) {
            statee = saved;
        } else {
            setCookie("bat_inventory", statee);
        }
    });
</script>

<main class="bg-[#0e0b0b] min-h-screen">
    <section class="p-8 text-white">
        <h1 class="text-3xl font-bold mb-4">The Batcave</h1>
        <p>Welcome to the Batcave, Batman. <br /> What tools would you like to use?</p> <br />
        <a href="/wayne/batman" class="text-blue-500 hover:underline">Access Batcomputer</a> <br />
        <p class="text-gray-400">Arsenal (You are here)</p>
        <a href="/wayne/batman/missions" class="text-blue-500 hover:underline">Access Missions</a> <br />
        <a href="/wayne/batman/comms" class="text-blue-500 hover:underline">Access Communication Center</a> <br />
        <a href="/wayne/batman/maps" class="text-blue-500 hover:underline">Access the Map of Gotham</a> <br />
        <a href="/wayne/batman/music" class="text-blue-500 hover:underline">Access the Bat Jukebox</a> <br />
    </section>

    <section class="p-8 flex flex-col gap-4">
        <h2 class="text-2xl text-white">Devices:</h2>
        <div class="flex flex-wrap gap-4">
            
            <!-- Sonic Devices -->
            <button
                class="{statee.devices.sonic === 'ONLINE' ? 'bg-green-500' : 'bg-red-500'} text-black rounded-xl p-5 shadow-lg border border-white/10 w-64 transition-colors"
                onclick={() => toggleDevice('sonic')}
            >
                <h2 class="text-lg font-bold">Sonic Devices</h2>
                <p class="text-sm font-semibold mt-1">State: {statee.devices.sonic}</p>
            </button>

            <!-- EMP Devices -->
            <button
                class="{statee.devices.emp === 'ONLINE' ? 'bg-green-500' : 'bg-red-500'} text-black rounded-xl p-5 shadow-lg border border-white/10 w-64 transition-colors"
                onclick={() => toggleDevice('emp')}
            >
                <h2 class="text-lg font-bold">EMP Devices</h2>
                <p class="text-sm font-semibold mt-1">State: {statee.devices.emp}</p>
            </button>

            <!-- Explosive Gel -->
            <button
                class="{statee.devices.gel === 'ONLINE' ? 'bg-green-500' : 'bg-red-500'} text-black rounded-xl p-5 shadow-lg border border-white/10 w-64 transition-colors"
                onclick={() => toggleDevice('gel')}
            >
                <h2 class="text-lg font-bold">Explosive Gel Blasters</h2>
                <p class="text-sm font-semibold mt-1">State: {statee.devices.gel}</p>
            </button>

            <!-- Batmobile -->
            <button
                class="{statee.devices.batmobile === 'READY' ? 'bg-green-500' : 'bg-red-500'} text-black rounded-xl p-5 shadow-lg border border-white/10 w-64 transition-colors"
                onclick={() => toggleVehicleSuit('batmobile')}
            >
                <h2 class="text-lg font-bold">Batmobile</h2>
                <p class="text-sm font-semibold mt-1">State: {statee.devices.batmobile}</p>
            </button>

            <!-- Bat Suit -->
            <button
                class="{statee.devices.suit === 'READY' ? 'bg-green-500' : 'bg-red-500'} text-black rounded-xl p-5 shadow-lg border border-white/10 w-64 transition-colors"
                onclick={() => toggleVehicleSuit('suit')}
            >
                <h2 class="text-lg font-bold">Bat Suit</h2>
                <p class="text-sm font-semibold mt-1">State: {statee.devices.suit}</p>
            </button>
        </div>
    </section>

    <section class="p-8 text-white">
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
</main>