<script>
	import { onMount } from 'svelte';

	const targetSecret = 'brucewayneisbatman';
	let isSecretRevealed = false;
    let key = '';

	onMount(() => {
		sessionStorage.removeItem('batman_buffer');
	});

	function handleKeydown(event) {
		// Ignore modifier keys
		if (event.ctrlKey || event.altKey || event.metaKey) return;

		if (event.key.length === 1) {
			let currentBuffer = sessionStorage.getItem('batman_buffer') || '';
			currentBuffer += event.key.toLowerCase();
			
			if (currentBuffer.length > targetSecret.length) {
				currentBuffer = currentBuffer.slice(-targetSecret.length);
			}

			sessionStorage.setItem('batman_buffer', currentBuffer);

			if (currentBuffer === targetSecret) {
				isSecretRevealed = true;
				sessionStorage.removeItem('batman_buffer');
                key = Math.random().toString(36).substring(2, 15); // Generate a random key
                document.cookie = `batman_key=${key}; path=/; max-age=600`; // Set cookie for 10 mins
				key = ""
			}
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

404 <br /> Not Found