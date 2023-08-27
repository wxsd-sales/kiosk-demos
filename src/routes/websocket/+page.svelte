<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';
	import { fade } from 'svelte/transition';
	import WebexLogo from '$assets/webex-logo.svg';
	import { Buffer } from 'buffer'
	//import {connect as jxapi} from 'jsxapi'
	import {connect as jxapi} from 'jsxapi'

	let currentState: string  = 'Standby';
	let nextState = '';
	let dialling = false;

	let waitSeconds: number = 10;
	let timer: number;
	let interval: NodeJS.Timer | null = null;

	onMount(() => {
		window.Buffer = Buffer;
		console.log('onMount ran')
		const timerParameter = $page.url.searchParams.get('timer');
		const device = $page.url.searchParams.get('device');
		const username = $page.url.searchParams.get('username');
		const password = $page.url.searchParams.get('password');
		if (timerParameter != null) {
			console.log(`Setting Wait Seconds to [${waitSeconds}]`)
			waitSeconds = parseInt(timerParameter);
		}
		resetTimer();
		handleHash();

		if(device == null) return;
		if(username == null) return;
		if(password == null) return;

		console.log('device:', device, 'username:', username, ' pass:', password)
		jxapi({host: device, protocol:'wss:', username: username, password: password})
		.on('error', console.error)
		.on('ready', async (xapi)=>{
			console.log(`Connected to device [${device}]`)
			xapi.Event.Message.Send.on((text: string) => {
				console.log('Message Send Event:', text)
			})	
		})
	});

	
	function countDownCompleted() {
		dialling = true;
		console.log('Countdown completd, notifying device');
		location.hash = '';
		location.hash = '#countdown-completed';
		location.hash = '';
	}

	function resetTimer(){
		console.log(`Reseeting time to [${waitSeconds}]`)
		timer = waitSeconds;
		dialling = false;
	}

	function stopCountdown() {
		if (interval == null) return;
		console.log('Clearing interval')
		clearInterval(interval)
		interval = null;
	}

	function startCountdown() {
		console.log('Starting Countdown')
		if(interval != null) return;
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

	function changeState(state: string){
		if(currentState == state) return;
		console.log(`Changing from state [${currentState}] to [${state}]`)
		if(nextState == 'Countdown') resetTimer();
		if(currentState == 'Countdown') stopCountdown();
		nextState = state;
		currentState = '';
	}
	
	function enableNextState(){
		currentState = nextState;
	}

	function handleHash() {
		console.log('Hash Updated: ' + location.hash);
		if (!location.hash.startsWith('#state=')) return;
		const hash = location.hash.replace('#state=', '');
		console.log('Hash State: ', hash);
		changeState(hash)
	}
</script>

<svelte:window on:hashchange={handleHash} />

<section class="hero is-dark is-fullheight">
	<!-- Hero head: will stick at the top -->
	<div class="hero-head" />
	<!-- Hero content: will be in the middle -->
	<div class="hero-body">
		{#if currentState == 'Standby'}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div
				class="container has-text-centered "
				transition:fly={{ y: -200, duration: 1000 }}
				on:click={() => changeState('Countdown')}
				on:outroend={enableNextState}
			>
				<div class="column is-half is-offset-one-quarter">
					<figure class="image is-16by9">
						<img src={WebexLogo} alt="Webex Logo" />
					</figure>
				</div>
				<p class="title is-size-1">WXSD Demo</p>
				<p class="title is-size-1">Please Walk Up To Begin</p>
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
				<p class="title is-size-1">👋😃</p>
				<p class="title is-size-1">Hi there!</p>
				<p class="title is-size-1">Please stand still while we connect your call</p>
				{#if dialling}
					<p class="title is-size-1">Dialling</p>
				{:else}
					<p class="title is-size-1">{timer}</p>
				{/if}
				
			</div>
		{/if}
	</div>
	<!-- Hero footer: will stick at the bottom -->
	<div class="hero-foot" />
</section>
