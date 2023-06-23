import WebexLogo from '$lib/assets/webex-logo.svg';
import OppLogo from './images/opplogo.png';
import OppBackground from './images/oppbackground.jpeg';
import type { Theme } from '../../../types';


export const Banks: Array<Theme>= [
	{
		tag: 'wxsd',
		logo: WebexLogo,
		background: null,
		themeName: 'WXSD Bank Demo',
		welecomeText: 'Please walk up or tap to begin',
		optionText: 'Choose Your Service',
		options: [
			{
				title: 'Investment Solutions',
				logo: '123'
			},
			{
				title: 'Retirement',
				logo: '123'
			},
			{
				title: 'Retirement',
				logo: '123'
			}
		]
	},
	{
		tag: 'opp',
		logo: OppLogo,
		background: OppBackground,
		themeName: 'Demo',
		welecomeText: 'Please walk up to tap to begin',
		optionText: 'Choose Your Service',
		options: [
			{
				title: 'Investment Solutions',
				logo: '123'
			},
			{
				title: 'Retirement',
				logo: '123'
			},
			{
				title: 'Retirement',
				logo: '123'
			}
		]

	}
];
