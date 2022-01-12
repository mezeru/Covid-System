import axios from "axios"

export const FHIR = axios.create({baseURL:"http://localhost:8090/fhir"});

export const openehr = axios.create({baseURL:"http://localhost:8080/ehrbase/rest/openehr/v1",
headers: {
    Accept: "application/json",
  }});

  export const ehrscape = axios.create({
    baseURL:"http://localhost:8080/ehrbase/rest/ecis/v1",
    headers: {
      Accept: "application/json",
    },
  });
