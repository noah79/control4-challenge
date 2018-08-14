import {action, autorun, observable, toJS} from 'mobx';
import * as _ from 'lodash'

export interface Weather {
	id: number,
	main: string,
	description: string,
	icon: string
}

export interface Forecast {
	rain: any,
	weather: Array<Weather>;
}

export interface City {
	location: string;
	temp?: string;
	icon?: string;
	details?: {
		geo: any,
		weather: {
			main: { temp: number, pressure: number, humidity: number, temp_max: number, temp_min: number },
			weather: Array<Weather>
			precipitation: { mode: string, value: number }
		},
		forecast: {
			list: Array<Forecast>
		}
	};
}

interface GeoCodeResponse {
	results: Array<{ geometry: { location: { lat: number, lng: number } } }>;
}

const apiKey = 'da65fafb6cb9242168b7724fb5ab75e7';

export class CityStore {
	constructor() {
		if (localStorage['cities']) {
			try {
				this.cities.replace(JSON.parse(localStorage['cities']));
			}
			catch (err) {
				this.loadDefaultCities();
			}
		}
		else {
			this.loadDefaultCities();
		}

		autorun(() => {
			const {cities} = this;
			localStorage['cities'] = JSON.stringify(toJS(cities).map(c => _.omit(c, ['details'])));
		})

		this.selectedCity = _.first(this.cities);

		autorun(() => {
			const {selectedCity} = this;
			if (selectedCity && !selectedCity.details) {
				this.loadDetails(selectedCity);
			}
		})
	}

	@observable cities = observable.array<City>();
	@observable selectedCity: City;

	@action private loadDefaultCities = () => {
		this.cities.replace([
			{location: 'San Francisco, CA'},
			{location: 'New York, NY'},
			{location: 'Salt Lake City, UT'}
		])
	}

	@action private loadDetails = async (selectedCity: City) => {
		// Lookup the geo coordinates
		const geoCoords = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${selectedCity.location}`);
		const coords = await geoCoords.json() as GeoCodeResponse;

		const {results} = coords;
		if (results.length === 0) {
			selectedCity.details = null; // Not found
		}
		else {
			const geo = _.first(results);
			const {geometry, geometry: {location: {lat, lng}}} = geo;

			console.log(geo, lat, lng);

			const currentWeatherRequest = await fetch(`http://api.openweathermap.org/data/2.5/weather?APPID=${apiKey}&lat=${lat}&lon=${lng}&units=imperial`);
			var weather = await currentWeatherRequest.json();
			console.log(weather);

			const forecastRequest = await fetch(`http://api.openweathermap.org/data/2.5/forecast?APPID=${apiKey}&lat=${lat}&lon=${lng}&units=imperial`);
			var forecast = await forecastRequest.json();
			console.log(forecast);

			selectedCity.details = {geo, weather, forecast};
		}
	}
}
