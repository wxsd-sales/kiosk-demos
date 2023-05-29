import queryString from 'query-string';
import {
	PUBLIC_WORKSPACE_CLIENT_ID,
	PUBLIC_WORKSPACE_SCOPES,
	PUBLIC_WEBEX_OAUTH
} from '$env/static/public';

export default class webexoauth {
	static webexOAuthRedirect() {
		const currentUrl = window.location.href.split('#')[0];
		let parameters = new URLSearchParams();
		parameters.append('response_type', 'token');
		parameters.append('redirect_uri', currentUrl);
		parameters.append('client_id', PUBLIC_WORKSPACE_CLIENT_ID);
		parameters.append('scope', PUBLIC_WORKSPACE_SCOPES);
		console.log('Redirecting to: ', `${PUBLIC_WEBEX_OAUTH}?${parameters.toString()}`);
		window.location.href = `${PUBLIC_WEBEX_OAUTH}?${parameters.toString()}`;
	}

	static getWebexAccessToken() {
		const { hash } = window.location;
		if (!hash) return;
		const parsedHash = queryString.parse(hash);
		if (Array.isArray(parsedHash['access_token'])) return;
		if (parsedHash['access_token'] == null) return;
		const accessToken = parsedHash['access_token'];

		// Clear any items from the hash that were provided by implicit grant flow
		[
			'access_token',
			'token_type',
			'expires_in',
			'refresh_token',
			'refresh_token_expires_in'
		].forEach((key) => Reflect.deleteProperty(parsedHash, key));
		//window.location.hash = queryString.stringify(parsedHash);
		return accessToken;
	}
}
