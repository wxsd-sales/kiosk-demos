import {connect} from 'jsxapi'
import { Buffer } from 'buffer'

export default class jsxapi{
	static connect(hostname: string, username: string, password: string) {
		window.Buffer = Buffer;
		return connect({host: hostname, protocol:'wss:', username: username, password: password})
		.on('error', console.error)
		.on('ready', async (xapi)=>{
			console.log(`Connected to device [${hostname}]`)
			xapi.Event.Message.Send.on((text: string) => {
				console.log(`Message Send Event From [${hostname}]:`, text)
			})	
		})
	}
}
