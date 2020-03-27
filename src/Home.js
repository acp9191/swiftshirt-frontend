import { Link } from 'react-router-dom';
import React from 'react';
import SignIn from './SignIn';
import api from './api';
import { connect } from 'react-redux';
import moment from 'moment';
import store from './store';
import styled from 'styled-components';
import { withCookies } from 'react-cookie';

const BodyContainer = styled.div`margin-top: 135px;`;

const WorkoutContainer = styled.div`margin-top: 30px;`;

const Card = styled.div`
	height: 200px;
	background-color: black;
	color: white;
	border-radius: 15px;
	transition: all .2s ease-in-out;
	cursor: pointer;

	:hover {
		transform: scale(1.1);
	}
`;

const CardText = styled.div`margin: auto;`;

function compare(a, b) {
	const endA = a.end;
	const endB = b.end;

	let comparison = 0;
	if (endA < endB) {
		comparison = 1;
	} else if (endA > endB) {
		comparison = -1;
	}
	return comparison;
}

function Home(props) {
	let { session, cookies, workouts } = props;

	if (!session) {
		let sessionObj = cookies.get('swiftshirt-user-session') || null;

		if (sessionObj) {
			console.log(sessionObj);
			store.dispatch({
				type: 'NEW_SESSION',
				data: sessionObj
			});
		}
	}

	if (!workouts.length && session) {
		console.log('here');
		api.get_workouts(session.id).then((resp) => {
			console.log(resp);
		});
	}

	let deepClone = JSON.parse(JSON.stringify(props));
	deepClone.defaultForm = true;

	let workoutsClone = deepClone.workouts;

	workoutsClone.sort(compare);

	store.dispatch({
		type: 'NEW_WORKOUT_DATA',
		data: []
	});
	store.dispatch({
		type: 'NEW_MUSCLE',
		data: null
	});
	store.dispatch({
		type: 'NEW_WORKOUT',
		data: null
	});

	let workoutCards = [];

	for (let i = 0; i <= workoutsClone.length - 1; i++) {
		const workout = workoutsClone[i];

		let hours = moment(workout.end, 'X').diff(moment(workout.start, 'X'), 'hours');
		let minutes = moment(workout.end, 'X').diff(moment(workout.start, 'X'), 'minutes') % 60;
		let seconds = moment(workout.end, 'X').diff(moment(workout.start, 'X'), 'seconds') % 60;

		let duration = '';

		if (hours) {
			duration += `${hours} hr`;
		}
		if (minutes) {
			duration += ` ${minutes} min`;
		}
		if (seconds) {
			duration += ` ${seconds} s`;
		}

		workoutCards.push(
			<div key={i} className="col-md-4">
				<Link
					to={`/workout/${workout.id}`}
					onClick={() => {
						store.dispatch({
							type: 'NEW_LOADING',
							data: true
						});

						store.dispatch({
							type: 'NEW_WORKOUT',
							data: workout
						});
					}}
				>
					<Card className="card mb-4">
						<CardText>
							{/* <div>Workout: {workout.id}</div> */}
							<div>{moment(workout.start, 'X').format('dddd, MMMM Do YYYY')}</div>
							<div>
								{moment(workout.start, 'X').format('h:mm a')}-{moment(workout.end, 'X').format('h:mm a')}
							</div>
							<div>Duration: {duration}</div>
						</CardText>
					</Card>
				</Link>
			</div>
		);
	}

	function signOut() {
		cookies.remove('swiftshirt-user-session');
		store.dispatch({
			type: 'LOGOUT_SESSION'
		});
	}

	const totalWorkouts = workoutsClone.length ? (
		<div> Total Workouts: {workoutsClone.length}</div>
	) : (
		<div>You have no workouts!</div>
	);

	return session ? (
		<BodyContainer>
			<div>
				<button className="btn btn-primary" onClick={signOut}>
					Sign Out
				</button>
			</div>
			<div style={{ padding: '10px 0' }}>{totalWorkouts}</div>
			<WorkoutContainer className="container">
				<div className="row">{workoutCards}</div>
			</WorkoutContainer>
		</BodyContainer>
	) : (
		<SignIn />
	);
}

function state2props(state) {
	return { workouts: state.workouts, session: state.session };
}

export default connect(state2props)(withCookies(Home));
