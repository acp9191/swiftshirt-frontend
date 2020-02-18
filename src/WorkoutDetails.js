import * as d3 from 'd3';

import React from 'react';
import api from './api';
import { connect } from 'react-redux';
import styled from 'styled-components';

const ChartContainer = styled.div`margin-top: 135px;`;

class WorkoutDetails extends React.Component {
	constructor(props) {
		super(props);
		let id = props.match.params.id;

		api.get_workout(id);
	}

	groupBy(xs, key) {
		return xs.reduce(function(rv, x) {
			(rv[x[key]] = rv[x[key]] || []).push(x);
			return rv;
		}, {});
	}

	drawChart(data) {
		for (let key of Object.keys(data)) {
			const subset = data[key];

			let margin = { top: 10, right: 30, bottom: 30, left: 60 },
				width = 460 - margin.left - margin.right,
				height = 400 - margin.top - margin.bottom;
			let svg = d3
				.select('.chart-container')
				.append('svg')
				.attr('width', width + margin.left + margin.right)
				.attr('height', height + margin.top + margin.bottom)
				.append('g')
				.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

			svg
				.append('text')
				.attr('x', width / 2)
				.attr('y', 10)
				.attr('text-anchor', 'middle')
				.style('font-size', '16px')
				.style('text-decoration', 'underline')
				.text(key);

			let x = d3
				.scaleTime()
				.domain(
					d3.extent(subset, function(d) {
						return d.created_at;
					})
				)
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
		const rawData = this.props.workout;

		let grouped = this.groupBy(rawData, 'name');

		this.drawChart(grouped);
	}

	render() {
		return <ChartContainer className="chart-container" />;
	}
}

function state2props(state) {
	return { workout: state.workout };
}

export default connect(state2props)(WorkoutDetails);
