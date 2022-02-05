<script>
  import { Router, Link, Route } from "svelte-navigator";
  import { useNavigate } from "svelte-navigator";
  const navigo = useNavigate();

  const handleBack = () => {
    navigo(-1);
  };
</script>

<header>
  <ul class="flex p-5">
    <li class="mr-2">
      <Link to="/">
        <sl-button type="neutral" size="medium"
          ><sl-icon name="house-door-fill" slot="prefix" /> Home
        </sl-button>
      </Link>
      <Link to="/Templates">
        <sl-button type="neutral" size="medium"
          ><sl-icon name="file-code-fill" slot="prefix" /> Templates
        </sl-button>
      </Link>
      <Link to="/get">
        <sl-button type="neutral" size="medium"
          ><sl-icon name="list-check" slot="prefix" /> List
        </sl-button>
      </Link>
      <sl-button type="neutral" outline size="medium" on:click={handleBack}
        ><sl-icon name="arrow-left-square-fill" slot="prefix" /> Back
      </sl-button>
    </li>
  </ul>
</header>
