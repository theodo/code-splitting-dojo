import React, { Component, Fragment } from "react";
import { BrowserRouter, NavLink, Route, Switch } from "react-router-dom";
import { Home, Graph, Random } from "./components";
import Highlight from "./components/Highlight";

import "./App.css";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Fragment>
          <header className="App__header">
            <div className="App__header__title">
              Code splitting dojo <Random />
            </div>
            <div className="App__header__links">
              <NavLink
                activeClassName="App__header__link__selected"
                className="App__header__link"
                exact
                to="/"
              >
                Home
              </NavLink>
              <NavLink
                activeClassName="App__header__link__selected"
                className="App__header__link"
                exact
                to="/graph"
              >
                Graph
              </NavLink>
              <NavLink
                activeClassName="App__header__link__selected"
                className="App__header__link"
                exact
                to="/highlight"
              >
                Highlight
              </NavLink>
            </div>
          </header>
          <div className="App__body">
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/graph" component={Graph} />
              <Route exact path="/highlight" component={Highlight} />
            </Switch>
          </div>
        </Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
