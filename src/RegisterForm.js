import React from 'react';
import api from './api';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';

const FormWrapper = styled.div`
	margin: 135px auto auto;
	max-width: 300px;
	text-align: left;
`;

const RegisterForm = withRouter(({ history }) => {
	let firstName,
		lastName,
		email,
		password,
		isCoach = false;

	function updateFirstName(ev) {
		firstName = ev.target.value;
	}

	function updateLastName(ev) {
		lastName = ev.target.value;
	}

	function updateEmail(ev) {
		email = ev.target.value;
	}

	function updatePassword(ev) {
		password = ev.target.value;
	}

	function updateIsCoach(ev) {
		isCoach = ev.target.checked;
	}

	function redirect() {
		history.push('/');
	}

	function register() {
		api.create_user(firstName, lastName, email, password, isCoach, redirect);
	}

	let registerForm = (
		<FormWrapper className="form no-shadow">
			<div className="form-group">
				<label>First Name</label>
				<input type="text" className="form-control" onChange={updateFirstName} />
			</div>
			<div className="form-group">
				<label>Last Name</label>
				<input type="text" className="form-control" onChange={updateLastName} />
			</div>
			<div className="form-group">
				<label>Email</label>
				<input type="text" className="form-control" onChange={updateEmail} />
			</div>
			<div className="form-group">
				<label>Password</label>
				<input
					type="password"
					className="form-control"
					onChange={updatePassword}
					onKeyPress={(e) => {
						if (e.key === 'Enter') {
							register();
						}
					}}
				/>
			</div>
			<div className="form-group">
				<label>Are you a Coach?</label>
				<input type="checkbox" className="form-control" onChange={updateIsCoach} />
			</div>
			<button className="btn btn-primary" onClick={register}>
				Register
			</button>
		</FormWrapper>
	);

	return (
		<div className="mb-2 no-shadow">
			<div>{registerForm}</div>
		</div>
	);
});

export default RegisterForm;
