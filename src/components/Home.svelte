<script>
  import { Router, Link, Route } from "svelte-navigator";
  export let location;
  export let navigate;
  location
  navigate
  
</script>

<div class="flex flex-col justify-center items-center">
  <div class="grid grid-cols-3 gap-10 m-10">
    <Link to="/new" class="flex-auto flex justify-center">
      <sl-button type="primary" size="large"
        ><sl-icon name="plus-lg" slot="prefix" /> New Patient
      </sl-button>
    </Link>

    <Link to="/get" class="flex-auto flex justify-center">
      <sl-button type="success" size="large"
        ><sl-icon name="list-check" slot="prefix" /> List of Patients
      </sl-button>
    </Link>

    <Link to="/getpatient" class="flex-auto flex justify-center">
      <sl-button type="primary" size="large"
        ><sl-icon name="stack" slot="prefix" /> Get a Patient
      </sl-button>
    </Link>
  </div>
  

  <div>
    <Link to="/delete" class="flex-auto flex justify-center">
      <sl-button type="danger" size="large"
        ><sl-icon name="trash" slot="prefix" /> Delete Patient Data
      </sl-button>
    </Link>
  </div>
</div>
