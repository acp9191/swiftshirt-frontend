import './App.css';

import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';

import Home from './Home';
import NavBar from './NavBar';
import React from 'react';
import WorkoutDetails from './WorkoutDetails';
import api from './api';

function App() {
	api.get_workout().then((resp) => {
		console.log(resp);
	});

	return (
		<Router>
			<div className="App">
				<NavBar />
				<Switch>
					<Route exact path="/">
						<Home />
					</Route>
					<Route path="/workout/:id">
						<WorkoutDetails />
					</Route>
				</Switch>
			</div>
		</Router>
	);
}

export default App;
