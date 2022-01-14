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
  let navigation;
  let tabs = {
    assess: "Conclu",
    Conclu: null
  }

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

  const templateId = "assessment.form";
  const handleSubmit = (e) => {
    loading = true;
    console.log(e.detail);
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
  <sl-tab-group bind:this={navigation}>
    <sl-tab slot="nav" panel="assess">Assessment</sl-tab>
    <sl-tab slot="nav" panel="Conclu">Conclusions</sl-tab>

    <sl-tab-panel name="assess">
      <mb-context path="assessment.form/context/start_time" />
      <mb-context path="assessment.form/context/setting" />
      <mb-context path="assessment.form/category" />
      <div class="flex flex-col gap-3 p-5 m-5">
        <mb-select
          path="assessment.form/assessment/covid-19_infection_risk_assessment/health_risk"
          label="Health risk"
        >
          <mb-option value="at0.1" label="COVID-19 Risk assessment" />
        </mb-select>
        <mb-select
          path="assessment.form/assessment/covid-19_infection_risk_assessment/risk_factors:0/risk_factor"
          label="Risk factor"
        >
          <mb-option
            value="at0.9"
            label="Contact with confirmed Covid-19 case"
          />
          <mb-option
            value="at0.14"
            label="Potential contact exposure based on location"
          />
          <mb-option
            value="at0.10"
            label="Contact with suspected case/ pneumonia case"
          />
          <mb-option
            value="at0.13"
            label="Contact with severe, unexplained respiratory disease"
          />

          <mb-option
            value="at0.18"
            label="Needs admission for respiratory disease"
          />

          <mb-option value="at0.19" label="Other household members are ill" />
          <mb-option
            value="at0.20"
            label="Household members with travel exposure"
          />
        </mb-select>
        <mb-select
          path="assessment.form/assessment/covid-19_infection_risk_assessment/risk_factors:0/presence"
          label="Presence"
        >
          <mb-option value="at0018" label="Present" />
          <mb-option value="at0019" label="Absent" />
          <mb-option value="at0.15" label="Unknown" />
        </mb-select>
        <mb-input
          path="assessment.form/assessment/covid-19_infection_risk_assessment/risk_factors:0/description"
          label="Description"
        />
        <mb-date
          time
          path="assessment.form/assessment/covid-19_infection_risk_assessment/risk_factors:0/date_identified"
          label="Date identified"
        />
        <mb-select
          path="assessment.form/assessment/covid-19_infection_risk_assessment/risk_assessment"
          label="Risk assessment"
        >
          <mb-option value="at0.16" label="Low risk" />
          <mb-option value="at0.17" label="High risk" />
        </mb-select>
        <mb-context
          path="assessment.form/assessment/covid-19_infection_risk_assessment/language"
        />
        <mb-context
          path="assessment.form/assessment/covid-19_infection_risk_assessment/encoding"
        />
        <mb-context
          path="assessment.form/assessment/covid-19_infection_risk_assessment/subject"
        />
      </div>
    </sl-tab-panel>
    <sl-tab-panel name="Conclu">
      <div class="flex flex-col gap-3 p-5 m-5">
        <mb-input
          path="assessment.form/conclusion/problem_diagnosis/problem_diagnosis_name"
          label="Problem/Diagnosis name"
        />
        <mb-input
          path="assessment.form/conclusion/problem_diagnosis/clinical_description"
          label="Clinical description"
        />

        <mb-select
          path="assessment.form/conclusion/problem_diagnosis/severity"
          label="Severity"
        >
          <mb-option value="at0047" label="Mild" />
          <mb-option value="at0048" label="Moderate" />
          <mb-option value="at0049" label="Severe" />
        </mb-select>

        <mb-date
          time
          path="assessment.form/conclusion/problem_diagnosis/date_time_of_resolution"
          label="Date/time of resolution"
        />
        <mb-select
          path="assessment.form/conclusion/problem_diagnosis/diagnostic_certainty"
          label="Diagnostic certainty"
        >
          <mb-option value="at0074" label="Suspected" />
          <mb-option value="at0075" label="Probable" />
          <mb-option value="at0076" label="Confirmed" />
        </mb-select>
        <mb-input
          path="assessment.form/conclusion/problem_diagnosis/comment"
          label="Comment"
        />

        <mb-context
          path="assessment.form/conclusion/problem_diagnosis/language"
        />
        <mb-context
          path="assessment.form/conclusion/problem_diagnosis/encoding"
        />
        <mb-context
          path="assessment.form/conclusion/problem_diagnosis/subject"
        />
      </div>
    </sl-tab-panel>
    <mb-context path="assessment.form/composer" />
    <mb-context path="assessment.form/territory" />
    <mb-context path="assessment.form/language" />
  </sl-tab-group>
  <div class="w-full flex justify-between">
    <sl-button
        type="neutral"
        on:click={() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
          let previous_tab = navigation.activeTab.previousElementSibling?.panel;
          navigation.show(previous_tab);
        }}
      >
        <sl-icon slot="prefix" name="arrow-left" />
        Back
      </sl-button>
    
      <mb-submit>
        <sl-button type="primary" size="large" {loading}>Submit</sl-button>
      </mb-submit>

    <sl-button
    type="neutral"
    on:click={() => {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 50);
      let next_tab = tabs[navigation.activeTab.panel];
      navigation.show(next_tab);
    }}
  >
    <sl-icon slot="suffix" name="arrow-right" />
    Next
  </sl-button>
  </div>
  
</mb-form>
