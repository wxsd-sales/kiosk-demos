<script lang="ts">
	import { readable } from 'svelte/store';

	import HomeScreen from './screens/HomeScreen.svelte';
	import ControlPanel from './screens/ControlPanel.svelte';
	import Settings from './screens/Settings.svelte';
	
	const controllerScreens = {
	  homeScreen: { component: HomeScreen, props: {} },
	  controlPanel: { component: ControlPanel, props: {} },
	  settings: { component: Settings, props: {} }
	};

	let activeComponent = controllerScreens.homeScreen;

	
	function showHomeScreen(e: CustomEvent) {
	  if (import.meta.env.DEV) console.info(e);
	  activeComponent = controllerScreens.homeScreen;
	}

	function showControPanel(e: CustomEvent) {
	  if (import.meta.env.DEV) console.info(e);
	  activeComponent = controllerScreens.controlPanel;
	}
  
	function showSettings(e: CustomEvent) {
	  if (import.meta.env.DEV) console.info(e);
	  activeComponent = controllerScreens.settings;
	}
  </script>
  
  <svelte:component
	this={activeComponent.component}
	{...activeComponent.props}
	on:showHomeScreen={showHomeScreen}
	on:showControPanel={showControPanel}
	on:showSettings={showSettings}
  />