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
	let down = false;
	let prevX = 0;
	let currX = 0;
	let prevY = 0;
	let currY = 0;
	let selectedColor = 'black';
	let brushSize = 3;
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
					position: 'top-center',
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
		console.log('Touch Start');
		const touch = ev.targetTouches.length >= 1 ? ev.targetTouches.item(0) : ev.touches.item(0);
		if (touch != null) {
			findxy('down', touch);
		}
	}

	function processTouchMove(ev: TouchEvent) {
		console.log('Touch Move');
		const touch = ev.targetTouches.length >= 1 ? ev.targetTouches.item(0) : ev.touches.item(0);
		if (touch != null) {
			findxy('move', touch);
		}
	}

	function processTouchEnd(ev: TouchEvent) {
		const touch = ev.targetTouches.length >= 1 ? ev.targetTouches.item(0) : ev.touches.item(0);
		console.log(
			'Touch End',
			touch,
			'Lenght = ',
			ev.targetTouches.length,
			' Touch itme',
			ev.touches.item(0)
		);
		findxy('up');
	}

	function processCancel(ev: TouchEvent | MouseEvent) {
		console.log('Touch or mouse cancel');
		ev.preventDefault();
	}

	function processMouseDown(ev: MouseEvent) {
		console.log('mouse down event');
		findxy('down', ev);
	}

	function processMouseMove(ev: MouseEvent) {
		console.log('Mouse Move');
		findxy('move', ev);
	}

	function processMouseEnd(ev: MouseEvent) {
		console.log('mouse end event');
		findxy('up', ev);
	}

	function findxy(res: string, e?: MouseEvent | Touch) {
		if (res == 'down' && e) {
			if (down) return;
			down = true;
			currX = e.clientX - canvas.offsetLeft;
			currY = e.clientY - canvas.offsetTop;

			drawDot(selectedColor, brushSize, window.innerWidth, window.innerHeight, [currX, currY]);
			// ctx.beginPath();
			// ctx.fillStyle = selectedColor;
			//ctx.roundRect(currX-(brushSize/2), currY-(brushSize/2), brushSize, brushSize);

			// ctx.arc(currX, currY, brushSize / 2, 0, 2 * Math.PI);
			// ctx.fill();
			lines.push([currX.toFixed(3), currY.toFixed(3)]);
			sendMessage('dot', lines);
			prevX = currX;
			prevY = currY;
			// sendMessage('dot', [currX.toFixed(2), currY.toFixed(2)]);
			//lines.push([(currX + 2).toFixed(2), (currY + 2).toFixed(2)]);
		}
		if (res == 'up' || res == 'out') {
			console.log('Mouse Up');
			sendMessage('line', lines);
			lines = [];
			drawDot(selectedColor, brushSize, window.innerWidth, window.innerHeight, [currX, currY]);
			down = false;
		}
		if (res == 'move' && e) {
			if (down) {
				prevX = currX;
				prevY = currY;
				currX = e.clientX - canvas.offsetLeft - brushSize / 2;
				currY = e.clientY - canvas.offsetTop - brushSize / 2;
				lines.push([currX.toFixed(2), currY.toFixed(2)]);
				if (lines.length > 20) {
					sendMessage('line', lines);
					lines = [];
					lines.push([currX.toFixed(2), currY.toFixed(2)]);
				}
		
				drawLine(
					selectedColor,
					brushSize,
					window.innerWidth, window.innerHeight,
					[prevX, prevY, currX, currY]
				)
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

	function drawDot(
		color: string,
		size: number,
		canvasWidth: number,
		canvasHeight: number,
		[x1, y1]: Array<number>
	) {
		console.log('Drawing a dot', x1, y1, size);
		if (canvasWidth != window.innerWidth || canvasHeight != window.innerHeight) {
			x1 = mapBetween(x1, 0, window.innerWidth, 0, canvasWidth);
			y1 = mapBetween(y1, 0, window.innerHeight, 0, canvasHeight);
		}
		ctx.beginPath();
		ctx.fillStyle = color;
		ctx.arc(x1, y1, size / 2, 0, 2 * Math.PI);
		ctx.fill();
	}

	function drawLine( 
		color: string,
		size: number,
		canvasWidth: number,
		canvasHeight: number,
		[x1, y1, x2, y2]: Array<number>
	) {
		if(Math.abs(x1-x2)< 1.2 || Math.abs(y1-y2)< 1.2){
			drawDot(color, size, canvasWidth, canvasHeight, [(x1 + x2) / 2, (y1 + y2) / 2]);
		}

		if (canvasWidth != window.innerWidth || canvasHeight != window.innerHeight) {
			x1 = mapBetween(x1, 0, window.innerWidth, 0, canvasWidth);
			y1 = mapBetween(y1, 0, window.innerHeight, 0, canvasHeight);
			x2 = mapBetween(x2, 0, window.innerWidth, 0, canvasWidth);
			y2 = mapBetween(y2, 0, window.innerHeight, 0, canvasHeight);
		}

		ctx.beginPath();
		ctx.strokeStyle = color;
		ctx.lineWidth = size;
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);

		ctx.stroke();
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
					xapi.Event.Message.Send.on(processMessage);
					resolve(true);
				});
		});
	}

	function sendMessage(type: string, array?: Array<[string, string]>) {
		if (xapi === undefined) return;
		const payload = {
			uuid: uuid,
			type: type,
			color: selectedColor,
			canvasWidth: window.innerWidth,
			canvasHeight: window.innerHeight,
			lineWidth: brushSize,
			data: array
		};
		//console.log('Sending:', JSON.stringify(payload));
		xapi.Command.Message.Send({ Text: JSON.stringify(payload) });
	}

	function processMessage(event: { Text: string }) {
		const message = parseString(event.Text);
		if (!message) return;
		if (message.uuid === uuid) return;
		console.log(JSON.stringify(message));

		switch (message.type) {
			case 'clear':
				clear();
				break;
			case 'dot':
				drawDot(
					message.color,
					message.lineWidth,
					message.canvasWidth,
					message.canvasHeight,
					message.data.pop()
				);
				break;
			case 'line':
				let [x1, y1] = message.data.shift();
				while (message.data.length > 0) {
					let [x2, y2] = message.data.shift();
					drawLine(message.color, message.lineWidth, message.canvasWidth, message.canvasHeight, [
						Number(x1),
						Number(y1),
						Number(x2),
						Number(y2)
					]);
					[x1, y1] = [x2, y2];
				}
				break;
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

<Toaster />
<canvas
	bind:this={canvas}
	on:mousedown={processMouseDown}
	on:mousemove={processMouseMove}
	on:mouseup={processMouseEnd}
	on:touchstart={processTouchStart}
	on:touchmove={processTouchMove}
	on:touchcancel={processCancel}
	on:touchend={processTouchEnd}
/>

{#if interactive}
	<div id="toolkit" class="p-2">
		<div class="buttons are-medium">
			<div class="pr-1">
				<input bind:value={brushSize} type="range" min="1" max="10" />
			</div>

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

</style>