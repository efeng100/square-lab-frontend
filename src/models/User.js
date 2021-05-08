import axios from 'axios';

import { BACKEND_URL } from '../constants';
import Sprint from './Sprint';
import Ultra from './Ultra';

class User {

	constructor(data) {
		this.id = data.id;
		this.name = data.name;
		this.sprints = data.sprints;
		this.ultras = data.ultras;
	}

	async refreshSprints() {
		this.sprints = await Sprint.getSprintsByUser(this.id);
	}

	async refreshUltras() {
		this.ultras = await Ultra.getUltrasByUser(this.id);
	}

	async delete() {
		return axios({
			method: 'delete',
			url: `${BACKEND_URL}/user/${this.id}`,
			withCredentials: true,
		})
		.then(result => {
			return {
				success: true,
			}
		})
		.catch(error => {
			return {
				success: false,
				status: error.response.status,
				message: error.response.data.message,
			}
		});
	}

}

User.getIDs = async () => {
	const result = await axios({
		method: 'get',
		url: `${BACKEND_URL}/user`,
		withCredentials: true,
	});

	return result.data;
};

User.getUser = async (id) => {
	const result = await axios({
		method: 'get',
		url: `${BACKEND_URL}/user/${id}`,
		withCredentials: true,
	});
	
	return new User({
		...result.data,
		sprints: await Sprint.getSprintsByUser(id),
		ultras: await Ultra.getUltrasByUser(id),
	});
};

export default User;