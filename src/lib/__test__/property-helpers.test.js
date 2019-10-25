const propertyHelpers = require('~/src/lib/property-helpers')

describe('PropertyHelpers: Conversion of empty values to nulls in an object with nullEmptyFields', () => {
  it('Should convert an empty string to a null', () => {
    const source = {
      foo: 'foo',
      bar: '',
    }
    const actual = propertyHelpers.nullEmptyFields(source)
    expect(actual.foo).equal('foo')
    expect(actual.bar).be.null
  })
  it('Should leave existing nulls alone', () => {
    const source = {
      foo: 'foo',
      bar: null,
    }
    const actual = propertyHelpers.nullEmptyFields(source)
    expect(actual.foo).equal('foo')
    expect(actual.bar).be.null
  })
})

describe('PropertyHelpers: Stripping fields with null values out of an object with deleteNulls', () => {
  it('Removes fields that have null values from an object', () => {
    const source = {
      foo: 'foo',
      bar: null,
    }
    const actual = propertyHelpers.deleteNulls(source)
    expect(actual.foo).equal('foo')
    expect(actual).to.not.have.property('bar')
  })
  it('Return an empty object if all fields are null', () => {
    const source = {
      foo: null,
      bar: null,
    }
    const actual = propertyHelpers.deleteNulls(source)
    expect(actual).to.deep.equal({})
  })
  it('Should ignore empty strings', () => {
    const source = {
      foo: 'foo',
      bar: '',
    }
    const actual = propertyHelpers.deleteNulls(source)
    expect(actual.foo).to.equal('foo')
    expect(actual.bar).to.equal('')
  })
  it('Should ignore false fields', () => {
    const source = {
      foo: 'foo',
      bar: false,
    }
    const actual = propertyHelpers.deleteNulls(source)
    expect(actual.foo).to.equal('foo')
    expect(actual.bar).to.be.false
  })
})

describe('PropertyHelpers: Finding names in objects with getPropertyName', () => {
  it('Should find a name in the first level of an object', () => {
    const source = {
      foo: 'bar',
      data: {
        id: '123456',
        name: 'morph the cat',
      },
    }
    const actual = propertyHelpers.getPropertyName(source, 'data')
    expect(actual).to.equal('morph the cat')
  })
  it('Should return undefined if the source property exists but does not have a name sub-property', () => {
    const source = {
      foo: 'bar',
      data: {
        id: '123456',
        nomme: 'morph the cat',
      },
    }
    const actual = propertyHelpers.getPropertyName(source, 'data')
    expect(actual).to.eq(null)
  })
  it('Should return null if the source property dows not exist', () => {
    const source = {
      foo: 'bar',
      picard: {
        id: '123456',
        nomme: 'morph the cat',
      },
    }
    const actual = propertyHelpers.getPropertyName(source, 'data')
    expect(actual).to.be.null
  })
})

describe('PropertyHelpers: Finding IDs in objects with getPropertyId', () => {
  it('Should find a name in the first level of an object', () => {
    const source = {
      foo: 'bar',
      data: {
        id: '123456',
        name: 'morph the cat',
      },
    }
    const actual = propertyHelpers.getPropertyId(source, 'data')
    expect(actual).to.equal('123456')
  })
  it('Should return undefined if the source property exists but does not have a name sub-property', () => {
    const source = {
      foo: 'bar',
      data: {
        guid: '123456',
        name: 'morph the cat',
      },
    }
    const actual = propertyHelpers.getPropertyId(source, 'data')
    expect(actual).to.equal(null)
  })
  it('Should return null if the source property dows not exist', () => {
    const source = {
      foo: 'bar',
      picard: {
        id: '123456',
        nomme: 'morph the cat',
      },
    }
    const actual = propertyHelpers.getPropertyId(source, 'data')
    expect(actual).to.be.null
  })
})

describe('PropertyHelpers: Convert Yes and No string to true and false with convertYesNoToBoolean', () => {
  it('Should turn a Yes into a boolean true', () => {
    const source = {
      foo: 'Yes',
    }

    const actual = propertyHelpers.convertYesNoToBoolean(source)
    expect(actual.foo).to.equal(true)
    expect(typeof actual.foo).to.equal('boolean')
  })
  it('Should turn a No into a boolean false', () => {
    const source = {
      foo: 'No',
    }

    const actual = propertyHelpers.convertYesNoToBoolean(source)
    expect(actual.foo).to.equal(false)
    expect(typeof actual.foo).to.equal('boolean')
  })
  it('Should ignore case', () => {
    const source = {
      foo: 'yES',
      bar: 'nO',
    }

    const actual = propertyHelpers.convertYesNoToBoolean(source)
    expect(actual.foo).to.be.true
    expect(typeof actual.foo).to.equal('boolean')
    expect(actual.bar).to.be.false
    expect(typeof actual.bar).to.equal('boolean')
  })
})

describe('PropertyHelpers: Conversion of nested objects', () => {
  it('Should convert an empty string to null', () => {
    const source = {
      foo: 'foo',
      bar: null,
    }
    const actual = propertyHelpers.convertNestedObjects(source, ['bar'])
    expect(actual.bar).be.null
  })
  it('Should convert a string to a nested object', () => {
    const source = {
      foo: 'foo',
      bar: 'some-id',
    }
    const actual = propertyHelpers.convertNestedObjects(source, ['bar'])
    expect(actual.bar).to.deep.equal({
      id: 'some-id',
    })
  })
  it('Should do nothing if props is not passed in', () => {
    const source = {
      foo: 'foo',
      bar: 'some-id',
    }
    const actual = propertyHelpers.convertNestedObjects(source)
    expect(actual).to.deep.equal(source)
  })
  it('Should do nothing if object and props are not passed in', () => {
    const actual = propertyHelpers.convertNestedObjects()
    expect(actual).to.deep.equal({})
  })
})
