<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();

	import { onAuthStateChanged } from 'firebase/auth';
	import { auth } from '$lib/firebase.client';
	import { session } from '$lib/session';

	onAuthStateChanged(auth, (user) => {
	session.set({
		loggedIn: !!user,
		loading: false,
		user: user
		? {
			displayName: user.displayName,
			email: user.email,
			photoURL: user.photoURL,
			uid: user.uid
			}
		: null
	});
	});
</script>

<svelte:head><title>The Batcave</title> <link rel="icon" href={favicon} /></svelte:head>
{@render children()}
