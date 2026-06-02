<script>
    import { onMount } from "svelte";

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return "";
    }

    onMount(() => {
        const access = getCookie("wayne_access_ceo");

        if (access !== "true") {
            window.location.href = "/";
        }
    });

    function logout() {
        document.cookie = "wayne_access_ceo=; path=/; max-age=0";
        window.location.href = "/internal";
    }
</script>

<main>
    <h1>Wayne Internal Dashboard</h1>
    <p>Welcome, Bruce Wayne. Here you can access all internal resources and information related to Wayne Enterprises.</p>
    <h2>sitenav:</h2>
    <br />
    <p>CEO's Office (You are here)</p>
    <a href="/wayne/ceo/financials" class="text-blue-500 hover:underline">Financial Reports</a> <br />
    <a href="/wayne/ceo/comms" class="text-blue-500 hover:underline">Communication Center</a> <br />

    <br />
    <section class="mb-6 p-4 border rounded">
    <h2 class="text-lg font-bold">EXECUTIVE STATUS</h2>
    
    <div class="mt-2 text-sm space-y-1">
        <p>Company Status: <span class="text-green-600">Stable</span></p>
        <p>Global Operations: Active in 42 regions</p>
        <p>Security Level: Tier 3 Clearance</p>
        <p>Active Alerts: 0 Critical / 3 Monitoring</p>
    </div>
</section>
<button class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition" onclick={logout}>Log Out</button>
</main>