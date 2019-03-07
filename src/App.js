import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import Calendar from "./components/Calendar";


class App extends Component {
  render() {
    return (
      <div className='App'>
        <header>
          <div id="logo">
            <span className="icon">date_range</span>
            <span>
              react<b>calendar</b>
            </span>
          </div>
        </header>
        <div>
          <Calendar/>
        </div>
      </div>
    );
  }
}

export default App;
