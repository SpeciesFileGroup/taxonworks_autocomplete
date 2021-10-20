const example1 = document.querySelector('#example-code-1')
const example1Code = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@sfgrp/tw-autocomplete/dist/style.css">
    <script src="https://cdn.jsdelivr.net/npm/@sfgrp/tw-autocomplete/dist/tw-autocomplete.umd.min.js"></script>
    <title>TaxonWorks Autocomplete</title>
  </head>
  <body>
    <form 
      action="https://sfg.taxonworks.org/api/v1/taxon_names.json" 
      method="get"
    >
      <div>
        <input
          hidden
          name="project_token"
          value="xQ9bKrhfQtHYfro9t6YY0A"
        >
        <input 
          data-taxonworks-autocomplete="true"
          data-resource="taxon_names"
          data-name="taxon_name_id[]"
          data-project-token="xQ9bKrhfQtHYfro9t6YY0A"
          data-url="https://sfg.taxonworks.org/"
          placeholder="Search a taxon name..."
        >
      </div>
      <button type="submit">
        SEND
      </button>
    </form>
  </body>
</html>`


example1.innerHTML = Prism.highlight(example1Code, Prism.languages.html, 'html');
