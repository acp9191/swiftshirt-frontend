import * as d3 from 'd3';

import MusclesDiagram from './MusclesDiagram';
import React from 'react';
import api from './api';
import { connect } from 'react-redux';
import moment from 'moment';
import store from './store';
import styled from 'styled-components';
import { withCookies } from 'react-cookie';

const DiagramContainer = styled.div`
	background-color: darkgray;
	border-radius: 25px;
	margin: 40px auto;
	max-width: 500px;
`;

const TitleContainer = styled.div`margin-top: 135px;`;

const LeftRightBalance = styled.div`
	margin: 15px auto 100px;
	max-width: 500px;
`;

const DiagramTitle = styled.div`
	font-size: 30px;
	margin-top: 20px;
`;

const ButtonGroup = styled.div`
	max-width: 500px;
	display: block;
	margin: 0 auto;
`;

const LRContainer = styled.div`
	height: 55px;
	font-size: 20px;
`;

const Left = styled.span`
	float: left;
	margin-left: 45px;
`;
const Right = styled.span`
	float: right;
	margin-right: 45px;
`;

const Loader = styled.div`
	position: absolute;
	left: 50%;
	top: 50%;
	z-index: 1;
	width: 150px;
	height: 150px;
	margin: -75px 0 0 -75px;
	border: 16px solid #f3f3f3;
	border-radius: 50%;
	border-top: 16px solid steelblue;
	width: 120px;
	height: 120px;
	-webkit-animation: spin 2s linear infinite;
	animation: spin 2s linear infinite;

	@-webkit-keyframes spin {
		0% {
			-webkit-transform: rotate(0deg);
		}
		100% {
			-webkit-transform: rotate(360deg);
		}
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
`;

const keyValueMap = {
	right_bicep: 'Right Bicep',
	left_bicep: 'Left Bicep',
	right_ab: 'Right Ab',
	left_ab: 'Left Ab',
	right_back: 'Right Back',
	left_back: 'Left Back',
	right_shoulder: 'Right Shoulder',
	left_shoulder: 'Left Shoulder',
	right_tricep: 'Right Tricep',
	left_tricep: 'Left Tricep',
	right_chest: 'Right Chest',
	left_chest: 'Left Chest',
	right_forearm: 'Right Forearm',
	left_forearm: 'Left Forearm'
};

const classKeyValueMap = {
	right_bicep: 'bicep-right',
	left_bicep: 'bicep-left',
	right_ab: 'ab-right',
	left_ab: 'ab-left',
	right_back: 'back-right',
	left_back: 'back-left',
	right_shoulder: 'shoulder-right',
	left_shoulder: 'shoulder-left',
	right_tricep: 'tricep-right',
	left_tricep: 'tricep-left',
	right_chest: 'chest-right',
	left_chest: 'chest-left',
	right_forearm: 'forearm-right',
	left_forearm: 'forearm-left'
};

class WorkoutDetails extends React.Component {
	constructor(props) {
		super(props);
		let id = parseInt(props.match.params.id);

		this.selectMuscle = this.selectMuscle.bind(this);

		if (!props.workouts) {
			let sessionObj = props.cookies.get('swiftshirt-user-session') || null;

			api.get_workouts(sessionObj.id).then((workouts) => {
				let workout = workouts.items.find((x) => x.id === id);
				store.dispatch({
					type: 'NEW_WORKOUT',
					data: workout
				});
				store.dispatch({
					type: 'NEW_LOADING',
					data: false
				});
			});
		}

		api.get_rep_counts(id).then(() => {
			api.get_raw_workout(id).then(() => {
				store.dispatch({
					type: 'NEW_LOADING',
					data: false
				});
			});
		});
	}

	groupBy(xs, key) {
		return xs.reduce(function(rv, x) {
			(rv[x[key]] = rv[x[key]] || []).push(x);
			return rv;
		}, {});
	}

	highlightMuscles(repCountData) {
		delete repCountData.avg_hrt;
		delete repCountData.name;
		delete repCountData.id;

		let i = 0;
		let total = 0;

		for (let key in repCountData) {
			total += repCountData[key];
			i++;
		}

		let average = total / i;

		console.log(repCountData);
		console.log(average);

		let low = 'yellow';
		let medium = 'orange';
		let high = 'red';

		for (let key in repCountData) {
			if (repCountData[key] >= average * 1.05) {
				d3.selectAll(`svg .${classKeyValueMap[key]}`).attr('fill', high);
			} else if (repCountData[key] <= average * 0.95) {
				d3.selectAll(`svg .${classKeyValueMap[key]}`).attr('fill', low);
			} else {
				d3.selectAll(`svg .${classKeyValueMap[key]}`).attr('fill', medium);
			}
		}
	}

