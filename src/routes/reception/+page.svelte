<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import WebexLogo from '$assets/webex-logo.svg';

	let video: string | null;
	let spacesToken: string | null;
	let spacesRegion: string | null;
	let ready = false;

	onMount(() => {
		video = $page.url.searchParams.get('video');
		spacesToken = $page.url.searchParams.get('spacesToken');
		spacesRegion = $page.url.searchParams.get('spacesRegion');

		if (video && spacesToken && spacesRegion) {
			ready = true;
		}
	});
</script>

{#if !ready}
	<section class="hero is-dark is-fullheight">
		<!-- Hero head: will stick at the top -->
		<div class="hero-head" />
		<!-- Hero content: will be in the middle -->
		<div class="hero-body p-0">
			<div class="container has-text-centered">
				<div class="column is-half is-offset-one-quarter">
					<figure class="image is-16by9">
						<img src={WebexLogo} alt="Webex Logo" />
					</figure>
				</div>
				<p class="title is-size-1">Welcome</p>
			</div>
			<div class="hero-foot" />
		</div>
	</section>
{:else}
	<iframe title="YouTube" aria-hidden="true" tabindex="-1" src="{video}?autoplay=1" hidden allow="autoplay"/>
	<iframe
		style=" display: block; width: 100vw; height: 100vh;  border: none"
		title="Spaces"
		src="https://workspaces.dnaspaces.{spacesRegion}/#/preview/?token={spacesToken}"
		scrolling="no"
	/>
{/if}

<!-- Hero footer: will stick at the bottom -->

<style>
	:global(:root) {
		overflow-y: hidden;
	}


</style>
