const {
  isCheckboxSynced,
} = require('../../../../../assets/javascripts/modules/auto-submit')

describe('#Auto-submit', function () {
  describe('isCheckboxSynced()', function () {
    context('can submit form', function () {
      beforeEach(function () {
        this.evt = {
          target: {
            checked: false,
            type: 'checkbox',
          },
        }

        this.isSubmitting = false
      })

      it('return true and not change checkbox value', function () {
        expect(isCheckboxSynced.call(this, this.evt)).to.equal(true)
        expect(this.evt.target.checked).to.equal(false)
      })
    })

    context('can not submit form', function () {
      beforeEach(function () {
        this.evt = {
          target: {
            checked: true,
            type: 'checkbox',
          },
        }

        this.isSubmitting = true
      })

      it('return false and change checkbox value', function () {
        expect(isCheckboxSynced.call(this, this.evt)).to.equal(undefined)
        expect(this.evt.target.checked).to.equal(false)
      })
    })
  })
})
