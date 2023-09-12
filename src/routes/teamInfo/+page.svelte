<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';
	import { fade } from 'svelte/transition';
	import WebexLogo from '$assets/webex-logo.svg';
	import { Buffer } from 'buffer';

	import messageImage from '$lib/assets/teamInfo/message.jpg';
	import sourceCodeImage from '$lib/assets/teamInfo/sourceCode.jpg';
	import webexLabsImage from '$lib/assets/teamInfo/webexLabs.jpg';

	const team = ['askmrsinh', 'akoushke', 'rajithaBK', 'tahanson-cisco', 'wmpmills', 'zoneix'];

	onMount(() => {});
</script>

<!-- <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Ghost Style Blog - Free Bulma template</title>
    <script src="https://kit.fontawesome.com/15181efa86.js" crossorigin="anonymous"></script>
    <link rel="stylesheet" href="https://unpkg.com/bulma@0.9.4/css/bulma.min.css" />
    <link rel="stylesheet" type="text/css" href="../css/ghost-blog.css">
  </head> -->

<section class="hero is-fullheight">
	<div class="hero-head pt-5 pb-5">
		<div class="container has-text-centered">
			<h2 class="title has-text-white">Webex Solutions Developers</h2>
			<h2 class="subtitle has-text-grey-lighter">Delivering the Art of the Possible</h2>
		</div>
	</div>

	<div class="hero-body">
		<div class="container">
			<div class="container is-widescreen">
				<div class="tile is-ancestor">
					<div class="tile is-parent">
						<div class="title" />
						{#each team as member}
							<div class="title is-1">
								<figure class="image blog-img is-64x64">
									<img
										class="is-rounded"
										src="https://github.com/{member}.png"
										alt="GitHub Avatar"
									/>
								</figure>
							</div>
						{/each}
						<div class="title" />
					</div>
				</div>
			</div>

		
			<div class="columns">
				<div class="columns is-multiline">
					<div class="column post is-4">
						<article class="columns is-multiline">
							<div class="column is-12">
								<figure class="image blog-img is-16by9">
									<img class="blog-img" src={webexLabsImage} alt="WebexLabs" />
								</figure>
							</div>
							<div class="column is-12 featured-content">
								<h3 class="has-text-info">Demos</h3>
								<h1 class="title pt-2 has-text-white">Webex Labs Demos on Collab Toolbox</h1>
								<h2 class="subtitle pt-2 has-text-grey-lighter">
									Check out our catalog of Proof of Concept demos at Webex Labs
								</h2>
								<a
									href="https://collabtoolbox.cisco.com/webex-labs"
									class="button is-primary has-text-grey-darker">Webex Labs</a
								>
							</div>
						</article>
					</div>
					<div class="column post is-4">
						<article class="columns is-multiline">
							<div class="column is-12">
								<figure class="image blog-img is-16by9">
									<img class="blog-img" src={sourceCodeImage} alt="SourceCode" />
								</figure>
							</div>
							<div class="column is-12 featured-content">
								<h3 class="has-text-info">Source Code</h3>
								<h1 class="title pt-2 has-text-white">Source Code Available On GitHub</h1>
								<h2 class="subtitle pt-2 has-text-grey-lighter">
									All our projects are open source and available on GitHub 👍
								</h2>

								<a
									href="https://github.com/wxsd-sales"
									class="button is-primary has-text-grey-darker">GitHub Repo</a
								>
							</div>
						</article>
					</div>
					<div class="column post is-4">
						<article class="columns is-multiline">
							<div class="column is-12">
								<figure class="image blog-img is-16by9">
									<img class="blog-img" src={messageImage} alt="Message" />
								</figure>
							</div>
							<div class="column is-12 featured-content">
								<h3 class="has-text-info">Engage</h3>
								<h1 class="title pt-2 has-text-white">Engage With Our Team</h1>
								<h2 class="subtitle pt-2 has-text-grey-lighter">
									Got a customer engagement and want to show them the art of the possible? Message
									our engagement Bot
								</h2>

								<a
									href="webexteams://im?email=globalexpert@webex.bot"
									class="button is-primary has-text-grey-darker">Message Bot 🤖</a
								>
							</div>
						</article>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="hero-footer" />
</section>

<style>
	a:hover {
		text-decoration: underline;
		color: #3b7adf;
	}

	hr {
		background: #24272c;
	}

	.hero-body {
		background: #191b1f;
	}

	.hero {
		background: #060606;
	}

	.blog-img {
		border-radius: 6px;
	}

	/* .blog-posts .post .featured .featured-image img {
		height: 380px;
	} */
	::-webkit-scrollbar {
		height: 10px;
		width: 10px;
	}
	::-webkit-scrollbar-track {
		background: #efefef;
		border-radius: 6px;
	}
	::-webkit-scrollbar-thumb {
		background: #d5d5d5;
		border-radius: 6px;
	}
	::-webkit-scrollbar-thumb:hover {
		background: #c4c4c4;
	}
</style>
