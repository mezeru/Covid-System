<script lang="ts">
  import "medblocks-ui/dist/medblocks";
  import "medblocks-ui/dist/shoelace";
  import "medblocks-ui/dist/styles.js"
  import "./style.css";
  import New from "./components/forms/newPatient.svelte";
  import Home from "./components/Home.svelte";
  import Delete from "./components/deleteEHR.svelte";
  import Get from "./components/list.svelte";
  import { Router, Route } from "svelte-navigator";
  import CompoForm from "./components/forms/Covid.svelte";
  import Patient from "./components/getPatient.svelte";
  import NavBar from "./components/nav.svelte";
  import Templates from "./components/Templates.svelte";
  import GetOne from "./components/GetOne.svelte";
  import AssessForm from "./components/forms/assessForm.svelte";
  import Vaccine from "./components/forms/vaccine.svelte";
</script>


<Router>
 
  <NavBar />

  <main class="flex flex-col gap-5 h-full">
    <Route path="/new" component={New} primary={false} />

    <Route path="/get" component={Get} primary={false} />

    <Route path="/delete" component={Delete} primary={false} />

    <Route path="/patient/:ehrId/" component={Patient} primary={false} />

    <Route path="/postdata/:ehrId/:compId/:adhaarId" component={CompoForm} primary={false} />

    <Route path="/vaccine/:ehrId/:compId/:adhaarId" component={Vaccine} primary={false} />

    <Route path="/assessment-form/:ehrId/:compId/:adhaarId" component={AssessForm} primary={false} />

    <Route path="/getpatient" component={GetOne} primary={false} />

    <Route path="/Templates" component={Templates} primary={false} />

    <Route path="/" component={Home} primary={false} />
  </main>
</Router>
