import { FHIR } from "./../../links"

export const immuneResource = async (AdhaarNo, fhirPatientId, {date,name,dosage}) => {

    

    const resource = {
        resourceType: "Immunization",

        status: "completed",

        identifier : [{value: AdhaarNo}],

        patient: {
            reference: `Patient/${fhirPatientId}`
        },

        occurrenceDateTime: {date},

        manufacturer: {
            "reference": {name}
        },

        "protocolApplied" : [{ // Protocol followed by the provider
            "series" : {name},
            "doseNumberString" : dosage,
            seriesDosesPositiveInt : 2
            
          }]

    }


    const resp = await FHIR.post("/Immunization", resource);
    console.log(resp);

}


