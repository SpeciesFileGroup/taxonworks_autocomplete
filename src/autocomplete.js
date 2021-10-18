import { makeGetRequest } from './request.js'
import { DEFAULT_OPTIONS } from './constants/options.js'
import { ATTRIBUTES } from './constants/attributes.js'
import { API_PARAMETERS } from './constants/parameters.js'
import { API_VERSION_PATH } from './constants/apiRoutes.js'

class Autocomplete {
  constructor (selector, options) {
    const element = typeof selector === 'string'
      ? document.querySelector(selector)
      : selector

    if (element) {
      this.setOptions(options)
      this.initAutocomplete(element)
    }
  }

  setOptions (options) {
    this.options = {
      ...DEFAULT_OPTIONS,
      ...options
    }
  }

  initAutocomplete (inputElement) {
    const autocompleteElement = document.createElement('div')

    autocompleteElement.classList.add('taxonworks_autocomplete')

    inputElement.classList.add('taxonworks_autocomplete__input')
    inputElement.parentElement.append(autocompleteElement)
    inputElement.addEventListener('input', this.handleInput.bind(this))

    this.autocompleteElement = autocompleteElement
    this.autocompleteElement.appendChild(inputElement)

    this.inputElement = inputElement
    this.autocompleteElement = autocompleteElement
  }

  makeUrl () {
    const { url, resource, api_version } = this.options
    const apiPath = API_VERSION_PATH[api_version] || API_VERSION_PATH[1]

    return new URL(url + apiPath + resource + '/autocomplete')
  }

  makeRequest (params) {
    const url = this.makeUrl() + this.queryString(params)
    const headers = new Headers({
      Authorization: `Token ${this.options.projectToken}`,
      'Content-Type': 'application/json'
    })

    this.currentRequest?.abort()
    this.currentRequest = makeGetRequest(url, {
      method: 'GET',
      headers
    })
    
    this.currentRequest.ready
      .then(response => response.json())
      .then(data => {
        this.results = data
        this.renderList(data)
      }).catch(console.error)

  }
  
  handleInput (event) {
    const value = event.target.value

    clearTimeout(this.requestTimeout)
    if (value.length >= this.options.threshold) {
      this.requestTimeout = setTimeout(() => {
        const params = Object.entries({ 
          ...this.getObjectParams(),
          term: value 
        })

        this.makeRequest(params)
      }, this.options.debounce)
    }
  }

  getObjectParams () {
    const filterParams = Object.fromEntries(
      API_PARAMETERS.map(param => [param, this.options[param]])
      .filter(([_, value]) => value))

    return filterParams
  }

  queryString (params) {
    const paramString = params.map(([key, value]) => `${key}=${value}`).join('&')

    return `?${paramString}`
  }

  createRow (item) {
    const template = document.createElement('template')

    template.innerHTML = `
      <li
        class="taxonworks_autocomplete__row"
        data-item-id="${item.id}">
        ${item.label_html}
      </li>
    `.trim()

    template.content.firstChild.addEventListener('click', () => { this.selectItem(item) })

    return template.content.firstChild
  }

  selectItem (item) {
    this.results = [item]
    this.inputElement.value = item.label
    this.options.events.select(item)
    this.renderList (this.results)
  }

  renderList (result) {
    const listElement = document.createElement('ul')
    const rowElements = []

    listElement.classList.add('taxonworks_autocomplete__list')

    result.forEach(item => {
      const row = this.createRow(item)

      rowElements.push(row)
      listElement.append(row)
    })

    this.listElement?.remove()    
    this.listElement = listElement

    this.autocompleteElement.append(this.listElement)
  }

  static getOptionsFromElement (element) {
    const options = {}

    ATTRIBUTES.forEach(param => {
      options[param] = element.getAttribute(`data-${param.replaceAll('_', '-')}`)
    })

    return options
  }

  static discover (selector, options) {
    const elements = document.querySelectorAll(selector)
    const elementsList = [...elements]
  
    return elementsList.map(element => 
      new Autocomplete(element, Autocomplete.getOptionsFromElement(element))
    )
  }

}

export {
  Autocomplete
}