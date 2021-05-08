import React, { useState } from 'react';

import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

import CloseButton from '../components/CloseButton';

import Auth from '../models/Auth';

const LoginForm = (props) => {
	const [username, updateUsername] = useState('');
	const [password, updatePassword] = useState('');
	const [showInvalidAlert, setShowInvalidAlert] = useState(false);
	const [invalidAlertText, setInvalidAlertText] = useState('');

	const handleUsernameChange = (event) => {
		updateUsername(event.target.value);
	};

	const handlePasswordChange = (event) => {
		updatePassword(event.target.value);
	};

	const handleSubmit = async (event) => {
		const result = await Auth.login(username, password);
		if (result.success) {
			localStorage.setItem('user_id', result.user_id);
			localStorage.setItem('user_name', result.user_name);
			props.onHide();
		} else {
			setShowInvalidAlert(true);
			setInvalidAlertText(result.message);
		}
	}

	return (
		<Modal
			{...props}
			size="lg"
			aria-labelledby="contained-modal-title-vcenter"
			centered
		>
			<Modal.Header>
				<Modal.Title id="contained-modal-title-vcenter">
					Log In
				</Modal.Title>
				<CloseButton onHide={props.onHide} />
			</Modal.Header>
			<Modal.Body>
				<Form>
					<Form.Group controlId="formBasicEmail" className='mb-3'>
						<Form.Label>Username</Form.Label>
						<Form.Control type="text" placeholder="Username" value={username} onChange={handleUsernameChange} />
					</Form.Group>

					<Form.Group controlId="formBasicPassword" className='mb-3'>
						<Form.Label>Password</Form.Label>
						<Form.Control type="password" placeholder="Password" value={password} onChange={handlePasswordChange} />
					</Form.Group>
					<Button variant="primary" onClick={handleSubmit}>
						Submit
					</Button>
				</Form>
				{
					showInvalidAlert ?
					<Alert variant='danger' className='mt-3'>
						{invalidAlertText}
					</Alert> :
					null
				}
			</Modal.Body>
		</Modal>
	);
}

export default LoginForm;