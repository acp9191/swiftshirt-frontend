import './App.css';

import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';

import Home from './Home';
import NavBar from './NavBar';
import { Provider } from 'react-redux';
import React from 'react';
import WorkoutDetails from './WorkoutDetails';
import api from './api';
import store from './store';

function App() {
	api.get_workouts().then((resp) => {
		console.log(resp);
	});
	return (
		<Provider store={store}>
			<Router>
				<div className="App">
					<NavBar />
					<Switch>
						<Route exact path="/">
							<Home />
						</Route>
						<Route path="/workout/:id" component={WorkoutDetails} />
					</Switch>
				</div>
			</Router>
		</Provider>
	);
}

export default App;
