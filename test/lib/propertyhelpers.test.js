/* globals expect: true, describe: true, it: true */
/* eslint no-unused-expressions: 0 */

const propertyHelpers = require('../../src/lib/propertyhelpers')

describe('Conversion of empty values to nulls in an object with nullEmptyFields', function () {
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

describe('Stripping fields with null values out of an object with deleteNulls', function () {
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
