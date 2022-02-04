<script lang="ts">
  import {
    Vitals,
    compositionsList,
    Lab,
    Clinical,
    Travel,
    Assessment,
VaccineList
  } from "../aql";
  import { useNavigate, Link } from "svelte-navigator";
  import { onMount } from "svelte";
  import { fade, fly } from "svelte/transition";
  import LineChart from "./LineChart.svelte";
  import loading2 from "../../assets/loading2.svg";
  import { FHIR, openehr } from "../links";
  import { getEncounters } from "./resouces/fhirEncounter";
import { EHR } from "./resouces/openEHR";

  const navigate = useNavigate();

  const formLink = {
    "assessment.v0": "assessment-form",
    "Opd_temp.v1": "postdata",
    "vaccine.v2":"vaccine"
  };

  

  let temp: { rows: { name: string }[]; columns: Record<string, string>[] } =
    null;
  let listComp = [];
  let listLabs = [];
  let clinical = [];
  let travel = [];
  let assess = [];
  let time = [];
  let encounters = []
  let vaccinations = []

  let loading = true;
  let navigation;
  let tabs = {
          vital: "immunization",
          immunization: "clinical",
          clinical: "travel",
          travel: "lab",
          lab: "assessment",
          assessment: "compositions",
          compositions: "encounter",
          encounter: null
        }

   export let ehrId;
   let id;
   let name;



  let table = new Set([
    "Time",
    "Temperature",
    "Pulse_Presence",
    "Pulse_Rate",
    "SpO2",
  ]);

  const makeSp = (temp) => {
    return temp.rows?.map((x) => x[5]?.numerator);
  };


  const makeTem = (temp) => {
    return temp.rows.map((x) => x[2]?.magnitude);
  };

  const makePr = (temp) => {
    return temp.rows?.map((x) => x[4]?.magnitude);
  };

  onMount(async () => {

    let resp = await FHIR.get(`/Patient/${ehrId}`)
    const fhirPatient = resp.data
    name = `${fhirPatient.name[0].given[0]}  ${fhirPatient.name[0].family !== undefined ? fhirPatient.name[0].family : " "}`
    id = fhirPatient.identifier[0].value

    let list;

    temp = await Vitals(ehrId);
    time = temp.rows?.map((x) => x[0]?.value).filter(e => e);

    list = await compositionsList(ehrId);
    listComp = list.rows;

    list = await getEncounters(id);
    encounters = list

    list = await Lab(ehrId);
    listLabs = list.rows;

    list = await Clinical(ehrId);
    clinical = list.rows;

    list = await Travel(ehrId);
    travel = list.rows;

    list = await Assessment(ehrId);
    assess = list.rows;

    list = await VaccineList(ehrId);
    vaccinations = list.rows;

    console.log({vaccinations})



    loading = false;

    try {
      await openehr.get(`/ehr/${ehrId}`, {
        headers: {
          Accept: "application/json",
        },
      });
      console.log("EHR exists");
    } catch (e) {
      if (e.response.status === 404) {
        console.log("EHR Does not exist, creating");
        const r = await openehr.put(
          `/ehr/${ehrId}`,
          EHR(id),
          {
            headers: {
              Accept: "application/json",
            },
          }
        );
        console.log("Created EHR");
      }
    }
  });

  const handleName = (row, key) => {
    if (!row) {
      return "-";
    }

    switch (key) {
      case "Time":
        return `<div>
                <sl-format-date
                  day="numeric"
                  month="long"
                  date=${row.value}
                />
              </div>
              <div>       
                <sl-format-date
                  hour="numeric"
                  minute="numeric"
                  hour-format="12"
                  date=${row.value}
                />
              </div>
                
                `;

      case "SpO2":
        return row.numerator + " %";

      case "Temperature":
      case "Pulse_Rate":
        return row.magnitude + " " + row.units;
    }
    return row.value;
  };
</script>

