<script lang="ts">


    import { fade } from "svelte/transition";
    import { useNavigate } from "svelte-navigator";
    import { ehrscape, handleDependencyInjection } from "../../links";
    import { onMount } from "svelte";
    import { immuneResource } from "../resouces/fhirImmunization";
    export let ehrId;
    export let compId;
    export let adhaarId;

    const templateId = "vaccine.v2";

    let form;
    let loading = false;
    let navigation;
    let tabs = {
        clinical: "lab",
        "lab": null
    };
    let navigo = useNavigate();

    onMount(async () => {
    if (compId != "None") {
      const r = await ehrscape.get(`/composition/${compId}`, {
        params: { format: "FLAT" },
      });
      const data = r.data?.composition;
      console.log({ data });
      if (data) {
        form.import(data);
      }
    }
  });


    const handleSubmit = (e) => {
    loading = true;


    if(compId !== 'None'){
      ehrscape
          .put(`/composition/${compId}`, e.detail, {
            params: { format: "FLAT", templateId, ehrId },
          })
          .then((response) => {
            if (response.status == 200) {

              navigo(-1);
            }
          })
          .catch((err) => {
            loading = false;
            alert(err);
            
          });
    }
    else{

      ehrscape
      .post("/composition", e.detail, {
        params: { format: "FLAT", templateId, ehrId },
      })
      .then((response) => {
        if (response.status == 201) {

          console.log(e.detail)

          immuneResource(adhaarId,ehrId,{
            date: e.detail["vaccine.v2/covid_vaccine/date_and_time_taken"],
            name: e.detail["vaccine.v2/covid_vaccine/name_of_manufacturer_vaccine"],
            dosage: e.detail["vaccine.v2/covid_vaccine/dosage_informatio"]})
          navigo(-1);
          
        }
      })
      .catch((err) => {
        alert(err);
      });
    

    }

    loading = false;
  };

</script>


<h2 class="font-sans text-6xl font-bold">Enter Vaccination Details</h2>
<mb-form
  bind:this={form}
  in:fade={{ duration: 1000 }}
  class="flex flex-col gap-3 p-10 m-10 rounded-lg border"
  ref="formRef"
  on:mb-submit={handleSubmit}
  on:mb-dependency={handleDependencyInjection}
  >

    <mb-context path="vaccine.v2/context/start_time"></mb-context>
    <mb-context path="vaccine.v2/context/setting"></mb-context>
    <mb-text-select path="vaccine.v2/covid_vaccine/name_of_manufacturer_vaccine" label="Name of manufacturer/vaccine">
        <mb-option value="Pfizer-BioNTech"  label="Pfizer-BioNTech"></mb-option>
        <mb-option value="Oxford-AstraZeneca"  label="Oxford-AstraZeneca"></mb-option>
        <mb-option value="Moderna"  label="Moderna"></mb-option>
        <mb-option value="Sputnik V"  label="Sputnik V"></mb-option>
        <mb-option value="Covaxin"  label="Covaxin"></mb-option>   
    </mb-text-select>
    <mb-date time path="vaccine.v2/covid_vaccine/date_and_time_taken" label="Date and Time taken"></mb-date>

    <mb-text-select path="vaccine.v2/covid_vaccine/dosage_information" label="Dosage Information">
      <mb-option value="First Dose"  label="First Dose"></mb-option>
      <mb-option value="Second Dose"  label="Second Dose"></mb-option>
      <mb-option value="Booster Shot"  label="Booster Shot"></mb-option>

    </mb-text-select>


    <mb-context path="vaccine.v2/covid_vaccine/language"></mb-context>
    <mb-context path="vaccine.v2/covid_vaccine/encoding"></mb-context>
    <mb-context path="vaccine.v2/covid_vaccine/subject"></mb-context>
    <mb-context path="vaccine.v2/category"></mb-context>
    <mb-context path="vaccine.v2/language"></mb-context>
    <mb-context path="vaccine.v2/territory"></mb-context>
    <mb-context path="vaccine.v2/composer"></mb-context>

    <mb-submit class="my-5">
        <sl-button type="primary" size="medium" {loading} >Submit</sl-button>
    </mb-submit>

</mb-form>

