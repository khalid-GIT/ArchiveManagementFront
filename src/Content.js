import React, {} from "react";
import {  Router,Routes, Route, useLocation, Navigate } from "react-router-dom";
import TableTree from './components/TableTree.js'
import Home from './components/Home.js'


function Content(){
return (
  
   
       <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/TableTree" element={<TableTree />} />
          <Route path="*" element={<Navigate to="/" />} /> {/* Redirection pour les routes inconnues */}
     
      </Routes>
  
  )
}
export default Content;