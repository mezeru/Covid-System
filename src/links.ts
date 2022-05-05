import axios from "axios"

const baseURL_FHIR = import.meta.env.VITE_BASE_URL_FHIR;
const baseURL_OPENEHR = import.meta.env.VITE_BASE_URL_OPENEHR;
const baseURL_EHRSCAPE = import.meta.env.VITE_BASE_URL_EHRSCAPE;

export const FHIR = axios.create({baseURL: `${baseURL_FHIR}`});

export const openehr = axios.create({baseURL: `${baseURL_OPENEHR}`,
headers: {
    Accept: "application/json",
  }});

export const hermes = axios.create({
    baseURL: `https://snomed.test4.voiceintern.com/v1`,
  });


  export const ehrscape = axios.create({
    baseURL: `${baseURL_EHRSCAPE}`,
    headers: {
      Accept: "application/json",
    },
  });


  export const handleDependencyInjection = (e: CustomEvent) => {
    if (e.detail.key === "hermes") {
      e.detail.value = hermes;
    }
  };


