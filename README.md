# taxonworks_autocomplete
A embedable javascript autocomplete that references a TaxonWorks API

## How to run on localhost

First install dependencies:

```sh
npm install
```

To run in dev mode mode:

```sh
npm run dev
```

Then go to http://localhost:3000


## Installation

With NPM

```bash
npm install @sfgrp/tw-autocomplete
```

## Quick start

there are two ways to setup TWAutocomplete. The easiest way is to let TWAutocomplete auto discover your inputs automatically. For that, you simply need to provide a data attribute to your input.

### Declarative

Add `data-taxonworks-autocomplete="true"` attribute to input elements to initialize it.
To pass the options you need to add the prefix `data-` and write the option in kebab-case, like the following example:

```html
<input 
  data-taxonworks-autocomplete="true"
  data-resource="taxon_names"
  data-project-token="xQ9bKrhfQtHYfro9t6YY0A"
  data-name="taxon_name_id"
  data-url="https://sfg.taxonworks.org"
  placeholder="Search a taxon name..."
>
```

### Imperative
You can initialize a it by instantiating the TWAutocomplete class


```html
<input 
  id="taxonworks-autocomplete"
  placeholder="Search..."
>
```
```javascript
import TWAutocomplete from '@sfgrp/tw-autocomplete'
import '@sfgrp/tw-autocomplete'

const autocomplete = new TWAutocomplete('#taxonworks-autocomplete', options)
```


### Options object
To set each property in the declarative initialization way, just add `data-` and write each option in kebab-case
```javascript
{
  project_id: 16,             // project id
  resource: "taxon_names",    // TaxonWorks controller route
  token: '',                  // User token
  api_version: 1,             // API version. default = 1
  threshold: 2,               // Min string length before make request. Default = 2
  debounce: 1000,             // Waiting time before to make a request. Default = 2
  projectToken: '',           // Project token. Don't use together with a user token.
  events: {                   // (Optional) Callback events
    select: () => {}
  }
}
```