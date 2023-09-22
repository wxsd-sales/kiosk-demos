<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import WebexLogo from '$assets/webex-logo.svg';

	let video: string | null;
	let spaces: string | null;
	let ready = false;

	onMount(() => {
		video = $page.url.searchParams.get('video');
		spaces = $page.url.searchParams.get('spaces');

		if (video && spaces) {
			ready = true;
		}
	});
</script>

<section class="hero is-dark is-fullheight">
	<!-- Hero head: will stick at the top -->
	<div class="hero-head" />
	<!-- Hero content: will be in the middle -->
	<div class="hero-body p-0">
		
			{#if !ready}
			<div class="container has-text-centered">
				<div class="column is-half is-offset-one-quarter">
					<figure class="image is-16by9">
						<img src={WebexLogo} alt="Webex Logo" />
					</figure>
				</div>
				<p class="title is-size-1">Welcome</p>
			</div>
			{:else}
				<iframe
					title="YouTube"
					aria-hidden="true"
					tabindex="-1"
					src="{video}"
					hidden
				/>
				<iframe style="width: 100vw; height: 100vh" title="Spaces" src={spaces} />
			{/if}
		
		<!-- Hero footer: will stick at the bottom -->
		<div class="hero-foot" />
	</div>
</section>

<style>
	:global(:root) {
		overflow-y: hidden;
	}
</style>
