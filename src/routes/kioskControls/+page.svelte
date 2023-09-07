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
	import { faker } from '@faker-js/faker';
	import TeamModal from '$lib/components/Team/TeamModal.svelte'
	import PrescriptionImage from '$lib/assets/kioskImages/prescription.jpg'
	import PharmacyHelpImage from '$lib/assets/kioskImages/pharmacyHelp.jpg'
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
	let showTeam: boolean = false;
	let showModal: boolean = false;

	const cards = [
		{
			image: PrescriptionImage,
			title: 'Perscription Pickup',
			text: 'Enter your prescription details and have your order fulfilled'
		},
		{
			image: 'https://res.cloudinary.com/crakerss/image/upload/c_scale,q_auto:eco,w_1440/v1502988509/background_conifer/MS.jpg',
			title: 'Click on image above',
			text: 'Purus semper eget duis at tellus at urna condimentum mattis. Non blandit massa enimnec. Integer enim neque volutpat ac tincidunt vitae semper quis. Accumsan tortorposuere ac ut consequat semper viverra nam.'
		},
		{
			image: PharmacyHelpImage,
			title: 'Have a question? ',
			text: 'Tap here to call our support staff for help'
		}
	]



	onMount(() => {
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
			});
	});

	function openModal(){
		showModal = true;

	}

	function openTeam(){
		showModal = false;
		showTeam = true;
	}

	function closeModal(){
		showModal = false;

	}
</script>




<section class="hero is-fullheight">
	<!-- Hero head: will stick at the top -->
	<div class="hero-head has-background-info ">
		<div class="container has-text-centered pt-1 pb-1">
			<p class="title has-text-white">Kiosk Controls</p>
			<p class="subtitle has-text-white">WXSD Demo</p>
		</div>
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

  <TeamModal bind:showTeam></TeamModal>