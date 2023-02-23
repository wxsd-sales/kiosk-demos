<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import WebexLogo from '$assets/webex-logo.svg';

	let logo: string | null;
	let location: string | null;
	let message: string | null;

	onMount(() => {
		logo = $page.url.searchParams.get('location');
		location = $page.url.searchParams.get('location');
		message = $page.url.searchParams.get('message');
	});
</script>

<section class="hero is-dark is-fullheight">
	<!-- Hero head: will stick at the top -->
	<div class="hero-head" />
	<!-- Hero content: will be in the middle -->
	<div class="hero-body">
		<div class="container has-text-centered">
			{#if logo}
				<div class="column is-half is-offset-one-quarter">
					<figure class="image is-16by9">
						<img src={WebexLogo} alt="Webex Logo" />
					</figure>
				</div>
			{/if}
			{#if location}
				<p class="title is-size-1">{location}</p>
			{/if}
			{#if message}
				<p class="title is-size-1">{message}</p>
			{/if}
		</div>
		<!-- Hero footer: will stick at the bottom -->
		<div class="hero-foot" />
	</div>
</section>