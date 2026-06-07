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

</script>

{#if allowed}
<main class="p-8">
	<h1>Wayne Internal Dashboard</h1>
	<p>
		Welcome, Bruce Wayne. Here you can access all internal resources and information related to
		Wayne Enterprises.
	</p>
	<h2>sitenav:</h2>
	<br /> <a href="/wayne/ceo" class="text-blue-500 hover:underline">CEO's Office</a> <br />
	<p class="text-gray-400">Financial Reports (You are here)</p>
	<a href="/wayne/ceo/comms" class="text-blue-500 hover:underline">Communication Center</a> <br />
    <br /> <br /> <br />
	<a href="/pdfs/1.pdf" class="text-blue-500 hover:underline">First Financial Report</a> <br />
	<a href="/pdfs/2.pdf" class="text-blue-500 hover:underline">Second Financial Report</a> <br />
	<a href="/pdfs/3.pdf" class="text-blue-500 hover:underline">Third Financial Report</a> <br />
	<a href="/pdfs/4.pdf" class="text-blue-500 hover:underline">Fourth Financial Report</a> <br />
	<a href="/pdfs/5.pdf" class="text-blue-500 hover:underline">Fifth Financial Report</a> <br />
	<a href="/pdfs/6.pdf" class="text-blue-500 hover:underline">Sixth Financial Report</a> <br />
	<a href="/pdfs/7.pdf" class="text-blue-500 hover:underline">Seventh Financial Report</a> <br />
	<a href="/pdfs/8.pdf" class="text-blue-500 hover:underline">Eight Financial Report</a> <br />
	<a href="/pdfs/9.pdf" class="text-blue-500 hover:underline">Ninth Financial Report</a> <br />
	<a href="/pdfs/10.pdf" class="text-blue-500 hover:underline">Tenth Financial Report</a> <br />
</main>
{/if}