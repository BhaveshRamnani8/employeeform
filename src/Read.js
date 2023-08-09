import { Button } from "@mui/material";
import { Space, Table } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Column from "antd/es/table/Column";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { employeeListUrl } from "./Constants";

function Read({ response, setResponse }) {
  const [isLoading, setIsLoading] = useState(false);
  const [employeeData, setEmployeeData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 5;

  async function LoadEmployeeData(pageNo) {
    setIsLoading(true);
    await axios
      .get(`${employeeListUrl}?PageNumber=${pageNo}&PageSize=${pageSize}`)
      .then((response) => {
        setEmployeeData(response.data.data);
        setTotalPages(response.data.totalPages);
        setCurrentPage(pageNo);
        setIsLoading(false);
        setResponse([]);
      })
      .catch((error) => console.log(error));
  }

  function getTotalPages() {
    return totalPages * parseInt(pageSize);
  }

  useEffect(() => {
    LoadEmployeeData(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      {response?.id && <h4>New Employee Created</h4>}
      {response?.id && (
        <h5>
          Id: {response.id}, FirstName:{response.firstName}, LastName:{" "}
          {response.lastName}, Email: {response.email}, Salary:{" "}
          {response.salary}, Hobbies: {response.hobbies}
        </h5>
      )}
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
