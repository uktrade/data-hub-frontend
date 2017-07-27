const transformers = require('~/src/apps/transformers')

describe('Global transformers', () => {
  describe('transformToOptions()', () => {
    context('with default value iteratee', () => {
      it('should map id and name to value and label', () => {
        const options = transformers.transformToOptions([{
          id: '1',
          name: 'One',
        }, {
          id: '2',
          name: 'Two',
        }])

        expect(options).to.deep.equal([{
          value: '1',
          label: 'One',
        }, {
          value: '2',
          label: 'Two',
        }])
      })
    })

    context('when custom value iteratee is supplied', () => {
      it('should map those values to value and label', () => {
        const items = [{
          id: '1',
          custom: 'Custom iteratee one',
        }, {
          id: '2',
          custom: 'Custom iteratee two',
        }]
        const iteratee = (item) => {
          return item.custom
        }
        const options = transformers.transformToOptions(items, iteratee)

        expect(options).to.deep.equal([{
          value: '1',
          label: 'Custom iteratee one',
        }, {
          value: '2',
          label: 'Custom iteratee two',
        }])
      })
    })
  })

  describe('transformContactsToOptions()', () => {
    it('should map id and first_name/last_name to value and label', () => {
      const options = transformers.transformContactsToOptions([{
        id: '1',
        first_name: 'Steve',
        last_name: 'George',
      }, {
        id: '2',
        first_name: 'Graham',
        last_name: 'Nice',
      }])

      expect(options).to.deep.equal([{
        value: '1',
        label: 'Steve George',
      }, {
        value: '2',
        label: 'Graham Nice',
      }])
    })
  })
})
