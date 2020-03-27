import { Link } from 'react-router-dom';
import React from 'react';
import api from './api';
import styled from 'styled-components';

const FormWrapper = styled.div`
	margin: 135px auto auto;
	max-width: 300px;
	text-align: left;
`;

const SignIn = () => {
	let email, password;

	function updateEmail(ev) {
		email = ev.target.value;
	}

	function updatePassword(ev) {
		password = ev.target.value;
	}

	function create_session() {
		api.create_session(email, password);
	}

	let signIn = (
		<FormWrapper className="form no-shadow">
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
							create_session();
						}
					}}
				/>
			</div>
			<div>
				<button className="btn btn-primary" onClick={create_session}>
					Sign In
				</button>
			</div>
			<div>
				<Link to="/">Forgot Password?</Link>
			</div>
			<div>
				<Link to="/register">Create an Account</Link>
			</div>
		</FormWrapper>
	);

	return (
		<div className="mb-2 no-shadow">
			<div>{signIn}</div>
		</div>
	);
};

export default SignIn;
