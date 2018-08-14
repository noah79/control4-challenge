import {Button, Icon, MenuItem, Spinner, Tooltip} from '@blueprintjs/core';
import {ItemPredicate, ItemRenderer, Select} from '@blueprintjs/select';
import {action, IObservableArray, observable} from 'mobx';
import * as React from 'react';
import {CityStore, Stores} from '../../stores';
import * as css from './CityChooser.css'
import {inject, observer} from 'mobx-react';
import {City} from 'stores';
import * as _ from 'lodash';

const CitySelect = Select.ofType<City>();

/** Taken from https://github.com/palantir/blueprint/blob/develop/packages/docs-app/src/examples/select-examples/films.tsx */
function highlightText(text: string, query: string) {
	let lastIndex = 0;
	const words = query
		.split(/\s+/)
		.filter(word => word.length > 0)
		.map(escapeRegExpChars);
	if (words.length === 0) {
		return [text];
	}
	const regexp = new RegExp(words.join("|"), "gi");
	const tokens: React.ReactNode[] = [];
	while (true) {
		const match = regexp.exec(text);
		if (!match) {
			break;
		}
		const length = match[0].length;
		const before = text.slice(lastIndex, regexp.lastIndex - length);
		if (before.length > 0) {
			tokens.push(before);
		}
		lastIndex = regexp.lastIndex;
		tokens.push(<strong key={lastIndex}>{match[0]}</strong>);
	}
	const rest = text.slice(lastIndex);
	if (rest.length > 0) {
		tokens.push(rest);
	}
	return tokens;
}

function escapeRegExpChars(text: string) {
	return text.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

/**
 * Each list item should display:
 *    Weather Icon
 *    City Name
 *    Current temperature
 */

interface MyProps {
	cityStore?: CityStore;
	disabled?: boolean;
}

@inject((stores: Stores) => ({cityStore: stores.cityStore}))
@observer
export class CityChooser extends React.Component<MyProps> {
	render() {
		const {addCity, removeCity, itemRenderer, filterCity, props: {cityStore, cityStore: {cities, selectedCity}, disabled}} = this;

		return (
			<div className={css.root}>
				<CitySelect className={css.select}
				            items={cities.slice()}
				            noResults={<MenuItem disabled={true} text="No results."/>}
				            popoverProps={{minimal: true}}
				            itemRenderer={itemRenderer}
				            onItemSelect={city => cityStore.selectedCity = city}
				            filterable
				            itemPredicate={filterCity}
				>
					<Button
						className={css.city}
						icon={!selectedCity.details ? null : <Tooltip className={css.icon} position='bottom' content={_.capitalize(selectedCity.details.weather.weather[0].description)}>
							<img src={`http://openweathermap.org/img/w/${selectedCity.details.weather.weather[0].icon}.png`}/>
						</Tooltip>}
						rightIcon="caret-down"
						text={selectedCity ? `${selectedCity.location} ${selectedCity.temp ? `(${selectedCity.temp})` : ''}` : "(No selection)"}
						disabled={disabled}
					>
						{selectedCity ?
						 selectedCity.details === undefined
						 ? <div className={css.loading}>
							 <Spinner size={16}/>
						 </div>
						 : selectedCity.details === null
						   ? <div className={css.error}>
							   <Tooltip content="Invalid City">
								   <Icon icon='error'/>
							   </Tooltip>
						   </div>
						   : null
						              : null}
					</Button>
				</CitySelect>

				<Tooltip content="Add a City">
					<Button icon='plus' onClick={addCity}/>
				</Tooltip>

				<Tooltip content={`Remove ${selectedCity ? `'${selectedCity.location}'` : 'city'}`} disabled={!selectedCity}>
					<Button disabled={!selectedCity} icon='trash' onClick={removeCity}/>
				</Tooltip>


			</div>
		);
	}

	@action addCity = () => {
		const city = prompt('Enter the city name');
		if (city) {
			this.props.cityStore.cities.push({location: city});
		}
	}

	@action removeCity = () => {
		const {props: {cityStore, cityStore: {selectedCity, cities}}} = this;

		if (confirm(`Remove ${selectedCity.location}?`)) {
			cities.remove(selectedCity);
			cityStore.selectedCity = _.first(cities);
		}
	}

	filterCity: ItemPredicate<City> = (query, city) => {
		const label = `${city.location.toLocaleLowerCase()} ${city.temp ? city.temp : ''}`;
		const index = label.indexOf(query.toLowerCase());

		return index >= 0;
	};

	itemRenderer: ItemRenderer<City> = (city, {handleClick, modifiers, query}) => {
		if (!modifiers.matchesPredicate) {
			return null;
		}

		return (
			<MenuItem
				active={modifiers.active}
				disabled={modifiers.disabled}
				label={city.temp}
				key={city.location}
				onClick={handleClick}
				icon={city.details ? <div className={css.icon}><img src={`http://openweathermap.org/img/w/${city.details.weather.weather[0].icon}.png`}/></div> : <Icon icon='blank'/>}
				text={highlightText(city.location, query)}
			/>
		);
	};
}
