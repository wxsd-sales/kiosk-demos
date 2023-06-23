<script lang="ts">
	import { onMount } from 'svelte';

	import background from './images/1-Night.png';

	//import top, widget and bottom
</script>

<div id="wallpaper" style="background-image: url({background})">
	<!-- Top Bar

	Widget

	Bottom Bar -->
</div>

<style>
	#wallpaper {
		display: flex;
		flex: auto;

		flex-direction: column;
		min-height: 100vh;

		/* justify-content: center;
		align-items: center; */
	}
</style>