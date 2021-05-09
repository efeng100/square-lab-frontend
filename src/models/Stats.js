import { GameMode, SIZES } from '../constants';
import User from './User';
import Sprint from './Sprint';
import Ultra from './Ultra';

const IMAGE_CHARTS_URL = 'https://image-charts.com/chart.js/2.8.0';
const QUICK_CHART_URL = 'https://quickchart.io/chart';

const SPRINT_INTERVALS = 20;
const SPRINT_INCREMENT = 1;

const ULTRA_INTERVALS = 10;
const ULTRA_INCREMENT = 25;

const RADAR_ORDER = [[GameMode.SPRINT, 4], [GameMode.SPRINT, 5], [GameMode.ULTRA, 5], [GameMode.ULTRA, 4], [GameMode.ULTRA, 3], [GameMode.SPRINT, 3]];

const paramsToQuery = (params) => {
	return Object.keys(params).map(function(k) {
    return encodeURIComponent(k) + '=' + encodeURIComponent(params[k])
	}).join('&');
}

class Stats {

	constructor(user_id, user_name) {
		this.user_id = user_id;
		this.user_name = user_name;
		this.sprintTimes = {};
		this.sprintPercentiles = {};
		this.ultraScores = {};
		this.ultraPercentiles = {};
	}

	async getStats() {
		const user = await User.getUser(this.user_id);
		SIZES.forEach(size => {
			this.sprintTimes[size] = user.sprints[size] === null ? null : user.sprints[size].time;
			this.ultraScores[size] = user.ultras[size] === null ? null : user.ultras[size].score;
		});

		let sprintData = {};
		await Promise.allSettled(SIZES.map(size => Sprint.getSprintsBySize(size)))
		.then(sprintSets => {
			for (let i = 0; i < SIZES.length; i++) {
				sprintData[SIZES[i]] = sprintSets[i].value;
			}
		});

		let ultraData = {};
		await Promise.allSettled(SIZES.map(size => Ultra.getUltrasBySize(size)))
		.then(ultraSets => {
			for (let i = 0; i < SIZES.length; i++) {
				ultraData[SIZES[i]] = ultraSets[i].value;
			}
		});
		
		SIZES.forEach(size => {
			if (this.sprintTimes[size] === null) {
				this.sprintPercentiles[size] = 0;
			} else if (sprintData[size].length <= 1) {
				this.sprintPercentiles[size] = 100;
			} else {
				this.sprintPercentiles[size] = (sprintData[size].reduce((count, sprint) => {
					return count + (this.sprintTimes[size] < sprint.time ? 1 : 0)
				}, 0))/(sprintData[size].length-1)*100;
			}
			
			if (this.ultraScores[size] === null) {
				this.ultraPercentiles[size] = 0;
			} else if (ultraData[size].length <= 1) {
				this.ultraPercentiles[size] = 100;
			} else {
				this.ultraPercentiles[size] = (ultraData[size].reduce((count, ultra) => {
					return count + (this.ultraScores[size] > ultra.score ? 1 : 0)
				}, 0))/(ultraData[size].length-1)*100;
			}
		});
	}

	async getRadar() {
		await this.getStats();

		const labels = [];
		const data = [];
		RADAR_ORDER.forEach(([mode, size]) => {
			if (mode === GameMode.SPRINT) {
				labels.push(`"Sprint ${size}×${size}"`)
				data.push(this.sprintPercentiles[size]);
			} else {
				labels.push(`"Ultra ${size}×${size}"`)
				data.push(this.ultraPercentiles[size]);
			}
		});

		const params = {
			c: `{
				type: 'radar',
				data: {
					labels: [${labels}],
					datasets: [
						{
							label:"${this.user_name}'s Skill Percentiles",
							data:[${data}],
							fill: true,
							backgroundColor: 'rgba(54, 162, 235, 0.2)',
							borderColor: 'rgb(54, 162, 235)',
							pointBackgroundColor: 'rgb(54, 162, 235)',
							pointBorderColor: '#fff',
							pointHoverBackgroundColor: '#fff',
							pointHoverBorderColor: 'rgb(54, 162, 235)'
						}
					],
				},
				options: {
					scale: {
						ticks: {
							beginAtZero: true,
							min: 0,
							max: 100,
							stepSize: 20,
						}
					},
				}
			}`
		};
	
		return QUICK_CHART_URL+'?'+paramsToQuery(params);
	}

}

