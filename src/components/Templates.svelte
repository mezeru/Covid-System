<script lang="ts">
  import { openehr } from "../links";

  import { onMount } from "svelte";
  let templates = [];
  let files;

  onMount(async () => {
    const r = await openehr.get("/definition/template/adl1.4");
    templates = r.data?.reverse();
  });

  const handleDate = (date) => {
    return `<sl-format-date
                  day="numeric"
                  month="long"
                  year="numeric"
                  hour="numeric"
                  minute="numeric"
                  hour-format="12"
                  date=${date}
                />`;
  };

  const handleClick = async () => {
    if (files[0].name.slice(-4).toLowerCase() == ".opt") {
      try {
        const r = await openehr.post(
          "/definition/template/adl1.4",
          await files[0].text(),
          {
            headers: {
              Accept: "application/xml",
              "Content-Type": "application/xml",
            },
          }
        );
        if(r.status === 204){
          const resp = await openehr.get("/definition/template/adl1.4");
        templates = resp.data.reverse;
        }
        
      } catch (e) {
        if (e.response.status == 409) {
          alert("Template Already Posted");
        }
        if (e.response.status == 415 || e.response.status == 400) {
          alert("Not a Valid XML Template");
        }
      }
    } else {
      alert("Upload an OPT or XML File Only");
    }
  };
</script>

<div class="p-5">
  {#if templates.length > 0}
    <div>
      <h3 class="text-5xl m-5 text-center font-bold text-blue-500">
        Templates Posted
      </h3>
    </div>
    <div class="flex flex-col p-5 m-2">
      {#each templates as temp, i}
        <div
          class="grid grid-cols-5 text-center items-center rounded-lg shadow-lg border p-5 m-3 "
        >
          <p class="text-3xl font-bold">
            {i + 1}
          </p>
          <p class="font-semibold">
            {temp.template_id}
          </p>
          <p>
            {temp.archetype_id}
          </p>
          <p>
            {temp.concept}
          </p>
          <p>
            {@html handleDate(temp.created_timestamp)}
          </p>
        </div>
      {/each}
    </div>
  {:else}
    <div>No Templates Posted</div>
  {/if}
  <div class="m-2 flex flex-row items-center justify-center">
    <sl-button type="primary" class="mx-5" on:click={handleClick}
      ><sl-icon name="file-earmark-plus-fill" slot="prefix" />Add</sl-button
    >
    <input type="file" class="mx-5" bind:files />
  </div>
</div>
