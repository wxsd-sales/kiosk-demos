<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';
	import { fade } from 'svelte/transition';
	import WebexLogo from '$assets/webex-logo.svg';
	import Keypad from '$lib/components/kiosk/Keypad.svelte';
	import toast, { Toaster } from 'svelte-french-toast';

	let standby = true;
	let mainView = false;
	let modal = false;
	let pin = '';

	$: view = pin ? pin.replace(/\d(?!$)/g, '•') : 'enter your pin';

	let sipAddress = 'user@example.com';
	let dialInput = '';
	let extension = '2222';

	onMount(() => {
		const sip = $page.url.searchParams.get('sipAddress');
		const num = $page.url.searchParams.get('extension');
		if (sip != null) {
			sipAddress = sip;
		}
		if (num != null) {
			extension = num;
		}
	});

	function dial(number: string) {
		console.log('Dialling Number', number);
		toast.success('Dialling ' + number);
		location.hash = '';
		location.hash = '#command=dial&number=' + number;
	}

	function dialSIP() {
		console.log('Dialling SIP', dialInput);
		toast.success('Dialling ' + dialInput);
		location.hash = '';
		location.hash = '#command=dial&number=' + dialInput;
	}

	function exitKiosk() {
		console.log('Existing Kiosk Mode');
		const loadingId = toast.loading('PIN sent to device')

		setTimeout(()=>{
			toast.remove(loadingId);
		}, 3000)
		location.hash = '';
		location.hash = '#command=exitKiosk&pin=' + pin;
	}

	function openModal() {
		console.log('Opening Modal');
		modal = true;
	}

	function closeModal() {
		console.log('Closing Modal');
		modal = false;
	}

	function pinAccepted() {
		console.log('PIN Accepted');
		toast.success('PIN Accepted');

	}

	function pinRejected() {
		console.log('Pin Rejected');
		toast.error('PIN Rejected');
	}

	function handleHash() {
		console.log('Hash Updated: ' + location.hash);
		if (!location.hash.startsWith('#response=')) return;

		const response = location.hash.replace('#response=', '');
		console.log('Hash Response: ' + response)

		switch (response) {
			case 'accepted':
				pinAccepted();
				break;
			case 'rejected':
				pinRejected();
				break;
		}
	}
</script>

<svelte:window on:hashchange={handleHash} />

<Toaster />

<section class="hero is-dark is-fullheight">
	<!-- Hero head: will stick at the top -->
	<div class="hero-head">
		{#if mainView}
			<div class="container has-text-centered ">
				<h1 class="title is-1 pt-3">WXSD - WebView Device Control</h1>
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
				<p class="title is-size-1">WXSD Demo</p>
				<p class="title is-size-3">WebView Device Control</p>
				<p class="title is-size-1">Tap To Begin</p>
			</div>
		{/if}

		{#if mainView}
			<div
				class="tile is-ancestor"
				transition:fade={{ delay: 250, duration: 300 }}
				on:outroend={() => (standby = true)}
			>
				<div class="tile is-parent">
					<article class="tile is-child box has-background-warning-dark">
						<h1 class="title">SIP Protocol</h1>
						<h2 class="subtitle">
							Tapping this button will place a call via the normal SIP Protocol handle. No macro is
							involved and a modal should appear.
						</h2>
						<a class="button is-light" href="sip:{sipAddress}">{sipAddress}</a>
					</article>
				</div>
				<div class="tile is-parent">
					<article class="tile is-child box has-background-primary-dark">
						<h1 class="title">Dial User</h1>
						<h2 class="subtitle">
							This button will update the URL Hash Parameters which the macro can detect and then
							place a call.
						</h2>
						<button class="button is-light" on:click={() => dial(sipAddress)}>{sipAddress}</button>
					</article>
				</div>

				<div class="tile is-parent">
					<article class="tile is-child box has-background-link-dark">
						<h1 class="title">Dial Call Queue</h1>
						<h2 class="subtitle">
							Similar to the dial user example, this will dial a Webex Calling number instead.
						</h2>
						<button class="button is-light" on:click={() => dial(extension)}
							>Extension {extension}</button
						>
					</article>
				</div>
				<div class="tile is-parent">
					<article class="tile is-child box has-background-info-dark">
						<h1 class="title">Dial Input</h1>
						<h2 class="subtitle">
							Enter any SIP URI or extension number you like and the Macro which instuct the Device
							to place a call
						</h2>
						<div class="field">
							<!-- svelte-ignore a11y-label-has-associated-control -->
							<label class="label has-text-light">Number</label>
							<div class="control">
								<input
									class="input"
									type="text"
									placeholder="user@example.com"
									bind:value={dialInput}
								/>
							</div>
						</div>
						<button class="button is-light" on:click={dialSIP}>Dial</button>
					</article>
				</div>
			</div>
		{/if}

		<div class="modal {modal ? 'is-active' : ''}">
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div class="modal-background" on:click={closeModal} />
			<div class="modal-card has-background-light">
				<header class="modal-card-head has-text-centered">
					<p class="modal-card-title">Enter PIN To Exit Kiosk Mode</p>
					<button class="delete" aria-label="close" on:click={closeModal} />
				</header>
				<section class="modal-card-body has-text-centered has-background-light">
					<h1 class="title {pin ? 'has-text-grey' : 'has-text-grey-lighter'}">{view}</h1>
					<Keypad bind:value={pin} on:submit={exitKiosk} on:timeout={()=>toast.error('No response from device')}/>
				</section>
			</div>
		</div>
	</div>
	<!-- Hero footer: will stick at the bottom -->
	<div class="hero-foot">
		{#if mainView}
			<div class="field is-grouped is-grouped-centered">
				<p class="control">
					<button class="button is-large is-danger" on:click={openModal}>Exit Kiosk</button>
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
