<script lang="ts">

    // if the person checking my code made it here, i was listening to the strokes while making this comment (hard to explain) and sum other songs (obv took 3m:44s +)
    // btw i just discovered if u hold ctrl and press arrow keys in vscode it moves by words (so cool (feel free to test it on these))

    import { onMount } from 'svelte';
    import { auth } from '$lib/firebase.client';
    import { onAuthStateChanged } from 'firebase/auth';
    import { goto } from '$app/navigation';

    let allowed = $state(false);
    let sidebarOpen = $state(true);
    let zoomMultiplier = $state(1);
    let mapX = $state(0);
    let mapY = $state(0);
    let containerRef: HTMLDivElement | null = $state(null);

    let pins = $state<{ x: number; y: number }[]>([]);

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
    function getCookie(name: string): string {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift() || "";
        return "";
    }

    // THIS is for putting PINS MY BROS

    function handleImageClick(event: MouseEvent) {
        if (!containerRef) return;
        const rect = containerRef.getBoundingClientRect();

        const windowX = event.clientX - rect.left;
        const windowY = event.clientY - rect.top;

        const rawX = (windowX + mapX) / zoomMultiplier;
        const rawY = (windowY + mapY) / zoomMultiplier;
        pins.push({ x: rawX, y: rawY });
    }

    // This is for ZOOOMING MY BROS
    
function handleWheel(event: WheelEvent) {
        event.preventDefault();
        if (!containerRef) return;

        const rect = containerRef.getBoundingClientRect();
        const windowX = event.clientX - rect.left;
        const windowY = event.clientY - rect.top;

        if (event.deltaY < 0) {
            if (zoomMultiplier === 1) {
                zoomMultiplier = 2;
                mapX = Math.min(Math.max(windowX * 2 - 390 / 2, 0), 390);
                mapY = Math.min(Math.max(windowY * 2 - 780 / 2, 0), 780);
            } else if (zoomMultiplier === 2) {
                zoomMultiplier = 4;
                mapX = Math.min(Math.max((windowX + mapX) * 2 - 390 / 2, 0), 390 * 3);
                mapY = Math.min(Math.max((windowY + mapY) * 2 - 780 / 2, 0), 780 * 3);
            }
        } else if (event.deltaY > 0) {
            if (zoomMultiplier === 4) {
                zoomMultiplier = 2;
                mapX = Math.min(Math.max((mapX + 390 / 2) / 2 - 390 / 2, 0), 390);
                mapY = Math.min(Math.max((mapY + 780 / 2) / 2 - 780 / 2, 0), 780);
            } else if (zoomMultiplier === 2) {
                zoomMultiplier = 1;
                mapX = 0;
                mapY = 0;
            }
        }
    }

    function removePin(indexToRemove: number, event: MouseEvent) {
        event.stopPropagation();
        pins.splice(indexToRemove, 1);
    }

    // these spotify ads fryin me rn :sob:

    // one day, 
    // i am going to grow wings, 
    // a chemical reaction.

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
        <a href="/wayne/batman" class="text-blue-500 hover:underline">Access Batcomputer</a>
        <a href="/wayne/batman/arsenal" class="text-blue-500 hover:underline">Access Arsenal</a>
        <a href="/wayne/batman/missions" class="text-blue-500 hover:underline">Access Missions</a>
        <a href="/wayne/batman/comms" class="text-blue-500 hover:underline">Access Communication Center</a>
        <p class="text-gray-500 font-semibold mt-2">Map of Gotham</p>
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

    <div bind:this={containerRef} class="relative overflow-hidden inline-block m-8 cursor-crosshair rounded-lg select-none" style="width: 390px; height: 780px; isolation: isolate;" onclick={handleImageClick} onwheel={handleWheel} role="presentation">
        <img src="/map.webp" alt="The Map of Gotham" class="absolute top-0 left-0 pointer-events-none rounded-lg" style="width: {390 * zoomMultiplier}px; height: {780 * zoomMultiplier}px; transform: translate({-mapX}px, {-mapY}px); max-width: none;"/>
        {#each pins as pin, index}
            <button class="absolute bg-red-600 border-2 border-white rounded-full w-3 h-3 cursor-pointer z-10" style="left: {pin.x * zoomMultiplier}px; top: {pin.y * zoomMultiplier}px; transform: translate(-50%, -50%) translate({-mapX}px, {-mapY}px);" onclick={(e) => removePin(index, e)}></button>
        {/each}
    </div>
</main>
{/if}