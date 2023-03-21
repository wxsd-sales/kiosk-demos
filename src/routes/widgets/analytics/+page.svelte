<script lang="ts">
	import type { PageData } from './$types';
	import { Demos } from '$assets/demos';

	export let data: PageData;

	const content = [
		[{title: 'Temperature', stat: '22.4° C', icon:"fa-temperature-three-quarters"}, 
    {title: 'Humidity', stat: '50%',  icon:"fa-wind"}],
		[{title: 'People Presence', stat: 'Yes',  icon:"fa-temperature-three-quarters"}, 
    {title: 'People Count', stat: '1',  icon:"fa-people-group"}],
    [{title: 'Space Capacity', stat: '1',  icon:"fa-user-check"}, 
    {title: 'Close Proximity', stat: 'No', icon:"fa-user-group"}]
	];

  //Temp


  //People


</script>

<svelte:head>
  <script src="https://kit.fontawesome.com/33539b0b8b.js" crossorigin="anonymous"></script>
</svelte:head>

<section class="hero is-dark is-fullheight">
	<!-- Hero head: will stick at the top -->
	<div class="hero-head has-text-centered">
		<p class="title is-size-2">Device Analytics</p>
	</div>

	<!-- Hero content: will be in the middle -->
	<div class="hero-body">




    <div class="container">
      {#each content as row}
      <div class="columns is-mobile">
        
        {#each row as item}
        <div class="column">
          <div class="card has-background-dark has-text-grey-light outline">
            <header class="card-header">
              <p class="card-header-title is-size-5 has-text-grey-light">{item.title}</p>
              <span class="icon is-large is-size-5">
                <i class="fas {item.icon}"></i>
              </span>
            </header>
            <div class="card-content has-text-centered">

              <h1 class="title">{item.stat}</h1>
              <!-- <p >{item.stat}</p> -->
            </div>
      
          </div>
        </div>
          {/each} 
        
        </div>
  
      {/each}
    </div>

    
    

	

		<!-- Hero footer: will stick at the bottom -->
		<div class="hero-foot" />
	</div>
</section>

<style>
  .outline {
    border: 1px solid white;
  }

</style>
