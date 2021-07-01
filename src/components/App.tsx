import {HamburgerMenu, MenuItem, NavigationMenu} from './Menu';
import {Popup, PopupContext, PopupHandlers} from './Popup';
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
const Trade = React.lazy(() => import('./Trade'));

const Loading:React.FC = () => <h3>Loading...</h3>;

const ContentSelector:React.FC = () => {
  const [user, loading] = useAuthState(auth);
  if (loading) return (<Loading/>);
  if (!user) return (<h1>PLEASE SIGN IN</h1>);
  return (
    <Suspense fallback={<Loading/>}>
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

const App:React.FC = () => {
  const [popupContent, setPopupContent] = React.useState<React.ReactNode>(null);
  const [user, loading] = useAuthState(auth);
  const formFactor = useFormFactor();
  const Menu = formFactor === 'mobile' ? HamburgerMenu : NavigationMenu;
  
  // Memoize so consumers are not always re-rendered.
  const popupContextValue = React.useMemo<PopupHandlers>(() => ({
    dismiss: () => setPopupContent(null),
    show: (node) => setPopupContent(node),
  }), [setPopupContent]);

  return (
    <PopupContext.Provider value={popupContextValue}>
      <div className={styles.App}>
        <header>
          <Menu>
            <MenuItem label="Home" pathname="/"></MenuItem>
            <MenuItem label="Friends" pathname="/friends"></MenuItem>
            <MenuItem label="Deck" pathname="/deck"></MenuItem>
            <MenuItem label="Trade" pathname="/trade"></MenuItem>
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
