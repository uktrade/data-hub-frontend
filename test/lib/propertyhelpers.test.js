/* globals expect: true, describe: true, it: true */
/* eslint no-unused-expressions: 0 */

const propertyHelpers = require('../../src/lib/propertyhelpers')

describe('PropertyHelpers: Conversion of empty values to nulls in an object with nullEmptyFields', function () {
  it('Should convert an empty string to a null', function () {
    const source = {
      foo: 'foo',
      bar: ''
    }
    const actual = propertyHelpers.nullEmptyFields(source)
    expect(actual.foo).equal('foo')
    expect(actual.bar).equal(null)
  })
  it('Should leave existing nulls alone', function () {
    const source = {
      foo: 'foo',
      bar: null
    }
    const actual = propertyHelpers.nullEmptyFields(source)
    expect(actual.foo).equal('foo')
    expect(actual.bar).equal(null)
  })
})

describe('PropertyHelpers: Stripping fields with null values out of an object with deleteNulls', function () {
  it('Removes fields that have null values from an object', function () {
    const source = {
      foo: 'foo',
      bar: null
    }
    const actual = propertyHelpers.deleteNulls(source)
    expect(actual.foo).equal('foo')
    expect(actual).to.not.have.property('bar')
  })
  it('Return an empty object if all fields are null', function () {
    const source = {
      foo: null,
      bar: null
    }
    const actual = propertyHelpers.deleteNulls(source)
    expect(actual).to.deep.equal({})
  })
  it('Should ignore empty strings', function () {
    const source = {
      foo: 'foo',
      bar: ''
    }
    const actual = propertyHelpers.deleteNulls(source)
    expect(actual.foo).to.equal('foo')
    expect(actual.bar).to.equal('')
  })
  it('Should ignore false fields', function () {
    const source = {
      foo: 'foo',
      bar: false
    }
    const actual = propertyHelpers.deleteNulls(source)
    expect(actual.foo).to.equal('foo')
    expect(actual.bar).to.equal(false)
  })
})

describe('PropertyHelpers: Finding names in objects with getPropertyName', function () {
  it('Should find a name in the first level of an object', function () {
    const source = {
      foo: 'bar',
      data: {
        id: '123456',
        name: 'morph the cat'
      }
    }
    const actual = propertyHelpers.getPropertyName(source, 'data')
    expect(actual).to.equal('morph the cat')
  })
  it('Should return undefined if the source property exists but does not have a name sub-property', function () {
    const source = {
      foo: 'bar',
      data: {
        id: '123456',
        nomme: 'morph the cat'
      }
    }
    const actual = propertyHelpers.getPropertyName(source, 'data')
    expect(actual).to.equal(undefined)
  })
  it('Should return null if the source property dows not exist', function () {
    const source = {
      foo: 'bar',
      picard: {
        id: '123456',
        nomme: 'morph the cat'
      }
    }
    const actual = propertyHelpers.getPropertyName(source, 'data')
    expect(actual).to.equal(null)
  })
})

describe('PropertyHelpers: Finding IDs in objects with getPropertyId', function () {
  it('Should find a name in the first level of an object', function () {
    const source = {
      foo: 'bar',
      data: {
        id: '123456',
        name: 'morph the cat'
      }
    }
    const actual = propertyHelpers.getPropertyId(source, 'data')
    expect(actual).to.equal('123456')
  })
  it('Should return undefined if the source property exists but does not have a name sub-property', function () {
    const source = {
      foo: 'bar',
      data: {
        guid: '123456',
        name: 'morph the cat'
      }
    }
    const actual = propertyHelpers.getPropertyId(source, 'data')
    expect(actual).to.equal(undefined)
  })
  it('Should return null if the source property dows not exist', function () {
    const source = {
      foo: 'bar',
      picard: {
        id: '123456',
        nomme: 'morph the cat'
      }
    }
    const actual = propertyHelpers.getPropertyId(source, 'data')
    expect(actual).to.equal(null)
  })
})

describe('PropertyHelpers: Convert Yes and No string to true and false with convertYesNoToBoolean', function () {
  it('Should turn a Yes into a boolean true', function () {
    const source = {
      foo: 'Yes'
    }

    const actual = propertyHelpers.convertYesNoToBoolean(source)
    expect(actual.foo).to.equal(true)
    expect(typeof actual.foo).to.equal('boolean')
  })
  it('Should turn a No into a boolean false', function () {
    const source = {
      foo: 'No'
    }

    const actual = propertyHelpers.convertYesNoToBoolean(source)
    expect(actual.foo).to.equal(false)
    expect(typeof actual.foo).to.equal('boolean')
  })
  it('Should ignore case', function () {
    const source = {
      foo: 'yES',
      bar: 'nO'
    }

    const actual = propertyHelpers.convertYesNoToBoolean(source)
    expect(actual.foo).to.equal(true)
    expect(typeof actual.foo).to.equal('boolean')
    expect(actual.bar).to.equal(false)
    expect(typeof actual.bar).to.equal('boolean')
  })
})

describe('PropertyHelpers: Check if an object has a property that is also an object with hasObjectProperty', function () {
  it('Should return true if an object is found in an object', function () {
    const source = {
      foo: {
        bar: 1
      }
    }

    const actual = propertyHelpers.hasObjectProperty(source, 'foo')
    expect(actual).to.equal(true)
    expect(typeof actual).to.equal('boolean')
  })
  it('Should return false if the property is not an object', function () {
    const source = {
      foo: 1
    }

    const actual = propertyHelpers.hasObjectProperty(source, 'foo')
    expect(actual).to.equal(false)
    expect(typeof actual).to.equal('boolean')
  })
})

describe('PropertyHelpers: Check if an object has a property with hasProperty', function () {
  it('Should return true if an object is found in an object', function () {
    const source = {
      foo: {
        bar: 1
      }
    }

    const actual = propertyHelpers.hasProperty(source, 'foo')
    expect(actual).to.equal(true)
    expect(typeof actual).to.equal('boolean')
  })
  it('Should return false if the property does not exist', function () {
    const source = {
      bar: 1
    }

    const actual = propertyHelpers.hasProperty(source, 'foo')
    expect(actual).to.equal(false)
    expect(typeof actual).to.equal('boolean')
  })
})