<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { Buffer } from 'buffer';
	import toast, { Toaster } from 'svelte-french-toast';
	import { XAPI, connect as jsxapi } from 'jsxapi/lib/browser';
	import type { WebSocketCredentials } from '../../types';

	let credentials: WebSocketCredentials;
	let xapi: XAPI;

	const colors = ['green', 'blue', 'red', 'yellow', 'orange', 'black', 'white'];
	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let flag = false;
	let prevX = 0;
	let currX = 0;
	let prevY = 0;
	let currY = 0;
	let dot_flag = false;

	let selectedColor = 'black';
	let y = 2;

	let interactive: boolean = true;
	let uuid = self.crypto.randomUUID();

	let lines: Array<[string, string]> = [];

	onMount(() => {
		console.log('onMount ran');

		credentials = getCredentials();
		console.log('Credentials:', JSON.stringify(credentials));

		if (credentials) {
			toast.promise(
				connectToDevice(credentials),
				{
					loading: `Connecting to [${credentials.ipAddress}]`,
					success: `Connected to [${credentials.ipAddress}]`,
					error: `Failed to connect [${credentials.ipAddress}]`
				},
				{
					position: 'bottom-center',
					duration: 4000
				}
			);
		}

		const res = canvas.getContext('2d');
		if (!res || !(res instanceof CanvasRenderingContext2D)) {
			throw new Error('Failed to get 2D context');
		}
		ctx = res;
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		const userAgent = window.navigator.userAgent;
		console.log(userAgent);

		if (userAgent.includes('RoomOS')) {
			if (
				!userAgent.includes('Desk') &&
				!userAgent.includes('Board') &&
				!userAgent.includes('Navigator')
			) {
				interactive = false;
			}
		}
	});

	function processTouchStart(ev: TouchEvent) {
		const touch = ev.targetTouches.length >= 1 ? ev.targetTouches.item(0) : ev.touches.item(0);
		if (touch != null) {
			findxy('down', touch);
		}
	}

	function processTouchMove(ev: TouchEvent) {
		console.log('Touch Move Event', JSON.stringify(ev));
		const touch = ev.targetTouches.length >= 1 ? ev.targetTouches.item(0) : ev.touches.item(0);
		if (touch != null) {
			findxy('move', touch);
		}
	}

	function processTouchEnd(ev: TouchEvent) {
		const touch = ev.targetTouches.length >= 1 ? ev.targetTouches.item(0) : ev.touches.item(0);
		if (touch != null) {
			findxy('up', touch);
		}
	}

	function processCancel(ev: TouchEvent | MouseEvent) {
		ev.preventDefault();
	}

	function processMouseDown(ev: MouseEvent) {
		findxy('down', ev);
	}

	function processMouseMove(ev: MouseEvent) {
		findxy('move', ev);
	}

	function findxy(res: string, e: MouseEvent | Touch) {
		if (res == 'down') {
			prevX = currX;
			prevY = currY;
			currX = e.clientX - canvas.offsetLeft;
			currY = e.clientY - canvas.offsetTop;

			flag = true;
			dot_flag = true;
			if (dot_flag) {
				ctx.beginPath();
				ctx.fillStyle = selectedColor;
				ctx.fillRect(currX, currY, 2, 2);
				ctx.closePath;
				lines.push([currX.toFixed(2), currY.toFixed(2)]);
				lines.push([(currX + 2).toFixed(2), (currY + 2).toFixed(2)]);
				dot_flag = false;
			}
		}
		if (res == 'up' || res == 'out') {
			sendMessage('line', lines);
			lines = [];
			flag = false;
		}
		if (res == 'move') {
			if (flag) {
				prevX = currX;
				prevY = currY;
				currX = e.clientX - canvas.offsetLeft;
				currY = e.clientY - canvas.offsetTop;
				lines.push([currX.toFixed(2), currY.toFixed(2)]);
				if (lines.length > 20) {
					sendMessage('line', lines);
					lines = [];
					lines.push([currX.toFixed(2), currY.toFixed(2)]);
				}
				draw();
			}
		}
	}

	function mapBetween(
		currentNum: number,
		minAllowed: number,
		maxAllowed: number,
		min: number,
		max: number
	) {
		return ((maxAllowed - minAllowed) * (currentNum - min)) / (max - min) + minAllowed;
	}

	function draw() {
		ctx.beginPath();
		ctx.moveTo(prevX, prevY);
		ctx.lineTo(currX, currY);
		ctx.strokeStyle = selectedColor;
		ctx.lineWidth = y;
		ctx.stroke();
		ctx.closePath();
	}

	function drawLine(
		color: string,
		lineWidth: number,
		canvasWidth: number,
		canvasHeight: number,
		[x1, y1, x2, y2]: Array<number>
	) {
		const convertx1 = mapBetween(x1, 0, window.innerWidth, 0, canvasWidth);
		const converty1 = mapBetween(y1, 0, window.innerHeight, 0, canvasHeight);
		const convertx2 = mapBetween(x2, 0, window.innerWidth, 0, canvasWidth);
		const converty2 = mapBetween(y2, 0, window.innerHeight, 0, canvasHeight);

		ctx.beginPath();
		ctx.moveTo(convertx1, converty1);
		ctx.lineTo(convertx2, converty2);
		ctx.strokeStyle = color;
		ctx.lineWidth = lineWidth;
		ctx.stroke();
		ctx.closePath();
	}

	function parseString(str: string) {
		let result;
		try {
			result = JSON.parse(str);
		} catch (e) {
			result = false;
		}
		return result;
	}

	function getCredentials() {
		const hash = window.location.hash.split('#').pop();
		if (hash === undefined) {
			toast.error('Missing Hash Value');
			return;
		}

		const decoded = window.atob(hash);
		return parseString(decoded);
	}

	function connectToDevice(credentials: WebSocketCredentials) {
		window.Buffer = Buffer;
		return new Promise((resolve, reject) => {
			jsxapi({
				host: credentials.ipAddress,
				protocol: 'wss:',
				username: credentials.username,
				password: credentials.password
			})
				.on('error', (error) => {
					console.error;
					reject();
				})
				.on('ready', async (connection: XAPI) => {
					xapi = connection;

					precessMessage;

					resolve(true);
				});
		});
	}

	function sendMessage(type: string, array?: Array<[string, string]>) {
		const payload = {
			uuid: uuid,
			type: type,
			color: selectedColor,
			canvasWidth: window.innerWidth,
			canvasHeight: window.innerHeight,
			lineWidth: y,
			data: array
		};
		console.log('Sending:', JSON.stringify(payload));
		xapi.Command.Message.Send({ Text: JSON.stringify(payload) });
	}

	function precessMessage(event: { Text: string }) {
		const message = parseString(event.Text);
		if (!message) return;
		if (message.uuid === uuid) return;

		if (message.type === 'clear') {
			clear();
			return;
		}

		const data = message.data;
		console.log('Coordinates: ', JSON.stringify(data));

		if (message.data.length < 2) return;

		let [x1, y1] = message.data.shift();
		console.log('First xy', x1, y1);

		while (message.data.length > 0) {
			let [x2, y2] = message.data.shift();
			drawLine(message.color, message.lineWidth, message.canvasWidth, message.canvasHeight, [
				x1,
				y1,
				x2,
				y2
			]);

			[x1, y1] = [x2, y2];
		}
	}

	function erase() {
		let response = confirm('Want to clear?');
		if (response) {
			sendMessage('clear');
			clear();
		}
	}

	function clear() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	}

	function selectColor(color: string) {
		selectedColor = color;
	}
