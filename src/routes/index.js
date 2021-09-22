import React from "react";
import { Route, Switch } from "react-router-dom";
import List from "./list";
const App = ({ match }) => (
  <div>
    <Switch>
      <Route path={`${match.url}`} component={List} />
    </Switch>
  </div>
);

export default App;
