<script lang="ts">
</script>

<!-- <div class="x">
	<div class="y" style="font-size: 3em">🎃</div>
</div> -->

<div class="stage">
    <div class="move-1">
        <div class="pumpkin bounce-7">🎃</div>
    </div>
</div>

<style>
	/* .x {
		z-index: 3;
		-webkit-animation: x 13s linear infinite alternate;
		animation: x 13s linear infinite alternate;
	}

	.y {
		z-index: 3;
		-webkit-animation: y 7s linear infinite alternate;
		animation: y 7s linear infinite alternate;
	}

	@-webkit-keyframes x {
		100% {
			transform: translateX(calc(100vw - 100px));
		}
	}

	@keyframes x {
		100% {
			transform: translateX(calc(100vw - 100px));
		}
	}
	@-webkit-keyframes y {
		100% {
			transform: translateY(calc(100vh - 100px));
		}
	}
	@keyframes y {
		100% {
			transform: translateY(calc(100vh - 100px));
		}
	} */

    .stage {
        z-index: 3;
        text-align: center;
        position: absolute;
        bottom: 8px;
        height: 330px;

    }
    .pumpkin {
        animation-duration: 2s;
        animation-iteration-count: infinite;
        font-size: 5em;
        margin: 0 auto 0 auto;
        transform-origin: bottom;
    }

    .move-1 {
        animation-duration: 12s;
        animation-iteration-count: infinite;
    }
    .bounce-7 {
        animation-name: bounce-7;
        animation-timing-function: cubic-bezier(0.280, 0.840, 0.420, 1);
    }
    @keyframes bounce-7 {
        0%   { transform: scale(1,1)      translateY(0); }
        10%  { transform: scale(1.1,.9)   translateY(0); }
        30%  { transform: scale(.9,1.1)   translateY(-100px); }
        50%  { transform: scale(1.05,.95) translateY(0); }
        57%  { transform: scale(1,1)      translateY(-7px); }
        64%  { transform: scale(1,1)      translateY(0); }
        100% { transform: scale(1,1)      translateY(0); }
    }

    .move-1 {
        animation-name: move-1;

    }
    @keyframes move-1 {
        0%   { transform: translateX(0); }
        50% { transform: translateX(10em); }
        100% { transform: translateX(0); }
    }

</style>
