import { makeGetRequest } from './utils/request.js'
import { DEFAULT_OPTIONS } from './constants/options.js'
import { ATTRIBUTES } from './constants/attributes.js'
import { API_PARAMETERS } from './constants/parameters.js'
import { API_VERSION_PATH } from './constants/apiRoutes.js'
import createSpinnerElement from './utils/spinnerElement.js'

export default class TWAutocomplete {
  constructor (selector, options) {
    const element = typeof selector === 'string'
      ? document.querySelector(selector)
      : selector

    if (element) {
      this.setOptions(options)
      this.init(element)
    } else {
      console.error("Element doesn't exist")
    }
  }

  setOptions (options) {
    this.options = {
      ...DEFAULT_OPTIONS,
      ...options
    }
  }

  init (inputElement) {
    this.inputElement = inputElement
    this.spinnerElement = createSpinnerElement()
    this.hiddenInputElement = this.#createHiddenInput()
    this.autocompleteElement = this.#createAutocompleteContainer()

    inputElement.classList.add('taxonworks_autocomplete__input')
    inputElement.parentElement.append(this.autocompleteElement)
    inputElement.addEventListener('input', this.handleInput.bind(this))

    this.autocompleteElement.appendChild(this.inputElement)
    this.autocompleteElement.appendChild(this.spinnerElement)
    this.autocompleteElement.appendChild(this.hiddenInputElement)
  }

  #createHiddenInput () {
    const hiddenInputElement = document.createElement('input')
    const inputName = this.options.name
      ? this.options.name
      : `${this.options.resource}_id`

    hiddenInputElement.setAttribute('type', 'hidden')
    hiddenInputElement.setAttribute('name', inputName)

    return hiddenInputElement
  }

  #createAutocompleteContainer () {
    const autocompleteElement = document.createElement('div')

    autocompleteElement.classList.add('taxonworks_autocomplete')

    return autocompleteElement
  }

  makeUrl () {
    const { url, resource, api_version } = this.options
    const apiPath = API_VERSION_PATH[api_version] || API_VERSION_PATH[1]

    return new URL(url + apiPath + resource + '/autocomplete')
  }

  makeRequest (params) {
    const url = this.makeUrl() + this.queryString(params)

    this.#showSpinner(true)
    this.currentRequest = makeGetRequest(url)    
    this.currentRequest.ready
      .then(response => response.json())
      .then(data => {
        this.results = data
        this.#renderList(data)
      })
      .catch(console.error)
      .finally(_ => {
        this.#showSpinner(false)
      })
  }
  
  handleInput (event) {
    const value = event.target.value

    this.currentRequest?.abort()
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

  #showSpinner (isVisible) {
    this.spinnerElement.style.display = isVisible 
      ? 'inline'
      : 'none'
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

  #createRow (item) {
    const template = document.createElement('template')

    template.innerHTML = `
      <li
        class="taxonworks_autocomplete__row"
        data-item-id="${item.id}">
        ${item.label_html}
      </li>
    `.trim()

    template.content.firstChild.addEventListener('click', () => { this.#selectItem(item) })

    return template.content.firstChild
  }

  #selectItem (item) {
    this.results = [item]
    this.inputElement.value = item.label
    this.options.events.select(item)
    this.hiddenInputElement.value = item.id
    this.#renderList (this.results)
  }

  #renderList (list) {
    const rowElements = list.map(item => this.#createRow(item))
    const listElement = document.createElement('ul')

    listElement.classList.add('taxonworks_autocomplete__list')

    if (rowElements.length) {
      listElement.append(...list.map(item => this.#createRow(item)))
    } else {
      listElement.append(this.#emptyRow())
    }

    this.listElement?.remove()    
    this.listElement = listElement
    this.autocompleteElement.append(this.listElement)
  }

  #emptyRow () {
    const li = document.createElement('li')

    li.classList.add('taxonworks_autocomplete__row')
    li.innerText = '-- None --'

    return li
  }

  static getOptionsFromElement (element) {
    const options = {}

    ATTRIBUTES.forEach(param => {
      options[param] = element.getAttribute(`data-${param.replaceAll('_', '-')}`)
    })

    return options
  }

  static discover (selector) {
    const tag = selector || '[data-taxonworks-autocomplete="true"]'
    const elements = document.querySelectorAll(tag)
    const elementsList = [...elements]
  
    return elementsList.map(element => 
      new TWAutocomplete(element, TWAutocomplete.getOptionsFromElement(element))
    )
  }
}

TWAutocomplete.autoDiscover = true

TWAutocomplete._autoDiscoverFunction = () => {
  if (TWAutocomplete.autoDiscover) {
    return TWAutocomplete.discover()
  }
}

window.addEventListener('DOMContentLoaded', TWAutocomplete._autoDiscoverFunction)

export {
  TWAutocomplete
}