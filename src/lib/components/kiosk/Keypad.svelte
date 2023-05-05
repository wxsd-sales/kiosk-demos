<script lang='ts'>
	import { createEventDispatcher } from 'svelte';

	export let value = '';
    export let loading = false;

	const dispatch = createEventDispatcher();

	const select = (num: number) => () => value += num;
	const clear  = () => value = '';
	const submit = () => {
        dispatch('submit')
        loading = true;
        setTimeout(()=>{
            dispatch('timeout');
            loading = false;
        },4000)
    };
</script>


<div class="tile is-ancestor">
    <div class="tile is-parent">
        <button class="tile is-child button is-large" on:click={select(1)}>1</button>
    </div>
    <div class="tile is-parent">
        <button class="tile is-child button is-large" on:click={select(2)}>2</button>
    </div>
    <div class="tile is-parent">
        <button class="tile is-child button is-large" on:click={select(3)}>3</button>
    </div>
</div>
<div class="tile is-ancestor">
    <div class="tile is-parent">
        <button class="tile is-child button is-large" on:click={select(4)}>4</button>
    </div>
    <div class="tile is-parent">
        <button class="tile is-child button is-large" on:click={select(5)}>5</button>
    </div>
    <div class="tile is-parent">
        <button class="tile is-child button is-large" on:click={select(6)}>6</button>
    </div>
</div>
<div class="tile is-ancestor">
    <div class="tile is-parent">
   
        <button class="tile is-child button is-large" on:click={select(7)}>7</button>

    </div>
    <div class="tile is-parent">
        <button class="tile is-child button is-large" on:click={select(8)}>8</button>
    </div>
    <div class="tile is-parent">
        <button class="tile is-child button is-large" on:click={select(9)}>9</button>
    </div>
</div>
<div class="tile is-ancestor">
    <div class="tile is-parent">
        <button class="tile is-child button is-large is-warning"  on:click={clear}>Clear</button>
    </div>
    <div class="tile is-parent">
        <button class="tile is-child button is-large" on:click={select(0)}>0</button>
    </div>
    <div class="tile is-parent">
        <button class="tile is-child button is-large 
        is-success {loading ? 'is-loading' : '' }" 
         on:click={submit}
         disabled={value ===''}>Submit</button>
    </div>
</div>
  


<!-- 
	<button disabled={!value} on:click={clear}>clear</button>
	<button class="button is-large"  on:click={select(0)}>0</button>
	<button disabled={!value} on:click={submit}>submit</button> -->