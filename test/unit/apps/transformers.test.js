const serviceOptionData = require('~/test/unit/data/interactions/service-options-data.json')

describe('Global transformers', () => {
  beforeEach(() => {
    this.transformers = require('~/src/apps/transformers')
  })

  describe('#transformObjectToOption', () => {
    it('should return value and label from id and name', () => {
      const actual = this.transformers.transformObjectToOption({
        id: '1',
        name: 'One',
        foo: 'bar',
      })

      expect(actual).to.deep.equal({
        value: '1',
        label: 'One',
      })
    })
  })

  describe('#transformStringToOption', () => {
    it('should return value and label from string', () => {
      const actual = this.transformers.transformStringToOption('One')

      expect(actual).to.deep.equal({
        value: 'One',
        label: 'One',
      })
    })
  })

  describe('#transformContactToOption', () => {
    it('should return value and label from id and first_name/last_name', () => {
      const actual = this.transformers.transformContactToOption({
        id: '1',
        first_name: 'Steve',
        last_name: 'George',
        foo: 'bar',
      })

      expect(actual).to.deep.equal({
        value: '1',
        label: 'Steve George',
      })
    })
  })

  describe('#transformDateObjectToDateString', () => {
    context('when invalid key', () => {
      it('should throw an error', () => {
        const actual = () => this.transformers.transformDateObjectToDateString()

        expect(actual).to.throw('date object key is required to transform date')
      })
    })

    context('when valid key', () => {
      it('should return a function', () => {
        const actual = this.transformers.transformDateObjectToDateString(
          'start_date'
        )

        expect(actual).to.be.a('function')
      })
    })

    context('when valid key with inner call', () => {
      it('should return empty string for incorrect object', () => {
        expect(
          this.transformers.transformDateObjectToDateString('start_date')()
        ).to.be.null
        expect(
          this.transformers.transformDateObjectToDateString('start_date')({})
        ).to.be.null
        expect(
          this.transformers.transformDateObjectToDateString('start_date')({
            a: 'v',
          })
        ).to.be.null
        expect(
          this.transformers.transformDateObjectToDateString('start_date')({
            year: '123124',
          })
        ).to.be.null
        expect(
          this.transformers.transformDateObjectToDateString('start_date')({
            year: '2017',
          })
        ).to.be.null
      })

      it('should return date string for correct object', () => {
        const dateObj = {
          start_date_year: '2017',
          start_date_month: '09',
          start_date_day: '25',
        }
        const actual = this.transformers.transformDateObjectToDateString(
          'start_date'
        )(dateObj)

        expect(actual).to.equal('2017-09-25')
      })

      it('should return partial date string for object', () => {
        const actualYearMonth = this.transformers.transformDateObjectToDateString(
          'start_date'
        )({
          start_date_year: '2017',
          start_date_month: '09',
        })
        const actualYear = this.transformers.transformDateObjectToDateString(
          'start_date'
        )({
          start_date_year: '2017',
        })

        expect(actualYearMonth).to.equal('2017-09-')
        expect(actualYear).to.equal('2017--')
      })
    })
  })

  describe('#transformDateStringToDateObject', () => {
    context('when invalid date string', () => {
      it('should return empty date object for no args', () => {
        const actual = this.transformers.transformDateStringToDateObject()

        expect(actual).to.deep.equal({
          year: '',
          month: '',
          day: '',
        })
      })

      it('should return empty date object for invalid date', () => {
        const actual = this.transformers.transformDateStringToDateObject(
          '12345-098-11'
        )

        expect(actual).to.deep.equal({
          year: '',
          month: '',
          day: '',
        })
      })
    })

    context('when valid date string', () => {
      it('should return correct date object from date string', () => {
        const actual = this.transformers.transformDateStringToDateObject(
          '2017-09-25'
        )

        expect(actual).to.deep.equal({
          year: '2017',
          month: '09',
          day: '25',
        })
      })
    })
  })

  describe('#transformIdToObject', () => {
    it('should return an object with id', () => {
      const actual = this.transformers.transformIdToObject('123456')

      expect(actual).to.deep.equal({
        id: '123456',
      })
    })
  })

  describe('#transformServicesOptions', () => {
    context(
      'when the service options have no interaction questions or secondary options',
      () => {
        it('should return the correct options', () => {
          const actual = this.transformers.transformServicesOptions([
            serviceOptionData[0],
          ])
          expect(actual).to.deep.equal([
            {
              label: 'Account Management',
              value: 'sv1',
              interactionQuestions: [],
              secondaryOptions: [],
            },
          ])
        })
      }
    )
    context('when the service options have interaction questions', () => {
      it('should return the correct options', () => {
        const actual = this.transformers.transformServicesOptions([
          serviceOptionData[1],
        ])
        expect(actual).to.deep.equal([
          {
            label: 'Providing Export Advice & Information',
            value: 'Providing Export Advice & Information',
            interactionQuestions: [],
            secondaryOptions: [
              {
                label: 'Advice & information',
                value: 'sv2',
                parent: 'Providing Export Advice & Information',
                interactionQuestions: [
                  {
                    label: 'What did you give advice about?',
                    value: 'sv2-q1',
                    options: [
                      { label: 'Banking & Funding', value: 'sv2-q1-a1' },
                      {
                        label: 'More Banking & Funding',
                        value: 'sv2-q1-a2',
                      },
                    ],
                    serviceId: 'sv2',
                    isControlledBySecondary: true,
                  },
                  {
                    label: 'Another question?',
                    value: 'sv2-q2',
                    options: [
                      { label: 'Banking & Funding', value: 'sv2-q2-a1' },
                      {
                        label: 'More Banking & Funding',
                        value: 'sv2-q2-a2',
                      },
                    ],
                    serviceId: 'sv2',
                    isControlledBySecondary: true,
                  },
                ],
              },
            ],
          },
        ])
      })
    })
    context('when the service options have no interaction questions', () => {
      it('should return the correct options', () => {
        const actual = this.transformers.transformServicesOptions([
          serviceOptionData[0],
        ])
        expect(actual).to.deep.equal([
          {
            label: 'Account Management',
            value: 'sv1',
            interactionQuestions: [],
            secondaryOptions: [],
          },
        ])
      })
    })

    context('when the service has questions but no sub service', () => {
      it('should return the correct options', () => {
        const actual = this.transformers.transformServicesOptions([
          serviceOptionData[2],
        ])
        expect(actual).to.deep.equal([
          {
            interactionQuestions: [
              {
                label: 'Who was the company introduced to?',
                options: [
                  {
                    label: 'Customers',
                    value: 'sv3-q1-a1',
                  },
                  {
                    label: 'More customers',
                    value: 'sv3-q1-a2',
                  },
                ],
                serviceId: 'sv3',
                value: 'sv3-q1',
              },
            ],
            label: 'Making Introductions (Export)',
            secondaryOptions: [],
            value: 'sv3',
          },
        ])
      })
    })
  })
})
