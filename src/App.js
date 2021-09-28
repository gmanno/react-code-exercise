import logo from "./logo.png";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import Routes from "./routes/index";
import { Route, BrowserRouter } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1 className="App-title"></h1>
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
