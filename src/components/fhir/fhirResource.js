export const convertResource = (patient) => {

    const name = patient["Name"].split(" ");

    const resource = {
        resourceType: "Patient",

        identifier : [{value: patient.AdhaarNo}],

        name:[{
            use: "official",
            given: [name[0]],
            family: name[name.length - 1 > 0 ? name.length - 1 : " "] 
        }],

        gender: patient["Gender"].toLowerCase(),

        telecom: [{
            system: "phone",
            value: patient.PhoneNo
        }],
        address: [{
            use: "home",
            line : [patient.PlaceofLiving]
        }]
        
    }

    return resource;

}


