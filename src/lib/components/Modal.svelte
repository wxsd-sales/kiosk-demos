<script lang="ts">
	export let title: string = 'Title';
	export let modalVisiable: boolean = false;

	function closeModal() {
		modalVisiable = false;
	}
</script>

<div class="modal" class:is-active={modalVisiable}>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div class="modal-background" on:click={closeModal} />
	<div class="modal-card">
		<header class="modal-card-head">
			<p class="modal-card-title">{title}</p>
			<button class="delete" aria-label="close" on:click={closeModal} />
		</header>
		<section class="modal-card-body">
			<slot name="body" />
		</section>

		{#if $$slots.footer}
			<footer class="modal-card-foot">
				<slot name="footer">asbas</slot>
			</footer>
		{/if}
	</div>
</div>
