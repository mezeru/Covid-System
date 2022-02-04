import { openehr } from "./links";

export const formatAql = (aqlResultData): any => {
  const { columns, rows } = aqlResultData;
  return { columns, rows };
};


export const Lab = async (ehrId :string) =>{
  const query = `SELECT 
  c/context/start_time/value as time, o/data[at0001]/events[at0002]/data[at0003]/items[at0005]/value as Test, 
  o/data[at0001]/events[at0002]/data[at0003]/items[at0075]/value as Test_time, 
  o/data[at0001]/events[at0002]/data[at0003]/items[at0057]/value as Result, 
  o/data[at0001]/events[at0002]/data[at0003]/items[at0098]/value as Suggesition 
  from EHR e CONTAINS COMPOSITION c CONTAINS OBSERVATION o [openEHR-EHR-OBSERVATION.laboratory_test_result.v1] 
  WHERE e/ehr_id/value='${ehrId}' ORDER by time DESC
  `;

  const r = await openehr.post(`/query/aql`, {
    q: query,
  });
  return formatAql(r.data);  
}


export const compositionsList = async (ehrId :string) =>{
    const query = `SELECT 
    c/context/start_time/value as time, 
    c/uid/value as uid,
    c/archetype_details/template_id/value 
    from EHR e CONTAINS COMPOSITION c where e/ehr_id/value='${ehrId}' LIMIT 15 ORDER BY time DESC
    `
    const r = await openehr.post(`/query/aql`, {
      q: query,
    });
    return formatAql(r.data);  
}

  export const Vitals = async (ehrId :string) => {
    const query = `SELECT
    c/context/start_time as Time,
    c/content[openEHR-EHR-SECTION.adhoc.v1,'Clinical Background']/items[openEHR-EHR-ADMIN_ENTRY.covid_19_admission.v0]/data[at0001]/items[at0002]/value as Admit,
    c/content[openEHR-EHR-SECTION.adhoc.v1,'Clinical Background']/items[openEHR-EHR-SECTION.adhoc.v1,'Vital Signs']/items[openEHR-EHR-OBSERVATION.body_temperature.v2]/data[at0002]/events[at0003]/data[at0001]/items[at0004]/value as Temperature,
    c/content[openEHR-EHR-SECTION.adhoc.v1,'Clinical Background']/items[openEHR-EHR-SECTION.adhoc.v1,'Vital Signs']/items[openEHR-EHR-OBSERVATION.respiration.v2]/data[at0001]/events[at0002]/data[at0003]/items[at0062]/value as Pulse_Presence,
    c/content[openEHR-EHR-SECTION.adhoc.v1,'Clinical Background']/items[openEHR-EHR-SECTION.adhoc.v1,'Vital Signs']/items[openEHR-EHR-OBSERVATION.respiration.v2]/data[at0001]/events[at0002]/data[at0003]/items[at0004]/value as Pulse_Rate,
    c/content[openEHR-EHR-SECTION.adhoc.v1,'Clinical Background']/items[openEHR-EHR-SECTION.adhoc.v1,'Vital Signs']/items[openEHR-EHR-OBSERVATION.pulse_oximetry.v1]/data[at0001]/events[at0002]/data[at0003]/items[at0006]/value as SpO2
    from EHR e CONTAINS COMPOSITION c CONTAINS OBSERVATION o
    WHERE e/ehr_id/value='${ehrId}'
    LIMIT 10
    ORDER by Time DESC
    `;

    const r = await openehr.post(`/query/aql`, {
      q: query,
    });
    
    return formatAql(r.data);
  };


  export const Travel = async (ehrId :string) => {
    const query = `SELECT
    c/context/start_time as Time,
    o/data[at0001]/events[at0002]/data[at0003]/items[at0004]/value as Travel,
    o/data[at0001]/events[at0002]/data[at0003]/items[at0026]/value as DomInter
    from EHR e CONTAINS COMPOSITION c CONTAINS OBSERVATION o [openEHR-EHR-OBSERVATION.travel_screening.v0]
    WHERE e/ehr_id/value='${ehrId}'
    ORDER by Time DESC
    `
    const r = await openehr.post(`/query/aql`, {
      q: query,
    });
    return formatAql(r.data);
  }

  export const Assessment = async (ehrId :string) => {
    const query = `SELECT
    c/context/start_time/value as Time,
    ev/data[at0001]/items[at0016]/items[at0013.1]/value/value as RiskFactor,
    ev/data[at0001]/items[at0016]/items[at0017.1]/value/value as Presence,
    ev/data[at0001]/items[at0016]/items[at0029]/value/value as date,
    ev/data[at0001]/items[at0020]/value/value,
    ev/protocol[at0010]/items[at0025]/value/value
    from EHR e CONTAINS COMPOSITION c CONTAINS EVALUATION ev [openEHR-EHR-EVALUATION.health_risk-covid.v0]
    WHERE e/ehr_id/value='${ehrId}'
    ORDER by Time DESC
    `
    const r = await openehr.post(`/query/aql`, {
      q: query,
    });
    return formatAql(r.data);
  }

  export const Clinical = async (ehrId :string) => {
    const query = `SELECT
    c/context/start_time as Time,
    o/data[at0001]/events[at0002]/data[at0003]/items[at0022]/items[at0004]/value/value as Symptoms,
    c/content[openEHR-EHR-SECTION.adhoc.v1,'Clinical Background']/items[openEHR-EHR-OBSERVATION.symptom_sign_screening.v0]/data[at0001]/events[at0002]/data[at0003]/items[at0034]/value/value as Presenting_conditions
    from EHR e CONTAINS COMPOSITION c CONTAINS OBSERVATION o [openEHR-EHR-OBSERVATION.symptom_sign_screening.v0]
    WHERE e/ehr_id/value='${ehrId}'
    ORDER by Time DESC
    `;

    const r = await openehr.post(`/query/aql`, {
      q: query,
    });
    return formatAql(r.data);
  };


  export const VaccineList = async (ehrId :string) => {
    const query = ` SELECT
    c/context/start_time/value as time,
    ev/data[at0002]/items[at0003]/value/value,
    ev/data[at0002]/items[at0007]/value/value,
    ev/data[at0002]/items[at0005]/value/value
    FROM EHR e CONTAINS COMPOSITION c CONTAINS EVALUATION ev [openEHR-EHR-EVALUATION.covid_vaccine.v0]
    WHERE e/ehr_id/value='${ehrId}'
    ORDER by time DESC
    `;

    const r = await openehr.post(`/query/aql`, {
      q: query,
    });
    return formatAql(r.data);
  };

  