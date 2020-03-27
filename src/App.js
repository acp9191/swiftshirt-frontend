import './App.css';

import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';

import Home from './Home';
import NavBar from './NavBar';
import { Provider } from 'react-redux';
import React from 'react';
import RegisterForm from './RegisterForm';
import WorkoutDetails from './WorkoutDetails';
import store from './store';

function App() {
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
						<Route path="/register" exact={true} render={() => <RegisterForm />} />
					</Switch>
				</div>
			</Router>
		</Provider>
	);
}

export default App;
