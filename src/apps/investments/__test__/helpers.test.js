const proxyquire = require('proxyquire')

describe('buildIncompleteFormList', () => {
  beforeEach(() => {
    this.loggerSpy = sinon.spy()
    this.helpers = proxyquire('../helpers', {
      '../../config/logger': {
        error: this.loggerSpy,
      },
    })
  })

  context('when there are no incomplete fields', () => {
    beforeEach(() => {
      this.actual = this.helpers.buildIncompleteFormList()
    })

    it('should provide an array', () => {
      expect(this.actual).to.be.an('array')
    })

    it('should provide an empty array', () => {
      expect(this.actual.length).to.equal(0)
    })
  })

  context('when the incomplete field label does not exist', () => {
    beforeEach(() => {
      this.actual = this.helpers.buildIncompleteFormList([
        'field_does_not_exist',
        'actual_land_date',
      ])
    })

    it('should provide an array', () => {
      expect(this.actual).to.be.an('array')
    })

    it('should provide an array with one element', () => {
      expect(this.actual.length).to.equal(1)
    })

    it('should provide an array with the existing field', () => {
      const expected = [
        {
          url: 'edit-details',
          text: 'Actual land date',
        },
      ]

      expect(this.actual).to.deep.equal(expected)
    })

    it('should log an error', () => {
      expect(this.loggerSpy.args[0][0]).to.equal(
        'Could not find label for incomplete field field_does_not_exist'
      )
    })

    it('should log once', () => {
      expect(this.loggerSpy).to.be.calledOnce
    })
  })

  context('when the incomplete field form does not exist in the lookup', () => {
    beforeEach(() => {
      this.actual = this.helpers.buildIncompleteFormList([
        'investor_company',
        'actual_land_date',
      ])
    })

    it('should provide an array', () => {
      expect(this.actual).to.be.an('array')
    })

    it('should provide an array with one element', () => {
      expect(this.actual.length).to.equal(1)
    })

    it('should provide an array with the existing field', () => {
      const expected = [
        {
          url: 'edit-details',
          text: 'Actual land date',
        },
      ]

      expect(this.actual).to.deep.equal(expected)
    })

    it('should log an error', () => {
      expect(this.loggerSpy.args[0][0]).to.equal(
        'Could not find form link for incomplete field investor_company'
      )
    })

    it('should log once', () => {
      expect(this.loggerSpy).to.be.calledOnce
    })
  })

  context('when there are three incomplete fields', () => {
    beforeEach(() => {
      this.actual = this.helpers.buildIncompleteFormList([
        'number_new_jobs',
        'actual_land_date',
        'number_safeguarded_jobs',
      ])
    })

    it('should provide an array', () => {
      expect(this.actual).to.be.an('array')
    })

    it('should provide an array with three elements', () => {
      expect(this.actual.length).to.equal(3)
    })

    it('should group together the fields from the same form', () => {
      const expected = [
        {
          url: 'edit-details',
          text: 'Actual land date',
        },
        {
          url: 'edit-value',
          text: 'Number of new jobs',
        },
        {
          url: 'edit-value',
          text: 'Number of safeguarded jobs',
        },
      ]

      expect(this.actual).to.deep.equal(expected)
    })
  })
})
