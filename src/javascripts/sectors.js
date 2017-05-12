/* eslint no-new: 0 */
const { createElementFromMarkup, removeElement, hide, insertAfter } = require('../lib/element-stuff')
const transformSectors = require('../lib/transform-sectors')

const PRIMARYPANELMARKUP = `
  <div class="form-group primary-sector-wrapper">
    <label class="form-label-bold">Sector</label>
    <select class="form-control"></select>
  </div>`

const SUBSECTORPANELMARKUP = `
  <div class="panel panel-border-narrow subsector-wrapper">
    <div class="form-group">
      <label class="form-label-bold">Subsector</label>
      <select class="form-control"></select>
    </div>
  </div>`

class Sectors {
  constructor (element, document) {
    this.document = document || window.document
    this.cacheElements(element)
    this.parseData()
    this.showPrimarySectors()
    this.showInitialValue()
  }

  // Grab a reference to elements that are usefull
  cacheElements (element) {
    this.sourceWrapper = element
    this.sourceSelect = this.sourceWrapper.querySelector('select')
    hide(this.sourceWrapper)
  }

  // Parse the original select dropdown and get a list fo all the sectors available.
  // From this calculate the primary sector list.
  parseData () {
    const optionElements = this.sourceSelect.querySelectorAll('option')
    const sectors = []
    for (let pos = 0; pos < optionElements.length; pos += 1) {
      const optionElement = optionElements.item(pos)
      sectors.push({ id: optionElement.value, name: optionElement.innerHTML })
    }
    this.primarySectors = transformSectors.getAllPrimarySectors(sectors)
    this.sectors = sectors
  }

  // Show a dropdown of primary sectors and listen for selection.
  showPrimarySectors () {
    this.primaryPanel = createElementFromMarkup(PRIMARYPANELMARKUP, this.document)
    this.primarySelectElement = this.primaryPanel.querySelector('select')

    let primarySelectInnerMarkup = ''
    for (let pos = 0; pos < this.primarySectors.length; pos += 1) {
      primarySelectInnerMarkup += `<option>${this.primarySectors[pos]}</option>`
    }
    this.primarySelectElement.innerHTML = primarySelectInnerMarkup

    this.primarySelectElement.addEventListener('change', this.handlePrimarySelect.bind(this), true)
    insertAfter(this.primaryPanel, this.sourceWrapper)
  }

  // Look at the original select, is this an existing record with an exiting value?
  // If it is then show the sector and subsector selected.
  showInitialValue () {
    if (this.sourceSelect.selectedIndex === 0) return

    const currentValue = this.sourceSelect.options[this.sourceSelect.selectedIndex].value
    const currentOption = this.sectors.filter(option => option.id === currentValue)[0]
    const primarySectorName = transformSectors.getPrimarySectorName(currentOption.name)
    const primaryIndex = this.primarySectors.indexOf(primarySectorName)
    this.primarySelectElement.selectedIndex = primaryIndex

    // If selected value has no sub sector, we are done, otherwise setup the sub sector select
    if (currentOption.name.indexOf(':') === -1) return

    const subSectorName = transformSectors.getSubsectorName(currentOption.name)
    this.hideSubsectorDropdown()
    const subSectors = transformSectors.getAllSubSectors(primarySectorName, this.sectors)
    this.createSubsectorDropdown(subSectors)
    let subsectorIndex = 0

    for (let pos = 0; pos < subSectors.length; pos += 1) {
      if (subSectors[pos].name === subSectorName) {
        subsectorIndex = pos + 1
        break
      }
    }

    this.subsectorSelectElement.selectedIndex = subsectorIndex
  }

  // Create a sub sector dropdown based on the selected primary sector
  createSubsectorDropdown (subSectors) {
    let markup = '<option value="">Select a sector</option>'

    for (let pos = 0; pos < subSectors.length; pos += 1) {
      markup += `<option value="${subSectors[pos].id}">${subSectors[pos].name}</option>`
    }

    this.subsectorPanel = createElementFromMarkup(SUBSECTORPANELMARKUP, this.document)
    this.subsectorSelectElement = this.subsectorPanel.querySelector('select')
    this.subsectorSelectElement.innerHTML = markup
    this.subsectorSelectElement.addEventListener('change', this.handleSubsectorSelect.bind(this), true)
    insertAfter(this.subsectorPanel, this.primarySelectElement)
  }

  // Hide the sub sector dropdown by removing it from the page
  hideSubsectorDropdown () {
    if (this.subsectorPanel) {
      removeElement(this.subsectorPanel)
      this.subsectorPanel = null
    }
  }

  // When the user selects a primary sector, reset the selected value
  // and show the sub sector dropdown if required. If no subsector then
  // update the original dropdown with the value selected.
  handlePrimarySelect (event) {
    const sectorName = event.target.value
    this.sourceSelect.value = ''
    this.hideSubsectorDropdown()
    const subSectors = transformSectors.getAllSubSectors(sectorName, this.sectors)
    if (subSectors && subSectors.length > 0) {
      this.createSubsectorDropdown(subSectors)
    } else {
      this.selectOriginalControlForName(event.target.value)
    }
  }

  // update the original dropdown with the primary sector and subsector selected.
  handleSubsectorSelect (event) {
    const id = event.target.value
    this.selectOriginalControlForId(id)
  }

  // Helper function to make it easy to select the original dropdown
  selectOriginalControlForName (name) {
    let index
    for (let pos = 0; pos < this.sectors.length; pos += 1) {
      if (this.sectors[pos].name === name) {
        index = pos
        break
      }
    }
    this.sourceSelect.selectedIndex = index
  }

  // Helper function to make it easy to select the original dropdown
  selectOriginalControlForId (id) {
    let index
    for (let pos = 0; pos < this.sectors.length; pos += 1) {
      if (this.sectors[pos].id === id) {
        index = pos
        break
      }
    }
    this.sourceSelect.selectedIndex = index
  }
}

// If this control is loaded on a real page, activate
if (typeof document !== 'undefined') {
  const element = document.getElementById('sector-wrapper')
  new Sectors(element)
}

module.exports = Sectors
