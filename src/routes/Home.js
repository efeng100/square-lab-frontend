import React, { useState } from 'react';
import { LinkContainer } from 'react-router-bootstrap';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import { GameMode } from '../constants';

import Navigation from '../components/Navigation';
import SignupForm from '../components/SignupForm'
import LoginForm from '../components/LoginForm'

import clock from '../images/clock.png';
import plus from '../images/plus.png';

function Home() {
  const [showSignupForm, setShowSignupForm] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);

  const openSignupForm = () => {
    setShowSignupForm(true);
  };

  const closeSignupForm = () => {
    setShowSignupForm(false);
  }

  const openLoginForm = () => {
    setShowLoginForm(true);
  };

  const closeLoginForm = () => {
    setShowLoginForm(false);
  };

  return (
    <>
    <Navigation />
    <Container fluid className='my-3'>
      <Row className='justify-content-md-center'>
        <Col md='auto'>
          <Jumbotron>
            <h1>Welcome to Square Lab</h1>
            <p>
              Just click the dark squares.
            </p>
            <p>
              <LinkContainer to={`/game/${GameMode.ULTRA}/4`}><Button variant="outline-success">Play</Button></LinkContainer>
            </p>
          </Jumbotron>
          <h2>
            Game Modes
          </h2>
          <p>
            Use the links at the top to try each mode.
          </p>
          <div style={{'display': 'flex', 'flexDirection': 'row'}}>
            <Card bg='light' text='dark' className='m-2' style={{ width: '18rem' }}>
              <Card.Header>Sprint</Card.Header>
              <Card.Img variant="top" src={clock} className='p-4' />
              <Card.Body>
                <Card.Text>
                  Hit 50 targets in as little time as possible. Play on a 3×3, 4×4, or 5×5 grid.
                </Card.Text>
              </Card.Body>
            </Card>
            <Card bg='light' text='dark' className='m-2' style={{ width: '18rem' }}>
              <Card.Header>Ultra</Card.Header>
              <Card.Img variant="top" src={plus} />
              <Card.Body>
                <Card.Text>
                  Hit as many targets as you can in 30 seconds. Play on a 3×3, 4×4, or 5×5 grid.
                </Card.Text>
              </Card.Body>
            </Card>
          </div>
          {
            localStorage.getItem('user_id') === null ?
            <>
            <h3 className='my-3 '>
              Make an account to save your scores
            </h3>
            <Button variant="outline-primary" className='me-4' onClick={openSignupForm}>Sign Up</Button>
            <Button variant="outline-info" onClick={openLoginForm}>Log In</Button>
            </> :
            null
          }
        </Col>
      </Row>
    </Container>
    <SignupForm show={showSignupForm} onHide={closeSignupForm} />
    <LoginForm show={showLoginForm} onHide={closeLoginForm} />
    </>
  );
}

export default Home;