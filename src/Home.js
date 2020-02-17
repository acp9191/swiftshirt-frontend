import { Link } from 'react-router-dom';
import React from 'react';
import moment from 'moment';
import styled from 'styled-components';
import workouts from './workouts.json';

const BodyContainer = styled.div`margin-top: 105px;`;

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

function Home() {
	let workoutCards = [];

	for (let i = 0; i <= workouts.length - 1; i++) {
		workoutCards.push(
			<div key={i} className="col-md-4">
				<Link to={`/workout/${workouts[i].id}`}>
					<Card className="card mb-4">
						<CardText>
							<div>{workouts[i].name}</div>
							<div>{moment(workouts[i].name, 'DD/MM/YYYY').format('dddd, MMMM Do YYYY')}</div>
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

export default Home;
