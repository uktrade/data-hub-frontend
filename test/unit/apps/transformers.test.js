const transformers = require('~/src/apps/transformers')

describe('Global transformers', () => {
  describe('transformObjectToOption()', () => {
    it('should return value and label from id and name', () => {
      const option = transformers.transformObjectToOption({
        id: '1',
        name: 'One',
        foo: 'bar',
      })

      expect(option).to.deep.equal({
        value: '1',
        label: 'One',
      })
    })
  })
  describe('transformStringToOption()', () => {
    it('should return value and label from string', () => {
      const option = transformers.transformStringToOption('One')

      expect(option).to.deep.equal({
        value: 'One',
        label: 'One',
      })
    })
  })

  describe('transformContactToOption()', () => {
    it('should return value and label from id and first_name/last_name', () => {
      const option = transformers.transformContactToOption({
        id: '1',
        first_name: 'Steve',
        last_name: 'George',
        foo: 'bar',
      })

      expect(option).to.deep.equal({
        value: '1',
        label: 'Steve George',
      })
    })
  })
})
