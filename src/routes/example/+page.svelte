<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';
	import { fade } from 'svelte/transition';
	import WebexLogo from '$assets/webex-logo.svg';

	let standby = true;
	let mainView = false;

	let sipAddress = '';
	
	function dial(number: string) {
		console.log('Dialling Number', number);
		location.hash = '';
		location.hash = '#command=dial&number=' + number;
	};

	function dialSIP() {
		console.log('Dialling SIP', sipAddress);
		location.hash = '';
		location.hash = '#command=dial&number=' + sipAddress;
	}

	function exitKiosk() {
		console.log('Existing Kiosk Mode');
		location.hash = '';
		location.hash = '#command=exitKiosk';
	}
</script>

<section class="hero is-dark is-fullheight">
	<!-- Hero head: will stick at the top -->
	<div class="hero-head">
		{#if mainView}
			<div class="container has-text-centered ">
				<h1 class="title is-1 pt-3">Welcome to the WXSD Demo Kiosk</h1>
			</div>
		{/if}
	</div>
	<!-- Hero content: will be in the middle -->
	<div class="hero-body">
		{#if standby}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div
				class="container has-text-centered "
				on:click={() => (standby = false)}
				transition:fly={{ y: -200, duration: 1000 }}
				on:outroend={() => (mainView = true)}
			>
				<div class="column is-half is-offset-one-quarter">
					<figure class="image is-16by9">
						<img src={WebexLogo} alt="Webex Logo" />
					</figure>
				</div>
				<p class="title is-size-1">WXSD Kiosk Demo</p>
				<p class="title is-size-1">Tap To Begin</p>
			</div>
		{/if}

		{#if mainView}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- <div
				class="container"
				transition:fade={{ delay: 250, duration: 300 }}
				on:outroend={() => (standby = true)}
			>
				<a class="button is-large" href="#dial=wimills@cisco.com&command=123"
					>Dial wimills@cisco.com</a
				>
				
				<a class="button is-large" href="#exitKiosk">Exit Kiosk Junk</a>
				<button class="button is-large" on:click={() => (mainView = false)}>Kiosk Standby</button>
			</div> -->

			<div
				class="tile is-ancestor"
				transition:fade={{ delay: 250, duration: 300 }}
				on:outroend={() => (standby = true)}
			>
				<div class="tile is-parent">
					<article class="tile is-child box has-background-primary-dark">
						<p class="title">Dial User</p>
						<button class="button is-light"
						on:click={()=>dial('wimills@cisco.com')}>wimills@cisco.com</button>
					</article>
				</div>

				<div class="tile is-parent">
					<article class="tile is-child box has-background-link-dark">
						<p class="title">Dial Call Queue</p>
						<button class="button is-light"
						on:click={()=>dial('2222')}>Extension 2222</button>
					</article>
				</div>
				<div class="tile is-parent">
					<article class="tile is-child box has-background-info-dark">
						<p class="title">Dial Input</p>
						<div class="field">
							<!-- svelte-ignore a11y-label-has-associated-control -->
							<label class="label">Number</label>
							<div class="control">
								<input
									class="input"
									type="text"
									placeholder="user@example.com"
									bind:value={sipAddress}
								/>
							</div>
						</div>
						<button class="button is-light"
						on:click={dialSIP}>Dial</button>
					</article>
				</div>
			</div>
		{/if}
	</div>
	<!-- Hero footer: will stick at the bottom -->
	<div class="hero-foot">
		{#if mainView}
			<div class="field is-grouped is-grouped-centered">
				<p class="control">
					<button class="button is-large is-danger" on:click={exitKiosk}>Exit Kiosk</button>
				</p>
				<p class="control">
					<button class="button is-large is-warning" on:click={() => (mainView = false)}
						>Enter Standby</button
					>
				</p>
			</div>
		{/if}
	</div>
</section>
