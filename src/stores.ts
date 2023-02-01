import { writable } from 'svelte/store';
import type {OrderItem} from './types'




export const cart = writable(new Array<OrderItem>);


// const testOrder = {
//     name: 'Will',
//     location: 'Office',
//     coffee: 'Latte',
//     milk: 'Regular'
// };


// cart.subscribe(value => {
// 	console.log(value);
// }); // logs '0'


// cart.set([testOrder])