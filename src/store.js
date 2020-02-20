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

function workoutData(state = [], action) {
	switch (action.type) {
		case 'NEW_WORKOUT_DATA':
			return action.data;
		default:
			return state;
	}
}

function muscle(state = null, action) {
	switch (action.type) {
		case 'NEW_MUSCLE':
			return action.data;
		default:
			return state;
	}
}

function root_reducer(state0, action) {
	let reducer = combineReducers({
		workouts,
		workoutData,
		muscle
	});

	let state1 = reducer(state0, action);

	return deepFreeze(state1);
}

let store = createStore(root_reducer);
export default store;
