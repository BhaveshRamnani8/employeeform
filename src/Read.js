import { Button } from "@mui/material";
import { Space, Table } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Column from "antd/es/table/Column";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { employeeHubUrl, employeeListUrl } from "./Constants";
import {
  HttpTransportType,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";

function Read(props) {
  const [connection, setConnection] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [employeeData, setEmployeeData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 5;

  const [serverMsg, setServerMsg] = useState([
    {
      id: 0,
      firstName: "",
      lastName: "",
      email: "",
      salary: "",
      hobbies: "",
    },
  ]);

  async function LoadEmployeeData(pageNo) {
    setIsLoading(true);
    await axios
      .get(`${employeeListUrl}?PageNumber=${pageNo}&PageSize=${pageSize}`)
      .then((response) => {
        setEmployeeData(response.data.data);
        setTotalPages(response.data.totalPages);
        setCurrentPage(pageNo);
        setIsLoading(false);
      })
      .catch((error) => console.log(error));
    setServerMsg([]);
  }

  function getTotalPages() {
    return totalPages * parseInt(pageSize);
  }

  function setUpSignalRHub() {
    const hcb = new HubConnectionBuilder()
      .withUrl(employeeHubUrl || "", {
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets,
      })
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build();

    setConnection(hcb);
  }

  useEffect(() => {
    setUpSignalRHub();
  }, []);

  useEffect(() => {
    connection?.start();
  }, [connection]);

  connection?.on("RefreshEmployeeList", (message) => {
    console.log("invoked message");
    setServerMsg(message);
    //setEmployeeData(data => [...data, {message}])
  });

  useEffect(() => {
    LoadEmployeeData(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function displayResponse() {
    console.log(props.response);
    connection?.invoke("RefreshEmployeeList", props.response);
  }
  useEffect(() => {
    if (props.response) {
      setUpSignalRHub();
      displayResponse();
    } else {
      console.log("response not found");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.response]);

  function handleDelete(id) {
    connection.invoke("RefreshEmployeeList", null);
    confirmAlert({
      title: "Delete Employee",
      message: "Are you sure you want to delete this record permanently?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            axios.delete(`${employeeListUrl}/${id}`).then(() => {
              LoadEmployeeData(currentPage);
            });
          },
        },
        {
          label: "No",
        },
      ],
    });
  }
  const newEmpData = (data) => {
    console.log("new emp data" + data);
  };

  return (
    <div className="App">
      <h1>Employee Details</h1>
      <Link to={`/EmployeeForm/0`} onSubmit={newEmpData}>
        <Button variant="contained">Create Employee</Button>
      </Link>
      {serverMsg?.id && <h4>New User Created</h4>}
      {serverMsg?.id && (
        <h5>
          Id: {serverMsg.id}, FirstName:{serverMsg.firstName}, LastName:{" "}
          {serverMsg.lastName}, Email: {serverMsg.email}, Salary:{" "}
          {serverMsg.salary}, Hobbies: {serverMsg.hobbies}
        </h5>
      )}
      {props?.response && <h4>{props.response}</h4>}
      <br /> <br /> <br />
      <Table
        loading={isLoading}
        dataSource={employeeData}
        key="empTable"
        pagination={{
          pageSize: pageSize,
          total: getTotalPages(),
          onChange: (page) => LoadEmployeeData(page),
        }}
      >
        <Column title="Id" dataIndex="id" key="id" />
        <Column title="FirstName" dataIndex="firstName" key="firstName" />
        <Column title="LastName" dataIndex="lastName" key="lastName" />
        <Column title="Email" dataIndex="email" key="email" />
        <Column title="Salary" dataIndex="salary" key="salary" />
        <Column title="Hobbies" dataIndex="hobbies" key="Hobbies" />
        <Column
          title="Action"
          key="action"
          render={(_, record) => (
            <Space size="middle">
              <Link to={`/EmployeeForm/${record.id}`} state={{ data: record }}>
                <Button
                  variant="contained"
                  color="secondary"
                  size="small"
                  key="edit"
                >
                  Edit
                </Button>
              </Link>
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={() => handleDelete(record.id)}
                key="delete"
              >
                Delete
              </Button>
            </Space>
          )}
        />
      </Table>
      <br />
      <br />
    </div>
  );
}

export default Read;
