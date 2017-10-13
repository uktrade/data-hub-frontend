const sampleOptions = [
  { id: 'master', name: 'Master' },
  { id: 'voland', name: 'Voland' },
]

describe('Interaction macros', () => {
  beforeEach(() => {
    this.transformContactToOptionSpy = sinon.spy()
    this.transformObjectToOptionSpy = sinon.spy()

    this.macros = proxyquire('~/src/apps/interactions/macros', {
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

  describe('#interactionFormConfig', () => {
    it('should return object with specified returnLink present', () => {
      const returnLink = '/companies/1/interactions'
      const actual = this.macros.interactionFormConfig({ returnLink })

      expect(actual.returnLink).to.deep.equal(returnLink)
    })

    it('should return object with transformed contact options', () => {
      const actual = this.macros.interactionFormConfig({ contacts: sampleOptions })
      actual.children.find(x => x.name === 'contact').options()

      expect(this.transformContactToOptionSpy).to.have.callCount(2)
    })

    it('should return object with transformed dit_adviser options', () => {
      const actual = this.macros.interactionFormConfig({ advisers: sampleOptions })
      actual.children.find(x => x.name === 'dit_adviser').options()

      expect(this.transformContactToOptionSpy).to.have.callCount(2)
    })

    it('should return object with transformed service options', () => {
      const actual = this.macros.interactionFormConfig({ services: sampleOptions })
      actual.children.find(x => x.name === 'service').options()

      expect(this.transformObjectToOptionSpy).to.have.callCount(2)
    })

    it('should return object with transformed dit_team options', () => {
      const actual = this.macros.interactionFormConfig({ dit_team: sampleOptions })
      actual.children.find(x => x.name === 'dit_team').options()

      expect(this.transformObjectToOptionSpy).to.have.callCount(2)
    })
  })

  describe('#serviceDeliveryFormConfig', () => {
    it('should return object with transformed event options', () => {
      const actual = this.macros.serviceDeliveryFormConfig({ events: sampleOptions })
      actual.children.find(x => x.name === 'event').options()

      expect(this.transformObjectToOptionSpy).to.have.callCount(2)
    })
  })
})
