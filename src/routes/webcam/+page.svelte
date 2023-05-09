<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	const createMessageAPI = 'https://webexapis.com/v1/messages';

	let token: string | null;
	let email: string | null;
	let text: string | null;
    let error = false;
    let sent = false;

	let canvas: HTMLCanvasElement;
	let context: CanvasRenderingContext2D | null;
	let player: HTMLVideoElement;

	function getImage() {
		if (context == null) return;
		context.drawImage(player, 0, 0, canvas.width, canvas.height);
		canvas.toBlob(sendImage);
	}

	function sendImage(imgData: Blob | null) {
		if (imgData == null) return;
		if (token == null || email == null) return;

		if (text == null) {
			text = 'Attached is your webcam screenshot';
		}

		let formdata = new FormData();
		formdata.append('toPersonEmail', email);
		formdata.append('text', text);
		formdata.append('files', imgData, 'webcam.png');

		console.log(`Email: ${email} - Text: ${text} `);
		const header = new Headers({
			Authorization: 'Bearer ' + token
		});

		fetch(createMessageAPI, {
			headers: header,
			method: 'post',
			body: formdata
		})
			.then((result) => {
                console.log('Image sent')
                sent = true;
                setTimeout(close, 2000);
            })
			.catch((error) => console.log('Image failed to send'));
	}

	onMount(() => {
		token = $page.url.searchParams.get('token');
		email = $page.url.searchParams.get('email');
        text = $page.url.searchParams.get('text');
		context = canvas.getContext('2d');

        if(token == null || email == null){
            error = true;
            return
        }

		const constraints = {
			video: true
		};

		// Attach the video stream to the video element and autoplay.
		navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
			player.srcObject = stream;
			setTimeout(getImage, 2000);
		});
	});
</script>

<section class="hero is-dark is-fullheight">
	<div class="hero-head" />
	<div class="hero-body">
		<div class="container has-text-centered">
            {#if error}
            <p class="title">Missing URL Parameters</p>
            <p class="subtitle">Please ensure a Bot Token and taget email is provided<br>Text parameter is optional</p>
            <p class="subtitle">E.g. http://example.com/?token=123&email=user@example&text=Here is your webcam capture</p>
            {:else}
            <p class="title">Camera Capture</p>
                {#if sent}
                <p class="title">Image has been sent 😀</p>
                {:else}
                <p class="title">This web page will catpure your webcam</p> 
                {/if}
            {/if}
		</div>
	</div>
	<div class="hero-foot">
		<!-- svelte-ignore a11y-media-has-caption -->
		<video hidden bind:this={player} controls autoplay />
		<button hidden id="capture">Capture</button>
		<canvas hidden bind:this={canvas} width="1920" height="1080" />
	</div>
</section>
