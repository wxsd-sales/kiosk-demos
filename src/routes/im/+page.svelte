<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import validator from 'validator';

	onMount(() => {
		const space = $page.url.searchParams.get('space');
		const roomId = $page.url.searchParams.get('roomId');

		console.log('Space:', space)
		console.log('RoomId:', roomId)
		if (space != null) {
			const decodedId = validator.isUUID(space) ? space : atob(space).split('/').pop() ;
			console.log('Room UUID: ', decodedId);
			window.location.href = 'webexteams://im?space=' + decodedId;
		} else if( roomId != null) {
			const decodedId = validator.isUUID(roomId) ? roomId : atob(roomId).split('/').pop();
			console.log('Room UUID: ', decodedId);
			window.location.href = 'webexteams://im?space=' + decodedId;
		} else {
			console.log('No RoomID parameter given');
		}
	});

</script>

<h1>Opening Webex Space</h1>
