import React, { useEffect } from "react";
import {  Router,Routes, Route, useLocation, Navigate } from "react-router-dom";
import './App.css';

import Header from './components/Header';
import SideNav from './components/SideNav';
import Footer from './components/Footer';
import Content from "./Content.js";

function DebugComponent() {
  let location = useLocation();

  useEffect(() => {
    console.log("URL a changé :", location.pathname);
  }, [location]);

  return null; // Ce composant sert juste à afficher l'URL dans la console
}

function App() {
  console.log('App is loaded');
  return (
    <div className="App">
     
        <DebugComponent />
        <Header />
        <SideNav />
        <Content/>
       

        <Footer />
     
    </div>
  );
}

export default App;
