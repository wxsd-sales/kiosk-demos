<script lang="ts">
	import { onMount } from 'svelte';
	import { cart } from '../../../stores';
	import type { OrderItem } from '../../../types';
	import toast, { Toaster } from 'svelte-french-toast';

	let step = 1;
	let item = <OrderItem>{};

	export let buttonSize: string = 'is-large';
	export let responsive: boolean = true;

	const coffeeOptions = [
		{ name: 'Espresso', image: 'latte image', milk: false },
		{ name: 'Double Espresso', image: 'latte image', milk: false },
		{ name: 'Americano', image: 'latte image', milk: false },
		{ name: 'Cappuccino', image: 'latte image', milk: true },
		{ name: 'Flat White', image: 'latte image', milk: true },
		{ name: 'Latte', image: 'latte image', milk: true }
	];

	const milkOptions = ['Regular', 'Skimmed', 'Coconut', 'Oat', 'Soya'];

	function addOrder() {
		console.log('Adding order to cart');
		cart.update((current) => [...current, item]);
		item = <OrderItem>{};
		console.log('Showing toast');
		toast.success('Order added to cart');

		step = 4;
	}

	function nextStep() {
		step = step + 1;
	}

	function goToStep(i: number) {
		console.log('Going to step: ' + i);
		step = i;
	}

	function backStep() {
		step = step - 1;
	}

	function selectCoffee(name: string) {
		console.log(name + ' was clicked');
		item.coffee = name;
		console.log(item);
	}

	function selectMilk(name: string) {
		console.log(name + ' was clicked');
		item.milk = name;
		console.log(item);
	}

	// onMount(async () => {
	// 	connection = new soapbox(testRoom);
	// });
</script>

<Toaster />
{#if step == 0}
    <h1 class="title is-1 has-text-centered">Welcome to the Webex </h1>
	<nav class="level is-align-content-end">
		<button
			class="button level-item is-rounded {buttonSize}"
			class:is-responsive={responsive}
			on:click|once={nextStep}>Start Order</button
		>
	</nav>
{:else if step == 1}
    <h1 class="title is-1 has-text-centered">Select a coffee ☕</h1>
	<div class="buttons">
		{#each coffeeOptions as { name, image }, i}
			<button
				class="button is-rounded {buttonSize}"
				class:is-responsive={responsive}
				disabled={name == item.coffee}
				on:click={() => {
					selectCoffee(name);
				}}
			>
				{name}
			</button>
		{/each}
	</div>
	<nav class="level ">
		<div class="level-left">
			<button class="button level-item is-rounded {buttonSize}"
            class:is-responsive={responsive} 
            on:click|once={backStep}>Cancel</button
			>
		</div>
		<div class="level-right is-align-content-end">
			<button
				class="button level-item is-rounded {buttonSize}"
                class:is-responsive={responsive} 
				disabled={item.coffee == undefined}
				on:click|once={nextStep}>Select Milk</button
			>
		</div>
	</nav>
{:else if step == 2}
    <h1 class="title is-1 has-text-centered">Select peferred milk 🥛</h1>
	<div class="buttons">
		{#each milkOptions as milk, i}
			<button
				class="button is-rounded {buttonSize}"
                class:is-responsive={responsive} 
				disabled={milk == item.milk}
				on:click={() => {
					selectMilk(milk);
				}}
			>
				{milk}
			</button>
		{/each}
	</div>
	<nav class="level is-align-content-end">
		<div class="level-left">
			<button class="button level-item is-rounded {buttonSize}" 
            class:is-responsive={responsive} 
            on:click|once={backStep}>Back</button>
		</div>
		<div class="level-right">
			<button
				class="button level-item is-rounded {buttonSize}"
                class:is-responsive={responsive} 
				disabled={item.milk == undefined}
				on:click|once={nextStep}>Review Order</button
			>
		</div>
	</nav>
{:else if step == 3}
    <h1 class="title is-1 has-text-centered">Reivew Selection</h1>
        <h1 class="subtitle is-1 has-text-centered">Coffee: {item.coffee} | Milk: {item.milk}</h1>
	<nav class="level is-align-content-end">
		<div class="level-left">
			<button class="button level-item is-rounded {buttonSize}"
            class:is-responsive={responsive} 
             on:click|once={backStep}>Back</button>
		</div>
		<div class="level-right">
			<button class="button level-item is-rounded {buttonSize}"
            class:is-responsive={responsive} 
            on:click|once={addOrder}>Add to cart</button>
		</div>
	</nav>
{:else if step == 4}
    <h1 class="title is-1 has-text-centered">Selection added to cart</h1>
	<nav class="level is-align-content-end ">
		<div class="level-left">
			<button class="button level-item is-rounded {buttonSize}" 
            class:is-responsive={responsive} 
            on:click|once={() => goToStep(1)}
				>Add More</button
			>
		</div>
		<div class="level-right">
			<button class="button level-item is-rounded {buttonSize}"
            class:is-responsive={responsive} 
            on:click|once={addOrder}>Review Cart</button>
		</div>
	</nav>
{/if}
