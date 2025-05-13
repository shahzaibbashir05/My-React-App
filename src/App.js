import React from 'react';
import './App.css';
import FirstComponent from "./Components/FirstComponent"; 
import VotingWidget from './Components/VotingWidget';

function App() {
  return (
    <div className="App">
      <FirstComponent name="shahzaib" age={21} />
      {/* <VotingWidget /> */}
    </div>
  );
}

export default App;