</script>

<svelte:head>
	<meta
		name="viewport"
		content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
	/>
</svelte:head>

<Toaster />
<canvas
	bind:this={canvas}
	on:mousedown={processMouseDown}
	on:mousemove={processMouseMove}
	on:mouseup={processCancel}
	on:touchstart={processTouchStart}
	on:touchmove={processTouchMove}
	on:touchcancel={processCancel}
	on:touchend={processTouchEnd}
/>

{#if interactive}
	<div id="toolkit" class="p-2">
		<div class="buttons are-large">
			{#each colors as color}
				<button
					class="button is-rounded"
					style="background: {color}"
					on:click={() => selectColor(color)}
				/>
			{/each}
			<button class="button is-rounded is-danger is-light" on:click={erase}>Clear</button>
		</div>
	</div>
{/if}

<div id="teamMessage">Made with ❤️ by the WXSD team (wxsd@external.cisco.com)</div>

<style>
	:global(html, body) {
		height: 100%;
		width: 100%;
		margin: 0;
		overflow-y: hidden;
		overflow-x: hidden;
	}

	canvas {
		position: absolute;
		-webkit-user-select: none;
		-khtml-user-select: none;
		-moz-user-select: none;
		-o-user-select: none;
		user-select: none;
	}

	#toolkit {
		position: absolute;
		bottom: 8px;
		right: 16px;
		height: auto;
		width: auto;
		border: 1px solid #808080;
		background: #a9a9a9;
		border-radius: 40px;
		text-align: center;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	#teamMessage {
		position: absolute;
		bottom: 8px;
		left: 16px;
		height: auto;
		width: auto;
		text-align: center;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	/* .button {
		background-color: #94b8b8;
		border: 2px solid #808080;
		border-radius: 50%;
		color: black;
		text-align: center;
		display: inline-block;
		margin: 5px 5px;
		width: 55px;
		height: 55px;
	} */

	.colorSelect {
		display: inline-block;
		border: 2px solid #808080;
		margin: 5px 5px;
		border-radius: 50%;
		width: 50px;
		height: 50px;
	}
</style>
