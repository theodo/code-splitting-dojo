import React, { Component, Fragment, lazy, Suspense } from "react";
import { BrowserRouter, NavLink, Route, Switch } from "react-router-dom";
import Random from "./components/Random";
import "./App.css";

const Home = lazy(() => import("./components/Home"));
const Graph = lazy(() => import("./components/Graph"));
const Highlight = lazy(() => import("./components/Highlight"));

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
              <Suspense fallback={null}>
                <Route exact path="/" component={Home} />
                <Route exact path="/graph" component={Graph} />
                <Route exact path="/highlight" component={Highlight} />
              </Suspense>
            </Switch>
          </div>
        </Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
