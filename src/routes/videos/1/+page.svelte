<script lang="ts">
    import type { PageData } from './$types';
    import Video from '$assets/videos/Webex-by-Cisco-video.mp4'
    
    export let data: PageData;
</script>


<!-- svelte-ignore a11y-media-has-caption -->
<video width="320" height="240" controls autoplay>
<source src={Video} type="video/mp4">
<source src={Video}  type="video/ogg">
Your browser does not support the video tag.
</video>