<script lang="ts">
// login/+page.svelte
 import { session } from '$lib/session';
 import { auth } from '$lib/firebase.client';
 import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  type UserCredential
 } from 'firebase/auth';
 import { goto } from '$app/navigation';
	import { log } from 'firebase/firestore/pipelines';

 let email: string = '';
 let password: string = '';

 let loginmessage = $state("")

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

    if(user.email === 'bruce@wayne.com'){
        loginmessage = "Welcome, Mr. Bruce. Redirecting..."
        await goto('/wayne/ceo')
    }
    else if(user.email === 'batman@wayne.com'){
        loginmessage = "Welcome, Batman. Redirecting..."
        await goto('/wayne/batman')
    }
    else {
      loginmessage = "Incorrect Credentails"
    }
  } catch (error) {
    console.error(error);
  }
}
</script>
<main class="p-8">
<div class="login-form">
 <h1>Login</h1>
 <form onsubmit={loginWithMail}>
  <input bind:value={email} type="text" placeholder="Email" />
  <input bind:value={password} type="password" placeholder="Password" />
  <button type="submit">Login</button>
 </form>
 </div>
 <p>{loginmessage}</p> <br />
 <a href="/" class="underline">go home</a>
</main>