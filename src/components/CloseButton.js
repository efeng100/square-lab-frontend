import React from 'react';

import '../styles/style.css';

import closeButtonImage from '../images/close-button.PNG';

const CloseButton = ({onHide}) => {
	return (
		<img src={closeButtonImage} onClick={onHide} className='form-close-button'/>
	)
}

export default CloseButton;