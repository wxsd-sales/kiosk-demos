<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';
	import { fade } from 'svelte/transition';
	import WebexLogo from '$assets/webex-logo.svg';
	import { Buffer } from 'buffer';
	//import {connect as jxapi} from 'jsxapi'
	import { XAPI, connect as jsxapi } from 'jsxapi/lib/browser';
	//import type { Connect } from 'jsxapi/lib/connect';
	//import type jsxapi from '$lib/jxapi';

	interface Credentials {
		username: string;
		password: string;
		ipAddress: string;
	}

	let credentials: Credentials;
	let xapi: XAPI;
	let connectionStatus = 'Connecting...';

	let currentState: string = 'Standby';
	let nextState = '';
	let dialling = false;

	let waitSeconds: number = 10;
	let timer: number;
	let interval: NodeJS.Timer | null = null;

	onMount(() => {
		resetTimer();
		window.Buffer = Buffer;
		console.log('onMount ran');
		const hash = window.location.hash.split('#').pop();
		if (hash === undefined) return;
		const decoded = window.atob(hash);
		credentials = JSON.parse(decoded);
		console.log('Credentials:', JSON.stringify(credentials));

		jsxapi({
			host: credentials.ipAddress,
			protocol: 'wss:',
			username: credentials.username,
			password: credentials.password
		})
			.on('error', console.error)
			.on('ready', async (connection: XAPI) => {
				connectionStatus = `Connected [${credentials.ipAddress}]`;
				xapi = connection;
				console.log(`Connected to device [${credentials.ipAddress}]`);
				xapi.Config.RoomAnalytics.PeopleCountOutOfCall.set('On');
				xapi.Config.RoomAnalytics.PeoplePresenceDetector.set('On');
				xapi.Status.RoomAnalytics.Engagement.CloseProximity.on((state: string) =>
					processChange('CloseProximity', state)
				);
				xapi.Status.RoomAnalytics.PeopleCount.Current.on((state: string) =>
					processChange('PeopleCount', state)
				);
			});
	});

	async function processChange(type: string, state: string) {
		//if(suspend) return;

		const calls = await xapi.Status.SystemUnit.State.NumberOfActiveCalls.get();
		if (calls > 0) return;

		let close = null;
		let count = null;

		switch (type) {
			case 'CloseProximity':
				close = state;
				count = await xapi.Status.RoomAnalytics.PeopleCount.Current.get();
				break;
			case 'PeopleCount':
				count = state;
				close = await xapi.Status.RoomAnalytics.Engagement.CloseProximity.get();
				break;
		}

		if ((count < 1 || close == 'False') && interval != null) {
			changeState('Standby');
			stopCountdown();
			console.log(
				`Count [${count}] - Close [${close}] - Change Type [${type}] - Detection Ended, resetting timer`
			);
			return;
		} else if (count > 0 && close == 'True' && interval == null) {
			changeState('Countdown');
			console.log(
				`Count [${count}] - Close [${close}] - Change Type [${type}] - New detection detected, starting timer`
			);
			return;
		} else {
			console.log(`Count [${count}] - Close [${close}] - Change Type [${type}] - Ignoring`);
			return;
		}
	}

	function countDownCompleted() {
		dialling = true;
		console.log('Countdown completd, notifying device');
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

	function exitKiosk() {
		if (xapi) {
			console.log('Exiting Kiosk Mode, changing device kiosk mode config to Off');
			xapi.Config.UserInterface.Kiosk.Mode.set('Off');
		} else {
			console.log('Not connected, cannot exit kiosk mode');
		}
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

<section class="hero is-dark is-fullheight">
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
	<div class="hero-foot">
		<!-- <nav class="navbar is-transparent">
			<div class="navbar-start">
				{#if currentState == 'Countdown'}
					<button class="navbar-item button is-normal is-outlined is-text" on:click={exitKiosk}>
						<span class="icon is-small">
							<i class="fas fa-circle-xmark" />
						</span><span>Exit</span></button
					>
				{/if}
				<nav class="navbar-item level is-mobile">
					<div class="level-item has-text-centered">
					  <div>
						<p class="heading">Tweets</p>
						<p class="title">3,456</p>
					  </div>
					</div>
					<div class="level-item has-text-centered">
					  <div>
						<p class="heading">Following</p>
						<p class="title">123</p>
					  </div>
					</div>
					<div class="level-item has-text-centered">
					  <div>
						<p class="heading">Followers</p>
						<p class="title">456K</p>
					  </div>
					</div>
					<div class="level-item has-text-centered">
					  <div>
						<p class="heading">Likes</p>
						<p class="title">789</p>
					  </div>
					</div>
				  </nav>
			</div>

			

			<div class="navbar-end">
				<div class="navbar-item">
					<div>{connectionStatus}</div>
				</div>
			</div>
		</nav> -->



		<nav class="level">
			<!-- Left side -->
			<div class="level-left">
			  
			{#if currentState == 'Countdown'}
				<button class="level-item button is-normal is-outlined is-text" on:click={exitKiosk}>
					<span class="icon is-small">
						<i class="fas fa-circle-xmark" />
					</span><span>Exit</span></button
				>
			{/if}
			</div>
			 
			{#if currentState == 'Countdown'}
			<div class="level-item has-text-centered">
				
				  Made with love - WXSD Team
				
			  </div>
			 
			  {/if}
			<!-- Right side -->
			<div class="level-right">
				<div class="level-item">{connectionStatus}</div>
			</div>
		  </nav>
	</div>
</section>
