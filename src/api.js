import jQuery from 'jquery';
import store from './store';

class Server {
	get_workouts() {
		return jQuery.ajax('http://swiftshirt.us-east-2.elasticbeanstalk.com/api/v1/workouts?offset=1&limit=100', {
			method: 'get',
			dataType: 'json',
			contentType: 'application/json; charset=UTF-8',
			success: (resp) => {
				store.dispatch({
					type: 'NEW_WORKOUTS',
					data: resp.items
				});
			}
		});
	}

	get_workout(id) {
		return jQuery.ajax(
			`http://swiftshirt.us-east-2.elasticbeanstalk.com/api/v1/workouts/${id}/raw?offset=1&limit=500`,
			{
				method: 'get',
				dataType: 'json',
				contentType: 'application/json; charset=UTF-8',
				success: (resp) => {
					console.log(resp);
					store.dispatch({
						type: 'NEW_WORKOUT',
						data: resp.items
					});
				}
			}
		);
	}
}

export default new Server();
