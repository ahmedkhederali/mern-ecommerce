import React from "react";
import {BrowserRouter as Router} from "react-router-dom"
import Header from "./components/header/Header";
import MainPage from "./components/mainPage/MainPage";
import {DataProvider} from "./GlobalState"
function App() {
  return (
    <DataProvider>
      <Router>
        <div className="App">
          <Header/>
          <MainPage/>
        </div>
      </Router>
    </DataProvider>
  );
}

export default App;
