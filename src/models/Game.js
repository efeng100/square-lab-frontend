import { GameMode, SPRINT_GOAL, PlayState } from '../constants';

class Game {

	constructor(size, gameMode) {
		this.size = size;
		this.gameMode = gameMode;
		this.startCallbacks = [];
		this.clickCallbacks = [];
		this.endCallbacks = [];
		this.setupNewGame();
	}

	setupNewGame() {
		this.grid = Array(this.size).fill().map(() => Array(this.size).fill(0));
		this.score = 0;
		this.playState = PlayState.SETUP;

		for (let i = 0; i < this.size-1; i++) {
			this.addTarget();
		}
	}

	startGame() {
		this.playState = PlayState.PLAYING;
		this.startCallbacks.forEach(callback => {
			callback();
		});
	}

	click(row, column) {
		if (this.playState === PlayState.SETUP) {
			this.startGame();
		}
		const isTarget = this.grid[row][column] === 1;
		if (isTarget) {
			this.score++;
			if (this.gameMode === GameMode.SPRINT && this.score >= SPRINT_GOAL) {
				this.end(true);
				return;
			} else {
				this.addTarget();
			}
			this.grid[row][column] = 0;
		} else {
			this.grid[row][column] = 2;
			this.end(false);	
		}

		this.clickCallbacks.forEach(callback => {
			callback(row, column, isTarget);
		});
	}

	addTarget() {
		let cands = [];
		for (let r = 0; r < this.size; r++) {
			for (let c = 0; c < this.size; c++) {
				if (this.grid[r][c] === 0) {
					cands.push([r, c]);
				}
			}
		}
		let [r, c] = cands[Math.floor(Math.random()*cands.length)];
		this.grid[r][c] = 1;
	}

	end(success) {
		this.playState = PlayState.OVER;
		this.endCallbacks.forEach(callback => {
			callback(this.score, success, this.gameMode);
		});
	}

	// callback takes void
	onStart(callback) {
		this.startCallbacks.push(callback);
	}

	// callback takes row, column, isTarget
	onClick(callback) {
		this.clickCallbacks.push(callback);
	}

	// callback takes score, success, gameMode
	onEnd(callback) {
		this.endCallbacks.push(callback);
	}

	getGameState() {
		return {
			grid: this.grid,
			score: this.score,
			playState: this.playState,
		};
	}

}

export default Game;