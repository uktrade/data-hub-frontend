const adviserFilters = require('~/src/apps/adviser/filters')

describe('adviser filters', () => {
  describe('#filterActiveAdvisers', () => {
    beforeEach(() => {
      this.activeInactiveAdviserData = [{
        id: '1',
        name: 'Jeff Smith',
        is_active: true,
      }, {
        id: '2',
        name: 'John Smith',
        is_active: true,
      }, {
        id: '3',
        name: 'Zac Smith',
        is_active: true,
      }, {
        id: '4',
        name: 'Fred Smith',
        is_active: false,
      }, {
        id: '5',
        name: 'Jim Smith',
        is_active: false,
      }]
    })

    context('when no current adviser is specified', () => {
      beforeEach(() => {
        this.activeAdvisers = adviserFilters.filterActiveAdvisers({ advisers: this.activeInactiveAdviserData })
      })

      it('should exlude records not active', () => {
        const expectedAdvisers = [{
          id: '1',
          name: 'Jeff Smith',
          is_active: true,
        }, {
          id: '2',
          name: 'John Smith',
          is_active: true,
        }, {
          id: '3',
          name: 'Zac Smith',
          is_active: true,
        }]

        expect(this.activeAdvisers).to.deep.equal(expectedAdvisers)
      })
    })

    context('when a current adviser is specified', () => {
      beforeEach(() => {
        const currentAdviser = this.activeInactiveAdviserData[3].id

        this.activeAdvisers = adviserFilters.filterActiveAdvisers({
          advisers: this.activeInactiveAdviserData,
          includeAdviser: currentAdviser,
        })
      })

      it('should include active records and the current adviser', () => {
        const expectedAdvisers = [{
          id: '1',
          name: 'Jeff Smith',
          is_active: true,
        }, {
          id: '2',
          name: 'John Smith',
          is_active: true,
        }, {
          id: '3',
          name: 'Zac Smith',
          is_active: true,
        }, {
          id: '4',
          name: 'Fred Smith',
          is_active: false,
        }]

        expect(this.activeAdvisers).to.deep.equal(expectedAdvisers)
      })
    })

    context('when adviser data has no is_active property', () => {
      beforeEach(() => {
        this.badAdviserData = [{
          id: '1',
          name: 'Jeff Smith',
        }, {
          id: '2',
          name: 'John Smith',
        }]

        this.activeAdvisers = adviserFilters.filterActiveAdvisers({ advisers: this.badAdviserData })
      })

      it('should include adviser', () => {
        expect(this.activeAdvisers).to.deep.equal(this.badAdviserData)
      })
    })
  })
})
