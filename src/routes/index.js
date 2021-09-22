import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./home";
const App = ({ match }) => (
  <div>
    <Switch>
      <Route path={`${match.url}`} component={Home} />
    </Switch>
  </div>
);

export default App;
