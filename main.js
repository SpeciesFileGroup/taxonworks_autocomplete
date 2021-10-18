import './style.css'
import { Autocomplete } from './src/autocomplete.js'

/* const autocomplete = new Autocomplete('#taxonworks-autocomplete', {
  resource: 'taxon_names',
  url: 'http://localhost:3000',
  api_version: 1,
  project_id: 16,
  events: {
    select: item => { console.log(item) }
  }
}) */

Autocomplete.discover('#taxonworks-autocomplete')