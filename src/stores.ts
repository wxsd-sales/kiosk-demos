import { writable } from 'svelte/store';
import { readable } from 'svelte/store';
import type {OrderItem} from './types'

export const deploymentName = readable('Webex Device Web App Demos');

export const cart = writable(new Array<OrderItem>);