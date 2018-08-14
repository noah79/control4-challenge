import {observable} from 'mobx';
import {Provider} from 'mobx-react';
import * as React from 'react';
import {ApolloProvider} from 'react-apollo';
import * as css from './App.css';
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import {observer} from '../node_modules/mobx-react/custom';
import {CityChooser, CityWeatherDetails} from './components';


import logo from './logo.svg';
import {stores} from './stores';

class App extends React.Component {
	public render() {
		return (
			<Provider {...stores}>
			<Router>
				<div className={css.App}>
					<header className={css['App-header']}>
						<img src={logo} className={css['App-logo']} alt="logo"/>
						<h1 className={css['App-title']}>Control4 Weather Challenge</h1>
					</header>

					{/*<Route exact path="/" component={Home}/>*/}
					{/*<Route path="/about" component={About}/>*/}

					<div className={css.details}>
						<CityChooser/>
						<CityWeatherDetails/>
					</div>

				</div>
			</Router>
			</Provider>
		);
	}
}

@observer
class Home extends React.Component {

	render() {
		return <div>
			<h2>Home</h2>
		</div>
	}
}

const About = () => (
	<div>
		<h2>About</h2>
	</div>
);

export default App;


