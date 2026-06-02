<script>
    import { onMount } from 'svelte';
    import MD5 from 'crypto-js/md5';

    let email = "";
    let password = "";
    let loginmessage = $state("");
    const waynehash = "8f1f2c58fabe9002d96d33c72ddb4026";

    let expectedKey = "";

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return "";
    }

    onMount(() => {
        expectedKey = getCookie("batman_key");
    });

    function login() {
        const inputHash = MD5(password).toString();
    
    if (email === "brucewayne" && password === expectedKey) {
        document.cookie = "wayne_access=true; path=/; max-age=3600";
        loginmessage = "ACCESS GRANTED";
        setTimeout(() => {
            window.location.href = "/wayne/batman";
        }, 500);
    }
    else if (email === "brucewayne" && inputHash === waynehash) {
        document.cookie = "wayne_access_ceo=true; path=/; max-age=3600";
        loginmessage = "Welcome, Mr. Wayne. Redirecting to CEO Dashboard...";
        setTimeout(() => {
            window.location.href = "/wayne/ceo";
        }, 500);
    } else {
        loginmessage = "Incorrect credentials. Please try again.";

        setTimeout(() => {
            loginmessage = "";
        }, 2000);
    }
}
</script>
<main class="ml-2">
<h1>Welcome to Wayne Enterprises.</h1>
<sup>Future Through Innovation</sup>
<br />
<h2>Internal Page</h2>
<br /> <br />
<p>Employee Login:</p>
<input type="email" placeholder="Email" class="border p-2 rounded w-full max-w-sm" bind:value={email}/>
<br />
<input type="password" placeholder="Password" class="border p-2 rounded w-full max-w-sm mt-4" bind:value={password}/>
<br />
<button class="bg-blue-500 text-white px-4 py-2 rounded mt-4 hover:bg-blue-600 transition" onclick={login}>Login</button> <br /> <br />
<p>{loginmessage}</p>
</main>

<footer class="fixed bottom-10 left-2 text-xs text-gray-400">
    <a href="/" class="text-gray-800">home</a>
</footer>