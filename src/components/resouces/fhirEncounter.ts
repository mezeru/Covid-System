import { FHIR } from "../../links";



export const encounterResource = async (AdhaarNo, fhirPatientId, classNo) => {

    const classArr = [
        {
            system: "http://terminology.hl7.org/CodeSystem/v3-ActCode", // OPD
            code: "AMB",
            display: "Ambulatory"
        },
        {
            system: "http://terminology.hl7.org/CodeSystem/v3-ActCode", // Assessment
            code: "CDSREV",
            display: "Assessment "
        }
    ]

    const resource = {
        resourceType: "Encounter",
        id:  String(fhirPatientId),
        identifier : [{value: AdhaarNo} ],
        status: "finished",
        class: classArr[classNo],
        subject: {
            reference: `Patient/${fhirPatientId}`
        }
    }
    console.log({resource});
   
    try{
        await FHIR.post(`/Encounter`,resource,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );
    }
    catch(e){
        console.log({e});
    }
    
}

export const getEncounters = async(id) =>{
    let encounters = []
    const resp = await FHIR.get(`/Encounter?identifier=${id}`);
    if(resp.data.total !== 0){
    encounters = resp.data.entry.map(e => e.resource).reverse();
    }
    return [...encounters]
}