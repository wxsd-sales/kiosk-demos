<script lang="ts">
	//import { LottiePlayer } from '@lottiefiles/svelte-lottie-player';
	import coffieLottie from '../../lib/assets/lottie/coffee-shop-barista.json';
	import { onMount } from 'svelte';
	import CoffeeOrder from '$components/coffee/CoffeeOrder.svelte';
	import CartIcon from '$components/coffee/CartIcon.svelte';
	import LottiePlayerTest from '$components/LottiePlayerTest.svelte';

	const buttonOptions = {
		responsive: true,
		buttonSize: 'is-large'
	};
</script>

<!-- <section class="hero is-dark is-fullheight">
	<div class="hero-head" />
	<div class="hero-body ">
		<div class="columns">
			<div class="column is-half is-fullheight">
				<container>
					<LottiePlayerTest
						src={coffieLottie}
						autoplay={true}
						loop={true}
						speed={0.75}
						renderer="svg"
						background="transparent"
					/>
				</container>
			</div>
			<div class="column is-half is-fullheight">
				<CartIcon {...buttonOptions} />
				<CoffeeOrder {...buttonOptions} />
			</div>
		</div>
	</div>
	<div class="hero-foot" />
</section> -->

<!-- <div class="columns ">
  <div class="column is-half">
    <container>
      <LottiePlayerTest
        src={coffieLottie}
        autoplay={true}
        loop={true}
        speed={0.75}
        renderer="svg"
        background="transparent"
      />
    </container>
  </div>
  <div class="column">
    <CartIcon {...buttonOptions} />
    <CoffeeOrder {...buttonOptions} />
  </div>
</div> -->

<!-- 
<figure class="image  container ">
  <img src="/webex-logo.svg" alt="Webex Logo" />
</figure> -->

<!-- <LottiePlayer
          src={coffieLottie}
          autoplay={true}
          loop={true}
          speed="0.75"
          renderer="svg"
          height="100vh"
          width="100vw"
          background="transparent"
        />

        <div class="container">
				<CartIcon />

				<figure class="image  container ">
					<img src="/webex-logo.svg" alt="Webex Logo" />
				</figure>

				<CoffeeOrder />
        </div> -->


<section class="hero is-dark is-fullheight">
	<div class="hero-head" />
	<div class="hero-body ">
		<div class="tile is-ancestor">
      <div class="tile  is-parent">
        <div class="tile is-child ">
          <LottiePlayerTest
                src={coffieLottie}
                autoplay={true}
                loop={true}
                speed={0.75}
                renderer="svg"
                background="transparent"
              />
        </div>
      </div>
      <div class="tile is-parent">
        <div class="tile is-flex is-flex-direction-column is-justify-content-space-between is-child">
          <CartIcon {...buttonOptions} />
          <CoffeeOrder {...buttonOptions} />
        </div>
      </div>
    </div>
	</div>
	<div class="hero-foot" />
</section>



<!-- <div class="tile is-ancestor">
  <div class="tile is-parent">
    <div class="tile is-child box">
      <LottiePlayerTest
						src={coffieLottie}
						autoplay={true}
						loop={true}
						speed={0.75}
						renderer="svg"
						background="transparent"
					/>
    </div>
  </div>
  <div class="tile is-parent">
    <div class="tile is-child box">
      <CartIcon {...buttonOptions} />
				<CoffeeOrder {...buttonOptions} />
    </div>
  </div>
</div> -->