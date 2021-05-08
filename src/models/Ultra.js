import axios from 'axios';

import { BACKEND_URL } from '../constants';

class Ultra {

	constructor(data) {
		this.id = data.id;
		this.user_id = data.user_id;
		this.size = data.size;
		this.score = data.score;
		this.set_on = new Date(data.set_on);
	}

}

Ultra.getUltras = async () => {
	const result = await axios({
		method: 'get',
		url: `${BACKEND_URL}/ultra`,
		withCredentials: true,
	});

	return result.data.map(json => new Ultra(json));
};

Ultra.getUltrasBySize = async (size) => {
	const result = await axios({
		method: 'get',
		url: `${BACKEND_URL}/ultra`,
		withCredentials: true,
		params: {size},
	});

	return result.data.map(json => new Ultra(json));
};

Ultra.getUltrasByUser = async (user_id) => {
	const result = await axios({
		method: 'get',
		url: `${BACKEND_URL}/ultra/${user_id}`,
		withCredentials: true,
	});

	const ultras = {};
	for (const [size, ultra] of Object.entries(result.data)) {
		if (ultra === null) {
			ultras[size] = null;
		} else {
			ultras[size] = new Ultra(ultra);
		}
	}

	return ultras;
};

Ultra.submitUltra = async (user_id, size, score) => {
	return axios({
		method: 'post',
		url: `${BACKEND_URL}/ultra`,
		withCredentials: true,
		data: {user_id, size, score},
	})
	.then(result => {
		return {
			success: true,
			ultra: new Ultra(result.data),
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


export default Ultra;