import styles from './App.module.scss';
import {SignIn, SignOut} from './Login';
import {Menu, MenuItem} from './Menu';
import {Deck} from './Deck';
import {Friends} from './Friends';
import {auth} from '../firebase';
import {useAuthState} from 'react-firebase-hooks/auth';
import * as React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

const Home: React.FunctionComponent = () => {
  return (
    <h3>HOME</h3>
  );
}

const Trade: React.FunctionComponent = () => {
  return (
    <h3>TRADE</h3>
  );
}

const ContentSelector:React.FunctionComponent = () => {
  const [user] = useAuthState(auth);
  if (!user) return (<h1>PLEASE SIGN IN</h1>);
  return (
    <Switch>
      <Route exact path='/' component={Home} />
      <Route path='/friends' component={Friends} />
      <Route path='/deck' component={Deck} />
      <Route path='/trade' component={Trade} />
      <Redirect to='/' />
    </Switch>
  );
}


const App:React.FunctionComponent = () => {
  const [user] = useAuthState(auth);
  return (
    <div className={styles.App}>
      <header>
        <Menu>
          <MenuItem label="Home" href="/"></MenuItem>
          <MenuItem label="Friends" href="/friends"></MenuItem>
          <MenuItem label="Deck" href="/deck"></MenuItem>
          <MenuItem label="Trade" href="/trade"></MenuItem>
        </Menu>        
        {user ? <SignOut/> : <SignIn/>}
      </header>
      <main>
        <ContentSelector/>
      </main>
    </div>
  );
}

export default App;
