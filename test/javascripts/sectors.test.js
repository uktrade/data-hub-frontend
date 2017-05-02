/* eslint no-new: 0 */
const jsdom = require('jsdom')
const { JSDOM } = jsdom
const Sectors = require('../../src/javascripts/sectors')

const HTML = `
  <html>
    <body>
      <form>
        <div class="form-group" id="sector-wrapper">
          <label class="form-label-bold" for="sector">Sector</label>
          <select id="sector" class="form-control" name="sector">
            <option value="">Pick a value</option>
            <option value="af959812-6095-e211-a939-e4115bead28a">Advanced Engineering</option>
            <option value="e9e181d2-f6a0-e211-b972-e4115bead28a">Aerospace : Component Manufacturing</option>
            <option value="b122c9d2-5f95-e211-a939-e4115bead28a">Aerospace : Component Manufacturing : Engines</option>
            <option value="e74171b4-efe9-e511-8ffa-e4115bead28a">Aerospace : Component Manufacturing : test widgets</option>
            <option value="b722c9d2-5f95-e211-a939-e4115bead28a">Aerospace : Maintenance</option>
          </select>
        </div>
      </form>
    </body>
  </html>`

function domTokenToArray (obj) {
  let array = []
  // iterate backwards ensuring that length is an UInt32
  for (let i = obj.length >>> 0; i--;) {
    array[i] = obj[i]
  }
  return array
}

