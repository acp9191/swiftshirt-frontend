import './App.css';

import React from 'react';
import api from './api';
import logo from './swift_shirt_logo.png';
import moment from 'moment';
import styled from 'styled-components';
import workouts from './workouts.json';

const Image = styled.img`
	border-radius: 8px;
	max-width: 100%;
	max-height: 100%;
	background-image: url(${logo});
`;

const ImageContainer = styled.div`
	width: 300px;
	height: 65px;
	margin: 20px auto;
	display: block;
`;

const BodyContainer = styled.div`border-top: 1px solid black;`;

const WorkoutContainer = styled.div`margin-top: 30px;`;

const Card = styled.div`
	height: 200px;
	background-color: black;
	color: white;
	border-radius: 15px;
`;

const CardText = styled.div`margin: auto;`;

// import jQuery from 'jquery';

// window.jQuery = window.$ = jQuery;

function App() {
	api.get_workout().then((resp) => {
		console.log(resp);
	});

	let workoutCards = [];

	for (let i = 0; i <= workouts.length - 1; i++) {
		workoutCards.push(
			<div className="col-md-4">
				<Card className="card mb-4">
					<CardText>
						<div>{workouts[i].name}</div>
						<div>{moment(workouts[i].name, 'DD/MM/YYYY').format('dddd, MMMM Do YYYY')}</div>
					</CardText>
				</Card>
			</div>
		);
	}

	return (
		<div className="App">
			<header className="App-header">
				<ImageContainer>
					<Image src={logo} alt="Swift Shirt Logo" />
				</ImageContainer>
			</header>
			<BodyContainer>
				<WorkoutContainer className="container">
					<div className="row">{workoutCards}</div>
				</WorkoutContainer>
			</BodyContainer>
		</div>
	);
}

export default App;
