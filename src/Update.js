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
import { json, useLocation, useNavigate } from "react-router-dom";

export default function Update() {
  const location = useLocation();
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
    countryId: 0,
    stateId: 0,
    cityId: 0,
    zipCode: "",
    password: "",
  });

  const onDataChange = (event)=>{
    const name = event.target.name;
    const value = event.target.value;

    if(name == "maritalStatus"){
      setDataValues((prevValues)=> {return {...prevValues, [name]: event.target.checked}});
    }
    else if(name == "birthDate"){
      setDataValues((prevValues)=> {return {...prevValues, [name]: dayjs(event.target.value)}});
    }
    else{
      setDataValues((prevValues)=> {return {...prevValues, [name]: value}});
    }
    
    if (name == "countryId") {
      setCityList([]);
      setDataValues((prevValues) => {
        return { ...prevValues, stateId: "" };
      });
    }

    if (name == "stateId") {
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

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm();

  useEffect(() => {
    const formData = location?.state?.data;
    Object.keys(formData).forEach(function(key){
      setValue(key, formData[key]);
    });    
    setDataValues(location.state?.data);        
    setHobbies(location.state?.data?.hobbies.split(","));
    setBirthDate(dayjs(new Date(location.state?.data?.birthDate)));
  }, []);

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
        .then((response) => (
          setStateList(response.data)))
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



  const navigate = useNavigate();

  const onSubmit = () => {
    const header = { "Access-Control-Allow-Origin": "*" };    
    axios
      .put(`https://localhost:7087/api/Employee/${location.state?.data.id}`, {
        id: location.state?.data.id,
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
        header
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
  const hobbiesList = ["Singing", "Codeing", "Reading", "Dancing", "Surfing"];

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
      <h2>Edit Employee</h2>
      <InputLabel id="name">
        First Name :
        <Input
          placeholder="Enter First Name"
          variant="outlined"     
          {...register("firstName", { required: "required message" })}
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
          value={data.lastName}
          {...register("lastName", { required: true })}
          onChange={onDataChange}
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
          name="gender"
          {...register("gender")}
          onChange={onDataChange}
          value={data.gender}
        >
          <FormControlLabel value="m" control={<Radio />} label="Male" />
          <FormControlLabel value="f" control={<Radio />} label="Female" />
          <FormControlLabel value="o" control={<Radio />} label="Other" />
        </RadioGroup>
      </InputLabel>

      <InputLabel id="maritalStatus">
        Are you Married ?
        <Checkbox             
          checked={data.maritalStatus}
          value={data.maritalStatus}
          {...register("maritalStatus")}
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
          onChange={(e) => setHobbies(e.target.value)}
          placeholder="Select your Hobbies"          
          value={hobbie}
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
          value={data.salary}
          onChange={onDataChange}
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
          value={data.address}
          {...register("address")}
          onChange={onDataChange}
        />
      </InputLabel>

      <InputLabel id="countryId">
        Country :
        <Select
          {...register("countryId")}
          placeholder="Select your Country"
          style={{ minWidth: "300px", height: "30px" }}
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
          style={{ minWidth: "300px", height: "30px" }}
          value={data.stateId}
          onChange={onDataChange}
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
          style={{ minWidth: "300px", height: "30px" }}
          value={data.cityId}
          onChange={onDataChange}
        >
          {cityList.map((city, index) => (
            <MenuItem value={city.id} key={index}>
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
          value={data.zipCode}          
          {...register("zipCode", { type: "number" })}
          onChange={onDataChange}
        />
      </InputLabel>

      <InputLabel>
        Password :
        <Input
          placeholder="Enter password"
          variant="outlined"
          value={data.password}
          type="password"
          {...register("password", {
            pattern:
              /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/,
          })}          
          onChange={onDataChange}
        />
      </InputLabel>
      {errors?.password?.type === "pattern" && (
        <p className="error">Password is invalid</p>
      )}

      <Button type="submit" variant="contained" onClick={handleSubmit}>
        Update
      </Button>
      <Button variant="contained" onClick={onBackClick}>
        Back
      </Button>
    </form>
  );
}
