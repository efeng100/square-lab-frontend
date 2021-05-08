import React from 'react';

import { PlayState } from '../constants';

const Tile = ({value, playState, onClick}) => {
	const bgcolors = ['tile-light', 'tile-dark', 'tile-red']
	
	const handleClick = () => {
		if (playState !== PlayState.OVER) {
			onClick();	
		}
	}

	return (
		<div className={`tile ${bgcolors[value]} ${playState === PlayState.OVER ? '' : 'clickable'}`} onMouseDown={handleClick}></div>
	)
}

export default Tile;