<script lang="ts">
  import "medblocks-ui/dist/medblocks";
  import "medblocks-ui/dist/shoelace";
  import "./style.css";
  import New from "./components/newPatient.svelte";
  import Home from "./components/Home.svelte";
  import Delete from "./components/deleteEHR.svelte";
  import Get from "./components/list.svelte";
  import { Router, Route } from "svelte-navigator";
  import CompoForm from "./components/Covid.svelte";
  import Patient from "./components/getPatient.svelte";
  import NavBar from "./components/nav.svelte";
  import Templates from "./components/Templates.svelte";
  import GetOne from "./components/GetOne.svelte";
  import AssessForm from "./components/assessForm.svelte";
</script>

<Router>
  <NavBar />

  <main class="flex flex-col gap-5 h-full">
    <Route path="/new" component={New} />

    <Route path="/get" component={Get} />

    <Route path="/delete" component={Delete} />

    <Route path="/patient/:ehrId/" component={Patient} />

    <Route path="/postdata/:ehrId/:compId/:adhaarId" component={CompoForm} />

    <Route path="/assessment-form/:ehrId/:compId/:adhaarId" component={AssessForm} />

    <Route path="/getpatient" component={GetOne} />

    <Route path="/Templates" component={Templates} />

    <Route>
      <Home />
    </Route>
  </main>
</Router>