{#if loading}
      <div class="flex items-center justify-center" style="height: 80vh">
        <img src={loading2} width="250px" alt="Loading for Data" />
      </div>
{:else}
<div
  in:fly={{ y: 200, duration: 500 }}
  class="m-5 bg-white rounded-lg shadow-lg"
>
  <div
    class="grid grid-cols-3 gap-3 p-5 shadow-lg rounded-t-lg border bg-gray-700 justify-between"
  >
    <div class="grid grid-cols-1 justify-center items-center">
      <p class="font-bold text-5xl text-white">{name}</p>
      <p class="text-3xl text-white">{id}</p>
      
    </div>

    <div class="grid grid-cols-2 justify-between items-center">
      {#if !loading}
        
        <p
          in:fade={{ duration: 1500 }}
          class="px-5 m-2 py-2 text-white font-bold rounded text-center uppercase text-3xl blinkDiv {temp
            ?.rows[0]?.[1]?.value == 'YES'
            ? 'bg-yellow-500'
            : 'bg-green-500'}"
        >
          {temp?.rows[0]?.[1]?.value == "YES" ? "Admitted" : "Not Admitted"}
        </p>

        {#if assess[0] === undefined}

        <p
          in:fade={{ duration: 1500 }}
          class="px-5 m-2 py-2 text-white font-bold rounded text-center uppercase text-3xl blinkDiv bg-blue-700 border-blue-700"
        >
          Infection Unknown
        </p>

        {:else}
        
        <p
          in:fade={{ duration: 1500 }}
          class="px-5 m-2 py-2 text-white font-bold rounded text-center uppercase text-3xl blinkDiv {assess[0][2] == 'Present' ? "bg-red-700 border-red-700" : assess[0][2] == 'Absent' ? "bg-green-700 border-green-700" : "bg-blue-700 border-blue-700"}"
        >
        {assess[0][2] == 'Present' ? "Infected" : "Not Infected"}
        </p>
        {/if}
      {/if}
    </div>
    <div class="flex justify-end items-center">
      <div class="grid grid-rows-2 gap-5">
        <sl-button
          type="primary"
          on:click|preventDefault={() => {
            navigate(`/postdata/${ehrId}/None/${id}`);
          }}
        >
          <sl-icon name="plus-square-fill" slot="prefix" />Add Clinical Data
        </sl-button>

        <sl-button
          type="success"
          on:click|preventDefault={() => {
            navigate(`/assessment-form/${ehrId}/None/${id}`);
          }}
        >
          <sl-icon name="plus-square-fill" slot="prefix" />Add Assessment
        </sl-button>

        <sl-button
          type="primary"
          on:click|preventDefault={() => {
            navigate(`/vaccine/${ehrId}/None/${id}`);
          }}
        >
          <sl-icon name="plus-square-fill" slot="prefix" />Add Vaccination
        </sl-button>
      </div>
    </div>
  </div>

  <div
    class="flex flex-col gap-3 p-5 shadow-lg rounded-b-lg border"
    in:fly={{
      duration: 2500,
    }}
  >
    
    {#if time.length > 0}
      <sl-tab-group bind:this={navigation}>
        <sl-tab slot="nav" panel="vital">Vital Signs</sl-tab>

        {#if vaccinations.length > 0}
        <sl-tab slot="nav" panel="immunization">Immunization </sl-tab>
        {/if}

        <sl-tab slot="nav" panel="clinical">Clinical Data</sl-tab>

        {#if travel[0][1]}
        <sl-tab slot="nav" panel="travel">Travel History</sl-tab>
        {/if}

        {#if listLabs[0][1] > 0}
        <sl-tab slot="nav" panel="lab">Laboratory Tests</sl-tab>
        {/if}

        {#if assess.length > 0}
        <sl-tab slot="nav" panel="assessment">Assessments</sl-tab>
        {/if}

        <sl-tab slot="nav" panel="compositions">Compositions Posted</sl-tab>
        <sl-tab slot="nav" panel="encounter">Encounters</sl-tab>

        <sl-tab-panel name="clinical">
          <h3 class="text-3xl font-bold">Clinical Background</h3>
          <div class="grid grid-cols-2 gap-3 p-5">
            <div
              class="flex flex-col gap-3 p-5 rounded-lg border justify-around"
            >
              <div class="grid gap-5 p-5 cursor-pointer" style="grid-template-rows: 2.5fr 5fr;">
                <p class="font-semibold text-3xl text-center">
                  Screening Purpose
                </p>
                <div class="grid {`grid-cols-${clinical.length === 1 ? 1 : 2}`}">
                  {#each clinical as Symptom}
                    {#if Symptom[2] != null && Symptom[2] != "None"}
                      <div class="p-2">
                        <p
                          class="text-2xl text-white border rounded text-center bg-blue-500 py-2 px-2 cursor-pointer hover:bg-blue-700 focus:ring-violet-300"
                        >
                          {Symptom[2]}
                        </p>
                      </div>
                    {/if}
                  {/each}
                </div>
              </div>
            </div>

            <div
              class="flex flex-col gap-3 p-5 rounded-lg border justify-around"
            >
              <div class="grid gap-5 p-5 cursor-pointer" style="grid-template-rows: 2.5fr 5fr;">
                <p class="font-semibold text-3xl text-center">
                  Symptoms and Signs
                </p>
                <div class="grid {`grid-cols-${clinical.length === 1 ? 1 : 2}`}">
                  {#each clinical as Symptom}
                    {#if Symptom[2] != null && Symptom[2] != "None"}
                      <div class="p-2">
                        <p
                          class="text-2xl text-white border rounded text-center bg-blue-500 py-2 px-2 cursor-pointer hover:bg-blue-700 focus:ring-violet-300"
                        >
                          {Symptom[1]}
                        </p>
                      </div>
                    {/if}
                  {/each}
                </div>
              </div>
            </div>

          
        </sl-tab-panel>

        <sl-tab-panel name="vital">
          <div class="flex flex-col gap-3 p-5">
            <h3 class="text-3xl font-bold">Vital Signs</h3>
            <div class="flex flex-col gap-3 p-5 rounded-lg border">
              <table>
                <tbody>
                  {#each temp.columns as key, i}
                    {#if table.has(key.name)}
                      <tr>
                        <td class="font-bold">
                          {key.name.split("_").join(" ")}
                        </td>
                        {#each temp.rows as row}
                          <td
                            class={key.name == "Time"
                              ? "font-bold text-center pb-5"
                              : "text-center"}
                          >
                            {@html handleName(row[i], key.name)}
                          </td>
                        {/each}
                      </tr>
                    {/if}
                  {/each}
                </tbody>
              </table>
            </div>
            <h3 class="text-4xl font-bold mt-5">Patient Monitoring</h3>
            <div
              class="flex flex-row justify-evenly gap-5 border shadow-lg p-5 rounded-lg items-center"
            >
              <div class="w-1/3">
                <p class="my-2 text-2xl text-center font-semibold">
                  Body Temperature
                </p>
                <div>
                  <LineChart
                    label="Temperature"
                    labels={time}
                    data={makeTem(temp)}
                    min="30"
                    max="45"
                    color="rgb(255, 0, 102)"
                  />
                </div>
              </div>

              <div class="w-1/3">
                <p class="my-2 text-2xl text-center font-semibold">
                  Pulse Rate
                </p>
                <div class="flex">
                  <LineChart
                    label="Pulse Rate"
                    labels={time}
                    data={makePr(temp)}
                    min="50"
                    max="180"
                    color="rgb(51, 204, 51)"
                  />
                </div>
              </div>

              <div class="w-1/3">
                <p class="my-2 text-2xl text-center font-semibold">SpO2</p>
                <div class="flex">
                  <LineChart
                    label="SpO2"
                    labels={time}
                    data={makeSp(temp)}
                    min="0"
                    max="100"
                    color="rgb(204, 102, 255)"
                  />
                </div>
              </div>
            </div>
          </div>
        </sl-tab-panel>

        <sl-tab-panel name="travel">
          <div class="flex flex-col gap-3 p-5">
            <h3 class="font-bold text-3xl">Travel History</h3>
            <div class="flex flex-col p-5">
              
              {#each travel as comp}
                {#if comp[1]}
                  <div
                    class="grid grid-cols-2 gap-3 p-5 rounded-lg border shadow-lg"
                  >
                    <p class="text-center">
                      <span class="font-bold">Travelled Recently ? </span> :
                      <span
                        class="px-10 py-2 m-5 text-white font-bold border rounded text-center bg-red-500"
                      >
                        {comp[1].value}
                      </span>
                    </p>

                    <p class="text-center">
                      <span class="font-bold">Where ?</span> :
                      <span
                        class="px-10 py-2 m-5 text-white font-bold border rounded text-center {clinical !=
                        null
                          ? 'bg-yellow-500'
                          : 'bg-green-500'}">{comp[2]?.value}</span
                      >
                    </p>
                  </div>
                {/if}
                
              {/each}
            </div>
          </div>
        </sl-tab-panel>

        <sl-tab-panel name="lab">
          <div class="flex flex-col gap-3 p-5">
            <h3 class="font-bold text-4xl mb-5 text-center">
              Laboratory Tests
            </h3>
            {#each listLabs as test}
              {#if test[1]}
                <div
                  class="p-5 rounded-lg flex flex-col shadow-inner bg-gray-800"
                >
                  <div class="grid grid-cols-2 justify-evenly">
                    <p
                      class="flex flex-col text-center font-bold text-3xl mb-5 text-white"
                    >
                      {test[1].value}
                      <span class="font-normal text-base m-2 text-white"
                        >{@html handleName(test[2], "Time")}</span
                      >
                    </p>
                    <div class="flex items-center justify-center">
                      <p
                        class="{test[3]?.value == 'Positive'
                          ? 'bg-red-500'
                          : test[3]?.value == 'Negative'
                          ? 'bg-green-500'
                          : 'bg-yellow-500'} px-5 py-3 text-3xl rounded-lg text-white"
                      >
                        {test[3]?.value}
                      </p>
                    </div>
                  </div>
                  <div class="flex justify-evenly">
                    <p
                      class="appearance-none w-full bg-gray-100 text-gray-700 border border-gray-200 rounded py-3 px-4 text-lg"
                    >
                      {test[4]?.value}
                    </p>
                  </div>
                </div>
                <br />
              {/if}
            {/each}
          </div>
        </sl-tab-panel>

        <sl-tab-panel name="assessment">
          <div class="flex flex-col gap-3 p-5">
            {#each assess as asses, i}
              {#if asses[1]}
                <div
                  class="rounded-lg shadow-inner bg-gray-900 text-gray-200 p-5"
                >
                  <div class="grid grid-cols-2 p-2 items-center">
                    <div class="text-center text-xl">
                      <div>
                          <p class="text-center text-lg" style="display: {asses[5] === null ? "none" : "block"} ;"><span class="font-bold">{asses[5]} Result : </span><span class="text-white font-bold py-2 px-4 border m-4 rounded {asses[2] == 'Present' ? "bg-red-700 border-red-700" : asses[2] == 'Absent' ? "bg-green-700 border-green-700" : "bg-blue-700 border-blue-700" }">{asses[2]}</span></p>
                      </div>
                    </div>
                    <div class="text-center text-xl font-semibold">
                      <p>{asses[1]}</p>
                    </div>
                   
                  </div>
                  <div class="flex justify-center items-center flex-col font-bold text-xl">
                  <div>
                    <sl-format-date
                    month="long"
                    day="numeric"
                    hour-format="12"
                    date={asses[3]}
                  />
                </div>
                <div>
                  <sl-format-date
                    hour="numeric"
                    minute="numeric"
                    hour-format="12"
                    date={asses[3]}
                  />
                  </div>
                </div>
                </div>
              {/if}
            {/each}
          </div>
        </sl-tab-panel>
      
        <sl-tab-panel name="compositions">
          <div class="flex flex-col gap-3 p-5">
            {#each listComp as comp}
              {#if comp[1]}
                <div
                  class="grid grid-cols-3 p-5 rounded-lg shadow-inner bg-gray-900 text-gray-200 items-center"
                >
                  <div class="flex flex-col text-center text-lg font-semibold">
                    <sl-format-date
                      month="long"
                      day="numeric"
                      date={comp[0]}
                    />
                    <sl-format-date
                      hour="numeric"
                      minute="numeric"
                      hour-format="12"
                      date={comp[0]}
                    />
                  </div>
                  <div class="text-center text-lg font-semibold">
                    <p>{comp[2]}</p>
                  </div>
                  <div class="flex flex-row items-center justify-center">
                    <Link
                      class="text-center text-lg bg-gray-200 text-gray-900 px-4 py-2 rounded hover:bg-gray-500 hover:text-white font-semibold"
                      to={`/${formLink[comp[2]]}/${ehrId}/${comp[1].substring(
                        0,
                        36
                      )}/${id}`}
                    >
                      Edit Composition
                    </Link>
                  </div>
                </div>
                <br />
              {/if}
            {/each}
          </div>
        </sl-tab-panel>

        <sl-tab-panel name="encounter">
          <div class="flex flex-col gap-3 p-5">
            {#each encounters as encounter}
              {#if encounters.length > 0}
                <div
                  class="grid grid-cols-3 p-5 rounded-lg shadow-inner bg-gray-900 text-gray-200 items-center"
                >
                  <div class="flex flex-col text-center text-lg font-semibold">
                    <sl-format-date
                      month="long"
                      day="numeric"
                      date={encounter.meta.lastUpdated}
                    />
                    <sl-format-date
                      hour="numeric"
                      minute="numeric"
                      hour-format="12"
                      date={encounter.meta.lastUpdated}
                    />
                  </div>
                  <div class="text-center text-lg font-semibold">
                    <p>{encounter.class.display}</p>
                  </div>

                  <div class="text-center text-lg font-semibold capitalize">
                    <p>{encounter.status}</p>
                  </div>
                </div>
                <br />
              {/if}
            {/each}
          </div>
        </sl-tab-panel>

        <sl-tab-panel name="immunization">
          <div class="flex flex-col gap-3 p-5">
            {#each vaccinations as vaccine}
              {#if vaccinations.length > 0}
                <div
                  class="grid grid-cols-3 p-5 rounded-lg shadow-inner bg-gray-900 text-gray-200 items-center"
                >
                  <div class="text-center flex flex-col text-lg font-semibold">
                    <sl-format-date
                      day="numeric"
                      month="long"
                      date={vaccine[2]}
                    />
                    <sl-format-date
                    hour="numeric"
                    minute="numeric"
                    hour-format="12"
                    date={vaccine[2]}
                    />
                  </div>
                  <div class="text-center text-lg font-semibold">
                    <p>{vaccine[1]}</p>
                  </div>

                  <div class="text-center text-lg font-semibold capitalize">
                    <p>{vaccine[3]}</p>
                  </div>
                </div>
                <br />
              {/if}
            {/each}
          </div>
        </sl-tab-panel>

        
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
    {:else}
      <p
        class="text-6xl subpixel-antialiased text-center p-5 text-red-500 font-bold"
      >
        No Data
      </p>
    {/if}
  </div>
  
</div>
{/if}
