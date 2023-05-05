<script lang="ts">
	import { deploymentName } from '../../../stores';
	let date = new Date();
	$: year = date.getFullYear();
</script>

<footer class="footer has-background-dark">
	<div class="content has-text-centered has-text-white">
		<p>Disclaimer</p>
		<p>
			Everything shown is for demo and Proof of Concept purposes only. Use of the site is solely at
			your own risk. This site may contain links to third party content, which we do not warrant,
			endorse, or assume liability for. These demos are for Cisco Webex usecases, but are not
			Official Cisco Webex Branded demos.
		</p>
		<p>
			<strong class="has-text-white">{$deploymentName}</strong> by
			<a class="has-text-grey-light" href="https://github.com/wxsd-sales">WXSD-Sales</a><br />
			@ {year} Webex by Cisco <br />
		</p>
		<i class="micon icon-cisco-logo " />
	</div>
</footer>
