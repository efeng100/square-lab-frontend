import axios from 'axios';

import { BACKEND_URL } from '../constants';

const AUTH_URL = `${BACKEND_URL}/auth`;

class Auth {}

Auth.signup = async (name, password) => {
	return axios({
		method: 'post',
		url: `${AUTH_URL}/signup`,
		withCredentials: true,
		data: {name, password},
	})
	.then(result => {
		return {
			success: true,
			user_id: result.data.id,
			user_name: result.data.name,
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

Auth.login = async (name, password) => {
	return axios({
		method: 'post',
		url: `${AUTH_URL}/login`,
		withCredentials: true,
		data: {name, password},
	})
	.then(result => {
		return {
			success: true,
			user_id: result.data.id,
			user_name: result.data.name,
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

Auth.logout = async () => {
	const result = await axios({
		method: 'get',
		url: `${AUTH_URL}/logout`,
		withCredentials: true,
	});
	
	return result.data
};

export default Auth;