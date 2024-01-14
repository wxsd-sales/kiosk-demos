<script lang="ts">
	import QRCode from 'qrcode';
	import Modal from '../Modal.svelte';
	export let showTeam: boolean = false;

	const teamInfo = 'https://wxsd-sales.github.io/kiosk-demos/teamInfo';

	let teamInfoQRCode = QRCode.toDataURL(teamInfo, { margin: 1 });
</script>

<Modal title="About the WXSD Team" bind:modalVisiable={showTeam}>
	<span slot="body">
		<p class="title is-5">
			The WXSD is small team of full-stack developers dedicated to showing the Art of the Possible
			with Webex and Cisco products and beyond.
		</p>

		<p class="title is-5">Scan QR code below to learn more of our work</p>
		<!-- <h1>
			
		</h1> -->

		<div class="tile is-ancestor">
			<div class="tile is-parent">
				<div class="tile is-child is-1" />

				<article class="tile is-child is-10 box">
					{#await teamInfoQRCode}
						<figure class="image is-1by1">
							<img src="" alt="QR Code" />
						</figure>
					{:then image}
						<figure class="image">
							<img src={image} alt="QR Code" />
						</figure>
					{:catch error}
						<figure class="image is-1by1">
							<img src="" alt="QR Code" />
						</figure>
					{/await}
				</article>

				<div class="tile is-child is-1" />
			</div>
		</div></span
	>
</Modal>
