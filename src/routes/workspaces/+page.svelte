<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import WebexLogo from '$assets/webex-logo.svg';
	import webexoauth from '$lib/webexoauth';
	import workspaceReport from '$lib/workspaceReport';

	const accessToken = webexoauth.getWebexAccessToken();
	let currentStep = accessToken == undefined ? 0 : 1;

	let wsReport: workspaceReport | undefined;

	let counter = 0;
	let loading = false;
	let queryComplete = false;

	$: testing = wsReport?.workspaces;

	if (accessToken) {
		wsReport = new workspaceReport(accessToken);
	}

	onMount(()=>{
		console.log($page.url)
	})


	const steps = [
		{
			title: 'Sign In',
			text: 'Please Sign In Using Webex',
			button: 'Sign In',
			icon: 'fa-circle-user',
			action: () => webexoauth.webexOAuthRedirect()
		},
		{
			title: 'List Workspaces',
			text: 'Click Begin To List Your Organisations Workspaces',
			icon: 'fa-building',
			button: 'Begin',
			result: 'Workspaces Found: ',
			action: () => queryWorkspaces()
		},
		{
			title: 'Query Capabilities',
			text: 'Click Begin To Get All Your Workspaces Capabilities',
			button: 'Begin',
			icon: 'fa-list-check',
			result: 'Workspaces Processed: ',
			metrics: ['soundLevel', 'ambientNoise', 'temperature', 'humidity'],
			options: ['soundLevel', 'ambientNoise', 'temperature', 'humidity'],
			action: () => getCapabilites()
		},
		{
			title: 'Query Historical Data',
			text: 'Click Begin To Get All Your Workspaces Capabilities',
			button: 'Begin',
			icon: 'fa-chart-line'
		},
		{
			title: 'Download Report',
			text: 'Click Download to get report',
			button: 'Download',
			icon: 'fa-file-arrow-down'
		}
	];



	function createReport() {
		const rows = [
			['name1', 'city1', 'some other info'],
			['name2', 'city2', 'more info']
		];
		let csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
		var encodedUri = encodeURI(csvContent);
		var link = document.createElement('a');
		link.setAttribute('href', encodedUri);
		link.setAttribute('download', 'my_data.csv');
		document.body.appendChild(link); // Required for FF

		link.click(); // This will download the data file named "my_data.csv".
	}

	function workspaceProgress(results: number, finished = false) {
		counter = results;
		if (finished) {
			currentStep++;
			loading = false;
			console.log(wsReport?.workspaces.length);
		}
	}

	async function queryWorkspaces() {
		if (!wsReport) return;
		loading = true;
		counter = 0;
		console.log('Beginning report');
		wsReport.getWorkspaces(workspaceProgress);
	}

	function processCapabilities(capability: any) {
		console.log(capability);
	}

	async function getCapabilites() {
		if (!wsReport) return;

		loading = true;

		console.log('Beginning report');

		await wsReport.getAllCapabilities(processCapabilities);
	}
</script>

<section class="hero has-background-light is-fullheight">
	<!-- Hero head: will stick at the top -->
	<div class="hero-head">
		<nav class="level py-3">
			<p class=" level-item title is-size-1">WXSD Workspaces Report Demo</p>
		</nav>
	</div>
	<!-- Hero content: will be in the middle -->
	<div class="hero-body">
		<div class="container has-text-centered">
			<nav class="breadcrumb is-centered has-arrow-separator" aria-label="breadcrumbs">
				<ul>
					{#each steps as step, i}
						<!-- svelte-ignore a11y-invalid-attribute -->
						<li>
							<a href="#" class={i == currentStep ? 'has-text-success' : 'has-text-dark'}>
								<span class="icon">
									<i class="fas {step.icon}" aria-hidden="true" />
								</span>
								<span>{step.title}</span>
							</a>
						</li>
					{/each}
				</ul>
			</nav>

			{#each steps as step, i}
				{#if currentStep == i}
					<div class="tile is-ancestor">
						<div class="tile is-parent">
							<article class="tile is-child" />
							<article class="tile is-child box is-8 has-text-centered">
								<p class="title">{step.title}</p>
								<p class="subtitle">{step.text}</p>
								{#if loading}
									<div class="content">
										<p>{step.result} {counter}</p>
									</div>
								{/if}

								{#if step.options}
								<div class="container has-text-centered is-flex is-flex-direction-column pb-4">

								{#each step.options as option}
								<label class="checkbox">
									<input type="checkbox" />
									{option}
								</label>
									{/each}
									</div>
								{/if}
								
								
								

								<button
									class="button is-success {loading ? 'is-loading' : ''}"
									on:click={step.action}>{step.button}</button
								>
							</article>
							<article class="tile is-child" />
						</div>
					</div>
				{/if}
			{/each}
		</div>
	</div>
	<!-- Hero footer: will stick at the bottom -->
	<div class="hero-foot" />
</section>

<style>
</style>
