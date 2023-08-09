import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import React, { useEffect, useState } from "react";
import Read from "./Read";
import EmployeeForm from "./EmployeeForm";
import {
  HttpTransportType,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import { employeeHubUrl } from "./Constants";

function MainApp() {
  const [response, setResponse] = useState([]);
  const [connection, setConnection] = useState(null);

  useEffect(() => {
    const connection = new HubConnectionBuilder()
      .withUrl(employeeHubUrl || "", {
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets,
      })
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build();

    setConnection(connection);
  }, []);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          connection.on("ReceiveMessage", (empData) => {
            setResponse(empData);
          });
        })
        .catch((error) => console.log(error));
    }
  }, [connection]);

  const sendMessage = async (empData) => {
    console.log("sending message");
    console.log(empData);
    if (connection) {
      await connection.invoke("SendMessage", empData);
      setResponse([]);
    }
  };

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route
            exact
            path="/"
            element={<Read response={response} setResponse={setResponse} />}
          >
            {" "}
          </Route>
          <Route
            exact
            path="/EmployeeForm/:id"
            element={<EmployeeForm sendMessage={sendMessage} />}
          >
            {" "}
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default MainApp;
