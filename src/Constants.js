const baseUrl = "https://localhost:7087/api";
const employeeListUrl = `${baseUrl}/Employee`;
const employeeHubUrl = `https://localhost:7087/employeeHub`;
const countryListUrl = `${baseUrl}/Country`;
const stateListUrl = `${baseUrl}/State/countryId?countryId=`;
const cityListUrl = `${baseUrl}/City/stateId?stateId=`;
const hobbiesList = ["Singing", "Coding", "Reading", "Dancing", "Surfing"];

export {employeeListUrl, employeeHubUrl, countryListUrl, stateListUrl, cityListUrl, hobbiesList};