describe('#buildSortObject', () => {
  beforeEach(async () => {
    this.controller = require('~/src/apps/builders')
    this.options = [
      { value: 'o1', label: 'Option #1' },
      { value: 'o2', label: 'Option #2' },
    ]
  })

  it('should return object with empty options when no arguments are given', () => {
    const actual = this.controller.buildSortObject()

    expect(actual).to.have.property('options').that.is.an('array').and.have.length(0)
    expect(actual).to.have.property('selected').that.is.undefined
  })

  it('should return an object with options populated from passed argument', () => {
    const actual = this.controller.buildSortObject(this.options)

    expect(actual).to.have.property('options').that.is.an('array').and.have.length(2)
    expect(actual.options[0]).to.have.property('value', 'o1')
    expect(actual.options[0]).to.have.property('label', 'Option #1')
    expect(actual.options[1]).to.have.property('value', 'o2')
    expect(actual.options[1]).to.have.property('label', 'Option #2')
  })

  it('should return an object containing selected sort mode and sort options', () => {
    const actual = this.controller.buildSortObject(this.options, { sortby: 'o1' })

    expect(actual).to.have.property('options').that.is.an('array').and.have.length(2)
    expect(actual).to.have.property('selected', 'o1')
  })
})
