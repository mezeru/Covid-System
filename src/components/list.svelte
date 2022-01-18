<script>
  // @ts-nocheck
  import Fuse from "fuse.js";
  import OptKit from 'optkit';
  import { useNavigate } from "svelte-navigator";
  const navigate = useNavigate();
  import { onMount } from "svelte";
  import { each } from "svelte/internal";
  import { fade, fly } from "svelte/transition";
  import { expoIn, expoOut } from "svelte/easing";
  import { FHIR } from "../links";
  import loading1 from "../../assets/loading1.svg";

  let patients = [];
  let loading = true;
  let fuseObj;
  
  onMount(async () => {
    try{
      const resp = await FHIR.get("/Patient");
    if(resp.data.total > 0){
      patients = resp.data.entry.map(e => e.resource)
      patients.reverse();
      loading = false;
    }
    }
    catch(e){
      if(e.config.data === undefined){
        alert("Server is Down")
      };
    }
    

    const options = {
      includeScore: true,
      useExtendedSearch: true,
      keys: [
        { name: "AdhaarNo", weight: 3 },
        { name: "Name", weight: 2 },
      ],
    };

    fuseObj = new Fuse(patients, options);
    
  });


  const handleFilter = (value) => {
    if (value) {
      patients = fuseObj.search(value).map((x) => x.item);
    } else {
      patients = fuseObj._docs;
    }
  };

  const handleClick = ( ehrId) => {
    navigate(`/patient/${ehrId}`);
  };

  const handleDelete = async (id) => {
    let confirmed = await confirm("Confirm Delete Patient ?","Delete");
    
    if (confirmed){
      loading = true;
      patients = [];
    const resp = await FHIR.delete(`/Patient/${id}`);
    const r = await FHIR.get("/Patient");
    patients = r.data.entry.map(e => e.resource);
    patients.reverse();
    }
    loading = false;
  };
</script>

<OptKit/>
<h2 class="font-sans text-6xl font-bold mb-14">Patients Registered</h2>
<div class="flex items-center justify-center">
  <div>
    <label
      class="block text-2xl text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
      for="inline-full-name"
    >
      Search
    </label>
  </div>
  <div>
    <input
      class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-gray-500 focus:border-gray-200 focus:text-gray-100"
      id="inline-full-name"
      type="text"
      placeholder="Entry Search Query"
      on:input={(e) => handleFilter(e.target?.value)}
    />
  </div>
</div>

<div class="px-10">
  {#if loading}
    <div class="flex items-center justify-center">
      <img width="300px" src={loading1} alt="loading" />
    </div>
  {:else if patients.length > 0}
    {#each patients as patient,i}
      <div
        in:fly={{ y: 1000, duration: (i+1)*300, easing: expoOut }}
        class="m-5 rounded-lg border-2 border-gray-200 px-1 bg-gray-800 shadow-xl"
      >
        <div class="px-6 py-4 grid grid-cols-5">
          <div
            class="flex text-3xl font-bold mb-2 justify-center items-center text-gray-50
          "
          >
            <p class="text-center">
              {`${patient.name[0].given[0]}  ${patient.name[0].family !== undefined ? patient.name[0].family : " "}`}
            </p>
          </div>
          <div class="flex justify-center items-center">
            <p class="text-gray-300 font-bold text-xl">
              {patient.gender.toUpperCase()}
            </p>
          </div>

          <p
            class="text-gray-300 text-base flex flex-col items-center justify-center"
          >
            <span class="font-bold">Aadhaar Number</span><span
              >{patient.identifier[0].value}</span
            >
          </p>
          <p
            class="text-gray-300 text-base flex flex-col items-center justify-center"
          >
            <span class="font-bold">Phone number</span>
            <span>{patient.telecom[0].value}</span>
          </p>

          <div class="flex justify-end items-center gap-3">
            <sl-button
              type="success"
              on:click|preventDefault={() =>
                handleClick(patient.id)}
            >
              <sl-icon name="hdd-stack-fill" slot="suffix" />View Details
            </sl-button>
            <sl-button
              type="danger"
              on:click|preventDefault={() => handleDelete(patient.id)}
            >
              <sl-icon name="trash" slot="suffix" />
          
            </sl-button>
          </div>
        </div>
      </div>
    {/each}
  {:else}
    <div>
      <p
        class="text-6xl subpixel-antialiased text-center p-5 text-red-500 font-bold"
      >
        No Data
      </p>
    </div>
  {/if}
</div>
