const sampleOptions = [
  { id: 'master', name: 'Master' },
  { id: 'voland', name: 'Voland' },
]

describe('Service deliveries macros', () => {
  beforeEach(() => {
    this.transformContactToOptionSpy = sinon.spy()
    this.transformObjectToOptionSpy = sinon.spy()

    this.macros = proxyquire('~/src/apps/service-deliveries/macros', {
      '../transformers': {
        transformContactToOption: this.transformContactToOptionSpy,
        transformObjectToOption: this.transformObjectToOptionSpy,
      },
      '../../lib/metadata': {
        teams: [
          { id: 'alpha', name: 'Alpha' },
          { id: 'omega', name: 'Omega' },
        ],
      },
    })
  })

  describe('#serviceDeliveryEditFormConfig', () => {
    context('props with no values', () => {
      it('should return form config without props', () => {
        const actual = this.macros.serviceDeliveryEditFormConfig()

        expect(actual).to.be.an('object').and.have.property('buttonText')
        expect(actual).to.have.property('children').and.have.length.gt(1)
      })

      it('should return defaults for falsey props', () => {
        const actual = this.macros.serviceDeliveryEditFormConfig({
          advisers: '',
          contacts: null,
        })

        expect(actual.children[1].options()).to.be.an('array') // services
        expect(actual.children[7].options()).to.be.an('array') // contacts
        expect(actual.children[8].options()).to.be.an('array') // advisers
      })
    })

    context('valid props', () => {
      it('should return object with transformed contact options', () => {
        const actual = this.macros.serviceDeliveryEditFormConfig({ contacts: sampleOptions })
        actual.children.find(x => x.name === 'contact').options()

        expect(this.transformContactToOptionSpy).to.have.callCount(2)
      })

      it('should return object with transformed dit_adviser options', () => {
        const actual = this.macros.serviceDeliveryEditFormConfig({
          advisers: {
            results: sampleOptions,
          },
        })
        actual.children.find(x => x.name === 'dit_adviser').options()

        expect(this.transformContactToOptionSpy).to.have.callCount(2)
      })

      it('should return object with transformed service options', () => {
        const actual = this.macros.serviceDeliveryEditFormConfig({ services: sampleOptions })
        actual.children.find(x => x.name === 'service').options()

        expect(this.transformObjectToOptionSpy).to.have.callCount(2)
      })

      it('should return object with transformed dit_team options', () => {
        const actual = this.macros.serviceDeliveryEditFormConfig({ dit_team: sampleOptions })
        actual.children.find(x => x.name === 'dit_team').options()

        expect(this.transformObjectToOptionSpy).to.have.callCount(2)
      })
    })
  })
})
