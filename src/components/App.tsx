import './App.css';
import {SignIn, SignOut} from './Login';
import {Deck} from './Deck';
import {auth} from '../firebase';
import {useAuthState} from 'react-firebase-hooks/auth';
import * as React from 'react';


const App:React.FunctionComponent = () => {
  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <header>
        {user ? <SignOut/> : <SignIn/>}
      </header>
      <main>
        {user && <Deck/>}
      </main>
    </div>
  );
}

export default App;
