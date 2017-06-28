/* eslint-disable */
const { addClass, removeClass, insertAfter, findDoc, createElementFromMarkup } = require('../../lib/element-stuff')
const eventsToSuppress = [40, 38, 9, 13, 27]

function arrayIncludes (array, item) {
  if (!Array.isArray(array)) {
    return false
  }

  return array.indexOf(item)
}

class AutocompleteBase {
  constructor (element) {
    this.element = element
    this.document = findDoc(this.element)

    this.mousedover = false
    this.focused = false

    this.ACTIVECLASS = 'autocomplete__suggestion--active'
    this.SUGGESTIONCLASS = 'autocomplete__suggestion'

    this.getCurrentValue()
    this.hideCurrentControl()
    this.createInput()
    this.attachEvents()
    addClass(this.element.parentNode, 'autocomplete__container')
  }

  hideCurrentControl () {
    addClass(this.element, 'u-hidden')
  }

  createInput () {
    const input = this.document.createElement('input')
    input.setAttribute('aria-owns', this.element.id)
    input.setAttribute('aria-hidden', true)
    input.setAttribute('autocomplete', 'off')
    input.setAttribute('type', 'text')
    addClass(input, 'form-control')
    insertAfter(input, this.element)
    input.value = this.displayValue
    this.displayField = input
  }

  renderSuggestions (matches, term) {
    // run hide again because due to a weird combination
    // of events, async lookups sometimes render suggestions on top of each other.
    this.hideSuggestions()

    const matchesToRender = (matches && matches.length > 7) ? matches.slice(0, 10) : matches

    let markup = '<ul class="autocomplete__suggestions">'
    for (const match of matchesToRender) {
      markup += `<li class="${this.SUGGESTIONCLASS}" data-value="${match.id}">${this.highlighter(match.name, term)}</li>`
    }
    markup += '</ul>'
    this.suggestionsElement = createElementFromMarkup(markup, this.document)
    this.attachSuggestionEvents(this.suggestionsElement)
    insertAfter(this.suggestionsElement, this.displayField)
  }

  select (target) {
    if (!target) {
      target = this.suggestionsElement.querySelector(`.${this.ACTIVECLASS}`)
    }
    if (!target) return

    const value = target.getAttribute('data-value')
    const display = target.textContent
    this.element.value = value
    this.displayField.value = display
    this.hideSuggestions()
  }

  highlighter (item, term) {
    const highlightTerm = term.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&')
    return item.replace(new RegExp('(' + highlightTerm + ')', 'ig'), ($1, match) => {
      return '<strong>' + match + '</strong>'
    })
  }

  lookup () {
    this.hideSuggestions()
    const term = this.displayField.value.toLowerCase().trim()
    if (term.length === 0) {
      return
    }

    this.getMatches(term, (error, matches) => {
      if (error) {
        if (console) {
          console.log(error)
        }
        return
      }
      if (matches.length > 0) {
        this.renderSuggestions(matches, term)
      }
    })
  }

  // Event Handers
  focus = (event) => {
    this.focused = true
  }

  blur = (event) => {
    this.focused = false
    if (!this.mousedover) {
      this.hideSuggestions()
    }
  }

  move = (event) => {
    if (!this.suggestionsElement) return

    switch (event.keyCode) {
      case 9: // tab
      case 13: // enter
      case 27: // escape
        event.preventDefault()
        break

      case 38: // up arrow
        event.preventDefault()
        this.prev()
        break

      case 40: // down arrow
        event.preventDefault()
        this.next()
        break
    }

    event.stopPropagation()
  };

  keypress = (event) => {
    if (this.suppressKeyPressRepeat) return
    this.move(event)
  }

  keyDown = (event) => {
    this.suppressKeyPressRepeat = arrayIncludes(eventsToSuppress, event.keyCode)
    this.move(event)
  }

  keyup = (event) => {
    switch (event.keyCode) {
      case 40: // down arrow
      case 38: // up arrow
      case 16: // shift
      case 17: // ctrl
      case 18: // alt
        break

      case 9: // tab
      case 13: // enter
        if (!this.suggestionsElement) return
        this.select()
        break

      case 27: // escape
        if (!this.suggestionsElement) return
        this.hideSuggestions()
        break

      default:
        this.lookup()
    }

    event.stopPropagation()
    event.preventDefault()
  }

  suggestionClick = (event) => {
    event.stopPropagation()
    event.preventDefault()
    this.select(event.target)
    this.displayField.focus()
  }

  next () {
    let currentActive = this.suggestionsElement.querySelector(`.${this.ACTIVECLASS}`)
    if (!currentActive) {
      addClass(this.suggestionsElement.querySelector(`.${this.SUGGESTIONCLASS}:first-child`), this.ACTIVECLASS)
      return
    }

    removeClass(currentActive, this.ACTIVECLASS)
    let next = currentActive.nextSibling
    if (!next) {
      next = this.suggestionsElement.querySelector(`.${this.SUGGESTIONCLASS}:first-child`)
    }

    addClass(next, this.ACTIVECLASS)
  }

  prev () {
    const currentActive = this.suggestionsElement.querySelector(`.${this.ACTIVECLASS}`)

    if (!currentActive) {
      addClass(this.suggestionsElement.querySelector(`.${this.SUGGESTIONCLASS}:last-child`), this.ACTIVECLASS)
      return
    }

    removeClass(currentActive, this.ACTIVECLASS)
    let prev = currentActive.previousSibling

    if (!prev) {
      prev = this.suggestionsElement.querySelector(`.${this.SUGGESTIONCLASS}:last-child`)
    }

    addClass(prev, this.ACTIVECLASS)
  }

  mouseEnter = (event) => {
    this.mousedover = true
    removeClass(this.suggestionsElement.querySelector(`.${this.ACTIVECLASS}`), this.ACTIVECLASS)
    addClass(event.target, this.ACTIVECLASS)
  }

  mouseLeave = (event) => {
    this.mousedover = false
    removeClass(event.target, this.ACTIVECLASS)
  }

  hideSuggestions () {
    if (this.suggestionsElement) {
      this.element.parentNode.removeChild(this.suggestionsElement)
      this.suggestionsElement = null
    }
  }

  attachEvents () {
    this.displayField.addEventListener('focus', this.focus, false)
    this.displayField.addEventListener('blur', this.blur, false)
    this.displayField.addEventListener('keydown', this.keyDown, false)
    this.displayField.addEventListener('keyup', this.keyup, false)
  }

  attachSuggestionEvents (suggestionsElement) {
    suggestionsElement.addEventListener('click', this.suggestionClick)
    suggestionsElement.addEventListener('mouseenter', this.mouseEnter)
    suggestionsElement.addEventListener('mouseleave', this.mouseLeave)
  }
}

module.exports = AutocompleteBase
