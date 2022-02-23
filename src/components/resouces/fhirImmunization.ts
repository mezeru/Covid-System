import { FHIR } from "./../../links"

export const immuneResource = async (AdhaarNo, fhirPatientId, {date,name,dosage}) => {

    

    const resource = {
        resourceType: "Immunization",

        status: "completed",

        identifier : [{value: AdhaarNo}],

        patient: {
            reference: `Patient/${fhirPatientId}`
        },

        // recorded: date,

        'vaccineCode': {
            'text': name
        },

        "protocolApplied" : [{ // Protocol followed by the provider
            "series" : name,
            "doseNumberString" : dosage,
            "targetDisease":{
                text: "COVID 19"
            }

          }]

    }

    console.log(resource);

    const resp = await FHIR.post("/Immunization", resource);
    

}


