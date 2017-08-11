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

  describe('transformIdToObject()', () => {
    it('should return an object with id', () => {
      const option = transformers.transformIdToObject('123456')

      expect(option).to.deep.equal({
        id: '123456',
      })
    })
  })

  describe('transformFieldsObjectToMacrosObject()', () => {
    it('should return empty array with no args', () => {
      const actual = transformers.transformFieldsObjectToMacrosObject()

      expect(actual).to.be.an('array').with.length(0)
    })

    it('should return an array of macro configuration objects from object', () => {
      const actual = transformers.transformFieldsObjectToMacrosObject({
        stage: {
          macroName: 'MultipleChoiceField',
          type: 'checkbox',
          value: 'prospect',
        },
      })

      expect(actual).to.deep.equal([
        {
          MultipleChoiceField:
            { name: 'stage', type: 'checkbox', value: 'prospect' },
        },
      ])
    })

    it('should return an array of macro configuration objects from array', () => {
      const actual = transformers.transformFieldsObjectToMacrosObject([
        {
          macroName: 'MultipleChoiceField',
          type: 'checkbox',
          name: 'stage',
          value: 'prospect',
        },
        {
          macroName: 'MetaItem',
          type: 'date',
          name: 'dob',
          value: '2017-08-11',
        },
      ])

      expect(actual).to.deep.equal([
        {
          MultipleChoiceField:
            { name: 'stage', type: 'checkbox', value: 'prospect' },
        },
        {
          MetaItem:
            { name: 'dob', type: 'date', value: '2017-08-11' },
        },
      ])
    })

    it('should return a assign sharedProps', () => {
      const actual = transformers.transformFieldsObjectToMacrosObject([
        {
          macroName: 'MultipleChoiceField',
          type: 'checkbox',
          name: 'stage',
          value: 'prospect',
        },
        {
          macroName: 'MetaItem',
          type: 'date',
          name: 'dob',
          value: '2017-08-11',
        },
      ], {
        shared: 'prop',
        modifier: 'small',
      })

      expect(actual).to.deep.equal([
        {
          MultipleChoiceField: {
            name: 'stage',
            type: 'checkbox',
            value: 'prospect',
            shared: 'prop',
            modifier: 'small',
          },
        },
        {
          MetaItem: {
            name: 'dob',
            type: 'date',
            value: '2017-08-11',
            shared: 'prop',
            modifier: 'small',
          },
        },
      ])
    })
  })
})
