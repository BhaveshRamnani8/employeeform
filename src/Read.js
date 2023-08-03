import { Button } from "@mui/material";
import { Space, Table } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Column from "antd/es/table/Column";

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

  return (
    <div className="App">
      <h1>Employee Details</h1>
      <Button variant="contained" onClick={onCreateClick}>
        Create Employee
      </Button>
      <br />
      <br />
      <br />
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
              <Link to="/edit" state={{ data: record }}>
                <Button variant="contained" color="secondary" size="small" key="edit">
                  Edit
                </Button>
              </Link>
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={() => handleDelete(record.id)}
                key= "delete"
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
