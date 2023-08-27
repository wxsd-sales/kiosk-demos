<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';
	import { fade } from 'svelte/transition';
	import WebexLogo from '$assets/webex-logo.svg';
	import { Buffer } from 'buffer';
	import { connect as jxapi } from 'jsxapi';

	let currentState: string = 'Standby';
	let nextState = '';
	let dialling = false;

	let waitSeconds: number = 10;
	let timer: number;
	let interval: NodeJS.Timer | null = null;

	let myGamePiece;
	let myObstacles = [];
	let myScore;

	let canvas: HTMLCanvasElement;

	let myGameArea = {
		canvas: document.createElement('canvas'),
		start: function () {
			this.canvas.width = 480;
			this.canvas.height = 270;
			this.context = this.canvas.getContext('2d');
			document.body.insertBefore(this.canvas, document.body.childNodes[0]);
			this.frameNo = 0;
		},
		clear: function () {
			this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		}
	};

	onMount(() => {
		window.Buffer = Buffer;
		console.log('onMount ran');


		const hash = window.location.hash.split('#').pop();
		
		if(hash == undefined) return;

		const decoded = window.atob(hash);
  		const credentials = JSON.parse(decoded)

		if('device' !in credentials) return;
		if('username' !in credentials) return;
		if('username' !in credentials) return;

		console.log('Credentials:', JSON.stringify(credentials));
		jxapi({ host: device, protocol: 'wss:', username: username, password: password })
			.on('error', console.error)
			.on('ready', async (xapi) => {
				console.log(`Connected to device [${device}]`);
				xapi.Event.Message.Send.on((text: string) => {
					console.log('Message Send Event:', text);
				});
			});

		startGame();
	});

	function handleHash() {
		console.log('Hash Updated: ' + location.hash);
		if (!location.hash.startsWith('#state=')) return;
		const hash = location.hash.replace('#state=', '');
		console.log('Hash State: ', hash);
		changeState(hash);
	}

	function startGame() {
		myGamePiece = new component(30, 30, 'red', 10, 120);
		myGamePiece.gravity = 0.05;
		myScore = new component('30px', 'Consolas', 'black', 280, 40, 'text');
		myGameArea.start();
	}

	function component(width: number, height: number, color: string, x: number, y: number, type: string | undefined) {
		this.type = type;
		this.score = 0;
		this.width = width;
		this.height = height;
		this.speedX = 0;
		this.speedY = 0;
		this.x = x;
		this.y = y;
		this.gravity = 0;
		this.gravitySpeed = 0;
		this.update = function () {
			ctx = myGameArea.context;
			if (this.type == 'text') {
				ctx.font = this.width + ' ' + this.height;
				ctx.fillStyle = color;
				ctx.fillText(this.text, this.x, this.y);
			} else {
				ctx.fillStyle = color;
				ctx.fillRect(this.x, this.y, this.width, this.height);
			}
		};
		this.newPos = function () {
			this.gravitySpeed += this.gravity;
			this.x += this.speedX;
			this.y += this.speedY + this.gravitySpeed;
			this.hitBottom();
		};
		this.hitBottom = function () {
			var rockbottom = myGameArea.canvas.height - this.height;
			if (this.y > rockbottom) {
				this.y = rockbottom;
				this.gravitySpeed = 0;
			}
		};
		this.crashWith = function (otherobj) {
			var myleft = this.x;
			var myright = this.x + this.width;
			var mytop = this.y;
			var mybottom = this.y + this.height;
			var otherleft = otherobj.x;
			var otherright = otherobj.x + otherobj.width;
			var othertop = otherobj.y;
			var otherbottom = otherobj.y + otherobj.height;
			var crash = true;
			if (
				mybottom < othertop ||
				mytop > otherbottom ||
				myright < otherleft ||
				myleft > otherright
			) {
				crash = false;
			}
			return crash;
		};
	}

	function updateGameArea() {
		var x, height, gap, minHeight, maxHeight, minGap, maxGap;
		for (i = 0; i < myObstacles.length; i += 1) {
			if (myGamePiece.crashWith(myObstacles[i])) {
				return;
			}
		}
		myGameArea.clear();
		myGameArea.frameNo += 1;
		if (myGameArea.frameNo == 1 || everyinterval(150)) {
			x = myGameArea.canvas.width;
			minHeight = 20;
			maxHeight = 200;
			height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
			minGap = 50;
			maxGap = 200;
			gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
			myObstacles.push(new component(10, height, 'green', x, 0));
			myObstacles.push(new component(10, x - height - gap, 'green', x, height + gap));
		}
		for (i = 0; i < myObstacles.length; i += 1) {
			myObstacles[i].x += -1;
			myObstacles[i].update();
		}
		myScore.text = 'SCORE: ' + myGameArea.frameNo;
		myScore.update();
		myGamePiece.newPos();
		myGamePiece.update();
	}

	function everyinterval(n) {
		if ((myGameArea.frameNo / n) % 1 == 0) {
			return true;
		}
		return false;
	}

	function accelerate(n) {
		myGamePiece.gravity = n;
	}
</script>


<svelte:window on:hashchange={handleHash} />

<canvas bind:this={canvas} id="myCanvas" width="500" height="500"></canvas>
<button on:mousedown={()=>accelerate(-0.2)} on:mouseup={()=>accelerate(0.05)}>ACCELERATE</button>
<p>Use the ACCELERATE button to stay in the air</p>
<p>How long can you stay alive?</p>