import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/kit/vite';

let urlBase =  '';

// Check we are deploying to GitHub Pages
if(process.env.GITHUB_PAGES == "true") {
	// Use repo name as base if given, otherwise use package name
	if(process.env.REPO_NAME) {
		console.log('Using provide repo name as base: ' + process.env.REPO_NAME)
		urlBase = `/${process.env.REPO_NAME}`;
	} else {
		console.log('Using package name as base: ' + process.env.npm_package_name)
		urlBase = `/${process.env.npm_package_name}`; 
	}
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter(),
		paths: {
			base: urlBase,
		},
	}
};

export default config;