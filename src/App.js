import "./App.css";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { InboxOutlined, UploadOutlined } from "@ant-design/icons";
import {
  Label,
  Input,
  Form,
  Button,
  Radio,
  Checkbox,
  Select,
  DatePicker,
  Upload,
  InputNumber,
  message,
} from "antd";
import { Option } from "antd/es/mentions";
import TextArea from "antd/es/input/TextArea";
import Password from "antd/es/input/Password";

const buttonLayout = {
  wrapperCol: {
    offset: 10,
    span: 16,
  },
};

function EmployeeForm() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const getCountryData = [
    {
      Name: "India",
      States: [
        {
          Name: "Gujarat",
          Cities: ["Ahemdabad", "Surat", "Vadodara"],
        },
        {
          Name: "Maharashtra",
          Cities: ["Mumbai", "Pune", "Thane"],
        },
      ],
    },
    {
      Name: "USA",
      States: [
        {
          Name: "California",
          Cities: ["Los Angeles", "New York"],
        },
      ],
    },
    {
      Name: "England",
      States: [
        {
          Name: "Birmington",
          Cities: ["Lords", "Baga", "Oval"],
        },
      ],
    },
  ];

  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);  
  
  const onCountryChange = (value) => {    
    setCountry(value);
    setStates(getCountryData.find((country) => country.Name === value).States);    
  };
  const onStateChange = (value) => {        
    setState(value);
    setCities(states.find((state) => state.Name === value).Cities);
  };
  const onCityChange = (value) => {
    setCity(value);
  }

  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log(values);
  };
  const onReset = () => {
    form.resetFields();
  };
  const fillDumyValues = () => {
    form.setFieldsValue({
      firstname: "Sachin",
      lastname: "Tendulkar",
      email: "tendulkar100@gmail.com",
      gender: "0",
    });
  };

  return (
    <div className="employee-form">      
      <Form
        form={form}
        onFinish={onFinish}
        autoComplete="off"
        labelCol={{
          span: 8,
        }}
        layout="horizontal"
        style={{
          maxWidth: 500,
        }}
      >
        <Form.Item label="Employee Form "></Form.Item>
        <Form.Item
          label="First Name :"
          name="firstname"
          rules={[
            {
              required: true,
              message: "Please fill First Name",
              whitespace: true,
            },
          ]}
        >
          <Input placeholder="Enter your First Name" />
        </Form.Item>

        <Form.Item
          label="Last Name :"
          name="lastname"
          rules={[
            {
              required: true,
              message: "Please fill Last Name",
            },
          ]}
        >
          <Input placeholder="Enter your Last Name" />
        </Form.Item>

        <Form.Item
          label="Email :"
          name="email"
          rules={[
            {
              required: true,
              message: "Please enter your email",
            },
            {
              type: "email",
              message: "Email is not valid",
            },
          ]}
          hasFeedback
        >
          <Input placeholder="Enter your Email" />
        </Form.Item>

        <Form.Item label="Gender :" name="gender">
          <Radio.Group>
            <Radio value="0">Male</Radio>
            <Radio value="1">Female</Radio>
            <Radio value="2">Other</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="Are you married ?" name="relationShipStatus">
          <Checkbox />
        </Form.Item>

        <Form.Item label="Birth Date :" name="birthDate">
          <DatePicker />
        </Form.Item>

        <Form.Item name="hobbies" label="Hobbies :">
          <Select mode="multiple" placeholder="Please select your Hobbie">
            <Select.Option value="singing">Singing</Select.Option>
            <Select.Option value="reading">Reading</Select.Option>
            <Select.Option value="coding">Coding</Select.Option>
            <Select.Option value="surfing">Surfing</Select.Option>
            <Select.Option value="dancing">Dancing</Select.Option>
          </Select>
        </Form.Item>       

        <Form.Item label="Salary :">
          <InputNumber min={5000} style={{ width: 100 }} />
        </Form.Item>

        <Form.Item label="Address :" name="address">
          <TextArea rows={3} maxLength={100} />
        </Form.Item>
          
        <Form.Item label="Country :" name="country" >
          <Select
          onChange={onCountryChange}
            placeholder="Select your Country"
            value={country}
                 
          >
            {
              getCountryData.map((country, index) => (
                <Select.Option value={country.Name} key={index}>{country.Name}</Select.Option>
              ))
            }
          </Select>
        </Form.Item>

        <Form.Item label="State :" name="state">
          <Select placeholder="Select your State" value={state} onChange= {onStateChange} >
            {
              states.map((state) => (
                <Select.Option value={state.Name}>{state.Name}</Select.Option>
              ))
            }
          </Select>
        </Form.Item>

        <Form.Item label="City :" name="city">
          <Select placeholder="Select your City" value={city} onChange={onCityChange}>
            {
              cities.map((city) => (
                <Select.Option value={city}>{city}</Select.Option>
              ))
            }
          </Select>
        </Form.Item>

        <Form.Item label="Pincode :" name="pincode">
          <Input maxLength={6} />
        </Form.Item>

        <Form.Item
          label="Password :"
          name="password"
          rules={[
            {
              message: "Password is incorrect",
            },
          ]}
        >
          <Password maxLength={16} minLength={8}></Password>
        </Form.Item>

        <Form.Item {...buttonLayout}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          <Button type="button" onClick={onReset}>
            Reset
          </Button>
          <Button type="link" htmlType="button" onClick={fillDumyValues}>
            Fill Form
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default EmployeeForm;
