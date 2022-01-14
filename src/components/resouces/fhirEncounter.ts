import { FHIR } from "src/links";



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
        identifier : [{value: AdhaarNo} ],
        status: "finished",
        class: classArr[classNo],
        subject: {
            reference: `Patient/${fhirPatientId}`
        },
        location: {
            location: {
                reference: "Location/1"
            }
        }
    }
    console.log({resource});
   
    try{
        const encounterResp = await FHIR.put(`/Encounter`,resource,
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