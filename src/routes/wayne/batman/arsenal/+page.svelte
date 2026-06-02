<script>
    import { onMount } from "svelte";

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return "";
    }

    function setCookie(name, value) {
        document.cookie = `${name}=${JSON.stringify(value)}; path=/; max-age=86400`;
    }

    function loadState() {
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

    function saveState(inv) {
        setCookie("statee", inv);
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

    let clicked = $state("OFFLINE");
    let clicked2 = $state("OFFLINE");
    let clicked3 = $state("OFFLINE");
    let clicked4 = $state("NOT READY");
    let clicked5 = $state("NOT READY");

    function change(item, delta) {
        inventory[item] = Math.max(0, inventory[item] + delta);
        inventory = { ...inventory };
        setCookie("bat_inventory", inventory);
    }

    onMount(() => {
    const access = getCookie("wayne_access");

    if (access !== "true") {
        window.location.href = "/";
    }

    const saved = loadState();

    if (saved) {
        statee = saved;
    } else {
        saveState();
    }
});
</script>

    <main class="bg-[#0e0b0b] min-h-screen">
    <section class="p-8 text-white">
    <h1 class="text-3xl font-bold mb-4">The Batcave</h1>
    <p>Welcome to the Batcave, Batman. <br /> What tools would you like to use?</p> <br />
    <a href="/wayne/batman" class="text-blue-500 hover:underline">Access Batcomputer</a> <br />
    <p>Arsenal (You are here)</p>
    <a href="/wayne/batman/missions" class="text-blue-500 hover:underline">Access Missions</a> <br />
    <a href="/wayne/batman/comms" class="text-blue-500 hover:underline">Access Communication Center</a> <br />
    <a href="/wayne/batman/maps" class="text-blue-500 hover:underline">Access the Map of Gotham</a> <br />
    <a href="/wayne/batman/music" class="text-blue-500 hover:underline">Access the Bat Jukebox</a> <br />
    </section>
<section class="p-8">
    <h2 class="text-2xl text-white">Devices:</h2>

    <button
        class="{clicked === 'ONLINE' ? 'bg-green-500' : 'bg-red-500'} text-black rounded-xl p-5 shadow-lg border border-white/10 w-64"
        onclick={() => clicked = clicked === 'OFFLINE' ? 'ONLINE' : 'OFFLINE'}
    >
        <h2 class="text-lg font-bold">Sonic Devices</h2>
        <p class="text-sm text-gray-600 mt-1">State: {clicked}</p>
    </button>

    <button
        class="{clicked2 === 'ONLINE' ? 'bg-green-500' : 'bg-red-500'} text-black rounded-xl p-5 shadow-lg border border-white/10 w-64"
        onclick={() => clicked2 = clicked2 === 'OFFLINE' ? 'ONLINE' : 'OFFLINE'}
    >
        <h2 class="text-lg font-bold">EMP Devices</h2>
        <p class="text-sm text-gray-600 mt-1">State: {clicked2}</p>
    </button>

    <button
        class="{clicked3 === 'ONLINE' ? 'bg-green-500' : 'bg-red-500'} text-black rounded-xl p-5 shadow-lg border border-white/10 w-64"
        onclick={() => clicked3 = clicked3 === 'OFFLINE' ? 'ONLINE' : 'OFFLINE'}
    >
        <h2 class="text-lg font-bold">Explosive Gel Blasters</h2>
        <p class="text-sm text-gray-600 mt-1">State: {clicked3}</p>
    </button>

    <button
        class="{clicked4 === 'READY' ? 'bg-green-500' : 'bg-red-500'} text-black rounded-xl p-5 shadow-lg border border-white/10 w-64"
        onclick={() => clicked4 = clicked4 === 'NOT READY' ? 'READY' : 'NOT READY'}
    >
        <h2 class="text-lg font-bold">Batmobile</h2>
        <p class="text-sm text-gray-600 mt-1">State: {clicked4}</p>
    </button>

    <button
        class="{clicked5 === 'READY' ? 'bg-green-500' : 'bg-red-500'} text-black rounded-xl p-5 shadow-lg border border-white/10 w-64"
        onclick={() => clicked5 = clicked5 === 'NOT READY' ? 'READY' : 'NOT READY'}
    >
        <h2 class="text-lg font-bold">Bat Suit</h2>
        <p class="text-sm text-gray-600 mt-1">State: {clicked5}</p>
    </button>
    </section>

    <br />
    <h2 class="text-2xl text-white">Tools:</h2>
    <section class="p-8 text-white">
    <h2 class="text-2xl mb-4">Tools Inventory</h2>

    {#each Object.entries(+) as [key, value]}
        <div class="flex items-center justify-between w-80 mb-3 border p-3 rounded-xl border-white/10 bg-black/30">
            
            <div>
                <p class="font-bold capitalize">{key}</p>
                <p class="text-sm text-gray-400">Stock: {value}</p>
            </div>

            <div class="flex gap-2">
                <button class="px-2 bg-red-500 rounded" onclick={() => change(key, -1)}>-</button>
                <button class="px-2 bg-green-500 rounded" onclick={() => change(key, 1)}>+</button>
            </div>

        </div>
    {/each}
</section>
    </main>