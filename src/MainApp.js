import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import React from 'react'
import Read from "./Read";
import EmployeeForm from "./EmployeeForm";

function MainApp() {
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Read />} > </Route>        
        <Route exact path="/EmployeeForm/:id" element={<EmployeeForm />} > </Route>
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default MainApp
