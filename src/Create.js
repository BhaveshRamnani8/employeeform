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
import { useNavigate } from "react-router";

export default function Create() {
  const [data, setDataValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    gender: "",
    maritalStatus: false,
    birthDate: null,
    hobbies: "",
    salary: "",
    address: "",
    countryId: "",
    stateId: 0,
    cityId: 0,
    zipCode: "",
    password: "",
  });

  const onDataChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    if (name === "maritalStatus") {
      setDataValues((prevValues) => {
        return { ...prevValues, [name]: event.target.checked };
      });
    } else if (name === "birthDate") {
      setDataValues((prevValues) => {
        return { ...prevValues, [name]: dayjs(event.target.value) };
      });
    } else {
      setDataValues((prevValues) => {
        return { ...prevValues, [name]: value };
      });
    }

    if (name === "countryId") {
      setCityList([]);
      setDataValues((prevValues) => {
        return { ...prevValues, stateId: "" };
      });
    }

    if (name === "stateId") {
      setDataValues((prevValues) => {
        return { ...prevValues, cityId: "" };
      });
    }    
  };

  const [birthDate, setBirthDate] = useState(null);
  const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [hobbie, setHobbies] = useState([]);
  const hobbiesList = ["Singing", "Codeing", "Reading", "Dancing", "Surfing"];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("https://localhost:7087/api/Country")
      .then((response) => setCountryList(response.data))
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    if (data.countryId !== 0) {
      axios
        .get(
          `https://localhost:7087/api/State/countryId?countryId=${data.countryId}`
        )
        .then((response) => setStateList(response.data))
        .catch((error) => console.log(error));
    }
  }, [data.countryId]);

  useEffect(() => {
    if (data.stateId !== 0) {
      axios
        .get(`https://localhost:7087/api/City/stateId?stateId=${data.stateId}`)
        .then((response) => setCityList(response.data))
        .catch((error) => console.log(error));
    }
  }, [data.stateId]);  

  const onSubmit = () => {
    const header = { "Access-Control-Allow-Origin": "*" };
    axios
      .post("https://localhost:7087/api/Employee", {
        id: 0,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        gender: data.gender,
        maritalStatus: data.maritalStatus === true ? 1 : 0,
        birthDate: birthDate,
        hobbies: hobbie.toString(),
        salary: data.salary,
        address: data.address,
        countryId: data.countryId,
        stateId: data.stateId,
        cityId: data.cityId,
        zipCode: data.zipCode,
        password: data.password,
        header,
      })
      .then(() => {
        navigate("/");
      });
  };

  const onBackClick = () => {
    navigate("/");
  };

  const menuProps = {
    PaperProps: {
      style: {
        maxHeight: 225,
        width: 2500,
      },
    },
  };

  return (
    <form
      className="App"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      autoComplete="off"
      layout="horizontal"
      spacing={2}
      style={{
        maxWidth: 800,
      }}
    >
      <h2>Employee Form</h2>

      <InputLabel id="name" required>
        First Name :
        <Input
          placeholder="Enter First Name"
          variant="outlined"
          {...register("firstName", { required: true })}
          value={data.firstName}
          onChange={onDataChange}
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
          {...register("lastName", { required: true })}
          value={data.lastName}
          onChange={onDataChange}
        />
      </InputLabel>
      {errors?.lastName?.type === "required" && (
        <p className="error">Please fill Last Name</p>
      )}

      <InputLabel id="email" required>
        E-mail :
        <Input
          placeholder="Enter email"
          variant="outlined"
          {...register("email", {
            required: true,
            pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          })}
          value={data.email}
          onChange={onDataChange}
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
          {...register("gender")}
          value={data.gender}
          onChange={onDataChange}
        >
          <FormControlLabel value="m" control={<Radio />} label="Male" />
          <FormControlLabel value="f" control={<Radio />} label="Female" />
          <FormControlLabel value="o" control={<Radio />} label="Other" />
        </RadioGroup>
      </InputLabel>

      <InputLabel id="maritalStatus">
        Are you Married ?
        <Checkbox
          {...register("maritalStatus")}
          checked={data.maritalStatus}
          value={data.maritalStatus}
          onChange={onDataChange}
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
            onChange={(newValue) => setBirthDate(newValue)}
          />
        </LocalizationProvider>
      </InputLabel>

      <InputLabel id="hobbies">
        Hobbies :
        <Select
          MenuProps={menuProps}
          size="small"
          multiple
          value={hobbie}
          {...register("hobbies")}
          style={{ minWidth: "300px", height: "30px" }}
          onChange={(e) => setHobbies(e.target.value)}
          placeholder="Select your Hobbies"
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
          value={data.salary}
          onChange={onDataChange}
        />
      </InputLabel>

      <InputLabel>
        Address :
        <TextField
          multiline
          rows={3}
          size="small"
          placeholder="Enter address"
          {...register("address")}
          value={data.address}
          onChange={onDataChange}
        />
      </InputLabel>

      <InputLabel id="country">
        Country :
        <Select
          placeholder="Select your Country"
          style={{ minWidth: "300px", height: "30px" }}
          {...register("countryId")}
          value={data.countryId}
          onChange={onDataChange}
        >
          {countryList.map((country, index) => (
            <MenuItem value={country.id} key={index}>
              {country.name}
            </MenuItem>
          ))}
        </Select>
      </InputLabel>

      <InputLabel>
        State :
        <Select
          {...register("stateId")}
          value={data.stateId}
          onChange={onDataChange}
          style={{ minWidth: "300px", height: "30px" }}
        >
          {stateList.map((state, index) => (
            <MenuItem value={state.id} key={index}>
              {state.name}
            </MenuItem>
          ))}
        </Select>
      </InputLabel>

      <InputLabel>
        City :
        <Select
          {...register("cityId")}
          value={data.cityId}
          onChange={onDataChange}
          style={{ minWidth: "300px", height: "30px" }}
        >
          {cityList.map((city, index) => (
            <MenuItem value={city.id} key={index}>
              {city.name}
            </MenuItem>
          ))}
        </Select>
      </InputLabel>

      <InputLabel>
        Pincode :
        <Input
          type="number"
          maxLength={6}
          {...register("zipCode", { type: "number" })}
          value={data.zipCode}
          onChange={onDataChange}
        />
      </InputLabel>

      <InputLabel>
        Password :
        <Input
          placeholder="Enter password"
          variant="outlined"
          type="password"
          {...register("password", {
            pattern:
              /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/,
          })}
          value={data.password}
          onChange={onDataChange}
        />
      </InputLabel>
      {errors?.password?.type === "pattern" && (
        <p className="error">Password is invalid</p>
      )}

      <Button type="submit" variant="contained" onClick={handleSubmit}>
        Submit
      </Button>
      <Button variant="contained" onClick={onBackClick}>
        Back
      </Button>
    </form>
  );
}
