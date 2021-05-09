import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useSound from 'use-sound';

import Timer from 'react-compound-timer';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

import { GameMode, ULTRA_TIME_LIMIT, SIZES } from '../constants';
import Game from '../models/Game';
import Sprint from '../models/Sprint';
import Ultra from '../models/Ultra';

import Navigation from '../components/Navigation';
import Tile from '../components/Tile';
import ScoreSubmission from '../components/ScoreSubmission';

import hitSound from '../sounds/hit.mp3';
import missSound from '../sounds/miss.mp3';

function GameView() {
  const params = useParams();
  const mode = Object.values(GameMode).includes(+params.mode) ? +params.mode : GameMode.ULTRA;
  const size = SIZES.includes(+params.size) ? +params.size : 4;

  const [game, updateGame] = useState(new Game(size, mode));
  const [gameState, updateGameState] = useState(game.getGameState());
  const [showScoreSubmission, setShowScoreSubmission] = useState(false);
  const [scoreData, setScoreData] = useState({
    mode: GameMode.SPRINT,
    size: 3,
    success: false,
    personalBest: false,
    time: 0,
    score: 0,
  });

  const timerRef = useRef(null);

  const [playHit] = useSound(hitSound, {volume: 0.2});
  const [playMiss] = useSound(missSound, {volume: 0.2});

  useEffect(() => {
    game.onStart(handleStart);
    game.onEnd(handleEnd);

    document.addEventListener('keydown', handleRestartKey);

    return () => {
      document.removeEventListener('keydown', handleRestartKey);
    };
  }, []);

  const getModeName = (mode) => {
    if (mode === GameMode.SPRINT) {
      return 'Sprint';
     } else {
      return 'Ultra';
     }
  };

  const getModeDescription = (mode) => {
    if (mode === GameMode.SPRINT) {
      return 'Hit 50 targets in as little time as possible. Time starts when you click the first one.';
    } else {
      return 'Hit as many targets as you can in 30 seconds. Time starts when you click the first one.';
    }
  };

  const playSound = (value) => {
    if (value === 1) {
      playHit();
    } else {
      playMiss();
    }
  };

  const handleClick = (row, column) => {
    game.click(row, column);
    updateGame(game);
    updateGameState(game.getGameState());
  };

  const handleStart = () => {
    timerRef.current.start();
  };

  const handleEnd = async (score, success, gameMode) => {
    timerRef.current.stop();
    const time = timerRef.current.getTime()/1000;
    if (localStorage.getItem('user_id') !== null) {
      if (mode === GameMode.SPRINT) {
        if (success) {
          const result = await Sprint.submitSprint(localStorage.getItem('user_id'), size, time);
          setScoreData({
            mode,
            size,
            success,
            personalBest: result.submitted,
            time,
            score,
            loggedIn: true,
          });
        } else {
          setScoreData({
            mode,
            size,
            success,
            personalBest: false,
            time,
            score,
          });
        }
      } else {
        const result = await Ultra.submitUltra(localStorage.getItem('user_id'), size, score);
        setScoreData({
          mode,
          size,
          success,
          personalBest: result.submitted,
          time,
          score,
        });
      }
    } else {
      setScoreData({
        mode,
        size,
        success,
        personalBest: false,
        time,
        score,
      })
    }
    setShowScoreSubmission(true);
  };

  const restartButtonTooltip = (props) => (
    <Tooltip {...props} className='ms-2'>
      Press R
    </Tooltip>
  );

  const handleRestart = () => {
    game.setupNewGame();
    updateGame(game);
    updateGameState(game.getGameState());
    timerRef.current.stop();
    timerRef.current.reset();
  };

  const handleRestartKey = (event) => {
    if (event.code === 'KeyR') {
      handleRestart();
    }
  };

  const handleUltraTimerStop = () => {
    game.end(true);
    updateGame(game);
    updateGameState(game.getGameState());
  };

  const closeScoreSubmission = () => {
    setShowScoreSubmission(false);
  }

  const timer = (mode) => {
    if (mode === GameMode.SPRINT) {
      return (
        <Timer
          ref={timerRef}
          lastUnit='s'
          startImmediately={false}
          timeToUpdate={1}
        >
          {({ start, stop, reset, getTime }) => (
            <>
            <Timer.Seconds />
            <Timer.Milliseconds formatValue={value => `.${('000' + value).substr(-3)}`}/>
            </>
          )}
        </Timer>
      );
    } else {
      return (
        <Timer
          ref={timerRef}
          checkpoints={[
            {
              time: 0,
              callback: handleUltraTimerStop,
            }
          ]}
          direction='backward'
          initialTime={ULTRA_TIME_LIMIT}
          lastUnit='s'
          startImmediately={false}
          timeToUpdate={1}
        >
          {({ start, stop, reset, getTime }) => (
            <>
            <Timer.Seconds />
            <Timer.Milliseconds formatValue={value => `.${('000' + value).substr(-3)}`}/>
            </>
          )}
        </Timer>
      );
    }
  }

  return (
    <>
    <Navigation />
    <Container fluid className='mt-3'>
      <Row className='justify-content-md-center'>
        <Col md='auto'>
          <h1>
            {getModeName(mode)}
          </h1>
        </Col>
      </Row>
      <Row className='justify-content-md-center'>
        <Col md='auto'>
          <p>
            {getModeDescription(mode)}
          </p>
        </Col>
      </Row>
    </Container>
    <Container fluid>
      <Row className='justify-content-md-center'>
        <Col md='auto'>
          <Card text='dark' className='m-2' style={{ width: '7rem', textAlign: 'center' }}>
            <Card.Header>Score</Card.Header>
            <Card.Body className='p-2'>
              <Card.Title className='my-0'>
                {gameState.score}
              </Card.Title>
            </Card.Body>
          </Card>
        </Col>
        <Col md='auto'>
          <Card text='dark' className='m-2' style={{ width: '7rem', textAlign: 'center' }}>
            <Card.Header>Time</Card.Header>
            <Card.Body className='p-2'>
              <Card.Title className='my-0'>
                {timer(mode)}
              </Card.Title>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className='justify-content-md-center my-3'>
        <Col md='auto'>
          <Container fluid>
            {
              gameState.grid.map((row, rowIndex) => (
                <Row className='justify-content-md-center m-0'>
                  {
                    row.map((tile, colIndex) => (
                      <Col md='auto' className='m-0 p-0'><Tile value={tile} playState={gameState.playState} onClick={() => {
                        playSound(tile);
                        handleClick(rowIndex, colIndex);
                      }}/></Col>
                    ))
                  }
                </Row>
              ))
            }
          </Container>
        </Col>
      </Row>
      <Row className='justify-content-md-center my-3'>
        <Col md='auto'>
          <OverlayTrigger
            placement="right"
            delay={{ show: 250, hide: 400 }}
            overlay={restartButtonTooltip}
          >
            <Button variant="info" onClick={handleRestart} style={{color: 'white'}}>Restart</Button>
          </OverlayTrigger>
        </Col>
      </Row>
    </Container>
    <ScoreSubmission show={showScoreSubmission} onHide={closeScoreSubmission} data={scoreData} />
    </>
  );
}

export default GameView;