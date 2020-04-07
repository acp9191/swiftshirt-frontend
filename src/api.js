import jQuery from 'jquery';
import store from './store';

class Server {
	get_workouts(user_id) {
		return jQuery.ajax(`https://api.swiftshirt.io/api/v1/workouts?offset=1&limit=100&user_id=${user_id}`, {
			method: 'get',
			dataType: 'json',
			contentType: 'application/json; charset=UTF-8',
			success: (resp) => {
				store.dispatch({
					type: 'NEW_WORKOUTS',
					data: resp.items
				});
				return resp.items;
			}
		});
	}

	get_rep_counts(id) {
		return jQuery.ajax(`https://api.swiftshirt.io/api/v1/workouts/${id}?offset=1&limit=10000`, {
			method: 'get',
			dataType: 'json',
			contentType: 'application/json; charset=UTF-8',
			success: (resp) => {
				store.dispatch({
					type: 'NEW_REP_COUNTS',
					data: resp
				});
			}
		});
	}

	get_raw_workout(id) {
		return jQuery.ajax(`https://api.swiftshirt.io/api/v1/workouts/${id}/raw?offset=1&limit=10000`, {
			method: 'get',
			dataType: 'json',
			contentType: 'application/json; charset=UTF-8',
			success: (resp) => {
				if (resp.items.length) {
					store.dispatch({
						type: 'NEW_WORKOUT_DATA',
						data: resp.items
					});
					store.dispatch({
						type: 'NEW_MUSCLE',
						data: resp.items[0].name
					});
				}
			}
		});
	}

	send_post(path, data, callback, error_callback) {
		return jQuery.ajax(`https://api.swiftshirt.io/${path}`, {
			method: 'post',
			dataType: 'json',
			contentType: 'application/json; charset=UTF-8',
			data: JSON.stringify(data),
			success: callback,
			error: error_callback
		});
	}

	setCookie(cname, cvalue, exdays) {
		var d = new Date();
		d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
		var expires = 'expires=' + d.toUTCString();
		document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
	}

	create_session(email, password) {
		return this.send_post(
			'api/v1/auth',
			{
				email,
				password
			},
			(resp) => {
				this.setCookie('swiftshirt-user-session', JSON.stringify(resp), 7);
				console.log(resp);
				store.dispatch({
					type: 'NEW_SESSION',
					data: resp
				});
			},
			(request, _status, _error) => {
				if (request) {
					alert('Invalid Email or Password');
				}
			}
		);
	}

	create_user(first_name, last_name, email, password, is_coach, redirect) {
		return this.send_post(
			'api/v1/users',
			{
				first_name,
				last_name,
				email,
				password,
				is_coach
			},
			() => {
				this.create_session(email, password);
				redirect();
			},
			(request, _status, _error) => {
				if (request) {
					alert('Username already taken');
				}
			}
		);
	}
}

export default new Server();
