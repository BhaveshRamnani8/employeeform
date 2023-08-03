import { Button } from "@mui/material";
import { alignProperty } from "@mui/material/styles/cssUtils";
import { Col, Divider, Row, Space, Table } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import { Link, NavLink } from "react-router-dom";
import Column from "antd/es/table/Column";
import { render } from "@testing-library/react";

function Read() {
  const navigate = useNavigate();
  const onCreateClick = () => {
    navigate("/Create");
  };

  const [employeeData, setEmployyeData] = useState([]);

  function getData() {
    axios
      .get("https://localhost:7087/api/Employee")
      .then((response) => setEmployyeData(response.data))
      .catch((error) => console.log(error));
  }
  useEffect(() => {
    getData();
  }, []);
  

  function handleDelete(id) {
    axios.delete(`https://localhost:7087/api/Employee/${id}`).then(() => {
      getData();
    });
  }

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

  return (
    <div className="App">
      <h1>Employee Details</h1>
      <Button variant="contained" onClick={onCreateClick}>
        Create Employee
      </Button>
      <br />
      <br />
      <br />
      <Table dataSource={employeeData}>
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
              <Link to="/edit" state={{ data: record }}>
                <Button variant="contained" color="secondary" size="small">
                  Edit
                </Button>
              </Link>
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={() => handleDelete(record.id)}
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
