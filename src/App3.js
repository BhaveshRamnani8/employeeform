import "./App.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Input, InputLabel } from "@mui/material";
import { useForm } from "react-hook-form";

export default function EmployeeForm(){

    const [data, setDataValues] = useState({
        control:"",
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
        stateId: "",
        cityId: "",
        zipCode: "",
        password: ""
      });
    
      const onDataChange = (event)=>{                
        setDataValues((prevValues)=> ({...prevValues, [event.target.name]: event.target.value}));
      };
      const onControlChange = (event) => {
        console.log(event.target.name);
        console.log(event.target.value);
      };
      console.log(data);
    const [selectedCountry, setSelectedCountry] = useState("");
    const [countryList, setCountryList] = useState([]);
    const [selectedState, setSelectedState] = useState("");
    const [stateList, setStateList] = useState([]);

    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm();

    const handleCountryChange = (event) => {              
        setSelectedCountry(event.target.value);
      };      
      const handleStateChange = (event) => {              
        setSelectedState(event.target.value);        
      };

    useEffect(() => {
        axios.get("https://localhost:7087/api/Country")
          .then((response) => setCountryList(response.data))
          .catch((error) => console.log(error));
          
      }, []);

      useEffect(()=>{

        if (selectedCountry !== "")
        {
            axios.get(`https://localhost:7087/api/State/countryId?countryId=${selectedCountry}`)
            .then((response)=> setStateList(response.data))
            .catch((error)=> console.log(error));    
        }
        
      },[selectedCountry])

    return <>
        <form className="App">
            <h1>Dummy Form</h1>

            <label>control : <input type="text" name="control" 
            onChange={onControlChange}
            //onChange={(e)=>onDataChange(e)}
            ></input> </label>
            
            <br/>
            <InputLabel id="name" required>
        First Name :
        <Input
          id="firstName"
          label="Required"
          placeholder="Enter First Name"
          variant="outlined"
          value={data.firstName}
          name="firstName"          
          {...register("firstName", { required: true })}
          onChange={onDataChange}
        />
      </InputLabel>
      {errors?.firstName?.type === "required" && (
        <p className="error">Please fill First Name</p>
      )}

      <InputLabel id="lastName" required>
        Last Name :
        <Input
          id="lastName"
          label="Enter Last Name"
          placeholder="Enter Last Name"
          variant="outlined"
          value={data.lastName}
          {...register("lastName", { required: true })}
          //onChange={(e) => setLastName(e.target.value)}
        />
      </InputLabel>
      {errors?.lastName?.type === "required" && (
        <p className="error">Please fill Last Name</p>
      )}

      <InputLabel id="email" required>
        E-mail :
        <Input
          id="email"
          label="Enter email"
          placeholder="Enter email"
          variant="outlined"
          value={data.email}
          //onChange={(e) => setEmail(e.target.value)}
          {...register("email", {
            required: true,
            pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          })}
        />
      </InputLabel>
      {errors?.email?.type === "required" && (
        <p className="error">Please fill Email</p>
      )}
      {errors?.email?.type === "pattern" && (
        <p className="error">Email is invalid</p>
      )}


            <label>Country :</label>
            <select onChange={handleCountryChange}
            style={{ minWidth: "100px", height: "30px" }}
            >
                {countryList.map((country,index)=>(
                    <option key={index} value={country.id}>{country.name}</option>
                ))}
            </select> 
            <br/>
            <br/>

            <label>State :</label>
            <select onChange={handleStateChange}
            style={{ minWidth: "100px", height: "30px" }}
            >
                {stateList.map((state,index)=>(
                    <option key={index} value={state.id}>{state.name}</option>
                ))}
            </select>
        </form>
    </>
};