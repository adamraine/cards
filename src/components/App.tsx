import {HamburgerMenu, MenuItem, NavigationMenu} from './Menu';
import {Popup, PopupContext} from './Popup';
import React, {Suspense} from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import {SignIn, SignOut} from './Login';
import {auth} from '../firebase';
import styles from './App.module.scss';
import {useAuthState} from 'react-firebase-hooks/auth';
import {useFormFactor} from '../hooks';

const Deck = React.lazy(() => import('./Deck'));
const Home = React.lazy(() => import('./Home'));
const Friends = React.lazy(() => import('./Friends'));

const Trade: React.FunctionComponent = () => {
  return (
    <PopupContext.Consumer>
      {value => {
        return <button onClick={() => {
          value.show(<h1>HELLO</h1>);
        }}>CLIK</button>;
      }}
    </PopupContext.Consumer>
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

const App:React.FunctionComponent = () => {
  const [popupContent, setPopupContent] = React.useState<React.ReactNode>(null);
  const [user, loading] = useAuthState(auth);
  const formFactor = useFormFactor();
  const Menu = formFactor === 'mobile' ? HamburgerMenu : NavigationMenu;
  return (
    <PopupContext.Provider value={{
      dismiss: () => setPopupContent(null),
      show: (node) => setPopupContent(node),
    }}>
      <div className={styles.App}>
        <header>
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
        <Popup>{popupContent}</Popup>
      </div>
    </PopupContext.Provider>
  );
};

export default App;
