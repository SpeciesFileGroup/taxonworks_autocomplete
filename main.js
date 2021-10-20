import './src/assets/stylesheets/tw-autocomplete.css'
import './src/assets/stylesheets/style.css'
import { TWAutocomplete } from './src/autocomplete.js'

const autocomplete = new TWAutocomplete('#taxonworks-autocomplete', {
  resource: 'taxon_names',
  url: 'http://localhost:3000',
  api_version: 1,
  project_id: 16,
  events: {
    select: item => { console.log(item) }
  }
})
