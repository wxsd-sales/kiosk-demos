<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
	import { config } from '@fortawesome/fontawesome-svg-core';

	let message: string | null

	onMount(() => {
		message = $page.url.searchParams.get('message');
	});
</script>

<h1>Test Page</h1>

<div>
	<p>
		<FontAwesomeIcon icon={faThumbsUp} /> Hello SvelteKit
	</p>
</div>

{#if message}
	<h1>{message}</h1>
{:else}
	<h1>No Message Given</h1>
{/if}
