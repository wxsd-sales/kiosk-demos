import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/kit/vite';

const dev = process.env.npm_lifecycle_event === "dev";

console.log('ENV: ' + JSON.stringify(process.env))

let base =  process.env.npm_package_name;

if(process.env.REPO_NAME) {
	console.log('Repo Name Present: ' + process.env.REPO_NAME)
	base = process.env.REPO_NAME
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter(),
		paths: {
			base: dev ? "" : `/${base}`,
		},
	}
};

export default config;
