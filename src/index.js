import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import "bootstrap/dist/css/bootstrap.min.css";

import Amplify from "aws-amplify";
import config from "./aws-exports";

Amplify.configure();

ReactDOM.render(<App />, document.getElementById("root"));
registerServiceWorker();
