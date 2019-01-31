describe('setInvestmentsLocalNav', () => {
  beforeEach(() => {
    this.setInvestmentsLocalNav = require('~/src/apps/investment-projects/middleware/local-navigation')
    this.NAV_ITEMS = [{
      path: 'propositions', label: 'Propositions', permissions: ['permission1'],
    }, {
      path: 'evaluation', label: 'Evaluations', permissions: ['permission0'],
    }, {
      path: 'audit', label: 'Audit history',
    }, {
      path: 'documents', label: 'CDMS documents', permissions: ['permission2'],
    }]
    this.res = {
      locals: {
        investment: {
          project_code: 'DHP-00000010',
        },
        user: {
          permissions: ['permission0'],
        },
      },
    }
    this.docLabel = this.NAV_ITEMS[3].label
    this.filterNonPermittedItem = sinon.stub().returns(() => true)
    this.setLocalNav = sinon.stub().returns(void 0)
    this.next = sinon.stub().returns(void 0)
  })

  context('when the item passed into the iterator function is not \'documents\' but is a legacy project', () => {
    beforeEach(() => {
      this.SINGLE_NAV_ITEM = this.NAV_ITEMS[0]
    })

    it('should call \'filterNonPermittedItem()\'', () => {
      // for (i in this) console.log('this[\"'+ i + ']\" = ' + this[i])
      this.setInvestmentsLocalNav({}, this.res, this.next, this.NAV_ITEMS, this.filterNonPermittedItem)
      expect(this.filterNonPermittedItem.called).to.be.true
    })

    it('should return nav items based on what \'filterOnPermissions()\' dictates these user can see', () => {
      let expected = this.setInvestmentsLocalNav({}, this.res, this.next, this.SINGLE_NAV_ITEM, this.filterNonPermittedItem)
      expect(expected).to.be.empty
      this.filterNonPermittedItem = sinon.stub().returns(() => false)
      expected = this.setInvestmentsLocalNav({}, this.res, this.next, this.SINGLE_NAV_ITEM, this.filterNonPermittedItem)
      expect(expected).to.be.empty
    })
  })
  context('when the item passed into the iterator function is \'documents\' and is also a legacy project', () => {
    beforeEach(() => {
      this.SINGLE_NAV_ITEM = this.NAV_ITEMS[3]
    })

    it('should call not call \'filterOnPermissions()\' if this is a legacy project', () => {
      this.setInvestmentsLocalNav({}, this.res, this.next, this.SINGLE_NAV_ITEM, this.filterNonPermittedItem)
      expect(this.filterNonPermittedItem.called).to.be.false
    })
  })
})