describe('Sector control', function () {
  let document
  let sectorsControl

  beforeEach(function () {
    const { window } = new JSDOM(HTML)
    document = window.document
    sectorsControl = new Sectors(document.getElementById('sector-wrapper'), document)
  })

  it('should hide the original element', function () {
    expect(domTokenToArray(document.querySelector('#sector-wrapper').classList)).to.include('hidden')
  })
  it('should read the data from the original dropdown and add a primary dropdown listing the primary sectors', function () {
    const primaryDropdownOptionElements = document.querySelectorAll('.primary-sector-wrapper select option')
    const primaryOptions = []

    for (let pos = 0; pos < primaryDropdownOptionElements.length; pos += 1) {
      const optionElement = primaryDropdownOptionElements.item(pos)
      primaryOptions.push(optionElement.innerHTML)
    }

    expect(primaryOptions).to.deep.equal(['Pick a value', 'Advanced Engineering', 'Aerospace'])
  })
  describe('No initial value set', function () {
    describe('initial state', function () {
      it('should show the primary dropdown with no value selected', function () {
        expect(document.getElementById('sector').selectedIndex).to.eq(0)
      })
      it('should hide the subsector dropdown and have no options listed or selected', function () {
        const subsectorSelectElement = document.querySelector('.subsector-wrapper select')
        expect(subsectorSelectElement).to.be.null
      })
    })
    describe('respond to selection', function () {
      it('should show a dropdown of sub sectors if the chosen sector has sub sectors', function () {
        sectorsControl.handlePrimarySelect({
          target: {
            value: 'Aerospace'
          }
        })

        const subsectorSelectElement = document.querySelector('.subsector-wrapper select')
        expect(subsectorSelectElement).to.ok
        const subsectorOptionElements = document.querySelectorAll('.subsector-wrapper select option')
        const subsectorOptions = []
        for (let pos = 0; pos < subsectorOptionElements.length; pos += 1) {
          const optionElement = subsectorOptionElements.item(pos)
          subsectorOptions.push(optionElement.innerHTML)
        }

        expect(subsectorOptions).to.deep.equal(['Select a sector', 'Component Manufacturing', 'Component Manufacturing : Engines', 'Component Manufacturing : test widgets', 'Maintenance'])
      })
      it('should not show a dropdown for sub sectors if selected sector has no sub sectors', function () {
        sectorsControl.handlePrimarySelect({
          target: {
            value: 'Advanced Engineering'
          }
        })

        const subsectorSelectElement = document.querySelector('.subsector-wrapper select')
        expect(subsectorSelectElement).to.be.null
      })
      it('should hide the sub sector dropdown if you select a sector with sub sectors and then select one that doesnt have sub sectors', function () {
        sectorsControl.handlePrimarySelect({
          target: {
            value: 'Aerospace'
          }
        })
        sectorsControl.handlePrimarySelect({
          target: {
            value: 'Advanced Engineering'
          }
        })

        const subsectorSelectElement = document.querySelector('.subsector-wrapper select')
        expect(subsectorSelectElement).to.be.null
      })
    })
    describe('update original select', function () {
      it('should not store a value if you select a primary sector that has sub sectors', function () {
        sectorsControl.handlePrimarySelect({
          target: {
            value: 'Aerospace'
          }
        })
        expect(sectorsControl.sourceSelect.selectedIndex).to.eq(0)
      })
      it('should clear the original select if you previously selected a value and then select a new primary that has no subssectors', function () {
        sectorsControl.sourceSelect.selectedIndex = 1
        sectorsControl.handlePrimarySelect({
          target: {
            value: 'Aerospace'
          }
        })
        expect(sectorsControl.sourceSelect.selectedIndex).to.eq(0)
      })
      it('should set the original select if you select a sector that has no sub sectors', function () {
        sectorsControl.handlePrimarySelect({
          target: {
            value: 'Advanced Engineering'
          }
        })
        expect(sectorsControl.sourceSelect.selectedIndex).to.eq(1)
      })
      it('should set the original select if you select a primary sector and then a sub sector', function () {
        sectorsControl.handlePrimarySelect({
          target: {
            value: 'Aerospace'
          }
        })
        sectorsControl.handleSubsectorSelect({
          target: {
            value: 'e9e181d2-f6a0-e211-b972-e4115bead28a'
          }
        })
        expect(sectorsControl.sourceSelect.selectedIndex).to.eq(2)
      })
    })
  })
  describe('pre-populated', function () {
    const maintenanceHTML = `
      <html>
        <body>
          <form>
            <div class="form-group" id="sector-wrapper" aria-hidden="true">
              <label class="form-label-bold" for="sector">Sector</label>
              <select id="sector" class="form-control" name="sector">
                <option value="">Pick a value</option>
                <option value="af959812-6095-e211-a939-e4115bead28a">Advanced Engineering</option>
                <option value="e9e181d2-f6a0-e211-b972-e4115bead28a">Aerospace : Component Manufacturing</option>
                <option value="b122c9d2-5f95-e211-a939-e4115bead28a">Aerospace : Component Manufacturing : Engines</option>
                <option value="e74171b4-efe9-e511-8ffa-e4115bead28a">Aerospace : Component Manufacturing : test widgets</option>
                <option value="b722c9d2-5f95-e211-a939-e4115bead28a" selected>Aerospace : Maintenance</option>
              </select>
            </div>
          </form>
        </body>
      </html>`

    const engineeringHTML = `
      <html>
        <body>
          <form>
            <div class="form-group" id="sector-wrapper" aria-hidden="true">
              <label class="form-label-bold" for="sector">Sector</label>
              <select id="sector" class="form-control" name="sector">
                <option value="">Pick a value</option>
                <option value="af959812-6095-e211-a939-e4115bead28a" selected>Advanced Engineering</option>
                <option value="e9e181d2-f6a0-e211-b972-e4115bead28a">Aerospace : Component Manufacturing</option>
                <option value="b122c9d2-5f95-e211-a939-e4115bead28a">Aerospace : Component Manufacturing : Engines</option>
                <option value="e74171b4-efe9-e511-8ffa-e4115bead28a">Aerospace : Component Manufacturing : test widgets</option>
                <option value="b722c9d2-5f95-e211-a939-e4115bead28a">Aerospace : Maintenance</option>
              </select>
            </div>
          </form>
        </body>
      </html>`

    describe('initial state', function () {
      it('should show the primary dropdown with the value selected if the current value has a sub sector', function () {
        const { window } = new JSDOM(maintenanceHTML)
        document = window.document
        new Sectors(document.getElementById('sector-wrapper'), document)
        const primaryDropdownElement = document.querySelector('.primary-sector-wrapper select')
        expect(primaryDropdownElement.selectedIndex).to.eq(2)
      })
      it('should show the subsector dropdown with the correct sub sector options and have the correct subsector selected', function () {
        const { window } = new JSDOM(maintenanceHTML)
        document = window.document
        new Sectors(document.getElementById('sector-wrapper'), document)
        const subsectorDropdownElement = document.querySelector('.subsector-wrapper select')
        expect(subsectorDropdownElement.selectedIndex).to.eq(4)
      })
      it('should show the primary dropdown with the value selected if the current value has no sub sector', function () {
        const { window } = new JSDOM(engineeringHTML)
        document = window.document
        new Sectors(document.getElementById('sector-wrapper'), document)
        const primaryDropdownElement = document.querySelector('.primary-sector-wrapper select')
        expect(primaryDropdownElement.selectedIndex).to.eq(1)
      })
      it('should hide the subsector dropdown if the value selected has no sub sector', function () {
        const { window } = new JSDOM(engineeringHTML)
        document = window.document
        new Sectors(document.getElementById('sector-wrapper'), document)
        const subsectorDropdownElement = document.querySelector('.subsector-wrapper select')
        expect(subsectorDropdownElement).to.be.null
      })
    })
    describe('respond to selection', function () {
      it('should hide the sub sector dropdown if you select a sector with sub sectors and then select one that doesnt have sub sectors', function () {
        const { window } = new JSDOM(maintenanceHTML)
        document = window.document
        const sectorsControl = new Sectors(document.getElementById('sector-wrapper'), document)
        sectorsControl.handlePrimarySelect({
          target: {
            value: 'Advanced Engineering'
          }
        })

        const subsectorSelectElement = document.querySelector('.subsector-wrapper select')
        expect(subsectorSelectElement).to.be.null
      })
    })
    describe('update original select', function () {
      it('should not store a value if you select a primary sector that has sub sectors', function () {
        const { window } = new JSDOM(maintenanceHTML)
        document = window.document
        sectorsControl.handlePrimarySelect({
          target: {
            value: 'Aerospace'
          }
        })
        expect(sectorsControl.sourceSelect.selectedIndex).to.eq(0)
      })
      it('should set the original select if you select a sector that has no sub sectors', function () {
        const { window } = new JSDOM(maintenanceHTML)
        document = window.document
        sectorsControl.handlePrimarySelect({
          target: {
            value: 'Advanced Engineering'
          }
        })
        expect(sectorsControl.sourceSelect.selectedIndex).to.eq(1)
      })
      it('should set the original select if you select a primary sector and then a sub sector', function () {
        const { window } = new JSDOM(maintenanceHTML)
        document = window.document
        sectorsControl.handlePrimarySelect({
          target: {
            value: 'Aerospace'
          }
        })
        sectorsControl.handleSubsectorSelect({
          target: {
            value: 'e9e181d2-f6a0-e211-b972-e4115bead28a'
          }
        })
        expect(sectorsControl.sourceSelect.selectedIndex).to.eq(2)
      })
    })
  })
})
