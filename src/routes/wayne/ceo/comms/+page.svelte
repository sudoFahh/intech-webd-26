<script>
    import { onMount } from 'svelte';
  import { auth } from '$lib/firebase.client';
  import { onAuthStateChanged, signOut } from 'firebase/auth';
  import { goto } from '$app/navigation';

  let allowed = $state(false);

  onMount(() => {
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

    let activeChat = $state(null);
    let message = $state("");
    let chats = $state({
        lucius: [],
        selina: [],
        harvey: [],
        william: [],
        john: [],
        serena: [],
        jack: [],
        jason: []
    });

    function openChat(name) {
        activeChat = name;
    }

    function sendMessage() {
        if (!activeChat || !message.trim()) return;

        chats[activeChat] = [
            ...chats[activeChat],
            { text: message, from: "you" }
        ];

        message = "";
    }
</script>
{#if allowed}
    <h1>Wayne Internal Dashboard</h1>
    <p>Welcome, Bruce Wayne. Here you can access all internal resources and information related to Wayne Enterprises.</p>
    <h2>sitenav:</h2>
    <br />
    <a href="/wayne/ceo" class="text-blue-500 hover:underline">CEO's Office</a> <br />
    <a href="/wayne/ceo/financials" class="text-blue-500 hover:underline">Financial Reports</a> <br />
    <p class="text-gray-400">Communication Center (You are here)</p> <br />
<div class="flex gap-6">

    <!-- CONTACTS -->
    <div class="flex flex-col gap-2 w-64">

        <p>manik make sure to add lucius fox, tam fox, william earle, miranda kane, alfred pennyworth, philip kane (any 5)</p>

    </div>

    <!-- CHAT WINDOW -->
    <div class="flex-1 border p-4">

        {#if activeChat}
            <h2 class="font-bold mb-2">Chat: {activeChat}</h2>

            <div class="h-64 overflow-auto border p-2 mb-2">
                {#each chats[activeChat] as msg}
                    <div>{msg.from}: {msg.text}</div>
                {/each}
            </div>

            <input class="border p-2 w-full"
                bind:value={message}
                placeholder="Type message..."
            />

            <button class="mt-2 bg-blue-500 text-white px-3 py-1"
                on:click={sendMessage}>
                Send
            </button>
        {:else}
            <p>Select a contact to start chatting</p>
        {/if}

    </div>

</div>
{/if}