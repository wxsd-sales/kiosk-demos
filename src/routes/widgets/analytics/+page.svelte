<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import connection from '$lib/cloudxapi';
	import { flatten } from 'flatten-anything';
	import type { PageData } from './$types';

	let token: string | null;
	let deviceId: string | null;

	let demo = false;

	let roomAnalytics: Record<string, any> = {
		'AmbientNoise.Level.A': 37,
		AmbientTemperature: '71.6°F / 22C',
		'Engagement.CloseProximity': 'False',
		'PeopleCount.Capacity': 1,
		'PeopleCount.Current': 1,
		PeoplePresence: 'No',
		RelativeHumidity: 41,
		'Sound.Level.A': 39,
		'ReverberationTime.Middle.RT60': 0,
		'T3Alarm.Detected': 'False',
		UltrasoundPresence: 'No'
	};

	onMount(() => {
		token = $page.url.searchParams.get('token');
		deviceId = $page.url.searchParams.get('deviceId');

		if (!token || !deviceId) {
			console.log('Missing Bot token or deviceId parameters');
			demo = true;
			return;
		}
		console.log(token);
		console.log(deviceId);

		if (token != null && deviceId != null) {
			const xapi = new connection(deviceId, token);
			pollData(xapi);
			setInterval(pollData, 5000, xapi);
		}
	});

	async function pollData(xapi: connection) {
		roomAnalytics = await 
    xapi
			.getAnalytics()
			.then((result) => flatten(result) )
			.then(result => {
				if ('AmbientTemperature' in result) {
					let cTemp = parseInt(result.AmbientTemperature);
					let fTemp = (cTemp * 9) / 5 + 32;
					result.AmbientTemperature = `${fTemp}°F / ${cTemp}°C`;
				}
        if ('RelativeHumidity' in result) {
					result.RelativeHumidity = result.RelativeHumidity + '%';
				}
				return result;
			});

		console.log(roomAnalytics);
	}

	//export let data: PageData;

	const sensors = [
		[
			{ title: 'Temperature', metric: 'AmbientTemperature', icon: 'fa-temperature-three-quarters' },
			{ title: 'Humidity', metric: 'RelativeHumidity', icon: 'fa-wind' }
		],
		[
			{ title: 'People Presence', metric: 'PeoplePresence', icon: 'fa-temperature-three-quarters' },
			{ title: 'People Count', metric: 'PeopleCount.Current', icon: 'fa-people-group' }
		],
		[
			{ title: 'Space Capacity', metric: 'PeopleCount.Capacity', icon: 'fa-user-check' },
			{ title: 'Close Proximity', metric: 'Engagement.CloseProximity', icon: 'fa-user-group' }
		]
	];
</script>

<svelte:head>
	<script src="https://kit.fontawesome.com/33539b0b8b.js" crossorigin="anonymous"></script>
</svelte:head>

<section class="hero is-dark is-fullheight">
	<!-- Hero head: will stick at the top -->
	<div class="hero-head has-text-centered">
		<p class="title is-size-2">Device Analytics</p>
	</div>
	<!-- Hero content: will be in the middle -->
	<div class="hero-body py-2">
		<div class="container has-text-centered">
			{#each sensors as row}
				<div class="columns is-mobile">
					{#each row as sensor}
						<div class="column">
							<div class="card has-background-dark has-text-grey-light outline">
								<header class="card-header">
									<p class="card-header-title is-size-5 has-text-grey-light">{sensor.title}</p>
									<span class="icon is-large is-size-5">
										<i class="fas {sensor.icon}" />
									</span>
								</header>
								<div class="card-content has-text-centered">
									<h1 class="title">{roomAnalytics[sensor.metric]}</h1>
									<!-- <p >{item.stat}</p> -->
								</div>
							</div>
						</div>
					{/each}
				</div>
			{/each}
			{#if demo}
				<p>Demo Mode</p>
			{/if}
		</div>
		<!-- Hero footer: will stick at the bottom -->
		<div class="hero-foot" />
	</div>
</section>

<style>
	.outline {
		border: 1px solid white;
	}
</style>
