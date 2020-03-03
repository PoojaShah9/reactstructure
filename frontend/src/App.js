import React from 'react';
import './App.css';
import {BrowserRouter, Route} from 'react-router-dom';
import { Login } from './component/login/login';
import {Register} from "./component/registration/register";
import {Dashboard} from "./component/dashboard/dashboard";

function App() {
  return (
      <div className="App">
        <header className="App-header">
          <BrowserRouter>
            <Route path="/" exact component={Login} />
            <Route path="/register" exact component={Register} />
            <Route path="/dashboard" exact component={Dashboard} />
          </BrowserRouter>
        </header>
      </div>
  );
}

export default App;
