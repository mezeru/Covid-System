export const EHR = (id) => {
        
    return {
          _type: "EHR_STATUS",
          archetype_node_id: "openEHR-EHR-EHR_STATUS.generic.v1",
          name: {
            value: "EHR Status",
          },
          subject: {
            external_ref: {
              id: {
                _type: "GENERIC_ID",
                value: id << 2,
                scheme: "id_scheme",
              },
              namespace: "examples",
              type: "PERSON",
            },
          },
          is_modifiable: true,
          is_queryable: true,
        }
        
}