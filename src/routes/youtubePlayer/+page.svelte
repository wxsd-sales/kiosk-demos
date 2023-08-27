<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';
	import { fade } from 'svelte/transition';
	import WebexLogo from '$assets/webex-logo.svg';
	import { Buffer } from 'buffer';
	import YouTube from '$lib/components/YouTube.svelte';
	//import YouTubePlayer from 'youtube-player';
	import { XAPI, connect as jsxapi } from 'jsxapi/lib/browser';
	import type { Options, YouTubePlayer } from 'youtube-player/dist/types';
	import toast, { Toaster } from 'svelte-french-toast';
	import { PlayerRender } from '$lib/lotteUtils';

	interface Credentials {
		username: string;
		password: string;
		ipAddress: string;
	}

	const options: Options = {
		height: window.innerHeight,
		width: window.innerWidth,
		//  see https://developers.google.com/youtube/player_parameters
		playerVars: {
			autoplay: 0,
			controls: 0
		}
	};

	let credentials: Credentials;
	let xapi: XAPI;

	let player: YouTubePlayer;
	let playerReady = false;
	let videoId: string;
	let duration: number;
	let playTime: number;
	let title: number;
	let rates: Array<number>;
	let playRate: number;
	let playState: string = 'unstarted'

	async function onReady(event: any) {
		console.log('onReady:', event);
		console.log(event.detail.target);
		// duration = await event.detail.target.playerInfo.duration;
		// title = await event.detail.target.videoTitle;

		player = event.detail.target;

		console.log('Duration', duration, 'Title', title);

		// access to player in all event handlers via event.target
		//event.target.pauseVideo();
	}

	async function onPlayerStateChange(event: any) {
		console.log('onPlayerStateChange:', event);

		switch (event.detail.data){
			case -1: //Unstarted
				playTime = Math.round(event.detail.target.playerInfo.currentTime);
				playState = 'Unstarted';
				updateController();
				break;
			case 0: //Ended
				playTime = Math.round(event.detail.target.playerInfo.currentTime);
				playState = 'Ended';
				updateController();
				break;
			case 1: //Playing
				playTime = Math.round(event.detail.target.playerInfo.currentTime);
				console.log('Duration:', duration, 'Title', title, 'PlayTime', playTime);
				playState = 'Playing';
				updateController();
				break;
			case 2: //Paused
				playTime = Math.round(event.detail.target.playerInfo.currentTime);
				playState = 'Paused';
				updateController();
				break;
			case 3: //Buffering
				playTime = Math.round(event.detail.target.playerInfo.currentTime);
				playRate = event.detail.target.playerInfo.playbackRate;
				playState = 'Buffering';
				updateController();
				break;
			case 5: //Cued
				duration = await player.getDuration();
				title = event.detail.target.videoTitle;
				rates = event.detail.target.playerInfo.availablePlaybackRates;
				playTime = Math.round(event.detail.target.playerInfo.currentTime);
				console.log('Duration:', duration, 'Title', title, 'PlayTime', playTime);
				playState = 'Cued';
				updateController();
				break;
		}

	}

	onMount(() => {
		const vid = $page.url.searchParams.get('videoId');
		if (vid != null) {
			videoId = vid;
			playerReady = true;
		}

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
				duration: 5000
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
					resolve(true);
				});
		});
	}

	function parseString(str: string) {
		let result;
		try {
			result = JSON.parse(str);
		} catch (e) {
			result = false;
		}
		return result;
	}

	function processMessages(event: { Text: string; id: number }) {
		console.log('Message Event', event);

		const message = parseString(event.Text);
		if (!message) return;
		if (message.device != 'controller') return;

		switch (message.type) {
			case 'Play':
				player.playVideo();
				break;
			case 'Pause':
				player.pauseVideo();
				break;
			case 'Speed':
				player.setPlaybackRate(message.data);
				break;
			case 'Sync':
				updateController();
				break;
			case 'PlayTime':
				player.seekTo(message.data , true)
				break;
		}

	}

	function sendMessage(type: string, data: string | number | {}) {
		const payload = {
			device: 'player',
			type: type,
			data: data
		};
		console.log('Sending:', JSON.stringify(payload));
		xapi.Command.Message.Send({ Text: JSON.stringify(payload) });
	}

	function updateController(){
		if(!playerReady) return;
		sendMessage('Sync', {title: title, duration: duration, rates: rates, playTime: playTime, playState: playState})
	}


</script>

<svelte:head>
	<style>
		body {
			background: black;
		}
	</style>
</svelte:head>

<!-- <div class="background">
	
</div> -->
<Toaster />
<!-- <div bind:this={player}></div> -->
{#if playerReady}
	<YouTube bind:videoId {options} on:ready={onReady} on:stateChange={onPlayerStateChange} />
{/if}

<style>
</style>
