<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';
	import { fade } from 'svelte/transition';
	import WebexLogo from '$assets/webex-logo.svg';
	import { Buffer } from 'buffer';
	import YouTube from '$lib/components/YouTube.svelte';
	import { XAPI, connect as jsxapi } from 'jsxapi/lib/browser';
	import toast, { Toaster } from 'svelte-french-toast';

	interface Credentials {
		username: string;
		password: string;
		ipAddress: string;
	}

	let credentials: Credentials;
	let xapi: XAPI;
	let volume: number = 0;

	let playing = false;
	let mute = false;
	let title: string = 'Loading ....';
	let playTime: number = 0;
	let duration: number = 0;

	let interval: NodeJS.Timer | null = null;
	let rates = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75];
	let playRate = 1;

	$: playTimeMS = fmtMSS(playTime);
	$: durationMS = fmtMSS(duration);

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

					resolve(true);
				});
		});
	}

	function fmtMSS(s: number) {
		return (s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + s;
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
		if (message.device != 'player') return;

		switch (message.type) {
			case 'Sync':

				switch (message.data.playState) {
					case 'Unstarted': //Unstarted
						playing = false;
						break;
					case 'Ended': //Ended
						playing = false;
						break;
					case 'Playing': //Playing
						playTime = message.data.playTime;
						startInterval()
						break;
					case 'Paused': //Paused
						playTime = message.data.playTime;
						playing = false;
						stopInterval();
						break;
					case 'Buffering': //Buffering
						playTime = message.data.playTime;
					
						stopInterval();
						break;
					case 'Cued': //Cued
						playing = false;
						playTime = message.data.playTime;
						rates = message.data.rates;
						title = message.data.title;
						duration = message.data.duration;
						break;
				}
				break;
		}

		//const data = message.data;
		//console.log("Coordinates: ", JSON.stringify(data));
	}

	function playPause() {
		if (playing) {
			console.log('Pausing Video');
			sendMessage('Pause');
		} else {
			console.log('Playing Video');
			sendMessage('Play');
		}
		
	}

	async function toggleMute() {
		mute = !mute;
		console.log('Volume', mute ? 'Muted' : 'Unmuted');
		if (mute) {
			xapi.Command.Audio.Volume.Mute();
			volume = 0;
		} else {
			xapi.Command.Audio.Volume.Unmute();
			volume = await xapi.Status.Audio.Volume.get();
		}
	}

	function updateProgressBar() {
		if (playTime === duration) {
			stopInterval();
			return;
		}
		playTime = Math.round(playTime + playRate);
	}

	function updatePlayTime(event: any) {
		console.log('update playtime', event);
		sendMessage('PlayTime', playTime);
	}

	function stopInterval() {
		if (interval === null) return;
		console.log('Clearning Interval')
		clearInterval(interval);
	}

	function startInterval(){
		playing = true;
		if (interval !== null) 
		console.log('Starting Interval')
		interval = setInterval(updateProgressBar, 1000);
	}


	function volumeChanged() {
		console.log('Volumn changed to', volume);
		xapi.Command.Audio.Volume.Set({ Level: volume });
	}

	function sendMessage(type: string, data: string | number = '') {
		const payload = {
			device: 'controller',
			type: type,
			data: data
		};
		console.log('Sending:', JSON.stringify(payload));
		xapi.Command.Message.Send({ Text: JSON.stringify(payload) });
	}

	function decreaseSpeed() {
		const index = rates.indexOf(playRate);
		if (index == 0 || index == -1) return;
		playRate = rates[index - 1];
		console.log('Playrate decreased to:', playRate);
		sendMessage('Speed', playRate);

		if (playing) {
			stopInterval();
			interval = setInterval(updateProgressBar, 1000 * playRate);
		}
	}

	function increaseSpeed() {
		const index = rates.indexOf(playRate);
		if (index == rates.length - 1 || index == -1) return;
		playRate = rates[index + 1];
		console.log('Playrate increased to:', playRate);
		sendMessage('Speed', playRate);
		if (playing) {
			stopInterval();
			interval = setInterval(updateProgressBar, 1000 * playRate);
		}
	}
</script>

<Toaster />

<section class="hero is-dark is-fullheight">
	<!-- Hero head: will stick at the top -->
	<div class="hero-head">
		<div class="container has-text-centered">
			<h1 class="title is-1 pt-4">YouTube Player Controls</h1>
		</div>
	</div>

	<!-- Hero content: will be in the middle -->
	<div class="hero-body">
		<div class="tile is-ancestor is-vertical">
			<div class="tile">
				<div class="tile is-parent">
					<div class="tile is-child" />
				</div>

				<div class="tile is-parent is-7">
					<div class="tile is-child card">
						<div class="card-content">
							<div class="media">
								<div class="media-content">
									<p class="title is-4 has-text-black">Now Watching</p>
								</div>
							</div>
							<div class="content">
								<p class="title is-4 has-text-black">{title}</p>
							</div>
						</div>
					</div>
				</div>

				<div class="tile is-parent">
					<div class="tile is-child" />
				</div>
			</div>

			<div class="tile">
				<div class="tile is-parent">
					<div class="tile is-child" />
				</div>

				<div class="tile is-parent">
					<div class="tile is-child is-flex is-justify-content-center">
						<p class="title is-flex is-align-content-end">[ {playTimeMS} / {durationMS} ]</p>
					</div>
				</div>

				<div class="tile is-parent">
					<div class="tile is-child" />
				</div>
			</div>

			<div class="tile">
				<div class="tile is-parent is-1">
					<div
						class="tile is-child container is-flex is-justify-content-center is-align-items-center"
					>
						<button
							class="button is-rounded is-large is-{playing ? 'link' : 'danger'}"
							on:click={playPause}
						>
							<span class="icon">
								<i class="fas fa-{playing ? 'pause' : 'play'}" />
							</span>
						</button>
					</div>
				</div>

				<div class="tile is-parent">
					<div class="tile is-child container is-flex is-justify-content-center">
						<input
							bind:value={playTime}
							on:mouseup={updatePlayTime}
							on:touchend={updatePlayTime}
							style="width: 100%;"
							type="range"
							min="1"
							max={duration.toString()}
						/>
					</div>
				</div>
			</div>

			<!-- <div class="tile">
				<div class="tile is-parent">
					<section class="tile is-child section" />
				</div>
			</div> -->

			<div class="tile">
				<div class="tile is-parent">
					<div class="tile is-child" />
				</div>

				<div class="tile is-parent is-1">
					<div class="tile is-child is-flex is-align-items-center">
						<button
							class="button is-rounded is-large is-{mute ? 'warning' : 'success'}"
							on:click={toggleMute}
						>
							<span class="icon">
								<i class="fas fa-{mute ? 'volume-xmark' : 'volume-high'}" />
							</span>
						</button>
					</div>
				</div>
				<div class="tile is-parent is-3 is-flex is-justify-content-center">
					<div class="tile is-child is-flex">
						<input
							bind:value={volume}
							on:change={volumeChanged}
							type="range"
							style="width: 100%;"
							min="0"
							max="100"
						/>
					</div>
				</div>

				<div class="tile is-parent">
					<div class="tile is-child" />
				</div>
				<!-- <div class="tile is-child is-flex ">
					<h2 class="subtitle pl-3 pb-3">speed</h2>
				</div> -->
				<div class="tile is-vertical is-2">
					<div class="tile is-vertical">
						<div class="tile is-parent is-flex">
							<div class="tile is-child is-flex is-justify-content-center">Playspeed</div>
						</div>

						<div class="tile is-parent is-flex">
							<div class="tile is-child is-flex is-justify-content-center">
								[ x{playRate} ]
							</div>
						</div>
					</div>

					<div class="tile">
						<div class="tile is-parent">
							<div class="tile is-child is-flex is-justify-content-center">
								<button class="button is-rounded is-large is-succcess" on:click={decreaseSpeed}>
									<span class="icon">
										<i class="fas fa-backward-fast" />
									</span>
								</button>
							</div>
						</div>
						<div class="tile is-parent">
							<div class="tile is-child is-flex is-justify-content-center">
								<button class="button is-rounded is-large is-succcess" on:click={increaseSpeed}>
									<span class="icon">
										<i class="fas fa-forward-fast" />
									</span>
								</button>
							</div>
						</div>
					</div>
				</div>

				<div class="tile is-parent">
					<div class="tile is-child" />
				</div>
			</div>

			<!-- <div class="tile">
				{#each Array(12) as _, index (index)}
					<div class="tile is-parent is-1">
						<div class="tile is-child box">
							<p class="title has-text-black">{index}</p>
						</div>
					</div>
				{/each}
			</div> -->
		</div>
	</div>

	<div class="hero-foot">
		<h2 class="subtitle pl-3 pb-3">
			Made with <i class="fas fa-heart has-text-danger" /> by the WXSD team (wxsd@external.cisco.com)
		</h2>
	</div>
</section>
