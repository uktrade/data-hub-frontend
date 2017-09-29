const { uniqueId } = require('lodash')

const { parseDateString } = require('../../../common/date')
const { addClass, removeClass } = require('../_deprecated/lib/element-stuff')

function isDate (text) {
  return parseDateString(text) !== null
}

function convertToDate (dateString) {
  return parseDateString(dateString)
}

const ASC_CLASS = 'is-ascending'
const DESC_CLASS = 'is-descending'

class SortableTable {
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
    this.headingElements.forEach((element) => {
      element.addEventListener('click', this.handleHeadingClick.bind(this))
    })
  }

  parseTable () {
    this.keys = SortableTable.assignTableKeys(this.headingElements)
    this.data = SortableTable.parseTableBody(this.element, this.keys)
  }

  handleHeadingClick (event) {
    const key = event.target.getAttribute('data-key')

    if (this.currentKey && key === this.currentKey) {
      this.sortAsc = !this.sortAsc
    } else {
      this.sortAsc = true
      this.currentKey = key
    }

    this.data = SortableTable.sort(this.data, key, this.sortAsc)
    this.tableBody.innerHTML = SortableTable.render(this.data)

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

  static assignTableKeys (headingElements) {
    let keys = []
    // parse the headings into an array of keys.
    headingElements.forEach((headingElement) => {
      const key = uniqueId('SortableTable__Column-')
      keys.push(key)
      headingElement.setAttribute('data-key', key)
    })

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

      let result
      if (aValue < bValue) {
        result = -1
      } else if (aValue > bValue) {
        result = 1
      } else {
        result = 0
      }

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

  static init () {
    const elements = document.querySelectorAll('.js-SortableTable')
    for (let pos = 0; pos < elements.length; pos += 1) {
      const element = elements.item(pos)
      new SortableTable(element) // eslint-disable-line no-new
    }
  }
}

module.exports = SortableTable
