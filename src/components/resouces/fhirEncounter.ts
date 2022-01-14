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
        const encounterResp = await FHIR.post(`/Encounter`,resource,
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