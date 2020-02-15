// import store from './store';
import jQuery from 'jquery';

class Server {
	get_workout() {
		return jQuery.ajax('http://swiftshirt.us-east-2.elasticbeanstalk.com/api/v1/workout/1', {
			method: 'get',
			dataType: 'json',
			contentType: 'application/json; charset=UTF-8',
			success: (resp) => {
				console.log(resp);
			}
		});
	}
}

export default new Server();
