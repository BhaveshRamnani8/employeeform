const baseUrl = "https://localhost:7087/api";
const employeeListUrl = `${baseUrl}/Employee`;
const countryListUrl = `${baseUrl}/Country`;
const stateListUrl = `${baseUrl}/State/countryId?countryId=`;
const cityListUrl = `${baseUrl}/City/stateId?stateId=`;
const hobbiesList = ["Singing", "Coding", "Reading", "Dancing", "Surfing"];

export {employeeListUrl, countryListUrl, stateListUrl, cityListUrl, hobbiesList};