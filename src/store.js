import { combineReducers, createStore } from 'redux';

import deepFreeze from 'deep-freeze';

function workouts(state = [], action) {
	switch (action.type) {
		case 'NEW_WORKOUTS':
			return action.data;
		default:
			return state;
	}
}

function workout(state = [], action) {
	switch (action.type) {
		case 'NEW_WORKOUT':
			return action.data;
		default:
			return state;
	}
}

function root_reducer(state0, action) {
	let reducer = combineReducers({
		workouts,
		workout
	});

	let state1 = reducer(state0, action);

	return deepFreeze(state1);
}

let store = createStore(root_reducer);
export default store;
