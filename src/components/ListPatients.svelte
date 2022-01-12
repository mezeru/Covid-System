<script>
  import { useNavigate } from "svelte-navigator";
  const navigate = useNavigate();
  import axios from "axios";
  import { onMount } from "svelte";
  import { each } from "svelte/internal";
  import { fade, fly } from "svelte/transition";
  import { FHIR } from "../links";
  import { Link } from "svelte-navigator";
  let patients = [];

  onMount(async () => {
    const r = await FHIR.get("/Patient");
    if (r.data.entry) {
      r.data.entry.reverse();
      patients = [...r.data.entry].map((x) => x.resource);
    }
    console.log(patients);
  });

  const handleClick = (ehrId) => {
    navigate(`/patient/${ehrId}`);
  };

  const handleDelete = async (id) => {
    console.log(id);
    const resp = await FHIR.delete(`/Patient/${id}`);
    const r = await FHIR.get("/Patient");
    if (r.data.entry) {
      patients = [...r.data.entry].map((x) => x.resource);
    } else {
      patients = [];
    }
  };
</script>

<h2 class="font-sans text-6xl font-bold mb-14">Patients Registered</h2>
<div>
  {#if patients.length > 0}
    {#each patients as patient}
      <div
        in:fly={{ y: 1200, duration: 600 }}
        class="mb-5 rounded-lg border-2 border-blue-200 bg-gray-50 lg:rounded-r p-4 shadow-md"
      >
        <div class="px-6 py-4 grid grid-cols-5">
          <Link
            class="flex text-2xl font-bold mb-2 items-center text-gray-900"
            to={`/new/${patient.id}`}
          >
            {patient.name[0].given + " " + patient.name[0].family}
          </Link>
          <div class="flex justify-center items-center">
            <p
              class="text-gray-700 text-black-400 font-bold text-xl capitalize"
            >
              {patient.gender}
            </p>
          </div>

          <p class="text-gray-700 text-base flex flex-col">
            <span class="font-bold">Aadhaar Number</span><span
              >{patient.identifier[0].value}</span
            >
          </p>
          <p class="text-gray-700 text-base flex flex-col">
            <span class="font-bold">Phone number</span>
            <span>{patient.telecom[0].value}</span>
          </p>

          <div class="flex justify-end items-center gap-3">
            <sl-button
              type="success"
              on:click|preventDefault={() => handleClick(patient.id)}
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
    <div
      in:fly={{ y: 1200, duration: 600 }}
      class="mb-5 rounded-lg border-2 border-blue-200 bg-gray-50 lg:rounded-r p-4 shadow-md"
    >
      <p class="text-2xl text-center">No Patients Registered</p>
    </div>
  {/if}
</div>
