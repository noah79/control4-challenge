import {HTMLTable, Spinner} from '@blueprintjs/core';
import {observable, toJS} from 'mobx';
import * as React from 'react';
import {City, CityStore, Stores} from '../../stores';
import * as css from './CityWeatherDetails.css'
import {inject, observer} from 'mobx-react';
import * as _ from 'lodash'

/**
 * Detail page should display:
 *    City Name
 *    Weather icon
 *    Current temperature
 *    Hi and Low temperature for the day
 *    Chance of precipitation
 *    Any other information you find relevant. (Optional)
 */

interface MyProps {
	cityStore?: CityStore;
}

@inject((stores: Stores) => ({cityStore: stores.cityStore}))
@observer
export class CityWeatherDetails extends React.Component<MyProps, {}> {
	render() {
		const {props: {cityStore: {selectedCity}}} = this;

		return (
			<div className={css.root}>
				{!selectedCity ? <div>No city is selected</div>
				               : selectedCity.details === null
				                 ? 'Invalid City'
				                 : !selectedCity.details
				                   ? null
				                   : (() => {
								const {details: {weather: {main: {temp, pressure, humidity, temp_max, temp_min}, precipitation, rain, weather}}} = selectedCity;
								return <>
									<HTMLTable className={css.detailTable} striped>
										<tbody>
										<tr>
											<td>Temperature:</td>
											<td>{temp}&deg; (High: {temp_max}&deg; / Low: {temp_min}&deg;)</td>
										</tr>

										<tr>
											<td>Chance of Rain:</td>
											{/* This is actually rain in the past 3 hours, not predicted */}
											<td>{_.keys(rain).map((time, i) => <div key={i} className={css.chanceOfRain}>{time} - {rain[time] * 100}%</div>)}</td>
										</tr>
										</tbody>
									</HTMLTable>
								</>
							})()}
			</div>
		);
	}
}
