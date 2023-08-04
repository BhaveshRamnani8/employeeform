import { Button } from "@mui/material";
import { Space, Table } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Column from "antd/es/table/Column";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { employeeListUrl } from "./Constants";

function Read() {
  const [employeeData, setEmployeeData] = useState([]);

  function LoadEmployeeData() {
    axios
      .get(employeeListUrl)
      .then((response) => setEmployeeData(response.data))
      .catch((error) => console.log(error));
  }

  useEffect(() => {
    LoadEmployeeData();
  }, []);

  function handleDelete(id) {
    confirmAlert({
      title: "Delete Employee",
      message: "Are you sure you want to delete this record permanently?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            axios.delete(`${employeeListUrl}/${id}`).then(() => {
              LoadEmployeeData();
            });
          },
        },
        {
          label: "No",
        },
      ],
    });
  }

  return (
    <div className="App">
      <h1>Employee Details</h1>
      <Link to={`/EmployeeForm/0`}>
        <Button variant="contained">Create Employee</Button>
      </Link>
      <br /> <br /> <br />
      <Table dataSource={employeeData} key="empTable">
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
