import { ReactDOM } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import React from 'react'
import Read from "./Read";
import Update from "./Update";
import Create from "./Create";

function MainApp() {
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Read />} > </Route>
        <Route exact path="/Create" element={<Create />} > </Route>
        <Route exact path="/Edit" element={<Update />} > </Route>        
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default MainApp
