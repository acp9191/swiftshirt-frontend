// import store from './store';
// import jQuery from 'jquery';

class Server {
	get_workout() {
		// const Http = new XMLHttpRequest();
		// const url = 'http://swiftshirt.us-east-2.elasticbeanstalk.com/api/v1/workout/1';
		// Http.open('GET', url);
		// Http.send();
		// Http.onreadystatechange = (e) => {
		// 	console.log(Http.responseText);
		// };
		// return;
		// return jQuery.ajax('http://swiftshirt.us-east-2.elasticbeanstalk.com/api/v1/workout/1', {
		// 	method: 'get',
		// 	dataType: 'json',
		// 	contentType: 'application/json; charset=UTF-8',
		// 	headers: {
		// 		'Access-Control-Allow-Origin': 'http://localhost:3000/',
		// 		'Access-Control-Allow-Credentials': true
		// 	},
		// 	crossDomain: true
		// 	success: (resp) => {
		// 		// 	// store.dispatch({
		// 		// 	// 	type: 'NEW_RECS',
		// 		// 	// 	data: resp
		// 		// 	// });
		// 		// 	// store.dispatch({
		// 		// 	// 	type: 'NEW_SPOTIFY_PLAYER',
		// 		// 	// 	data: {
		// 		// 	// 		spotifyType: 'track',
		// 		// 	// 		spotifyId: resp.rec.id
		// 		// 	// 	}
		// 		// 	// });
		// 		console.log(resp);
		// }
		// });
	}
}

export default new Server();
