import React, { useState, useEffect } from "react"
import Home from "./pages/Home"
import Favorite from "./pages/Favorite"
import Watchlist from "./pages/Watchlist"
import RandomSearch from "./pages/RandomSearch"
import { Redirect, Route } from "react-router-dom"
import {
  IonApp,
  IonIcon,
  IonItem,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonToggle,
  setupIonicReact,
} from "@ionic/react"
import { IonReactRouter } from "@ionic/react-router"
import { ListProvider } from "./components/Lists"
import { eye, home, library, shuffle } from "ionicons/icons"

import "@ionic/react/css/core.css"

import "@ionic/react/css/normalize.css"
import "@ionic/react/css/structure.css"
import "@ionic/react/css/typography.css"

import "@ionic/react/css/padding.css"
import "@ionic/react/css/float-elements.css"
import "@ionic/react/css/text-alignment.css"
import "@ionic/react/css/text-transformation.css"
import "@ionic/react/css/flex-utils.css"
import "@ionic/react/css/display.css"
import './theme/variables.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

//import '@ionic/react/css/palettes/dark.always.css';
//import '@ionic/react/css/palettes/dark.class.css';


/* Theme variables */
import Details from "./pages/Details"
import { useTranslation } from "react-i18next"
import SplashScreen from "./components/SplashScreen"


setupIonicReact()

const App: React.FC = () => {
  const { t } = useTranslation()

  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem("theme");
    if (savedMode === "dark") {
      setDarkMode(true);
      document.body.classList.add("dark");
    } else {
      setDarkMode(false);
      document.body.classList.remove("dark");
    }
  }, []);

  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  if (showSplash) {
    return <SplashScreen />
  }

  return (
    <IonApp>
      <IonReactRouter>
        <ListProvider>
          <IonTabs>
            <IonRouterOutlet>
              <Route exact path="/home" component={Home} />
              <Route exact path="/movies/:id" component={Details} />
              <Route exact path="/favorite" component={Favorite} />
              <Route exact path="/watchlist" component={Watchlist} />
              <Route exact path="/random" component={RandomSearch} />
              <Route exact path="/">
                <Redirect to="/home" />
              </Route>
            </IonRouterOutlet>
            <IonTabBar slot="bottom">
              <IonTabButton tab="home" href="/home">
                <IonIcon icon={home} />
                <IonLabel>{t("home")}</IonLabel>
              </IonTabButton>
              <IonTabButton tab="Favorite" href="/favorite">
                <IonIcon icon={library} />
                <IonLabel>{t("favorites")}</IonLabel>
              </IonTabButton>
              <IonTabButton tab="watchlist" href="/watchlist">
                <IonIcon icon={eye} />
                <IonLabel>{t("watchlist")}</IonLabel>
              </IonTabButton>
              <IonTabButton tab="random" href="/random">
                <IonIcon icon={shuffle} />
                <IonLabel>{t("random")}</IonLabel>
              </IonTabButton>
            </IonTabBar>
          </IonTabs>
        </ListProvider>
      </IonReactRouter>
    </IonApp>
  )
}

export default App
