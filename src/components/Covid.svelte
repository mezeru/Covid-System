<script>
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { useNavigate } from "svelte-navigator";
  import { ehrscape } from "../links";
  import { bind } from "svelte/internal";
import { encounterResource } from "./resouces/fhirEncounter";

  export let ehrId;
  export let compId;
  export let adhaarId;
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
      if (data) {
        form.import(data);
      }
    }
  });

  const templateId = "Opd_temp.v1";
  const handleSubmit = (e) => {
    loading = true;
    ehrscape
      .post("/composition", e.detail, {
        params: { format: "FLAT", templateId, ehrId },
      })
      .then((response) => {
        if (response.status == 200) {
          if(compId === "None"){
            encounterResource(adhaarId,ehrId,0)
          }
          navigo(-1);
        }
      })
      .catch((err) => {
        loading = false;
        alert(err);
        
      });
    
  };
</script>

<h2 class="font-sans text-6xl font-bold">Enter Details</h2>
<mb-form
  bind:this={form}
  in:fade={{ duration: 1000 }}
  class="flex flex-col gap-3 p-10 m-10 rounded-lg border"
  ref="formRef"
  on:mb-submit={handleSubmit}
>
  <sl-tab-group bind:this={navigation}>
    <sl-tab slot="nav" panel="clinical">OPD</sl-tab>
    <sl-tab slot="nav" panel="lab">Laboratory Tests</sl-tab>

    <sl-tab-panel name="clinical">
      <div class="flex flex-col gap-3 p-5 m-5">
        <p class="font-bold text-lg">Patient History and Background</p>

        <mb-context path="opd_temp.v1/category" />
        <mb-context path="opd_temp.v1/context/start_time" />
        <mb-context path="opd_temp.v1/context/setting" />

        <mb-select
          required
          path="opd_temp.v1/clinical_background/covid_19_admission/hospital_admission_status"
          label="Hospital admission status"
        >
          <mb-option value="at0003" label="YES" />
          <mb-option value="at0004" label="NO" />
          <mb-option value="at0005" label="UNKNOWN" />
        </mb-select>
        <mb-date
          time
          path="opd_temp.v1/clinical_background/covid_19_admission/date_first_admitted"
          label="Date first admitted"
        />
        <mb-context
          path="opd_temp.v1/clinical_background/covid_19_admission/language"
        />
        <mb-context
          path="opd_temp.v1/clinical_background/covid_19_admission/encoding"
        />
        <mb-context
          path="opd_temp.v1/clinical_background/covid_19_admission/subject"
        />

        <mb-context path="opd_temp.v1/clinical_background/age/time" />
        <mb-context path="opd_temp.v1/clinical_background/age/language" />
        <mb-context path="opd_temp.v1/clinical_background/age/encoding" />
        <mb-context path="opd_temp.v1/clinical_background/age/subject" />

        <mb-input
          reuired
          path="opd_temp.v1/clinical_background/symptom_sign_screening_questionnaire/any_event:0/screening_purpose"
          label="Screening purpose"
        />
        <mb-select
          required
          path="opd_temp.v1/clinical_background/symptom_sign_screening_questionnaire/any_event:0/presence_of_any_symptoms_or_signs"
          label="Presence of any symptoms or signs"
        >
          <mb-option value="at0031" label="Present" />
          <mb-option value="at0032" label="Absent" />
          <mb-option value="at0033" label="Unknown" />
        </mb-select>
        <mb-input
          required
          path="opd_temp.v1/clinical_background/symptom_sign_screening_questionnaire/any_event:0/specific_symptom_sign:0/symptom_or_sign_name"
          label="Symptom or sign name"
        />

        <mb-context
          path="opd_temp.v1/clinical_background/symptom_sign_screening_questionnaire/any_event:0/time"
        />
        <mb-context
          path="opd_temp.v1/clinical_background/symptom_sign_screening_questionnaire/language"
        />
        <mb-context
          path="opd_temp.v1/clinical_background/symptom_sign_screening_questionnaire/encoding"
        />
        <mb-context
          path="opd_temp.v1/clinical_background/symptom_sign_screening_questionnaire/subject"
        />
      </div>
      <div class="flex flex-col gap-3 p-5 shadow-lg rounded-lg border m-5">
        <p class="font-bold text-lg">Treatment</p>
        <mb-input
          path="opd_temp.v1/clinical_background/condition_screening_questionnaire/any_event:0/specific_condition:0/condition_name"
          label="Condition name"
        />

        <mb-context
          path="opd_temp.v1/clinical_background/condition_screening_questionnaire/any_event:0/time"
        />
        <mb-context
          path="opd_temp.v1/clinical_background/condition_screening_questionnaire/language"
        />
        <mb-context
          path="opd_temp.v1/clinical_background/condition_screening_questionnaire/encoding"
        />
        <mb-context
          path="opd_temp.v1/clinical_background/condition_screening_questionnaire/subject"
        />
        <mb-input
          path="opd_temp.v1/clinical_background/management_treatment_screening_questionnaire/any_event:0/specific_management_treatment_activity:0/activity_name"
          label="Activity name"
        />
        <mb-select
          path="opd_temp.v1/clinical_background/management_treatment_screening_questionnaire/any_event:0/specific_management_treatment_activity:0/actioned"
          label="Actioned?"
          disabled={`${false}`}
        >
          <mb-option value="at0023" label="Actioned" />
          <mb-option value="at0024" label="Not actioned" />
          <mb-option value="at0027" label="Unknown" />
        </mb-select>
        <mb-date
          time
          path="opd_temp.v1/clinical_background/management_treatment_screening_questionnaire/any_event:0/specific_management_treatment_activity:0/date_actioned"
          label="Date actioned"
        />
      </div>

      <div class="p-5 flex flex-col gap-3 mt-5 p-15 ">
        <p class="font-bold text-lg">Vital Signs</p>
        <mb-context
          path="opd_temp.v1/clinical_background/management_treatment_screening_questionnaire/any_event:0/time"
        />
        <mb-context
          path="opd_temp.v1/clinical_background/management_treatment_screening_questionnaire/language"
        />
        <mb-context
          path="opd_temp.v1/clinical_background/management_treatment_screening_questionnaire/encoding"
        />
        <mb-context
          path="opd_temp.v1/clinical_background/management_treatment_screening_questionnaire/subject"
        />
        <mb-quantity
          required
          default="Cel"
          path="opd_temp.v1/clinical_background/vital_signs/body_temperature/any_event:0/temperature"
          label="Temperature"
        >
          <mb-unit unit="Cel" label="Cel" />
          <mb-unit unit="[degF]" label="[degF]" />
        </mb-quantity>
        <mb-context
          path="opd_temp.v1/clinical_background/vital_signs/body_temperature/any_event:0/time"
        />
        <mb-select
          path="opd_temp.v1/clinical_background/vital_signs/body_temperature/location_of_measurement"
          label="Location of measurement"
        >
          <mb-option value="at0025" label="Rectum" />
          <mb-option value="at0023" label="Ear canal" />
          <mb-option value="at0061" label="Forehead" />
          <mb-option value="at0022" label="Mouth" />
          <mb-option value="at0043" label="Skin" />
          <mb-option value="at0060" label="Temple" />
        </mb-select>
        <mb-context
          path="opd_temp.v1/clinical_background/vital_signs/body_temperature/language"
        />
        <mb-context
          path="opd_temp.v1/clinical_background/vital_signs/body_temperature/encoding"
        />
        <mb-context
          path="opd_temp.v1/clinical_background/vital_signs/body_temperature/subject"
        />

        <div class="flex flex-col gap-3 p-5 shadow-lg rounded-lg border m-5">
          <p class="font-bold text-lg">Pulse Rate</p>
          <mb-select
            path="opd_temp.v1/clinical_background/vital_signs/respiration/any_event:0/presence"
            label="Presence"
            required
          >
            <mb-option value="at0063" label="Present" />
            <mb-option value="at0064" label="Not detected" />
          </mb-select>
          <mb-quantity
            default="/min"
            path="opd_temp.v1/clinical_background/vital_signs/respiration/any_event:0/rate"
            label="Rate"
          >
            <mb-unit unit="/min" label="/min" />
          </mb-quantity>
          <mb-select
            path="opd_temp.v1/clinical_background/vital_signs/respiration/any_event:0/regularity"
            label="Regularity"
          >
            <mb-option value="at0006" label="Regular" />
            <mb-option value="at0007" label="Irregular" />
          </mb-select>
          <mb-input
            path="opd_temp.v1/clinical_background/vital_signs/respiration/any_event:0/comment"
            label="Comment"
          />
          <mb-select
            path="opd_temp.v1/clinical_background/vital_signs/respiration/any_event:0/body_position"
            label="Body position"
          >
            <mb-option value="at0066" label="Standing/upright" />
            <mb-option value="at0067" label="Sitting" />
            <mb-option value="at0068" label="Reclining" />
            <mb-option value="at0069" label="Lying" />
            <mb-option value="at0071" label="Prone" />
          </mb-select>
        </div>
        <mb-context
          path="opd_temp.v1/clinical_background/vital_signs/respiration/any_event:0/time"
        />
        <mb-context
          path="opd_temp.v1/clinical_background/vital_signs/respiration/language"
        />
        <mb-context
          path="opd_temp.v1/clinical_background/vital_signs/respiration/encoding"
        />
        <mb-context
          path="opd_temp.v1/clinical_background/vital_signs/respiration/subject"
        />

        <mb-percent
          path="opd_temp.v1/clinical_background/vital_signs/pulse_oximetry/any_event:0/spo"
          label="SpO₂"
        />
        <mb-input
          path="opd_temp.v1/clinical_background/vital_signs/pulse_oximetry/any_event:0/interpretation:0"
          label="Interpretation"
        />
        <mb-input
          path="opd_temp.v1/clinical_background/vital_signs/pulse_oximetry/any_event:0/confounding_factors:0"
          label="Confounding factors"
        />
      </div>

      <mb-context
        path="opd_temp.v1/clinical_background/vital_signs/pulse_oximetry/any_event:0/time"
      />
      <mb-context
        path="opd_temp.v1/clinical_background/vital_signs/pulse_oximetry/language"
      />
      <mb-context
        path="opd_temp.v1/clinical_background/vital_signs/pulse_oximetry/encoding"
      />
      <mb-context
        path="opd_temp.v1/clinical_background/vital_signs/pulse_oximetry/subject"
      />

      <div class="flex flex-col gap-3 p-5 shadow-lg rounded-lg border m-5">
        <p class="font-bold text-lg">Travel Screening</p>
        <mb-select
          path="opd_temp.v1/clinical_background/travel_screening_questionnaire/any_event:0/travel"
          label="Travelling"
        >
          <mb-option value="at0006" label="Yes" />
          <mb-option value="at0005" label="No" />
          <mb-option value="at0027" label="Unknown" />
        </mb-select>
        <mb-select
          path="opd_temp.v1/clinical_background/travel_screening_questionnaire/any_event:0/domestic_international"
          label="Domestic/international"
        >
          <mb-option value="at0028" label="Domestic travel" />
          <mb-option value="at0029" label="International travel" />
          <mb-option value="at0030" label="Domestic and international travel" />
        </mb-select>
        <mb-context
          path="opd_temp.v1/clinical_background/travel_screening_questionnaire/any_event:0/time"
        />
        <mb-context
          path="opd_temp.v1/clinical_background/travel_screening_questionnaire/language"
        />
        <mb-context
          path="opd_temp.v1/clinical_background/travel_screening_questionnaire/encoding"
        />
        <mb-context
          path="opd_temp.v1/clinical_background/travel_screening_questionnaire/subject"
        />
      </div>
    </sl-tab-panel>
    <sl-tab-panel name="lab">
      <div class="flex flex-col gap-3 p-5 m-5 shadow-lg rounded-lg border">
        <mb-input
          path="opd_temp.v1/clinical_background/lab_testing/laboratory_test_result/any_event:0/test_name"
          label="Test name"
        />
        <mb-date
          time
          path="opd_temp.v1/clinical_background/lab_testing/laboratory_test_result/any_event:0/overall_test_status_timestamp"
          label="Overall test status timestamp"
        />

        <mb-text-select
          path="opd_temp.v1/clinical_background/lab_testing/laboratory_test_result/any_event:0/conclusion"
          label="Conclusion"
        >
          <mb-option value="Positive" label="Positive" />
          <mb-option value="Negative" label="Negative" />
          <mb-option value="Inconclusive" label="Unknown" />
        </mb-text-select>

        <mb-input
          path="opd_temp.v1/clinical_background/lab_testing/laboratory_test_result/any_event:0/test_diagnosis:0"
          label="Test diagnosis"
        />
        <mb-context
          path="opd_temp.v1/clinical_background/lab_testing/laboratory_test_result/any_event:0/time"
        />

        <mb-context
          path="opd_temp.v1/clinical_background/lab_testing/laboratory_test_result/test_method/coded_text_value"
        />
        <mb-context
          path="opd_temp.v1/clinical_background/lab_testing/laboratory_test_result/test_method/text_value"
        />
        <mb-context
          path="opd_temp.v1/clinical_background/lab_testing/laboratory_test_result/test_method/multimedia_value"
        />
        <mb-context
          path="opd_temp.v1/clinical_background/lab_testing/laboratory_test_result/test_method/parsable_value"
        />
        <mb-context
          path="opd_temp.v1/clinical_background/lab_testing/laboratory_test_result/test_method/state_value"
        />
        <mb-context
          path="opd_temp.v1/clinical_background/lab_testing/laboratory_test_result/test_method/boolean_value"
        />
        <mb-context
          path="opd_temp.v1/clinical_background/lab_testing/laboratory_test_result/test_method/identifier_value"
        />
        <mb-context
          path="opd_temp.v1/clinical_background/lab_testing/laboratory_test_result/test_method/uri_value"
        />
        <mb-context
          path="opd_temp.v1/clinical_background/lab_testing/laboratory_test_result/test_method/ehr_uri_value"
        />
        <mb-context
          path="opd_temp.v1/clinical_background/lab_testing/laboratory_test_result/test_method/duration_value"
        />
        <mb-context
          path="opd_temp.v1/clinical_background/lab_testing/laboratory_test_result/test_method/quantity_value"
        />
        <mb-context
          path="opd_temp.v1/clinical_background/lab_testing/laboratory_test_result/test_method/count_value"
        />
        <mb-context
          path="opd_temp.v1/clinical_background/lab_testing/laboratory_test_result/test_method/proportion_value"
        />
        <mb-context
          path="opd_temp.v1/clinical_background/lab_testing/laboratory_test_result/test_method/date_time_value"
        />
        <mb-context
          path="opd_temp.v1/clinical_background/lab_testing/laboratory_test_result/test_method/date_value"
        />
        <mb-context
          path="opd_temp.v1/clinical_background/lab_testing/laboratory_test_result/test_method/time_value"
        />
        <mb-context
          path="opd_temp.v1/clinical_background/lab_testing/laboratory_test_result/test_method/ordinal_value"
        />
        <mb-context
          path="opd_temp.v1/clinical_background/lab_testing/laboratory_test_result/test_method/scale_value"
        />
        <mb-context
          path="opd_temp.v1/clinical_background/lab_testing/laboratory_test_result/language"
        />
        <mb-context
          path="opd_temp.v1/clinical_background/lab_testing/laboratory_test_result/encoding"
        />
        <mb-context
          path="opd_temp.v1/clinical_background/lab_testing/laboratory_test_result/subject"
        />
      </div>
    </sl-tab-panel>
  </sl-tab-group>
  <mb-context path="opd_temp.v1/language" />
  <mb-context path="opd_temp.v1/territory" />
  <mb-context path="opd_temp.v1/composer" />
  
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
