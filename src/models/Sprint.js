import axios from 'axios';

import { BACKEND_URL } from '../constants';

class Sprint {

	constructor(data) {
		this.id = data.id;
		this.user_id = data.user_id;
		this.size = data.size;
		this.time = +data.time;
		this.set_on = new Date(data.set_on);
	}

}

Sprint.getSprints = async () => {
	const result = await axios({
		method: 'get',
		url: `${BACKEND_URL}/sprint`,
		withCredentials: true,
	});

	return result.data.map(json => new Sprint(json));
};

Sprint.getSprintsBySize = async (size) => {
	const result = await axios({
		method: 'get',
		url: `${BACKEND_URL}/sprint`,
		withCredentials: true,
		params: {size},
	});

	return result.data.map(json => new Sprint(json));
};

Sprint.getSprintsByUser = async (user_id) => {
	const result = await axios({
		method: 'get',
		url: `${BACKEND_URL}/sprint/${user_id}`,
		withCredentials: true,
	});

	const sprints = {};
	for (const [size, sprint] of Object.entries(result.data)) {
		if (sprint === null) {
			sprints[size] = null;
		} else {
			sprints[size] = new Sprint(sprint);
		}
	}

	return sprints;
};

Sprint.submitSprint = async (user_id, size, time) => {
	return axios({
		method: 'post',
		url: `${BACKEND_URL}/sprint`,
		withCredentials: true,
		data: {user_id, size, time},
	})
	.then(result => {
		return {
			success: true,
			sprint: new Sprint(result.data),
			submitted: result.data.submitted,
		}
	})
	.catch(error => {
		return {
			success: false,
			status: error.response.status,
			message: error.response.data.message,
		}
	});
};

export default Sprint;