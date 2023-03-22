import type { RoomAnalytics } from '../types';

export default class cloudxapi {
	statusUrl = 'https://webexapis.com/v1/xapi/status';
	commandUrl = 'https://webexapis.com/v1/xapi/command/';
	deviceId: string;
	token: string;

	constructor(deviceId: string, token: string) {
		this.deviceId = deviceId;
		this.token = token;
	}

	private xstatus(status: string) {
		let myheaders = new Headers();
		myheaders.append('Authorization', 'Bearer ' + this.token);

		var options = {
			method: 'GET',
			headers: myheaders
		};

		const parameters = new URLSearchParams({
			deviceId: this.deviceId,
			name: status
		});

		return fetch(this.statusUrl + '?' + parameters, options)
			.then((response) => response.json())
			.catch((error) => console.log('error', error));
	}

	private xcommand(command: string, args: object) {
		let myheaders = new Headers();
		myheaders.append('Authorization', 'Bearer ' + this.token);
		myheaders.append('Content-Type', 'application/json');

		const data = { deviceId: this.deviceId, args };

		var options = {
			method: 'POST',
			headers: myheaders,
			body: JSON.stringify(data)
		};

		return fetch(this.commandUrl + command, options)
			.then((response) => response.json())
			.catch((error) => console.log('error', error));
	}

	getAnalytics<Type extends RoomAnalytics>() {
		return this.xstatus('RoomAnalytics.*').then((response) => response.result.RoomAnalytics);
	}

	getPeripherals() {
		return this.xstatus('Peripherals.ConnectedDevice[*].*')
		.then((response) => response.result.RoomAnalytics)
		.then((response: RoomAnalytics) => response);
	}

	dial(number: string){
		return this.xcommand('Dial', {number: number})
	}
}
