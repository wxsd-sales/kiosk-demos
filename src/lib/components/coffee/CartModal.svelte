<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { elasticOut } from 'svelte/easing';
	import { cart } from '../../../stores';
	import soapbox from '../../soapbox';
	
	
	export let buttonSize: string = 'is-large';
	export let responsive: boolean = true;

	
	export let cartModalVisable = false;
	
	let connection: soapbox;
	const testRoom = 'coffeeOrders';

	function closeModal(){
		cartModalVisable = false
	}

	function sendOrder(){
		const testOrder = {
			name: 'William',
			location: 'The Office',
			items: $cart
		}

		console.log('Sending Order: ' +JSON.stringify(testOrder))
		connection.sendOrder(testOrder)



	}
	onMount(async () => {
		connection = new soapbox(testRoom);
	});
</script>

<div class="modal" class:is-active={cartModalVisable}>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div class="modal-background" on:click={closeModal}></div>
	<div class="modal-card has-text-white">
	  <header class="modal-card-head has-background-dark">
		<p class="modal-card-title has-text-white">Cart</p>
		<button class="delete" aria-label="close"  on:click={closeModal}></button>
	  </header>
	  <section class="modal-card-body has-background-dark">
		
		{#if $cart.length < 1}
		<p>No orders</p>
		{:else}
		{#each $cart as order, i}
		<p>{i+1}: {order.coffee} | {order.milk} 🗑️</p>
		{/each}
		{/if}
		<!-- Content ... -->
	  </section>
	  <footer class="modal-card-foot has-background-dark">
		{#if $cart.length > 0}
		<button class="button is-warning is-rounded {buttonSize}"
		class:is-responsive={responsive}>Clear Cart</button>
		<button class="button is-info is-rounded {buttonSize}"
		class:is-responsive={responsive}>Add More</button>
		<button class="button is-success is-rounded on:click={sendOrder} {buttonSize}
		class:is-responsive={responsive}">Submit Order</button>
		{:else}
		<button class="button is-info is-rounded {buttonSize}">Add an coffee</button>
		{/if}
	  </footer>
	</div>
  </div>