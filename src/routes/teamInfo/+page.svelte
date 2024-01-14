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
	//import { title } from 'process';

	const team = ['askmrsinh', 'akoushke', 'rajithaBK', 'tahanson-cisco', 'wmpmills', 'zoneix'];

	const cards = [
		{
			category: 'Demos',
			title: 'Webex Labs Demo on Collab Toolbox',
			subTitle: 'Check out our catalog of Proof of Concept demos at Webex Labs',
			link: 'https://collabtoolbox.cisco.com/webex-labs',
			linkText: 'Webex Labs',
			image: webexLabsImage,
			imageAlt: 'Webex Labs'
		},
		{
			category: 'Source Code',
			title: 'Source Code Available On GitHub',
			subTitle: 'All our projects are open source and available on GitHub 👍',
			link: 'https://github.com/wxsd-sales',
			linkText: 'GitHub Repo',
			image: sourceCodeImage,
			imageAlt: 'asd'
		},
		{
			category: 'Engage',
			title: 'Engage With Our Team',
			subTitle: 'Got a customer engagement and want to show them the art of the possible? Message our engagement Bot',
			link: 'https://collabtoolbox.cisco.com/webex-labs',
			linkText: 'Message Our Bot 🤖',
			image: messageImage,
			imageAlt: 'asd'
		}
	];

	onMount(() => {});
</script>

<section class="hero is-fullheight">
	<div class="hero-head pt-5 pb-5">
		<div class="container has-text-centered">
			<h2 class="title has-text-white">Webex Solutions Developers</h2>
			<h2 class="subtitle has-text-grey-lighter">Delivering the Art of the Possible</h2>
		</div>
	</div>

	<div class="hero-body">
		<div class="container">
			<section class="section is-flex is-flex-direction-column is-align-items-center">
				<div class="title has-text-white">Meet The Team</div>

				<div class="columns is-mobile">
					{#each team as member}
							<div class="colume">
								<figure class="image blog-img is-64x64">
									<img
										class="is-rounded"
										src="https://github.com/{member}.png"
										alt="GitHub Avatar"
									/>
								</figure>
							</div>
						{/each}
				  </div>
			
			</section>

			<div class="columns">
				<div class="columns is-multiline">
					{#each cards as { image, category, title, subTitle, link, linkText }}
						<div class="column post is-4">
							<article class="columns is-multiline">
								<div class="column is-12">
									<figure class="image blog-img is-16by9">
										<img class="blog-img" src={image} alt="WebexLabs" />
									</figure>
								</div>
								<div class="column is-12 featured-content">
									<h3 class="has-text-info">{category}</h3>
									<h1 class="title pt-2 has-text-white">{title}</h1>
									<h2 class="subtitle pt-2 has-text-grey-lighter">{subTitle}</h2>
									<a href="{link}" class="button is-primary has-text-grey-darker">{linkText}</a>
								</div>
							</article>
						</div>
					{/each}
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
