import React from 'react';
import {ClayIconSpriteContext} from "@clayui/icon"
import {HashRouter as Router, Route, Switch} from 'react-router-dom';

import {ApiContextProvider} from './context/ApiContext';
import Frontpage from "./pages/Frontpage";

function App() {
    const spritemap = process.env.PUBLIC_URL +'/assets/clay/icons.svg';

    return (
        <ApiContextProvider>
            <ClayIconSpriteContext.Provider value={spritemap}>
                <Router>
                    <Switch>
                        <Route path="/" exact>
                            <Frontpage/>
                        </Route>
                        <Route path='/category/:id'>
                            <Frontpage/>
                        </Route>
                    </Switch>
                </Router>
            </ClayIconSpriteContext.Provider>
        </ApiContextProvider>
    );
}

export default App;
