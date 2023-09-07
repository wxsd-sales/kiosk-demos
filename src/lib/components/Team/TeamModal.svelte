<script lang="ts">
	import QRCode from 'qrcode';
	import Modal from '../Modal.svelte';
	export let showTeam: boolean = false;

	const teamInfo = 'https://wxsd-sales.github.io/kiosk-demos/teamInfo';


	let teamInfoQRCode = QRCode.toDataURL(teamInfo, { quality: 0.9, margin: 1 });

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
							<img src={image} alt="QR Code" />
						</figure>
					{/await}
				</article>

				<div class="tile is-child is-1" />
			</div>

			<!-- {#await webexLabsQRCode}
			<figure class="image is-1by1">
				<img src="" alt="QR Code" />
			</figure>
		{:then image}
			<figure class="image">
				<img src={image} alt="QR Code" />
			</figure>
		{:catch error}
			<figure class="image is-1by1">
				<img src={image} alt="QR Code" />
			</figure>
		{/await} -->

			<!-- <div class="columns">
			<div class="column">
				{#await webexLabsQRCode}
				<div class="card">
					<div class="card-image">
					  <figure class="image is-1by1">
						<img src='' alt="QR Code">
					  </figure>
					</div>
					<div class="card-content">
					  <div class="media">
						<div class="media-content">
						  <p class="title is-4">Webex Labs</p>
						</div>
					  </div>
					</div>
				  </div>
				{:then image}
					<div class="card">
						<div class="card-image">
							<figure class="image is-1by1">
								<img src={image} alt="QR Code" />
							</figure>
						</div>
						<div class="card-content">
							<div class="media">
								<div class="media-content">
									<p class="title is-4">Webex Labs</p>
								</div>
							</div>
						</div>
					</div>
				{:catch error}
					<figure class="image is-128x128" />
				{/await}
			</div> -->
			<!-- <div class="column">
				{#await githubQRCode}
					<figure class="image is-128x128" />
				{:then image}
					<div class="card">
						<div class="card-image">
							<figure class="image is-1by1">
								<img src={image} alt="QR Code" />
							</figure>
						</div>
						<div class="card-content">
							<div class="media">
								<div class="media-content">
									<p class="title is-4">GitHub Repo</p>
								</div>
							</div>
						</div>
					</div>
				{:catch error}
					<figure class="image is-128x128" />
				{/await}
			</div> -->
			<!-- </div> -->
		</div></span
	>
</Modal>
