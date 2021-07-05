import {auth, UserContext} from '../firebase';
import {HamburgerMenu, MenuItem, NavigationMenu} from './Menu';
import {Popup, PopupContext, PopupHandlers} from './Popup';
import React, {Suspense} from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import {Login} from './Login';
import styles from './App.module.scss';
import {useAuthState} from 'react-firebase-hooks/auth';
import {useFormFactor} from '../hooks';

const Deck = React.lazy(() => import('./Deck'));
const Home = React.lazy(() => import('./Home'));
const Friends = React.lazy(() => import('./Friends'));
const Trade = React.lazy(() => import('./Trade'));

const Loading:React.FC = () => <h3>Loading...</h3>;

const ContentSelector:React.FC = () => {
  return (
    <Suspense fallback={<Loading/>}>
      <Switch>
        <Route exact path='/'><Home/></Route>
        <Route path='/friends'><Friends/></Route>
        <Route path='/deck'><Deck/></Route>
        <Route path='/trade'><Trade/></Route>
        <Redirect to='/'/>
      </Switch>
    </Suspense>
  );
};

const App:React.FC = () => {
  const [popupContent, setPopupContent] = React.useState<React.ReactNode>(null);

  const [user, loading] = useAuthState(auth);
  const userContextValue = React.useMemo(() => user ? ({user}) : undefined, [user]);

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
            <MenuItem label="Home" pathname="/"/>
            <MenuItem label="Friends" pathname="/friends"/>
            <MenuItem label="Deck" pathname="/deck"/>
            <MenuItem label="Trade" pathname="/trade"/>
          </Menu>        
          <Login/>
        </header>
        {userContextValue ? 
          <UserContext.Provider value={userContextValue}>
            <main>
              <ContentSelector/>
            </main>
            <footer>Copyright © 2021 Adam Raine</footer>
            <Popup>{popupContent}</Popup>
          </UserContext.Provider> :
          loading ? <Loading/> : <h1>PLEASE SIGN IN</h1>
        }
      </div>
    </PopupContext.Provider>
  );
};

export default App;
