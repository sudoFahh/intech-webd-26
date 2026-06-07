<script lang="ts">
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

  async function logout() {
    await signOut(auth);
    goto('/');
  }
</script>

{#if allowed}
<main class="p-8">
  <h1>Wayne Internal Dashboard</h1>

  <p>Welcome, Bruce Wayne. Here you can access all internal resources and information related to Wayne Enterprises.</p>

  <h2>sitenav:</h2>
    <br />
  <p class="text-gray-400">CEO's Office (You are here)</p>
  <a href="/wayne/ceo/financials" class="text-blue-500 hover:underline">Financial Reports</a><br />
  <a href="/wayne/ceo/comms" class="text-blue-500 hover:underline">Communication Center</a><br />
  <br />
<button class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition" onclick={logout}>Log Out</button>
</main>
{/if}