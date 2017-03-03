/* eslint no-new: 0 */
const { createElementFromMarkup, hide, show, insertAfter } = require('@uktrade/trade_elements').elementstuff
const transformSectors = require('../lib/transformsectors')

const PRIMARYPANELMARKUP = `
  <div class="form-group">
    <label class="form-label-bold">Sector</label>
    <select class="form-control"></select>
  </div>`

const SECONDARYPANELMARKUP = `
  <div class="panel panel-border-narrow hidden" aria-hidden="true">
    <div class="form-group">
      <label class="form-label-bold">Subsector</label>
      <select class="form-control"></select>
    </div>
  </div>`

class Sectors {

  constructor () {
    this.cacheElements()
    this.attachEvents()
    this.parseData()
    this.showPrimarySectors()
  }

  cacheElements () {
    this.sourceWrapper = document.getElementById('sector-wrapper')
    this.sourceSelect = this.sourceWrapper.querySelector('select')
    hide(this.sourceWrapper)

    this.primaryPanel = createElementFromMarkup(PRIMARYPANELMARKUP)
    this.primarySelectElement = this.primaryPanel.querySelector('select')
    insertAfter(this.primaryPanel, this.sourceWrapper)

    this.secondaryPanel = createElementFromMarkup(SECONDARYPANELMARKUP)
    this.secondarySelectElement = this.secondaryPanel.querySelector('select')
    insertAfter(this.secondaryPanel, this.primarySelectElement)
  }

  attachEvents () {
    this.primarySelectElement.addEventListener('change', this.handlePrimarySelect, true)
    this.secondarySelectElement.addEventListener('change', this.handleSecondarySelect, true)
  }

  // parse the list of options into a list of all sectors
  // and primary sectors
  parseData () {
    const optionElements = this.sourceSelect.querySelectorAll('option')
    const sectors = []
    for (let pos = 0; pos < optionElements.length; pos += 1) {
      const optionElement = optionElements.item(pos)
      sectors.push({ id: optionElement.value, name: optionElement.innerText })
    }

    this.primarySectors = transformSectors.getAllPrimarySectors(sectors)
    this.sectors = sectors
  }

  handlePrimarySelect = (event) => {
    const sectorName = event.target.value
    const subSectors = transformSectors.getAllSubSectors(sectorName, this.sectors)
    let markup = '<option value="">Select a sector</option>'

    for (const subSector of subSectors) {
      markup += `<option value="${subSector.id}">${subSector.name}</option>`
    }

    this.secondarySelectElement.innerHTML = markup
    show(this.secondaryPanel)
    this.sourceSelect.value = ''
  }

  handleSecondarySelect = (event) => {
    const value = event.target.value
    this.sourceSelect.value = value
  }

  showPrimarySectors () {
    let primarySelectInnerMarkup = ''

    for (const primarySector of this.primarySectors) {
      primarySelectInnerMarkup += `<option>${primarySector}</option>`
    }

    this.primarySelectElement.innerHTML = primarySelectInnerMarkup
  }
}

new Sectors()