	drawChart(subset) {
		if (subset) {
			subset.sort(function(x, y) {
				return x.id - y.id;
			});

			subset.forEach(function(d) {
				d.created_at = new Date(d.created_at * 1000);
			});

			let margin = { top: 20, right: 60, bottom: 60, left: 60 },
				width = 560 - margin.left - margin.right,
				height = 500 - margin.top - margin.bottom;

			let svg = d3
				.select('.chart-container')
				.append('svg')
				.attr('width', width + margin.left + margin.right)
				.attr('height', height + margin.top + margin.bottom)
				.append('g')
				.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

			let x = d3
				.scaleTime()
				.domain([ d3.min(subset, (d) => d.created_at), d3.max(subset, (d) => d.created_at) ])
				.range([ 0, width ]);

			svg.append('g').attr('transform', 'translate(0,' + height + ')').call(d3.axisBottom(x));

			let y = d3
				.scaleLinear()
				.domain([
					0,
					d3.max(subset, function(d) {
						return +d.value;
					})
				])
				.range([ height, 0 ]);

			svg.append('g').call(d3.axisLeft(y));

			var axisLabelX = height + 40;
			var axisLabelY = width / 2;

			svg
				.append('g')
				.attr('transform', 'translate(' + axisLabelY + ', ' + axisLabelX + ')')
				.append('text')
				.attr('text-anchor', 'middle')
				.text('Time');

			var axisLabelX2 = -45;
			var axisLabelY2 = height / 2;

			svg
				.append('g')
				.attr('transform', 'translate(' + axisLabelX2 + ', ' + axisLabelY2 + ')')
				.append('text')
				.attr('text-anchor', 'middle')
				.attr('transform', 'rotate(-90)')
				.text('Relative Intensity');

			svg
				.append('path')
				.datum(subset)
				.attr('fill', 'none')
				.attr('stroke', 'steelblue')
				.attr('stroke-width', 1.5)
				.attr(
					'd',
					d3
						.line()
						// .curve(d3.curveBasis)
						.x(function(d) {
							return x(d.created_at);
						})
						.y(function(d) {
							return y(d.value);
						})
				);
		}
	}

	componentDidUpdate() {
		d3.select('.chart-container svg').remove();
		d3.select('.pie-chart-container svg').remove();

		let deepClone = JSON.parse(JSON.stringify(this.props));
		deepClone.defaultForm = true;

		let rawData = deepClone.workoutData;

		let active = deepClone.muscle;

		let grouped = this.groupBy(rawData, 'name');

		if (deepClone.repCounts) {
			this.highlightMuscles(deepClone.repCounts);
			this.drawPieChart(deepClone.repCounts);
		}

		if (grouped && active) {
			this.drawChart(grouped[active]);
			store.dispatch({
				type: 'NEW_LOADING',
				data: false
			});
		}
	}

	selectMuscle(event) {
		store.dispatch({
			type: 'NEW_MUSCLE',
			data: event.target.dataset.key
		});
	}

	drawPieChart(repCountData) {
		var width = 450,
			height = 450,
			margin = 40;

		// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
		var radius = Math.min(width, height) / 2 - margin;

		// append the svg object to the div called 'my_dataviz'
		var svg = d3
			.select('.pie-chart-container')
			.append('svg')
			.attr('width', width)
			.attr('height', height)
			.append('g')
			.attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

		let data = {
			Shoulders: repCountData.left_shoulder + repCountData.right_shoulder,
			Biceps: repCountData.left_bicep + repCountData.right_bicep,
			Triceps: repCountData.left_tricep + repCountData.right_tricep,
			Chest: repCountData.left_chest + repCountData.right_chest,
			Forearms: repCountData.left_forearm + repCountData.right_forearm,
			Abs: repCountData.left_ab + repCountData.right_ab,
			Back: repCountData.left_back + repCountData.right_back
		};

		for (let key in data) {
			if (data[key] === 0) {
				delete data[key];
			}
		}

		// set the color scale
		var color = d3.scaleOrdinal().domain(data).range(d3.schemeSet2);

		// Compute the position of each group on the pie:
		var pie = d3.pie().value(function(d) {
			return d.value;
		});
		var data_ready = pie(d3.entries(data));

		// Now I know that group A goes from 0 degrees to x degrees and so on.

		// shape helper to build arcs:
		var arcGenerator = d3.arc().innerRadius(100).outerRadius(radius);

		// Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
		svg
			.selectAll('mySlices')
			.data(data_ready)
			.enter()
			.append('path')
			.attr('d', arcGenerator)
			.attr('fill', function(d) {
				return color(d.data.key);
			})
			.style('stroke-width', '2px')
			.style('opacity', 0.7);

		// Now add the annotation. Use the centroid method to get the best coordinates
		svg
			.selectAll('mySlices')
			.data(data_ready)
			.enter()
			.append('text')
			.text(function(d) {
				let percentage = (d.endAngle - d.startAngle) / (2 * Math.PI) * 100;
				return `${d.data.key}: ${percentage.toFixed(2)}%`;
			})
			.attr('transform', function(d) {
				return 'translate(' + arcGenerator.centroid(d) + ')';
			})
			.style('text-anchor', 'middle')
			.style('font-size', 17);
	}

