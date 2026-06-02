<script>
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
    <h1>Wayne Internal Dashboard</h1>
    <p>Welcome, Bruce Wayne. Here you can access all internal resources and information related to Wayne Enterprises.</p>
    <h2>sitenav:</h2>
    <br />
    <a href="/wayne/ceo" class="text-blue-500 hover:underline">CEO's Office</a> <br />
    <a href="/wayne/ceo/financials" class="text-blue-500 hover:underline">Financial Reports</a> <br />
    <p>Communication Center (You are here)</p> <br />
<div class="flex gap-6">

    <!-- CONTACTS -->
    <div class="flex flex-col gap-2 w-64">

        <button class="border p-3" on:click={() => openChat('lucius')}>Lucius Fox</button>
        <button class="border p-3" on:click={() => openChat('selina')}>Selina Kyle</button>
        <button class="border p-3" on:click={() => openChat('harvey')}>Harvey Dent</button>
        <button class="border p-3" on:click={() => openChat('william')}>William Chang</button>
        <button class="border p-3" on:click={() => openChat('john')}>John Brown</button>
        <button class="border p-3" on:click={() => openChat('serena')}>Serena Chen</button>
        <button class="border p-3" on:click={() => openChat('jack')}>Jack Cooper</button>
        <button class="border p-3" on:click={() => openChat('jason')}>Jason Bourne</button>

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