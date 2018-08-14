import {CityStore} from './CityStore';

export * from './CityStore'

export const stores = {
	cityStore: new CityStore()
}

export type Stores =  typeof stores;

