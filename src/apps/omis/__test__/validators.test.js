const { each, isArray } = require('lodash')

const validators = require('~/src/apps/omis/validators')

function testName (input) {
  if (isArray(input)) {
    return `${testName(input[0])} with args: ${input.slice(1)}`
  } else {
    return `${typeof input} ${input}`
  }
}

describe('OMIS form validators', () => {
  describe('duration()', () => {
    describe('invalid values', () => {
      const inputs = [
        null,
        undefined,
        true,
        0,
        'a',
        [null],
        [undefined],
        [true],
        [0],
        ['a'],
        [null, '1'],
        [undefined, '1'],
        [true, '1'],
        [0, '1'],
        ['a', '1'],
      ]
      each(inputs, i => {
        it(testName(i), () => {
          expect(validators.duration(i)).to.be.false
        })
      })
    })

    describe('valid values', () => {
      const inputs = [
        '',
        '1',
        [''],
        ['1'],
      ]
      each(inputs, i => {
        it(testName(i), () => {
          expect(validators.duration(i)).to.be.true
        })
      })
    })
  })

  describe('arrayrequired()', () => {
    describe('invalid values', () => {
      const inputs = [
        [undefined],
        [undefined, true],
        [''],
        ['', true],
      ]
      each(inputs, i => {
        it(testName(i), () => {
          expect(validators.arrayrequired(i)).to.be.false
        })
      })
    })

    describe('valid values', () => {
      const inputs = [
        [true],
        [false],
        [1],
        [0],
        ['a'],
      ]
      each(inputs, i => {
        it(testName(i), () => {
          expect(validators.arrayrequired(i)).to.be.true
        })
      })
    })
  })

  describe('euvatnumber()', () => {
    describe('invalid values', () => {
      const inputs = [
        null,
        undefined,
        true,
        0,
        'a',
      ]
      each(inputs, i => {
        it(testName(i), () => {
          expect(validators.euvatnumber(i)).to.be.false
        })
      })
    })

    describe('valid values', () => {
      // Valid EU number formats according to GOV.UK
      const inputs = [
        '',
        'ATU12345678',
        'BE0123456789',
        'BG123456789',
        'BG1234567890',
        'HR12345678901',
        'CY12345678L',
        'CZ12345678',
        'CZ123456789',
        'CZ1234567890',
        'DE123456789',
        'DK12345678',
        'EE123456789',
        'EL123456789',
        'GR123456789',
        'ESX12345678',
        'ES12345678X',
        'ESX1234567X',
        'FI12345678',
        'FR12345678901',
        'FRX1234567890',
        'FR1X123456789',
        'FRXX123456789',
        'GB123456789',
        'GB123456789012',
        'GBXX123',
        'HU12345678',
        'IE1234567X',
        'IE1X23456X',
        'IE1234567XX',
        'IT12345678901',
        'LT123456789',
        'LT123456789012',
        'LU12345678',
        'LV12345678901',
        'MT12345678',
        'NL123456789B01',
        'PL1234567890',
        'PT123456789',
        'RO12',
        'RO123',
        'RO1234',
        'RO12345',
        'RO123456',
        'RO1234567',
        'RO12345678',
        'RO123456789',
        'RO1234567890',
        'SE123456789012',
        'SI12345678',
        'SK1234567890',
      ]
      each(inputs, i => {
        it(testName(i), () => {
          expect(validators.euvatnumber(i)).to.be.true
        })
      })
    })
  })
})
