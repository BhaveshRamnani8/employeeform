import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import React, { useState } from 'react'
import Read from "./Read";
import EmployeeForm from "./EmployeeForm";

function MainApp() {

  const [response, setResponse] = useState("");
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Read response={response}/>} > </Route>        
        <Route exact path="/EmployeeForm/:id" element={<EmployeeForm setResponse={setResponse} />} > </Route>
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default MainApp
