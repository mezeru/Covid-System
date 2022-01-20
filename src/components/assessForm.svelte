<script>
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { useNavigate } from "svelte-navigator";
  import { ehrscape } from "../links";
import { encounterResource } from "./resouces/fhirEncounter";

  export let ehrId;
  export let compId;
  export let adhaarId;
  let form;
  let loading = false;

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

  const templateId = "assessment.v0";
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
        if (response.status == 200) {
          if(compId === "None"){
            encounterResource(adhaarId,ehrId,1)
          }
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

<h2 class="font-sans text-6xl font-bold">Enter Assessment</h2>
<mb-form
  bind:this={form}
  in:fade={{ duration: 1000 }}
  class="flex flex-col gap-3 p-10 m-10 rounded-lg border"
  ref="formRef"
  on:mb-submit={handleSubmit}
>
  <sl-tab-group>
    <sl-tab slot="nav" panel="assess">Assessment</sl-tab>

    <sl-tab-panel name="assess">
      <mb-context path="assessment.v0/context/start_time"></mb-context>
      <mb-context path="assessment.v0/context/setting"></mb-context>
      <div class="flex flex-col gap-3 p-5 m-5">
        
      <mb-select path="assessment.v0/covid-19_infection_risk_assessment/health_risk" label="Health risk" terminology="local">
        <mb-option value="at0.1" label="COVID-19 Risk assessment"></mb-option>
      </mb-select>
      <mb-select path="assessment.v0/covid-19_infection_risk_assessment/risk_factors:0/risk_factor" label="Risk factor" terminology="local">
        <mb-option value="at0.9" label="Contact with confirmed Covid-19 case"></mb-option>
      <mb-option value="at0.14" label="Potential contact exposure based on location"></mb-option>
      <mb-option value="at0.10" label="Contact with suspected case/ pneumonia case"></mb-option>
      <mb-option value="at0.13" label="Contact with severe, unexplained respiratory disease"></mb-option>
      <mb-option value="at0.11" label="Contact with birds in China"></mb-option>
      <mb-option value="at0.12" label="Contact with confirmed human case of Avian flu in China"></mb-option>
      <mb-option value="at0.18" label="Needs admission for respiratory disease"></mb-option>
      <mb-option value="at0.19" label="Other household members are ill"></mb-option>
      <mb-option value="at0.20" label="Household members with travel exposure"></mb-option>
      </mb-select>
      <div class="flex flex-col gap-3 p-5 shadow-lg rounded-lg border m-1">
        <mb-text-select path="assessment.v0/covid-19_infection_risk_assessment/assessment_method" label="Assessment method">
          <mb-option value="RT-PCR Test" label="RT-PCR Test"></mb-option>
      <mb-option value="Antigen Test"  label="Antigen Test"></mb-option>
        </mb-text-select>
      
      <mb-select path="assessment.v0/covid-19_infection_risk_assessment/risk_factors:0/presence" label="Presence" terminology="local">
        <mb-option value="at0018" label="Present"></mb-option>
      <mb-option value="at0019" label="Absent"></mb-option>
      <mb-option value="at0.15" label="Unknown"></mb-option>
      </mb-select>
    </div>
      <mb-input path="assessment.v0/covid-19_infection_risk_assessment/risk_factors:0/description" label="Description"></mb-input>
      <mb-date time path="assessment.v0/covid-19_infection_risk_assessment/risk_factors:0/date_identified" label="Date identified"></mb-date>
      <mb-checkbox path="assessment.v0/covid-19_infection_risk_assessment/risk_factors:0/mitigated" label="Mitigated"></mb-checkbox>
      <mb-select path="assessment.v0/covid-19_infection_risk_assessment/risk_assessment" label="Risk assessment" terminology="local">
        <mb-option value="at0.16" label="Low risk"></mb-option>
      <mb-option value="at0.17" label="High risk"></mb-option>
      </mb-select>
      <mb-duration year month hour path="assessment.v0/covid-19_infection_risk_assessment/time_period" label="The time period during which the predicted health risk is relevant"></mb-duration>
      <mb-date time path="assessment.v0/covid-19_infection_risk_assessment/last_updated" label="Last updated"></mb-date>
      

      <mb-context path="assessment.v0/covid-19_infection_risk_assessment/language"></mb-context>
      <mb-context path="assessment.v0/covid-19_infection_risk_assessment/encoding"></mb-context>
      <mb-context path="assessment.v0/covid-19_infection_risk_assessment/subject"></mb-context>
      </div>
    </sl-tab-panel>
    
      <mb-context path="assessment.v0/category"></mb-context>
      <mb-context path="assessment.v0/language"></mb-context>
      <mb-context path="assessment.v0/territory"></mb-context>
      <mb-context path="assessment.v0/composer"></mb-context>
    
  </sl-tab-group>
  <div class="flex justify-between">    
      <mb-submit>
        <sl-button type="primary" size="large" {loading}>Submit</sl-button>
      </mb-submit>
  </div>
  
</mb-form>
