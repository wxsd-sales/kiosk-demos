<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	import jxapi from '$lib/jxapi';
	import { Player, Video, DefaultUi, usePlayerStore } from '@vime/svelte';
	import type playerType from '@vime/svelte/dist/types/components/Player'


	import TapSidesToSeek from './TapSidesToSeek.svelte';

	// Obtain a ref if you need to call any methods.
	let player: playerType;

	/**
	 * All player properties are available through the store. If you prefer, you could also pass
	 * properties directly to the player and listen for events.
	 */
	const { paused } = usePlayerStore(() => player);

	const onPlaybackReady = () => {
		// ...
	};

	$: console.log('Paused:',$paused);

	onMount(() => {
		console.log('onMount ran');
		const timerParameter = $page.url.searchParams.get('timer');
		const device = $page.url.searchParams.get('device');
		const username = $page.url.searchParams.get('username');
		const password = $page.url.searchParams.get('password');

		handleHash();

		if (device == null) return;
		if (username == null) return;
		if (password == null) return;

		console.log('device:', device, 'username:', username, ' pass:', password);
		jxapi
			.connect(device, username, password)
			.on('error', console.error)
			.on('ready', async (xapi) => {
				console.log(`Connected to device [${device}]`);
				xapi.Event.Message.Send.on((text: string) => {
					console.log('Message Send Event:', text);
				});
			});
	});

	function handleHash() {
		console.log('Hash Updated: ' + location.hash);
		if (!location.hash.startsWith('#state=')) return;
		const hash = location.hash.replace('#state=', '');
		console.log('Hash State: ', hash);
	}
</script>

<svelte:window on:hashchange={handleHash} />

<svelte:head>
	<!-- Default theme. ~960B -->
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@vime/core@^5/themes/default.css" />

	<!-- Optional light theme (extends default). ~400B -->
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@vime/core@^5/themes/light.css" />
</svelte:head>

<section class="hero is-dark is-fullheight">
	<!-- Hero head: will stick at the top -->
	<div class="hero-head" />
	<!-- Hero content: will be in the middle -->
	<div class="hero-body">

	</div>
	<!-- Hero footer: will stick at the bottom -->
	<div class="hero-foot" />
</section>
