<script>
    import { onMount } from "svelte";

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return "";
    }

    onMount(() => {
        const access = getCookie("wayne_access");

        if (access !== "true") {
            window.location.href = "/";
        }
    });

    function logout() {
        document.cookie = "wayne_access=; path=/; max-age=0";
        window.location.href = "/internal";
    }
</script>
<main class="bg-[#0e0b0b] min-h-screen w-full text-white">
<section class="p-8">
<h1 class="text-3xl font-bold mb-4">The Batcave</h1>
<p>Welcome to the Batcave, Batman. <br /> What tools would you like to use?</p> <br />
<p class="text-gray-400">Batcomputer (You are here)</p>
<a href="/wayne/batman/arsenal" class="text-blue-500 hover:underline">Access Arsenal</a> <br/>
<a href="/wayne/batman/missions" class="text-blue-500 hover:underline">Access Missions</a> <br />
<a href="/wayne/batman/comms" class="text-blue-500 hover:underline">Access Communication Center</a> <br />
<a href="/wayne/batman/maps" class="text-blue-500 hover:underline">Access the Map of Gotham</a> <br />
<a href="/wayne/batman/music" class="text-blue-500 hover:underline">Access the Bat Jukebox</a> <br />
<button class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition" onclick={logout}>Log Out</button>
</section>
</main>
<style>
    html, body {
  background: #0e0b0b;
    }
</style>