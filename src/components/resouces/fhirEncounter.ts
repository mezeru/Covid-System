export const encounterResource = (AdhaarNo,fhirPatientId) => {

    const resource = {
        resourceType: "Encounter",
        identifier : [{value: AdhaarNo} ],
        status: "finished",
        class: {
            system: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
            code: "AMB",
            display: "ambulatory"
        },
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
    return resource;
}