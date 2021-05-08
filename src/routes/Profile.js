import React, { useState, useEffect } from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';

import Stats from '../models/Stats';

import Navigation from '../components/Navigation';
import PBTable from '../components/PBTable';
import GraphCarousel from '../components/GraphCarousel';

function Profile() {
  const [userStats, setUserStats] = useState(new Stats(localStorage.getItem('user_id'), localStorage.getItem('user_name')));
  const [radar, setRadar] = useState(null);
  const [sprintGraphs, setSprintGraphs] = useState({});
  const [ultraGraphs, setUltraGraphs] = useState({});

  useEffect(() => {
    async function updateStats() {
      await userStats.getStats();
      setUserStats(userStats);
    }

    async function fetchRadar() {
			let data;
			try {
				data = await userStats.getRadar();
			} catch(err) {
				data = null
			}
      setRadar(data);
    }

    async function fetchSprintGraphs() {
      let data;
			try {
				data = await Stats.getSprintGraphs();
			} catch(err) {
				data = null
			}
      setSprintGraphs(data);
    }

    async function fetchUltraGraphs() {
      let data;
			try {
				data = await Stats.getUltraGraphs();
			} catch(err) {
				data = null
			}
      setUltraGraphs(data);
    }

    updateStats();
    fetchRadar();
    fetchSprintGraphs();
    fetchUltraGraphs();
  }, []);

  return (
    <>
		<Navigation />
    <Container fluid className='my-3'>
      <Row className='justify-content-md-center'>
        <Col md='auto'>
          <h2>{userStats.user_name}'s Stats</h2>
        </Col>
      </Row>
      <Row className='justify-content-md-center mt-2'>
        <Col md='auto'>
          <PBTable stats={userStats} />
        </Col>
      </Row>
      <Row className='justify-content-md-center'>
        <Col md='auto'>
          <Image src={radar} />
        </Col>
      </Row>
      <Row className='justify-content-md-center mt-5'>
        <Col md='auto'>
          <h2>Global Stats</h2>
        </Col>
      </Row>
      <Row className='justify-content-md-center mb-3'>
        <Col md='auto' style={{width: '60vw'}}>
          <Card>
          <Card.Body>
            <Card.Title>Sprint Distributions</Card.Title>
            <GraphCarousel graphs={sprintGraphs} />
          </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className='justify-content-md-center'>
        <Col md='auto' style={{width: '60vw'}}>
        <Card>
          <Card.Body>
            <Card.Title>Ultra Distributions</Card.Title>
            <GraphCarousel graphs={ultraGraphs} />
          </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
		</>
  );
}

export default Profile;