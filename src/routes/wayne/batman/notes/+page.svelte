<script lang="ts">
    import { onMount } from 'svelte';
    import { auth } from '$lib/firebase.client';
    import { onAuthStateChanged } from 'firebase/auth';
    import { goto } from '$app/navigation';
    import { doc, getDoc, setDoc } from 'firebase/firestore';
    import { db } from '$lib/firebase.client';

    let allowed = $state(false);
    let text = $state("");
    let notes = $state<string[]>([""]);
    let active = $state(0);
    let pressTimer: any;

    async function loadState() {
        const ref = doc(db, "batman", "notes_collection");
        const snap = await getDoc(ref);

        if (snap.exists()) {
            return snap.data().savedNotes ?? [""];
        }
        return [""];
    }

    async function saveState() {
        if (!allowed) return;
        await setDoc(
            doc(db, "batman", "notes_collection"),
            { savedNotes: $state.snapshot(notes) }
        );
    }

    onMount(() => {
        onAuthStateChanged(auth, async (user) => {
            if (!user) {
                goto('/');
                return;
            }

            if (user.email === 'batman@wayne.com' && getCookie("batman_key")) {
                allowed = true;
                const saved = await loadState();
                notes = saved.length > 0 ? saved : [""];
                text = notes[active] ?? "";
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

    function setText(v: string) {
        notes[active] = v;
        text = v;
        saveState();
    }

    function newNote() {
        notes = [...notes, ""];
        active = notes.length - 1;
        text = "";
        saveState();
    }

    function switchNote(i: number) {
        active = i;
        text = notes[i] ?? "";
    }

    function startPress(i: number) {
        pressTimer = setTimeout(() => {
            deleteNote(i);
        }, 600);
    }

    function cancelPress() {
        clearTimeout(pressTimer);
    }

    function deleteNote(i: number) {
        if (notes.length <= 1) return;

        notes.splice(i, 1);

        if (active >= notes.length) {
            active = notes.length - 1;
        }

        text = notes[active] ?? "";
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
        <a href="/wayne/batman/missions" class="text-blue-500 hover:underline">Access Missions</a> <br />
        <a href="/wayne/batman/comms" class="text-blue-500 hover:underline">Access Communication Center</a> <br />
        <a href="/wayne/batman/maps" class="text-blue-500 hover:underline">Access the Map of Gotham</a> <br />
        <a href="/wayne/batman/music" class="text-blue-500 hover:underline">Access the Bat Jukebox</a> <br />
        <p class="text-gray-400">Notes (You are here)</p>
    </section>

    <section class="p-8">
        <div class="wrap">
            <textarea 
                class="editor" 
                bind:value={text} 
                oninput={(e) => setText((e.target as HTMLTextAreaElement).value)} 
                placeholder="Notes. Click '+' in the bottom right to add a new note, and long-press a note to delete it. Keep in mind, there always has to be atleast one note."
            ></textarea>

            <div class="bar">
                <div class="notes">
                    {#each notes as n, i}
                        <button 
                            class="note {i === active ? 'active' : ''}" 
                            onclick={() => switchNote(i)} 
                            onpointerdown={() => startPress(i)} 
                            onpointerup={cancelPress} 
                            onpointerleave={cancelPress}
                        >
                            {n.slice(0, 10) || "New Note"}
                        </button>
                    {/each}
                </div>
                <button class="plus" onclick={newNote}>+</button>
            </div>
        </div>
    </section>
</main>
{/if}

<style>
    .wrap {
        height: 60vh;
        width: 100%;
        display: flex;
        flex-direction: column;
        background: #110d0d;
        border: 1px solid #331111;
        border-radius: 4px;
    }

    .editor {
        flex: 1;
        width: 100%;
        border: none;
        outline: none;
        resize: none;
        padding: 18px;
        font-size: 16px;
        font-family: monospace;
        line-height: 1.5;
        background: transparent;
        color: #f1f1f1;
    }

    .bar {
        height: 38px;
        display: flex;
        align-items: center;
        border-top: 1px solid #2a1111;
        padding: 0 8px;
        background: #181313;
    }

    .notes {
        flex: 1;
        display: flex;
        gap: 6px;
        overflow-x: auto;
    }

    .note {
        font-size: 11px;
        font-family: monospace;
        padding: 4px 8px;
        border: 1px solid #441111;
        background: #0d0909;
        color: #999;
        cursor: pointer;
        white-space: nowrap;
    }

    .note.active {
        background: #cc1111;
        color: white;
        border-color: #ff3333;
    }

    .plus {
        width: 26px;
        height: 26px;
        border: none;
        cursor: pointer;
        background: transparent;
        font-size: 18px;
        color: #cc1111;
    }
</style>