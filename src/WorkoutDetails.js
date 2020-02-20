import * as d3 from 'd3';

import React from 'react';
import api from './api';
import { connect } from 'react-redux';
import store from './store';
import styled from 'styled-components';

const ChartContainer = styled.div`margin-top: 135px;`;

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

class WorkoutDetails extends React.Component {
	constructor(props) {
		super(props);
		let id = props.match.params.id;

		this.selectMuscle = this.selectMuscle.bind(this);

		api.get_workout(id).then(() => {
			store.dispatch({
				type: 'NEW_LOADING',
				data: false
			});
		});
	}

	groupBy(xs, key) {
		return xs.reduce(function(rv, x) {
			(rv[x[key]] = rv[x[key]] || []).push(x);
			return rv;
		}, {});
	}

	drawChart(subset) {
		if (subset) {
			subset.forEach(function(d) {
				d.created_at = new Date(d.created_at * 1000);
			});

			let margin = { top: 20, right: 60, bottom: 60, left: 60 },
				width = 460 - margin.left - margin.right,
				height = 400 - margin.top - margin.bottom;

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
						.curve(d3.curveBundle)
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
		d3.select('svg').remove();
		let deepClone = JSON.parse(JSON.stringify(this.props));
		deepClone.defaultForm = true;

		let rawData = deepClone.workoutData;

		let active = deepClone.muscle;

		let grouped = this.groupBy(rawData, 'name');

		if (grouped && active) {
			this.drawChart(grouped[active]);
		}
	}

	selectMuscle(event) {
		store.dispatch({
			type: 'NEW_MUSCLE',
			data: event.target.innerText
		});
	}

	render() {
		let workout = this.props.workoutData;

		let active = this.props.muscle;

		let grouped = this.groupBy(workout, 'name');

		let buttons = [];

		for (let key of Object.keys(grouped)) {
			if (key === active) {
				buttons.push(
					<button key={key} type="button" className="btn btn-primary active" onClick={this.selectMuscle}>
						{key}
					</button>
				);
			} else {
				buttons.push(
					<button key={key} type="button" className="btn btn-primary" onClick={this.selectMuscle}>
						{key}
					</button>
				);
			}
		}

		buttons = buttons.length ? buttons : <div>No Data!</div>;

		return this.props.loading ? (
			<Loader />
		) : (
			<div>
				<ChartContainer active={active} className="chart-container" />
				<div className="btn-group btn-group-toggle" data-toggle="buttons">
					{buttons}
				</div>
			</div>
		);
	}
}

function state2props(state) {
	return { workoutData: state.workoutData, muscle: state.muscle, loading: state.loading };
}

export default connect(state2props)(WorkoutDetails);
