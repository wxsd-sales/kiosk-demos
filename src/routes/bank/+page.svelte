<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';
	import { fade } from 'svelte/transition';
	import WebexLogo from '$assets/webex-logo.svg';

	import { Banks } from '$lib/assets/banks';

	let currentState: string = 'Standby';
	let nextState = '';
	let dialling = false;

	let waitSeconds: number = 10;
	let timer: number;

	let interval: NodeJS.Timer | null = null;

	const selected = $page.url.searchParams.get('theme') ?? 'wxsd';
	const theme = Banks.find((bank) => bank.tag == selected) ?? Banks.find((bank) => bank.tag == 'wxsd');


	$: vars = `--background-image: url(${theme?.background}); `;

	function countDownCompleted() {
		dialling = true;
		console.log('Countdown completed, notifying device');
		location.hash = '';
		location.hash = '#countdown-completed';
		location.hash = '';
	}

	function resetTimer() {
		console.log(`Reseeting time to [${waitSeconds}]`);
		timer = waitSeconds;
		dialling = false;
	}

	function stopCountdown() {
		if (interval == null) return;
		console.log('Clearing interval');
		clearInterval(interval);
		interval = null;
	}

	function startCountdown() {
		console.log('Starting Countdown');
		if (interval != null) return;
		interval = setInterval(countdown, 1000);
	}

	function countdown() {
		if (timer == 0) {
			stopCountdown();
			countDownCompleted();
		} else {
			timer = timer - 1;
		}
	}

	function changeState(state: string) {
		if (currentState == state) return;
		console.log(`Changing from state [${currentState}] to [${state}]`);
		if (nextState == 'Countdown') resetTimer();
		if (currentState == 'Countdown') stopCountdown();
		nextState = state;
		currentState = '';
	}

	function enableNextState() {
		currentState = nextState;
	}

	function handleHash() {
		console.log('Hash Updated: ' + location.hash);
		if (!location.hash.startsWith('#state=')) return;
		const hash = location.hash.replace('#state=', '');
		console.log('Hash State: ', hash);
		changeState(hash);
	}
</script>

<svelte:window on:hashchange={handleHash} />




<section class="hero is-fullheight"
class:is-dark={theme?.background == null}
class:bg={theme?.background != null}
style:background-image={theme?.background ? `url(${theme?.background})` : ''}>
	<!-- Hero head: will stick at the top -->
	<div class="hero-head" />
	<!-- Hero content: will be in the middle -->
	<div class="hero-body">
		{#if currentState == 'Standby'}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div
				class="container has-text-centered"
				transition:fly={{ y: -200, duration: 1000 }}
				on:click={() => changeState('Countdown')}
				on:outroend={enableNextState}
			>
				<div class="column is-half is-offset-one-quarter">
					<figure class="image">
						{#if theme && theme.logo != null}
							<img src={theme.logo} alt="Bank Logo" />
						{/if}
					</figure>
				</div>
				<p class="title is-size-1">{theme?.themeName}</p>
				<p class="title is-size-1">{theme?.welecomeText}</p>
			</div>
		{/if}

		{#if currentState == 'Countdown'}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div
				class="container has-text-centered"
				transition:fly={{ y: -200, duration: 1000 }}
				on:click={() => changeState('Standby')}
				on:outroend={enableNextState}
				on:outrostart={stopCountdown}
				on:introend={startCountdown}
			>
				<p class="title is-size-1">Hi There 👋😃</p>
				<p class="title is-size-1">{theme?.optionText}</p>

				<div class="tile is-ancestor">
					{#if theme}
						{#each theme.options as option}
							<div class="tile is-parent">
								<article class="tile is-child box">
									<p class="title">One</p>
									<p class="subtitle">Subtitle</p>
								</article>
							</div>
						{/each}
					{/if}
				</div>
			</div>
		{/if}
	</div>
	<!-- Hero footer: will stick at the bottom -->
	<div class="hero-foot" />
</section>

<style>

.bg {



  background-repeat: no-repeat;
  background-size: cover;
}

</style>
