import { Link } from 'react-router-dom';
import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import styled from 'styled-components';

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

function Home(props) {
	let { workouts } = props;

	let workoutCards = [];

	for (let i = 0; i <= workouts.length - 1; i++) {
		const workout = workouts[i];

		let hours = moment(workout.end, 'X').diff(moment(workout.start, 'X'), 'hours');
		let minutes = moment(workout.end, 'X').diff(moment(workout.start, 'X'), 'minutes');
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
				<Link to={`/workout/${workout.id}`}>
					<Card className="card mb-4">
						<CardText>
							<div>Workout: {workout.id}</div>
							<div>{moment(workout.start, 'X').format('dddd, MMMM Do YYYY')}</div>
							<div>
								{moment(workout.start, 'X').format('h:mm:ss a')}-{moment(workout.end, 'X').format('h:mm:ss a')}
							</div>
							<div>Duration: {duration}</div>
						</CardText>
					</Card>
				</Link>
			</div>
		);
	}

	return (
		<BodyContainer>
			<WorkoutContainer className="container">
				<div className="row">{workoutCards}</div>
			</WorkoutContainer>
		</BodyContainer>
	);
}

function state2props(state) {
	return { workouts: state.workouts };
}

export default connect(state2props)(Home);