Stats.getSprintGraphs = async () => {
	let data = {};
	await Promise.allSettled(SIZES.map(size => Sprint.getSprintsBySize(size)))
	.then(sprintSets => {
		for (let i = 0; i < SIZES.length; i++) {
			data[SIZES[i]] = sprintSets[i].value;
		}
	});
	
	const frequencyGroups = {};
	SIZES.forEach(size => {
		frequencyGroups[size] = data[size].reduce((freqs, sprint) => {
			const ind = Math.floor(sprint.time/SPRINT_INCREMENT);
			if (ind < SPRINT_INTERVALS) {
				freqs[ind]++;
			} else {
				freqs[SPRINT_INTERVALS]++;
			}
			return freqs;
		}, Array(SPRINT_INTERVALS+1).fill(0));
	});

	const labels = Array(SPRINT_INTERVALS).fill(0).map((value, ind) => `"sub-${(ind+1)*SPRINT_INCREMENT}"`);
	labels.push(`"${SPRINT_INTERVALS*SPRINT_INCREMENT}+"`)

	const getParams = (size, freqs) => {
		return {
			bkg: 'white',
			c: `{
				type: "line",
				data: {
					labels: [${labels}],
					datasets: [
						{
							backgroundColor: "rgba(255,150,150,0.5)",
							borderColor: "rgb(255,150,150)",
							data: [${freqs}],
							label: "Sprint ${size}×${size} Times",
							fill: "origin"
						}
					]
				},
				options: {
					scales: {
						xAxes: [{
							scaleLabel: {
								display: true,
								labelString: 'Time'
							}
						}],
						yAxes: [{
							scaleLabel: {
								display: true,
								labelString: 'Frequency'
							}
						}]
					}
				},
			}`
		}
	};

	const graphs = {};
	SIZES.forEach(size => {
		graphs[size] = IMAGE_CHARTS_URL+'?'+paramsToQuery(getParams(size, frequencyGroups[size]));
	});

	return graphs;
};

Stats.getUltraGraphs = async () => {
	let data = {};
	await Promise.allSettled(SIZES.map(size => Ultra.getUltrasBySize(size)))
	.then(ultraSets => {
		for (let i = 0; i < SIZES.length; i++) {
			data[SIZES[i]] = ultraSets[i].value;
		}
	});
	
	const frequencyGroups = {};
	SIZES.forEach(size => {
		frequencyGroups[size] = data[size].reduce((freqs, ultra) => {
			const ind = Math.floor(ultra.score/ULTRA_INCREMENT);
			if (ind < ULTRA_INTERVALS) {
				freqs[ind]++;
			} else {
				freqs[ULTRA_INTERVALS]++;
			}
			return freqs;
		}, Array(ULTRA_INTERVALS+1).fill(0));
	});

	const labels = Array(ULTRA_INTERVALS+1).fill(0).map((value, ind) => `"${ind*ULTRA_INCREMENT}+"`);

	const getParams = (size, freqs) => {
		return {
			bkg: 'white',
			c: `{
				type: "line",
				data: {
					labels: [${labels}],
					datasets: [
						{
							backgroundColor: "rgba(255,150,150,0.5)",
							borderColor: "rgb(255,150,150)",
							data: [${freqs}],
							label: "Ultra ${size}×${size} Scores",
							fill: "origin"
						}
					]
				},
				options: {
					scales: {
						xAxes: [{
							scaleLabel: {
								display: true,
								labelString: 'Score'
							}
						}],
						yAxes: [{
							scaleLabel: {
								display: true,
								labelString: 'Frequency'
							}
						}]
					}
				},
			}`
		}
	};

	const graphs = {};
	SIZES.forEach(size => {
		graphs[size] = IMAGE_CHARTS_URL+'?'+paramsToQuery(getParams(size, frequencyGroups[size]));
	});

	return graphs;
};

export default Stats;