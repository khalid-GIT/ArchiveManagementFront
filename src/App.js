import React, { useEffect } from "react";

import './App.css';

import Header from './components/Header.js';
import SideNav from './components/SideNav';
import Footer from './components/Footer';
import Content from "./Content.js";


// function DebugComponent() {
//   let location = useLocation();

//   useEffect(() => {
//     console.log("URL a changé :", location.pathname);
//   }, [location]);

//   return null; // Ce composant sert juste à afficher l'URL dans la console
// }

function App() {
  console.log('App is loaded');
  return (
  
    <div className="container-fluid mon-div">
    <div className="row">
        {/* Menu des dossiers */}
        <div className="col-md-2 ">
         
              <SideNav />
              </div>
              <div className="col-md-10 ">
          <Header /> 
          <Content />  
                  
              <Footer />
        </div>
          </div>
        
          </div>
      
   
  );
}

export default App;
