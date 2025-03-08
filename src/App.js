import React, {} from "react";
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import SideNav from './components/SideNav';

import Footer from './components/Footer';
import Content from './Content.js';

function App() {
  return (
    <div className="App">
    <Router>
        <Header/>
        <Home/>
        <SideNav/>
        <Footer/>
        
        <Content/>
        
      </Router>
            </div>
  );
}

export default App;
