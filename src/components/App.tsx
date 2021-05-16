import './App.scss';
import {SignIn, SignOut} from './Login';
import {Menu, MenuItem} from './Menu';
import {Deck} from './Deck';
import {Friends} from './Friends';
import {auth} from '../firebase';
import {useAuthState} from 'react-firebase-hooks/auth';
import * as React from 'react';

const ContentSelector:React.FunctionComponent = () => {
  const [user] = useAuthState(auth);
  if (!user) return (<h1>PLEASE SIGN IN</h1>);
  switch (window.location.pathname) {
    case '/':
      return (<h3>HOME</h3>);
    case '/friends':
      return (<Friends/>);
    case '/deck':
      return (<Deck/>);
    case '/trade':
      return (<h3>TRADE</h3>);
    default:
      return (<h3>UNKOWN LOCATION</h3>)
  }
}


const App:React.FunctionComponent = () => {
  const [user] = useAuthState(auth);
  return (
    <div className="App">
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
