<script lang="ts">

    // if the person checking my code made it here, i was listening to the strokes while making this comment (hard to explain) and sum other songs (obv took 3m:44s +)
    // btw i just discovered if u hold ctrl and press arrow keys in vscode it moves by words (so cool (feel free to test it on these))

    import { onMount } from 'svelte';
    import { auth } from '$lib/firebase.client';
    import { onAuthStateChanged } from 'firebase/auth';
    import { goto } from '$app/navigation';
    let allowed = $state(false);

    let scale = $state(1);
    let translateX = $state(0);
    let translateY = $state(0);
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

    // THIS is for putting PINS my MANS

    function handleImageClick(event: MouseEvent) {
        if (!containerRef) return;

        const rect = containerRef.getBoundingClientRect();
        
        const clickX = event.clientX - rect.left;
        const clickY = event.clientY - rect.top;

        pins.push({ x: clickX, y: clickY });
    }

    // This is for ZOOOMING in MY MANS
    
    function handleWheel(event: WheelEvent) {
        event.preventDefault();

        const zoomIntensity = 0.1;

        const delta = event.deltaY < 0 ? 1 : -1;
        
        const newScale = Math.min(Math.max(scale + delta * zoomIntensity, 1), 6);

        if (newScale === 1) {
            translateX = 0;
            translateY = 0;
        } else if (containerRef) {
            const rect = containerRef.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;
            
            translateX -= (mouseX - rect.width / 2) * (delta * zoomIntensity);
            translateY -= (mouseY - rect.height / 2) * (delta * zoomIntensity);
        }

        scale = newScale;
    }

    function removePin(indexToRemove: number, event: MouseEvent) {
        event.stopPropagation();
        pins.splice(indexToRemove, 1);
    }

    // these spotify ads fryin me rn :sob:

</script>

{#if allowed}
<main class="bg-[#0e0b0b] min-h-screen">
    <section class="p-8 text-white">
        <h1 class="text-3xl font-bold mb-4">The Batcave</h1>
        <p>Welcome to the Batcave, Batman. <br /> What tools would you like to use?</p> <br />
        <a href="/wayne/batman" class="text-blue-500 hover:underline">Access Batcomputer</a> <br />
        <a href="/wayne/batman/arsenal" class="text-blue-500 hover:underline">Access Arsenal</a> <br />
        <a href="/wayne/batman/missions" class="text-blue-500 hover:underline">Access Missions</a> <br />
        <a href="/wayne/batman/comms" class="text-blue-500 hover:underline">Access Communication Center</a> <br />
        <p class="text-gray-400">Map of Gotham (You are here)</p>
        <a href="/wayne/batman/music" class="text-blue-500 hover:underline">Access the Bat Jukebox</a> <br />
    </section>

    <div bind:this={containerRef} class="relative overflow-hidden inline-block m-8 cursor-zoom-in rounded-lg select-none" style="width: 390px; height: 780px; isolation: isolate;" onclick={handleImageClick} onwheel={handleWheel} role="presentation">
        <button><img src="/map.webp" alt="The Map of Gotham" width=390 height=780 class="transition-transform duration-200 ease-out origin-center pointer-events-none rounded-lg" style="transform: translate({translateX}px, {translateY}px) scale({scale});"/></button>
        {#each pins as pin, index}
            <button class="absolute bg-red-600 border-2 border-white rounded-full w-4 h-4 cursor-pointer z-10" style="left: {pin.x}px; top: {pin.y}px; transform: translate(-50%, -50%) translate({translateX / scale}px, {translateY / scale}px) scale({scale});" onclick={(e) => removePin(index, e)}></button>
        {/each}
    </div>
</main>
{/if}