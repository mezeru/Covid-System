<script>
  import Form from "./Startform.svelte";
  import axios from "axios";
  export let baseURL;
  let ehrId;
  let number;
  let data;
  let display = 0;
  const handleSubmit = async () => {
    console.log(number);
    try {
      const resp = await axios.get(`${baseURL}search?AdhaarNo=${number}`);

      if (resp.status == 200) {
        display = 1;
        data = resp;
        console.log(data);
      }
    } catch (e) {
      console.log(e);
    }
  };
</script>

<h1 class="font-sans text-6xl font-bold mb-10">
  Add a new Data to an existing Patient
</h1>
{#if display == 0}
  <div>
    <form
      class="flex flex-col p-5 items-center"
      on:submit|preventDefault={handleSubmit}
    >
      <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
        <label
          class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          for="ahrno"
        >
          Adhaar ID of the Patient
        </label>
        <input
          bind:value={number}
          class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          placeholder="XXXX XXXX XXXX"
          name="ahrno"
        />
      </div>
      <button
        class="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded mt-5"
        type="submit"
      >
        Submit
      </button>
    </form>
  </div>
{/if}

{#if display == 1}
  <form class="flex flex-col p-5 items-center" on:submit|preventDefault>
    <div class="w-full md:w-1/3 px-3 mb-6 md:mb-2 grid grid-cols-2 gap-5">
      <div>
        <label
          class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          for="ahrno"
        >
          Name
        </label>
        <p
          class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
        >
          {data.data.Name}
        </p>
      </div>
      <div>
        <label
          class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          for="ahrno"
        >
          Aadhaar Number
        </label>
        <p
          class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
        >
          {data.data.AdhaarNo}
        </p>
      </div>
    </div>

    <div class="w-full md:w-1/3 px-3 mb-6 md:mb-2 grid grid-rows-2">
      <div>
        <label
          class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          for="ahrno"
        >
          Gender
        </label>
        <p
          class="appearance-none block w-full md:mb-2 bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
        >
          {data.data.Gender}
        </p>
      </div>
      <div>
        <label
          class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          for="ahrno"
        >
          Residence
        </label>
        <p
          class="appearance-none block w-full md:mb-2 bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
        >
          {data.data.PlaceofLiving}
        </p>
      </div>
    </div>
    <p class="md:mt-5">Please confirm the Patient</p>
    <div class="grid grid-cols-2 gap-5">
      <button
        on:submit
        class="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded mt-5"
        on:click={() => {
          ehrId = data.data.ehrId;
          display = 2;
        }}
      >
        Confirm
      </button>
      <button
        class="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-500 rounded mt-5"
        on:click={() => {
          display = 0;
        }}
      >
        Decline
      </button>
    </div>
  </form>
{/if}

{#if display == 2}
  <Form {ehrId} />
{/if}
