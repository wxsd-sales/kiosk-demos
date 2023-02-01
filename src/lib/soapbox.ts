import { io } from 'socket.io-client';
import type { Order } from '../types';

export default class soapbox {
	ENDPOINT = 'https://soapbox.wbx.ninja';
	socket;
	room!: string;
	connected = false;

	constructor(room: string) {
		console.log('Attempting to connect to soapbox');
		this.room = room;
		this.socket = io(this.ENDPOINT, { query: {room: room}});
		this.socket.on('connection', (socket) => {
			console.log('Connected to: ' + this.ENDPOINT);
			this.connected = true;
		});

		this.socket.on('disconnect', () => {
			this.connected = false;
		});
	}
	sendOrder(order: Order) {
		console.log('Sending order: ' + JSON.stringify(order));
		const message = {
			command: 'set',
			set: 'append',
			data: order
		};
		this.socket.emit('message', message);
	}
}