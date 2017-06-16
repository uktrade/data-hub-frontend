const transformSectors = require('~/src/lib/transform-sectors')
const sectorList = require('~/test/unit/data/sector-list_input.json')

describe('Sectors transformer', () => {
  describe('Has subsector', () => {
    it('should indicate there is a sub sector', () => {
      const hasSubSectors = transformSectors.hasSubsectors('Aerospace : Component Manufacturing')
      expect(hasSubSectors).to.be.true
    })
    it('should indicate there is no sub setor', () => {
      const hasSubSectors = transformSectors.hasSubsectors('Engineering')
      expect(hasSubSectors).to.be.false
    })
  })
  describe('Get primary sector for sector', () => {
    it('should return the primary sector for a sector with a sub', () => {
      const sector = 'Aerospace : Component Manufacturing'
      const primarySector = transformSectors.getPrimarySectorName(sector)
      expect(primarySector).to.equal('Aerospace')
    })
    it('should return the sector given there is no sub sector', () => {
      const sector = 'Advanced Engineering'
      const primarySector = transformSectors.getPrimarySectorName(sector)
      expect(primarySector).to.equal('Advanced Engineering')
    })
  })
  describe('Get all primary sectors', () => {
    let primarySectors
    beforeEach(() => {
      primarySectors = transformSectors.getAllPrimarySectors(sectorList)
    })

    it('should return an array of primary sectors', () => {
      expect(primarySectors).to.be.an('array')
      expect(primarySectors).to.have.lengthOf(3)
    })
    it('should include primary name for sector with subsectors', () => {
      expect(primarySectors).to.include('Aerospace')
    })
    it('should include sector name for sector with no subsectors', () => {
      expect(primarySectors).to.include('Advanced Engineering')
    })
  })
  describe('Get subsectors', () => {
    it('should return a list of sub sectors for a sector', () => {
      const subSectors = transformSectors.getAllSubSectors('Aerospace', sectorList)
      expect(subSectors).to.be.an('array')
      expect(subSectors).to.have.lengthOf(9)
    })
    it('should return null when there are no subsectors', () => {
      const subSectors = transformSectors.getAllSubSectors('Advanced Engineering', sectorList)
      expect(subSectors).to.be.null
    })
    it('Each sub sector should include the id and name', () => {
      const subSectors = transformSectors.getAllSubSectors('Aerospace', sectorList)
      const firstSubSector = subSectors[0]
      expect(firstSubSector).to.have.all.keys('id', 'name')
    })
    it('Each sub sector should contain just the sub name', () => {
      const subSectors = transformSectors.getAllSubSectors('Aerospace', sectorList)
      const firstSubSector = subSectors[0]
      expect(firstSubSector.name).to.equal('Component Manufacturing')
      expect(firstSubSector.id).to.equal('e9e181d2-f6a0-e211-b972-e4115bead28a')
    })
  })
  describe('Get sector for name', () => {
    it('should return the sector object for a given sector name', () => {
      const sector = transformSectors.getSectorForName('Advanced Engineering', sectorList)
      expect(sector).to.eql({
        id: 'af959812-6095-e211-a939-e4115bead28a',
        name: 'Advanced Engineering',
      })
    })
  })
})
