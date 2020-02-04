const envSchema = require('../envSchema')

describe('envSchema', () => {
  it('should parse VCAP_SERVICES from a JSON string', () => {
    const jsonString = '{"str":"ing","numb":1,"bol":false,"obj":{},"arr":[]}'
    const { value } = envSchema.validate(
      {
        VCAP_SERVICES: jsonString,
      },
      {
        allowUnknown: true,
        abortEarly: false,
      }
    )

    expect(value.VCAP_SERVICES).to.deep.equal({
      str: 'ing',
      numb: 1,
      bol: false,
      obj: {},
      arr: [],
    })
  })
})
