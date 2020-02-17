import React from 'react';
import logo from './swift_shirt_logo.png';
import styled from 'styled-components';

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

function NavBar() {
	return (
		<header className="App-header">
			<ImageContainer>
				<Image src={logo} alt="Swift Shirt Logo" />
			</ImageContainer>
		</header>
	);
}

export default NavBar;
