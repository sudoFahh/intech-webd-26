<svelte:head>
	<title>Internal Login</title>
</svelte:head>

<script lang="ts">
 import { session } from '$lib/session';
 import { auth } from '$lib/firebase.client';
 import { signInWithEmailAndPassword } from 'firebase/auth';
 import { goto } from '$app/navigation';

 let email = $state('');
 let password = $state('');
 let loginmessage = $state('');

 async function loginWithMail(event: Event) {
  event.preventDefault();

  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const user = result.user;

    session.set({
      loggedIn: true,
      loading: false,
      user: {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        uid: user.uid
      }
    });

    if (user.email === 'bruce@wayne.com') {
        loginmessage = "Welcome, Mr. Bruce. Redirecting...";
        await goto('/wayne/ceo');
    } else if (user.email === 'batman@wayne.com') {
        loginmessage = "Welcome, Batman. Redirecting...";
        await goto('/wayne/batman');
    } else {
        loginmessage = "Incorrect Credentials";
    }
  } catch (error) {
    console.error(error);
    loginmessage = "Authentication failed.";
  }
}
</script>

<main class="flex min-h-screen items-center justify-center bg-[#f0f0f0] p-4 font-sans antialiased selection:bg-neutral-200">
 <div class="w-full max-w-[360px] rounded-lg bg-white p-10 text-center shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-1px_rgba(0,0,0,0.03)]">
  <h1 class="mt-0 mb-6 text-xl font-semibold text-neutral-900">Login</h1>
  
  <form onsubmit={loginWithMail} class="flex flex-col gap-3">
   <input bind:value={email} type="email" placeholder="Email" required class="rounded border border-neutral-200 bg-neutral-50 p-3 text-sm transition-colors duration-200 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none"/>
   <input bind:value={password} type="password" placeholder="Password" required class="rounded border border-neutral-200 bg-neutral-50 p-3 text-sm transition-colors duration-200 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none"/>
   <button type="submit" class="mt-2 rounded bg-neutral-950 p-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-neutral-800 active:bg-neutral-900">Login</button>
  </form>
  
  {#if loginmessage}
   <p class="mt-4 mb-0 text-xs text-neutral-500">{loginmessage}</p>
  {/if}
  
  <a href="/" class="mt-6 inline-block text-xs text-neutral-400 no-underline transition-colors hover:text-neutral-600 hover:underline">Go home</a>
 </div>
</main>