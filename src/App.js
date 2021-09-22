import logo from "./logo.png";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import Routes from "./routes/index";
import { Route, Switch, BrowserRouter } from "react-router-dom";

// you should feel free to reorganize the code however you see fit
// including creating additional folders/files and organizing your
// components however you would like.

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1 className="App-title">React Programming Exercise</h1>
      </header>
      <section className="container">
        <BrowserRouter>
          <Route path="/" component={Routes} />
        </BrowserRouter>
      </section>
    </div>
  );
}

export default App;
