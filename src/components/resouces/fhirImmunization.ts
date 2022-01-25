export const immuneResource = (AdhaarNo, fhirPatientId, {date,name}) => {

    

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
        } 

    }


    console.log(resource)

}


