<script lang="ts">
	import { Demos } from '$assets/demos';
	import Footer from '$components/Layout/Footer.svelte';
	import { deploymentName } from '../stores';

</script>

<section class="hero is-dark  is-fullheight">
	<!-- Hero head: will stick at the top -->
	<div class="hero-head has-text-centered">
		<p class="title">Webex Solution Developers - {$deploymentName}</p>
	</div>

	<!-- Hero content: will be in the middle -->
	<div class="hero-body px-0">
		<div class="container is-fluid">
		{#each Demos as demoRow}
			<div class="tile is-ancestor">
				{#each demoRow as demo}
					<div class="tile is-parent">
						<article class="tile is-child box is-flex is-flex-direction-column is-justify-content-space-between">
							<p class="title has-text-black">{demo.title}</p>
							<p class="subtitle has-text-black">{demo.subTitle}</p>
							<figure class="image image is-16by9">
								<img src={demo.image} alt="Demo Screenshot" />
							</figure>
							<div class="buttons pt-2">
								{#if demo.link}
									<a class="button is-dark" href={demo.link}>
										<span class="icon is-small">
											<i class="fas fa-brands fa-github" />
										</span>
										<span>Web App Code</span>
									</a>
								{/if}

								{#if demo.macro}
									<a class="button is-dark" href={demo.macro}>
										<span class="icon is-small">
											<i class="fas fa-brands fa-github" />
										</span>
										<span>Macro Code</span>
									</a>
								{/if}
								{#if demo.demo}
									<a class="button is-success" href={demo.demo}>
										<span class="icon is-small">
											<i class="fas fa-solid fa-globe" />
										</span>
										<span>Live Demo</span>
									</a>
								{/if}
								{#if demo.video}
									<a class="button is-link" href={demo.video}>
										<span class="icon is-small">
											<i class="fa-solid fa-circle-play"></i>
										</span>
										<span>Vidcast</span>
									</a>
								{/if}
							</div>
						</article>
					</div>
				{/each}
			</div>
		{/each}
	
		<!-- Hero footer: will stick at the bottom -->
		<div class="hero-foot"><Footer/></div>

	
</section>
