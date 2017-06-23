/* eslint-disable */
const {addClass, removeClass} = require('../lib/elementstuff')

function isDate (text) {
  return text.length === 10 && text.charAt(2) === '/' && text.charAt(5) === '/'
}

function convertToDate (string) {
  const parts = string.split('/')
  return new Date(parts[2], parts[1] - 1, parts[0])
}

const ASC_CLASS = 'table--sortable__sort-asc'
const DESC_CLASS = 'table--sortable__sort-desc'

class TableSort {

  constructor (element, document) {
    this.element = element
    this.cacheElements()
    this.attachEvents()
    this.parseTable()
    this.sortAsc = true
    this.currentKey = null
    this.document = document
  }

  cacheElements () {
    this.headingElements = this.element.querySelectorAll('thead th')
    this.tableBody = this.element.querySelector('tbody')
  }

  attachEvents () {
    for (let pos = 0; pos < this.headingElements.length; pos += 1) {
      const element = this.headingElements.item(pos)
      element.addEventListener('click', this.handleHeadingClick)
    }
  }

  parseTable () {
    this.keys = TableSort.parseTableHeader(this.headingElements)
    this.data = TableSort.parseTableBody(this.element, this.keys)
  }

  handleHeadingClick = (event) => {
    const key = event.target.getAttribute('data-key')

    if (!this.currentKey) {
      this.sortAsc = true
      this.currentKey = key
    } else if (key === this.currentKey) {
      this.sortAsc = !this.sortAsc
    } else {
      this.sortAsc = true
      this.currentKey = key
    }

    this.data = TableSort.sort(this.data, key, this.sortAsc)
    this.tableBody.innerHTML = TableSort.render(this.data)

    this.clearSortClasses()

    if (this.sortAsc) {
      addClass(event.target, ASC_CLASS)
    } else {
      addClass(event.target, DESC_CLASS)
    }
  }

  clearSortClasses () {
    removeClass(this.headingElements, ASC_CLASS)
    removeClass(this.headingElements, DESC_CLASS)
  }

  static parseTableHeader (headingElements) {
    let keys = []
    // parse the headings into an array of keys.
    for (let pos = 0; pos < headingElements.length; pos += 1) {
      keys.push(headingElements.item(pos).getAttribute('data-key'))
    }

    return keys
  }

  static parseTableBody (tableElement, keys) {
    let rowsData = []
    const rows = tableElement.querySelectorAll('tbody tr')

    for (let rowPos = 0; rowPos < rows.length; rowPos += 1) {
      const rowElement = rows.item(rowPos)
      const rowCells = rowElement.querySelectorAll('td')
      rowsData[rowPos] = {}
      for (let col = 0; col < keys.length; col += 1) {
        rowsData[rowPos][keys[col]] = rowCells[col].textContent
      }
    }

    return rowsData
  }

  static sort (data, key, sortAsc = true) {
    return data.sort((a, b) => {
      let aValue = a[key]
      let bValue = b[key]

      if (isDate(aValue) && isDate(bValue)) {
        aValue = convertToDate(aValue)
        bValue = convertToDate(bValue)
      }

      let result = 0
      if (aValue < bValue) result = -1
      if (aValue > bValue) result = 1

      if (!sortAsc) {
        result = result - (result * 2)
      }

      return result
    })
  }

  static render (data) {
    let html = ''
    for (const record of data) {
      let string = '<tr>'
      for (const key in record) {
        string += `<td>${record[key]}</td>`
      }
      string += '</tr>'
      html += string
    }
    return html
  }

  static activateAll () {
    const elements = document.querySelectorAll('.js-table--sortable')
    for (let pos = 0; pos < elements.length; pos += 1) {
      const element = elements.item(pos)
      new TableSort(element)   // eslint-disable-line no-new
    }
  }
}

module.exports = TableSort
