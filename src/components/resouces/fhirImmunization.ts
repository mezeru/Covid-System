export const convertResource = (AdhaarNo, fhirPatientId) => {

    

    const resource = {
        resourceType: "Immunization",

        identifier : [{value: AdhaarNo}],

        patient: {
            reference: `Patient/${fhirPatientId}`
        },

        
        
    }

    return resource;

}


