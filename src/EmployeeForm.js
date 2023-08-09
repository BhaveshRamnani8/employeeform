import "./App.css";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import TextField from "@mui/material/TextField";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import Button from "@mui/material/Button";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Checkbox } from "@mui/material";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  employeeListUrl,
  countryListUrl,
  stateListUrl,
  cityListUrl,
  hobbiesList,
} from "./Constants";

export default function EmployeeForm({ sendMessage }) {
  const [employeeData, setEmployeeData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    gender: "",
    maritalStatus: false,
    birthDate: null,
    hobbies: "",
    salary: "",
    address: "",
    countryId: 0,
    stateId: 0,
    cityId: 0,
    zipCode: "",
    password: "",
  });

  const [birthDate, setBirthDate] = useState(null);
  const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [hobby, setHobby] = useState([]);
  const menuProps = {
    PaperProps: {
      style: {
        maxHeight: 225,
        width: 2500,
      },
    },
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isNewEmployee = id === "0";

  useEffect(() => {
    if (!isNewEmployee) {
      const formData = location?.state?.data;
      Object.keys(formData).forEach(function (key) {
        setValue(key, formData[key]);
      });
      setEmployeeData(location.state?.data);
      setHobby(location.state?.data?.hobbies.split(","));
      setBirthDate(dayjs(new Date(location.state?.data?.birthDate)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    axios
      .get(countryListUrl)
      .then((response) => setCountryList(response.data))
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    if (employeeData.countryId !== 0) {
      axios
        .get(stateListUrl + employeeData.countryId)
        .then((response) => setStateList(response.data))
        .catch((error) => console.log(error));
    }
  }, [employeeData.countryId]);

  useEffect(() => {
    if (employeeData.stateId !== 0) {
      axios
        .get(cityListUrl + employeeData.stateId)
        .then((response) => setCityList(response.data))
        .catch((error) => console.log(error));
    }
  }, [employeeData.stateId]);

  const onFormDataChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    if (name === "maritalStatus") {
      setEmployeeData((prevValues) => {
        return { ...prevValues, [name]: event.target.checked };
      });
    } else if (name === "birthDate") {
      setEmployeeData((prevValues) => {
        return { ...prevValues, [name]: dayjs(event.target.value) };
      });
    } else {
      setEmployeeData((prevValues) => {
        return { ...prevValues, [name]: value };
      });
    }

    if (name === "countryId") {
      setCityList([]);
      setEmployeeData((prevValues) => {
        return { ...prevValues, stateId: "" };
      });
    }

    if (name === "stateId") {
      setEmployeeData((prevValues) => {
        return { ...prevValues, cityId: "" };
      });
    }
  };

  const onSubmit = async () => {
    const empData = {
      id: id,
      firstName: employeeData.firstName,
      lastName: employeeData.lastName,
      email: employeeData.email,
      gender: employeeData.gender,
      maritalStatus: employeeData.maritalStatus === true ? 1 : 0,
      birthDate: birthDate,
      hobbies: hobby.toString(),
      salary: employeeData.salary,
      address: employeeData.address,
      countryId: employeeData.countryId,
      stateId: employeeData.stateId,
      cityId: employeeData.cityId,
      zipCode: employeeData.zipCode,
      password: employeeData.password,
    };

    if (isNewEmployee) {
      await axios.post(employeeListUrl, empData).then((response) => {
        sendMessage(response.data);
        navigate("/");
      });
    } else {
      await axios.put(`${employeeListUrl}/${id}`, empData).then(() => {
        navigate("/");
      });
    }
  };

  const onBackClick = () => {
    navigate("/");
  };

  return (
    <form
      className="App"
      onSubmit={handleSubmit(onSubmit)}
      autoComplete="off"
      layout="horizontal"
      spacing={2}
      style={{
        maxWidth: 800,
      }}
    >
      <h2>{isNewEmployee ? "Create" : "Edit"} Employee</h2>
      <InputLabel id="name">
        First Name :
        <Input
          placeholder="Enter First Name"
          variant="outlined"
          {...register("firstName", { required: "required message" })}
          onChange={onFormDataChange}
        />
      </InputLabel>
      {errors?.firstName?.type === "required" && (
        <p className="error">Please fill First Name</p>
      )}

      <InputLabel id="lastName" required>
        Last Name :
        <Input
          placeholder="Enter Last Name"
          variant="outlined"
          value={employeeData.lastName}
          {...register("lastName", { required: true })}
          onChange={onFormDataChange}
        />
      </InputLabel>
      {errors?.lastName?.type === "required" && (
        <p className="error">Please fill Last Name</p>
      )}

      <InputLabel required>
        E-mail :
        <Input
          placeholder="Enter email"
          variant="outlined"
          {...register("email", {
            required: true,
            pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          })}
          value={employeeData.email}
          onChange={onFormDataChange}
        />
      </InputLabel>
      {errors?.email?.type === "required" && (
        <p className="error">Please fill Email</p>
      )}
      {errors?.email?.type === "pattern" && (
        <p className="error">Email is invalid</p>
      )}

      <InputLabel id="gender">
        Gender :
        <RadioGroup
          row
          name="gender"
          {...register("gender")}
          onChange={onFormDataChange}
          value={employeeData.gender}
        >
          <FormControlLabel value="m" control={<Radio />} label="Male" />
          <FormControlLabel value="f" control={<Radio />} label="Female" />
          <FormControlLabel value="o" control={<Radio />} label="Other" />
        </RadioGroup>
      </InputLabel>

      <InputLabel id="maritalStatus">
        Are you Married ?
        <Checkbox
          checked={employeeData.maritalStatus}
          value={employeeData.maritalStatus}
          {...register("maritalStatus")}
          onChange={onFormDataChange}
        />
      </InputLabel>

      <InputLabel id="birthDate">
        Birth Date :
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            maxDate={dayjs().subtract(18, "year")}
            views={["year", "month", "day"]}
            slotProps={{ textField: { size: "small" } }}
            value={birthDate}
            {...register("birthDate")}
            onChange={(newValue) => setBirthDate(newValue)}
            //onChange= {onDataChange}
          />
        </LocalizationProvider>
      </InputLabel>

      <InputLabel id="hobbies">
        Hobbies :
        <Select
          MenuProps={menuProps}
          size="small"
          multiple
          {...register("hobbies")}
          style={{ minWidth: "300px", height: "30px" }}
          onChange={(e) => setHobby(e.target.value)}
          placeholder="Select your Hobbies"
          value={hobby}
          //onChange={onDataChange}
        >
          {hobbiesList.map((name) => (
            <MenuItem key={name} value={name}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </InputLabel>

      <InputLabel id="salary">
        Salary :
        <Input
          type="number"
          placeholder="Enter salary"
          variant="standard"
          {...register("salary")}
          value={employeeData.salary}
          onChange={onFormDataChange}
        />
      </InputLabel>

      <InputLabel>
        Address :
        <TextField
          id="address"
          label=""
          multiline
          rows={3}
          size="small"
          placeholder="Enter address"
          value={employeeData.address}
          {...register("address")}
          onChange={onFormDataChange}
        />
      </InputLabel>

      <InputLabel id="countryId">
        Country :
        <Select
          {...register("countryId")}
          placeholder="Select your Country"
          style={{ minWidth: "300px", height: "30px" }}
          value={employeeData.countryId}
          onChange={onFormDataChange}
        >
          {countryList.map((country, index) => (
            <MenuItem value={country.id} key={country.id}>
              {country.name}
            </MenuItem>
          ))}
        </Select>
      </InputLabel>

      <InputLabel>
        State :
        <Select
          {...register("stateId")}
          style={{ minWidth: "300px", height: "30px" }}
          value={employeeData.stateId}
          onChange={onFormDataChange}
        >
          {stateList.map((state, index) => (
            <MenuItem value={state.id} key={state.id}>
              {state.name}
            </MenuItem>
          ))}
        </Select>
      </InputLabel>

      <InputLabel>
        City :
        <Select
          {...register("cityId")}
          style={{ minWidth: "300px", height: "30px" }}
          value={employeeData.cityId}
          onChange={onFormDataChange}
        >
          {cityList.map((city, index) => (
            <MenuItem value={city.id} key={city.id}>
              {city.name}
            </MenuItem>
          ))}
        </Select>
      </InputLabel>

      <InputLabel>
        Zip Code :
        <Input
          type="number"
          maxLength={6}
          value={employeeData.zipCode}
          {...register("zipCode", { type: "number" })}
          onChange={onFormDataChange}
        />
      </InputLabel>

      <InputLabel>
        Password :
        <Input
          placeholder="Enter password"
          variant="outlined"
          value={employeeData.password}
          type="password"
          {...register("password", {
            pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/,
          })}
          onChange={onFormDataChange}
        />
      </InputLabel>
      {errors?.password?.type === "pattern" && (
        <p className="error">Password is invalid</p>
      )}

      <Button type="submit" variant="contained" onClick={handleSubmit}>
        {isNewEmployee ? "Save" : "Update"}
      </Button>
      <Button variant="contained" onClick={onBackClick}>
        Back
      </Button>
    </form>
  );
}
