<script>
  import axios from "axios";
  import { FHIR } from "../links";
  let number;
  const handleSubmit = async () => {
    console.log(number);
    try {
      const resp = await FHIR.delete(`/Patient?identifier=${number}`);

      if (resp.status == 200) {
        alert("Patient Data Deleted");
        number = null;
      }
    } catch (e) {
      console.log(e);
    }
  };
</script>

<div>
  <h1 class="font-sans text-6xl font-bold mb-10">
    Delete an Electronic Health Record
  </h1>

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
