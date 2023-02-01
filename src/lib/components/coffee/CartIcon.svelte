<script lang="ts">
	import { onMount } from 'svelte';
	import { cart } from '../../../stores';
	import CartModal from './CartModal.svelte'
	//import soapbox from '../../soapbox';
	

	export let buttonSize: string = 'is-large';
	export let responsive: boolean = true;


	const testRoom = 'coffeeOrders';
	//let connection: soapbox;

	let cartModalVisable = false

	$: orderSize = $cart.length;
	
	function showCart() {
		console.log('Showing cart')
		cartModalVisable = true;
	}

	const testOrder = {
		name: 'William',
		location: 'Office',
		items: $cart
	};


	function sendOrder() {
		console.log('Sending Order: ' + JSON.stringify($cart));
		//connection.sendOrder(testOrder);
	}

	onMount(async () => {
		//connection = new soapbox(testRoom);
	});
</script>

<CartModal bind:cartModalVisable/>

<div class="level-right is-align-content-flex-start">
	<button class="button level-item is-rounded {buttonSize}"
	class:is-responsive={responsive}
	on:click={showCart}>🛒 {orderSize}</button>
</div>