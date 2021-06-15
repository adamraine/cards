import {Menu, MenuItem} from './Menu';
import React, {Suspense} from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import {SignIn, SignOut} from './Login';
import {auth} from '../firebase';
import styles from './App.module.scss';
import {useAuthState} from 'react-firebase-hooks/auth';

const Deck = React.lazy(() => import('./Deck'));
const Home = React.lazy(() => import('./Home'));
const Friends = React.lazy(() => import('./Friends'));

const Trade: React.FunctionComponent = () => {
  return (
    <h3>TRADE</h3>
  );
};

const ContentSelector:React.FunctionComponent = () => {
  const [user, loading] = useAuthState(auth);
  if (loading) return (<></>);
  if (!user) return (<h1>PLEASE SIGN IN</h1>);
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        <Route exact path='/' component={Home} />
        <Route path='/friends' component={Friends} />
        <Route path='/deck' component={Deck} />
        <Route path='/trade' component={Trade} />
        <Redirect to='/' />
      </Switch>
    </Suspense>
  );
};

const Icon:React.FunctionComponent = () => {
  return (
    <img
      src={"..\\..\\public\\logo_transparent.svg"}
      style={{
        width: 80,
        height: 80,
        marginRight: -25 
      }}
    />
  );
}

const App:React.FunctionComponent = () => {
  const [user, loading] = useAuthState(auth);
  return (
    <div className={styles.App}>
      <header>
        <Icon />
        <Menu>
          <MenuItem label="Home" href="/"></MenuItem>
          <MenuItem label="Friends" href="/friends"></MenuItem>
          <MenuItem label="Deck" href="/deck"></MenuItem>
          <MenuItem label="Trade" href="/trade"></MenuItem>
        </Menu>        
        {
          loading ?
            undefined :
            user ? <SignOut/> : <SignIn/>
        }
      </header>
      <main>
        <ContentSelector/>
      </main>
      <footer>Copyright © 2021 Adam Raine</footer>
    </div>
  );
};

export default App;
