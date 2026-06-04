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
<main>
  <h1>Wayne Internal Dashboard</h1>

  <p>Welcome, Bruce Wayne. Here you can access all internal resources and information related to Wayne Enterprises.</p>

  <h2>sitenav:</h2>
    <br />
  <p class="text-gray-400">CEO's Office (You are here)</p>
  <a href="/wayne/ceo/financials" class="text-blue-500 hover:underline">Financial Reports</a><br />
  <a href="/wayne/ceo/comms" class="text-blue-500 hover:underline">Communication Center</a><br />

  <section class="mb-6 p-4 border rounded">
    <h2 class="text-lg font-bold">EXECUTIVE STATUS</h2>

    <div class="mt-2 text-sm space-y-1">
      <p>Company Status: Stable</p>
      <p>Global Operations: Active in 42 regions</p>
      <p>Security Level: Tier 3 Clearance</p>
      <p>Active Alerts: 0 Critical / 3 Monitoring</p>
    </div>
  </section>

  <button onclick={logout}>
    Log Out
  </button>
</main>
{/if}