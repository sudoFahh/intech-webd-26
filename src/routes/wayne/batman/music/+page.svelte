<script lang="ts">

    // firebase requires credit card
    // however i do not have one and mummi papa dont trust me
    // so cloudinary jindabaad

    import { onMount } from 'svelte';
    import { auth } from '$lib/firebase.client';
    import { onAuthStateChanged } from 'firebase/auth';
    import { goto } from '$app/navigation';
    import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from 'firebase/firestore';
    import { db } from '$lib/firebase.client';

    const CLOUDINARY_CLOUD_NAME = "dntnitdp3"; 
    const CLOUDINARY_UPLOAD_PRESET = "intech-webd-26";
    let isUploading = $state(false);
    let uploadStatus = $state('');
    let allowed = $state(false);
    let sidebarOpen = $state(true);  
    let tracks = $state<{ id: string, title: string, url: string }[]>([]);
    let currentTrackUrl = $state('');

    onMount(() => {
        onAuthStateChanged(auth, (user) => {
            if (!user) {
                goto('/');
                return;
            }

            if (user.email === 'batman@wayne.com' && getCookie("batman_key")) {
                allowed = true;
                listenToTracks();
            } else {
                goto('/');
            }
        });
    });

    function listenToTracks() {
        const q = query(collection(db, 'bat_jukebox'), orderBy('createdAt', 'desc'));
        onSnapshot(q, (snapshot) => {
            tracks = snapshot.docs.map(doc => ({
                id: doc.id,
                title: doc.data().title,
                url: doc.data().url
            }));
            
            // Default to the first track if one exists
            if (tracks.length > 0 && !currentTrackUrl) {
                currentTrackUrl = tracks[0].url;
            }
        });
    }

    function getCookie(name: string): string {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift() || "";
        return "";
    }

    async function handleFileUpload(event: Event) {
        const target = event.target as HTMLInputElement;
        if (!target.files || target.files.length === 0) return;
        
        const file = target.files[0];
        isUploading = true;
        uploadStatus = "Uploading...";

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

            const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/video/upload`, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.error?.message || "Upload failed");

            await addDoc(collection(db, 'bat_jukebox'), {
                title: file.name.replace(/\.[^/.]+$/, ""),
                url: data.secure_url,
                createdAt: serverTimestamp()
            });

            uploadStatus = "Success!";
        } catch (err: any) {
            uploadStatus = `Error: ${err.message}`;
        } finally {
            isUploading = false;
        }
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
        <a href="/wayne/batman/missions" class="text-blue-500 hover:underline">Access Missions</a>
        <a href="/wayne/batman/comms" class="text-blue-500 hover:underline">Access Communication Center</a>
        <a href="/wayne/batman/maps" class="text-blue-500 hover:underline">Access the Map of Gotham</a>
        <p class="text-gray-500 font-semibold mt-2">Bat Jukebox</p>
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
    <br />
    <input class="text-white" type="file" accept="audio/mp3, audio/*" disabled={isUploading} onchange={handleFileUpload}/> <br />
    {#if uploadStatus}
        <p class="text-white" >{uploadStatus}</p>
    {/if}

    {#if currentTrackUrl}
        <audio src={currentTrackUrl} controls class="block my-4"></audio>
    {/if}
    <ul class="text-white">
        {#each tracks as track}
            <li class="my-2">
                <button onclick={() => currentTrackUrl = track.url} class="text-blue-400 hover:underline text-left">
                    Play: {track.title}
                </button>
            </li>
        {/each}
    </ul>
    </main>
{/if}