	render() {
		let workout = this.props.workoutData;

		let active = this.props.muscle;

		let grouped = this.groupBy(workout, 'name');

		let buttons = [];

		for (let key of Object.keys(grouped)) {
			if (key === active) {
				buttons.push(
					<button
						key={key}
						data-key={key}
						type="button"
						className="btn btn-primary active"
						onClick={this.selectMuscle}
					>
						{keyValueMap[key]}
					</button>
				);
			} else {
				buttons.push(
					<button
						key={key}
						data-key={key}
						type="button"
						className="btn btn-primary"
						onClick={this.selectMuscle}
					>
						{keyValueMap[key]}
					</button>
				);
			}
		}

		buttons = buttons.length ? buttons : <div>No Data!</div>;

		let selectedWorkout = this.props.workout;

		let repCounts = this.props.repCounts;

		return !this.props.loading && this.props.workout && this.props.repCounts ? (
			<div>
				<TitleContainer>{moment(selectedWorkout.start, 'X').format('dddd, MMMM Do YYYY')}</TitleContainer>
				<div>
					{moment(selectedWorkout.start, 'X').format('h:mm a')}-{moment(selectedWorkout.end, 'X').format('h:mm a')}
				</div>
				<div active={active} className="chart-container" />
				<ButtonGroup className="btn-group btn-group-toggle" data-toggle="buttons">
					{buttons}
				</ButtonGroup>
				<DiagramTitle>Muscle Activation</DiagramTitle>
				<DiagramContainer>
					<MusclesDiagram height={450} width={450} />
					<LRContainer>
						<Left>L</Left>
						<Right>R</Right>
					</LRContainer>
				</DiagramContainer>
				<DiagramTitle>Strain Distribution</DiagramTitle>
				<div className="pie-chart-container" />
				<DiagramTitle>Left/Right Balance</DiagramTitle>
				<LeftRightBalance>
					<div className="balance-title">Shoulders</div>
					<LRContainer>
						<Left>{repCounts.left_shoulder}</Left>
						<Right>{repCounts.right_shoulder}</Right>
					</LRContainer>
					<div className="balance-title">Back</div>
					<LRContainer>
						<Left>{repCounts.left_back}</Left>
						<Right>{repCounts.right_back}</Right>
					</LRContainer>
					<div className="balance-title">Chest</div>
					<LRContainer>
						<Left>{repCounts.left_chest}</Left>
						<Right>{repCounts.right_chest}</Right>
					</LRContainer>
					<div className="balance-title">Biceps</div>
					<LRContainer>
						<Left>{repCounts.left_bicep}</Left>
						<Right>{repCounts.right_bicep}</Right>
					</LRContainer>
					<div className="balance-title">Triceps</div>
					<LRContainer>
						<Left>{repCounts.left_tricep}</Left>
						<Right>{repCounts.right_tricep}</Right>
					</LRContainer>
					<div className="balance-title">Forearms</div>
					<LRContainer>
						<Left>{repCounts.left_forearm}</Left>
						<Right>{repCounts.right_forearm}</Right>
					</LRContainer>
					<div className="balance-title">Abs</div>
					<LRContainer>
						<Left>{repCounts.left_ab}</Left>
						<Right>{repCounts.right_ab}</Right>
					</LRContainer>
				</LeftRightBalance>
			</div>
		) : (
			<Loader />
		);
	}
}

function state2props(state) {
	return {
		workoutData: state.workoutData,
		muscle: state.muscle,
		loading: state.loading,
		workout: state.workout,
		repCounts: state.repCounts,
		session: state.session
	};
}

export default connect(state2props)(withCookies(WorkoutDetails));
