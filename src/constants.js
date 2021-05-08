const BACKEND_URL = getBackendURL();

function getBackendURL() {
	if (window.location.hostname.indexOf('localhost') !== -1) {
		return 'http://localhost:5000';
	} else {
		return '';
	}
}

const GameMode = Object.freeze({
	SPRINT: 0,
	ULTRA: 1,
});

const SPRINT_GOAL = 50;
const ULTRA_TIME_LIMIT = 30000;

const SIZES = [3, 4, 5];

const PlayState = Object.freeze({
	SETUP: 0,
	PLAYING : 1,
	OVER: 2,
});

export {
	BACKEND_URL,
	GameMode,
	SPRINT_GOAL,
	ULTRA_TIME_LIMIT,
	SIZES,
	PlayState,
}