import React from 'react';

import Table from 'react-bootstrap/Table';

import { SIZES } from '../constants';

const PBTable = ({stats}) => {
	return (
		<Table striped bordered hover>
			<thead>
				<tr>
				<th>Game Mode</th>
				<th>Personal Best</th>
				<th>Percentile</th>
				</tr>
			</thead>
			<tbody>
				{
					SIZES.map(size => {
						return (
							<tr>
							<td>Sprint {size}×{size}</td>
							<td>{stats.sprintTimes[size] === null || stats.sprintTimes[size] === undefined ? 'No Time' : `${stats.sprintTimes[size].toFixed(3)} seconds`}</td>
							<td>{stats.sprintPercentiles[size] === null || stats.sprintPercentiles[size] === undefined ? '0' : stats.sprintPercentiles[size].toFixed(2)} PR</td>
							</tr>
						)
					})
				}
				{
					SIZES.map(size => {
						return (
							<tr>
							<td>Ultra {size}×{size}</td>
							<td>{stats.ultraScores[size] === null || stats.ultraScores[size] === undefined ? 'No Score' : `${stats.ultraScores[size]} points`}</td>
							<td>{stats.ultraPercentiles[size] === null || stats.ultraPercentiles[size] === undefined ? '0' : stats.ultraPercentiles[size].toFixed(2)} PR</td>
							</tr>
						);
					})
				}
			</tbody>
		</Table>
	)
};

export default PBTable;