<script lang="ts">
    import { Demos} from '$assets/demos';
</script>


<section class="hero is-dark  is-fullheight">
	<!-- Hero head: will stick at the top -->
	<div class="hero-head has-text-centered">
		<p class="title">Webex Solution Developers - Kiosk Demos</p>
	</div>

	<!-- Hero content: will be in the middle -->
	<div class="hero-body">
		<div class="tile is-ancestor">
			<div class="tile is-vertical">
				<div class="tile is-ancestor">

          {#each Demos as demo}
					<div class="tile is-parent">
						<article class="tile is-child box ">
							<p class="title has-text-black">{demo.title}</p>
							<p class="subtitle has-text-black">{demo.subTitle}</p>
              <figure class="image image is-16by9">
                <img src={demo.image} alt='Demo Screenshot'>
              </figure>
              <div class="buttons pt-2">
				<a class="button is-primary" href="{demo.link}">Source Code</a>
				<a class="button is-link" href="{demo.demo}">Live Demo</a>
              </div>
						</article>
					</div>
          {/each}
				</div>
			</div>
		</div>

		<!-- Hero footer: will stick at the bottom -->
		<div class="hero-foot" />
	</div>
</section>
