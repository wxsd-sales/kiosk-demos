export default class workspaceReport {
	token: string;
	workspaces: Array<{}> = [];
	capacities: Array<{}> = [];

	constructor(token: string) {
		if (!token) {
			throw new Error('Access Token Required');
		}
		this.token = token;
	}

	async getWorkspaces(progress: CallableFunction) {
		let headers = new Headers();
		headers.append('Authorization', 'Bearer ' + this.token);

		let options = {
			method: 'GET',
			headers: headers
		};

		return await this.paginatedFetch(
			progress,
			'https://webexapis.com/v1/workspaces',
			options
		).catch((error) => console.log(error));
	}

	getAllCapabilities(process: CallableFunction) {
		console.log('Getting All Capabilities');
		console.log(this.workspaces);

		this.workspaces.forEach((ws) => {
			if ('id' in ws && typeof ws.id == 'string') {
				this._getCapabilities(process, ws.id);
			}
		});
	}

	getMetric(
		workspaceId: string,
		metricName: 'soundLevel' | 'ambientNoise' | 'temperature' | 'humidity',
		aggregation: 'hourly' | 'daily' = 'hourly',
		from: string,
		to: string,
		unit: 'celsius' | 'fahrenheit'
	) {
		let headers = new Headers();
		headers.append('Authorization', 'Bearer ' + this.token);

		let options = {
			method: 'GET',
			headers: headers
		};

		const paramaters = new URLSearchParams();

		paramaters.append('workspaceId', workspaceId);
		paramaters.append('metricName', metricName);
		paramaters.append('aggregation', aggregation);
		paramaters.append('from', from);
		paramaters.append('to', to);
		paramaters.append('unit', unit);

		return fetch(`https://webexapis.com/v1/workspaceMetrics?${paramaters.toString()}`, options)
			.then((response) => response.json())
			.then((result) => {
				const record = {
					id: workspaceId,
					capabitlities: result.capabilities
				};
			});

		('https://webexapis.com/v1/workspaceMetrics?workspaceId=Y2lzY29zcGFyazovL3VzL09SR0FOSVpBVElPTi85NmFiYzJhYS0zZGNjLTExZTUtYTE1Mi1mZTM0ODE5Y2RjOWE&metricName=%5Bobject%20Object%5D,%5Bobject%20Object%5D,%5Bobject%20Object%5D,%5Bobject%20Object%5D,%5Bobject%20Object%5D,%5Bobject%20Object%5D&aggregation=%5Bobject%20Object%5D,%5Bobject%20Object%5D,%5Bobject%20Object%5D&from=2020-10-21T13:33:37.789Z&to=2020-10-31T16:00:00.532Z&unit=%5Bobject%20Object%5D,%5Bobject%20Object%5D&sortBy=%5Bobject%20Object%5D,%5Bobject%20Object%5D');
	}

	async _getCapabilities(progress: CallableFunction, workspaceId: string) {
		let headers = new Headers();
		headers.append('Authorization', 'Bearer ' + this.token);

		let options = {
			method: 'GET',
			headers: headers
		};

		return fetch(`https://webexapis.com/v1/workspaces/${workspaceId}/capabilities`, options)
			.then((response) => response.json())
			.then((result) => {
				const record = {
					id: workspaceId,
					capabitlities: result.capabilities
				};
				progress && progress(record);
			});
	}

	paginatedFetch(progress: CallableFunction, url: string, options: RequestInit, items = []) {
		return fetch(url, options).then((response: Response) => {
			if (response.status !== 200) {
				throw `${response.status}: ${response.statusText}`;
			}

			return response.json().then((data) => {
				this.workspaces = items.concat(data.items);

				console.log('Workspaces length: ', this.workspaces.length);
				const link = response.headers.get('link');

				if (link != null) {
					console.log(link);

					const section = link.split(';');
					if (section.length != 2) {
						throw new Error("section could not be split on ';'");
					}
					const nextURL = section[0].replace(/<(.*)>/, '$1').trim();
					const name = section[1].replace(/rel="(.*)"/, '$1').trim();

					progress && progress(this.workspaces.length);
					this.paginatedFetch(progress, nextURL, options, items);
				} else {
					progress && progress(this.workspaces.length, true);
				}
			});
		});
	}
}
