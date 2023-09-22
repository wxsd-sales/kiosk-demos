<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { Buffer } from 'buffer';
	import { XAPI, connect as jsxapi } from 'jsxapi/lib/browser';
	import toast, { Toaster } from 'svelte-french-toast';
	import PrescriptionImage from '$lib/assets/kioskImages/prescription.jpg';
	import PharmacyHelpImage from '$lib/assets/kioskImages/pharmacyHelp.jpg';

	interface Credentials {
		username: string;
		password: string;
		ipAddress: string;
	}

	let credentials: Credentials;
	let xapi: XAPI;
	let volume: number = 0;


	const cards = [
		{
			image: PrescriptionImage,
			title: 'Watch TV',
			text: 'Enter your prescription details and have your order fulfilled'
		},
		{
			image: 'https://res.cloudinary.com/crakerss/image/upload/c_scale,q_auto:eco,w_1440/v1502988509/background_conifer/MS.jpg',
			title: 'Click on image above',
			text: 'Purus semper eget duis at tellus at urna condimentum mattis. Non blandit massa enimnec. Integer enim neque volutpat ac tincidunt vitae semper quis. Accumsan tortorposuere ac ut consequat semper viverra nam.'
		},
		{
			image: PharmacyHelpImage,
			title: 'Notify Staff',
			text: 'Tap here to call our support staff for help'
		}
	]


	onMount(() => {
		window.Buffer = Buffer;
		console.log('onMount ran');
		const hash = window.location.hash.split('#').pop();
		if (hash === undefined) {
			toast.error('Missing Hash Value');
			return;
		}

		const decoded = window.atob(hash);
		credentials = JSON.parse(decoded);
		console.log('Credentials:', JSON.stringify(credentials));

		toast.promise(
			connectToDevice(credentials),
			{
				loading: `Connecting to [${credentials.ipAddress}]`,
				success: `Connected to [${credentials.ipAddress}]`,
				error: `Failed to connect [${credentials.ipAddress}]`
			},
			{
				position: 'bottom-center',
				duration: 4000
			}
		);
	});

	function connectToDevice(credentials: Credentials) {
		return new Promise((resolve, reject) => {
			jsxapi({
				host: credentials.ipAddress,
				protocol: 'wss:',
				username: credentials.username,
				password: credentials.password
			})
				.on('error', (error) => {
					console.error;
					reject();
				})
				.on('ready', async (connection: XAPI) => {
					xapi = connection;
					console.log(`Connected to device [${credentials.ipAddress}]`);
					xapi.Event.Message.Send.on(processMessages);
					sendMessage('Sync');
					volume = await xapi.Status.Audio.Volume.get();
					const volumeMute = await xapi.Status.Audio.VolumeMute.get();
					mute = volumeMute == 'On';

					xapi.Status.Audio.Volume.on((vol: number) => {
						volume = vol;
					});
					xapi.Status.Audio.VolumeMute.on((muteState: string) =>{
						mute = muteState == 'On';

					});


					resolve(true);
				});
		});
	}

	function volumeChanged() {
		console.log('Volumn changed to', volume);
		xapi.Command.Audio.Volume.Set({ Level: volume });
	}


</script>

<Toaster />

<section class="hero is-fullheight">
	<!-- Hero head: will stick at the top -->
	<div class="hero-head has-background-info ">
		<nav class="navbar" role="navigation" aria-label="main navigation">
			<div class="navbar-brand">
			  <a class="navbar-item" href="https://bulma.io">
				<span class="icon is-large">
					<span class="fa-stack fa-sm">
					  <!-- <i class="fas fa-circle fa-stack-2x"></i> -->
					  <i class="fa-regular fa-hospital fa-2xl" style="color: #ffffff;"></i>
					</span>
				  </span>
				  <h1 class="title is-1">Patient Room Controls</h1>
			  </a>
		 
			</div>
		  
			<div id="navbarBasicExample" class="navbar-menu">
			  <div class="navbar-start">
				
				
			  </div>
		  
			  <div class="navbar-end">
				<div class="navbar-item">
				  <div class="buttons">
					<a class="button is-primary">
					  <strong>Sign up</strong>
					</a>
					<a class="button is-light">
					  Log in
					</a>
				  </div>
				</div>
			  </div>
			</div>
		  </nav>
	</div>
  
	<!-- Hero content: will be in the middle -->
	<div class="hero-body has-background-grey-lighter">
		{#each cards as card, index}
		<div class="column is-4">
			<div class="card is-shady">
				<div class="card-image">
					<figure class="image is-4by3">
						<img
							src={card.image}
							alt="Placeholder"
							class="modal-button"
							data-target="modal-image2"
						/>
					</figure>
				</div>
				<div class="card-content">
					<div class="content">
						<h4>{card.title}</h4>
						<p>
							{card.text}
						</p>
						<!-- <span class="button is-link modal-button" data-target="modal-image2">Image modal</span> -->
					</div>
				</div>
			</div>
		</div>

		{/each}
	</div>
  
	<!-- Hero footer: will stick at the bottom -->
	<div class="hero-foot">

		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div class="container has-text-centered" on:click={openTeam}>
			<h2 class="subtitle pb-1 pt-1">
				Made with <i class="fas fa-heart has-text-danger" /> by the WXSD team (wxsd@external.cisco.com)
			</h2>
		</div>

	</div>
  </section>