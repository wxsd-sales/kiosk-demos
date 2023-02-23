<script lang="ts">
	import { onMount } from 'svelte';
	import { cart } from '../../../stores';
	import type { OrderItem } from '../../../types';
	import toast, { Toaster } from 'svelte-french-toast';
	import { fade, fly} from 'svelte/transition';
	import { Coffees, Milks } from '../../assets/coffees/';

	let step = 1;
	let item = <OrderItem>{};

	export let buttonSize: string = 'is-large';
	export let responsive: boolean = true;
	export let textSize: string = '';


	$: coffeeIcon = () => {
		if (item.coffee == undefined) return null
		const icon = Coffees.find(coffee => item.coffee == coffee.name)
		if (icon == undefined) return null
		return icon.image 
	}

	const chunk = <T>(arr: T[], size: number): T[][] =>
		[...Array(Math.ceil(arr.length / size))].map((_, i) => arr.slice(size * i, size + size * i));

	const coffeeRows = chunk(Coffees, 3);

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

</script>

<Toaster />
{#if step == 0}
	<h1 class="title is-2 has-text-centered">Welcome to the Webex</h1>
	<nav class="level is-align-content-end">
		<button
			class="button level-item is-rounded {buttonSize}"
			class:is-responsive={responsive}
			on:click|once={nextStep}>Start Order</button
		>
	</nav>
{:else if step == 1}
	<h1 transition:fade class="title is-1 has-text-centered">Select Coffee</h1>

	{#each coffeeRows as row}
		<div transition:fade class="tile is-ancestor is-size-1">
			{#each row as { name, image }, i}
				<div class="tile is-parent is-justify-content-center is-align-items-center">
					<button
						class="tile button is-rounded {buttonSize}"
						class:is-responsive={responsive}
						disabled={name == item.coffee}
						on:click={() => {
							selectCoffee(name);
						}}
					>
						<span class="icon ">
							<img src={image} alt="{name} icon" />
						</span>

						<!-- <h3 class="subtitle is-3">{name}</h3> -->
						<p class="">{name}</p> 
					</button>
				</div>
			{/each}
		</div>
	{/each}

	<nav transition:fade class="level ">
		<div class="level-left">
			<button
				class="button level-item is-rounded {buttonSize}"
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
	<h1  transition:fade class="title is-1 has-text-centered">Select peferred milk 🥛</h1>
	<div transition:fade class="buttons">
		{#each Milks as milk, i}
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
	<nav transition:fade class="level is-align-content-end">
		<div class="level-left">
			<button
				class="button level-item is-rounded {buttonSize}"
				class:is-responsive={responsive}
				on:click|once={backStep}>Back</button
			>
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
	<h1 in:fly="{{ x: 200, duration: 2000 }}" out:fly="{{ x: -200, duration: 2000 }}"class="title is-1 has-text-centered">Reivew Selection</h1>
	<!-- <h1 class="subtitle is-1 has-text-centered">Coffee: {item.coffee} | Milk: {item.milk}</h1> -->
	
	<button class="button is-rounded {buttonSize}" 
		class:is-responsive={responsive}>
		<span class="icon ">
			<img src={coffeeIcon()} alt="{name} icon" />
		</span>
		<p>{item.coffee}</p>
	</button>
	<button class="button is-rounded {buttonSize}" 
		class:is-responsive={responsive}>
		<p>{item.milk}</p>
	</button>

	<nav class="level is-align-content-end">
		<div class="level-left">
			<button
				class="button level-item is-rounded {buttonSize}"
				class:is-responsive={responsive}
				on:click|once={backStep}>Back</button
			>
		</div>
		<div class="level-right">
			<button
				class="button level-item is-rounded {buttonSize}"
				class:is-responsive={responsive}
				on:click|once={addOrder}>Add to cart</button
			>
		</div>
	</nav>
{:else if step == 4}
	<h1 class="title is-1 has-text-centered">Selection added to cart</h1>
	<nav class="level is-align-content-end ">
		<div class="level-left">
			<button
				class="button level-item is-rounded {buttonSize}"
				class:is-responsive={responsive}
				on:click|once={() => goToStep(1)}>Add More</button
			>
		</div>
		<div class="level-right">
			<button
				class="button level-item is-rounded {buttonSize}"
				class:is-responsive={responsive}
				on:click|once={addOrder}>Review Cart</button
			>
		</div>
	</nav>
{:else if step == 5}
	<h1 class="title is-1 has-text-centered">Select Coffee</h1>

	{#each coffeeRows as row}
		<div class="tile is-ancestor">
			{#each row as { name, image }, i}
				<div class="tile is-parent is-justify-content-center is-align-items-center">
					<button
						class="button is-rounded {buttonSize}"
						class:is-responsive={responsive}
						disabled={name == item.coffee}
						on:click={() => {
							selectCoffee(name);
						}}
					>
						<span class="icon">
							<img src={image} alt="Webex Logo" />
						</span>
						<p>{name}</p>
					</button>
				</div>
			{/each}
		</div>
	{/each}

	<nav class="level ">
		<div class="level-left">
			<button
				class="button level-item is-rounded {buttonSize}"
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
{/if}
