import React from 'react';

import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert';

import { GameMode } from '../constants';

import CloseButton from '../components/CloseButton';

import '../styles/style.css';

const ScoreSubmission = (props) => {
	const {mode, size, success, personalBest, time, score} = props.data;
	const loggedIn = localStorage.getItem('user_id') !== null;

	return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
			dialogClassName='score-submission-modal'
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
					{
						loggedIn ?
						(success || mode === GameMode.ULTRA ? 'Score Submitted' : 'Score Not Submitted') :
						'Log in to submit and save your scores'
					}
        </Modal.Title>
				<CloseButton onHide={props.onHide} />
      </Modal.Header>
      <Modal.Body>
				{
					personalBest ?
					<Alert variant='info'>
						Congratulations! You beat your personal best
					</Alert> :
					null
				}
        <p>Player: {loggedIn ? localStorage.getItem('user_name') : 'Guest'}</p>
				<p>Game Mode: {mode === GameMode.SPRINT ? 'Sprint' : 'Ultra'} {size}×{size}</p>
				<p>
					{
						mode === GameMode.SPRINT ?
						`${success ? '' : 'Incomplete '}Time: ${time.toFixed(3)}` :
						`Score: ${score}`
					}
				</p>
      </Modal.Body>
    </Modal>
  );
}

export default ScoreSubmission;