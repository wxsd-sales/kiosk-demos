import RoomOSWidgets from './images/roomos-device-widgets.png';
import KioskIframes from './images/kiosk-iframes.gif';
import CoffeeOrder from './images/coffee-order.png';
import WebViewControls from './images/webview-controls.png';

export const Demos = [
	[
		{
			title: 'RoomOS Device Widgets',
			subTitle: 'Collection of Kiosk/PWA Widgets to demo solutinos to a variety of use cases',
			image: RoomOSWidgets,
			link: 'https://github.com/wxsd-sales/roomos-device-widgets',
			demo: 'https://app.vidcast.io/share/bb910329-f398-4f04-baec-18ddaf46f493'
		},
		{
			title: 'WebView Device Control',
			subTitle:
				'Control your Webex Device directly from an open WebView using a macro in the background',
			image: WebViewControls,
			link: 'https://github.com/wxsd-sales/roomos-device-widgets',
			macro: 'https://github.com/wxsd-sales/webview-control-macro',
			demo: 'https://app.vidcast.io/share/bb910329-f398-4f04-baec-18ddaf46f493',
			video: 'https://app.vidcast.io/share/bb910329-f398-4f04-baec-18ddaf46f493'
		}
	],
	[
		{
			title: 'Kiosk iFrames',
			subTitle: 'Card based UI with embedded sites',
			image: KioskIframes,
			link: 'https://wxsd-sales.github.io/kiosk-iframes/',
			demo: 'https://github.com/wxsd-sales/kiosk-iframes'
		},
		{
			title: 'Coffee Ordering',
			subTitle: 'Order coffee from your Webex Device',
			image: CoffeeOrder,
			link: 'https://wxsd-sales.github.io/kiosk-demos/coffee/',
			macro: 'https://github.com/wxsd-sales/webview-control-macro',
			demo: 'https://app.vidcast.io/share/bb910329-f398-4f04-baec-18ddaf46f493'
		}
	]
];
