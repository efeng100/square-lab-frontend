import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import Home from './routes/Home';
import GameView from './routes/GameView';
import Profile from './routes/Profile';

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path='/game/:mode/:size' component={GameView} />
        <Route exact path='/profile'>
					{
						localStorage.getItem('user_id') === null ?
						<Redirect to="/" /> :
						<Profile />
					}
				</Route>
				<Route path='/' component={Home} />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;