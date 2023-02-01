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

<section class="hero is-dark is-fullheight">
	<div class="hero-head" />
	<div class="hero-body ">
		<div class="tile is-ancestor">
      <div class="tile  is-parent">
        <div class="tile is-child ">
          <LottiePlayerTest
                src={coffieLottie}
                autoplay={false}
                loop={false}
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