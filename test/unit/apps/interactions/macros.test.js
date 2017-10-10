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

  describe('#interactionEditFormConfig', () => {
    it('should return object with specified returnLink present', () => {
      const actual = this.macros.interactionEditFormConfig({
        returnLink: 'xxx.yyy.zzz',
      })

      expect(actual.returnLink).to.deep.equal('xxx.yyy.zzz')
    })

    it('should return object with transformed contact options', () => {
      const actual = this.macros.interactionEditFormConfig({ contacts: sampleOptions })
      actual.children.find(x => x.name === 'contact').options()

      expect(this.transformContactToOptionSpy).to.have.callCount(2)
    })

    it('should return object with transformed dit_adviser options', () => {
      const actual = this.macros.interactionEditFormConfig({ advisers: sampleOptions })
      actual.children.find(x => x.name === 'dit_adviser').options()

      expect(this.transformContactToOptionSpy).to.have.callCount(2)
    })

    it('should return object with transformed service options', () => {
      const actual = this.macros.interactionEditFormConfig({ services: sampleOptions })
      actual.children.find(x => x.name === 'service').options()

      expect(this.transformObjectToOptionSpy).to.have.callCount(2)
    })

    it('should return object with transformed dit_team options', () => {
      const actual = this.macros.interactionEditFormConfig({ dit_team: sampleOptions })
      actual.children.find(x => x.name === 'dit_team').options()

      expect(this.transformObjectToOptionSpy).to.have.callCount(2)
    })
  })
})
