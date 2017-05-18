const findSectorName = /^(.+?) :/
const findSubsectorName = /^.+? : (.+)$/

function hasSubsectors (sectorName) {
  return (sectorName && sectorName.indexOf(' : ') >= 0)
}

function getPrimarySectorName (sectorName) {
  if (hasSubsectors(sectorName)) {
    const results = findSectorName.exec(sectorName)
    return results && results[1]
  }

  return sectorName
}

function getSubsectorName (sectorName) {
  return sectorName.replace(findSubsectorName, '$1')
}

function getAllPrimarySectors (allSectors = []) {
  const subSectors = {}

  allSectors.forEach((sector) => {
    subSectors[getPrimarySectorName(sector.name)] = true
  })

  return Object.keys(subSectors)
}

function getAllSubSectors (sectorName, allSectors) {
  const allSubSectors = allSectors
    .filter(sector => getPrimarySectorName(sector.name) === sectorName)
    .map(sector => ({
      id: sector.id,
      name: getSubsectorName(sector.name)
    }))

  if (allSubSectors === null || allSubSectors.length === 1) return null

  return allSubSectors
}

function getSectorForName (sectorName, allSectors) {
  return allSectors.find(sector => getPrimarySectorName(sector.name) === sectorName)
}

function getSectorForId (sectorId, allSectors) {
  return allSectors.find(sector => sector.id === sectorId)
}

module.exports = {
  hasSubsectors,
  getPrimarySectorName,
  getSubsectorName,
  getAllSubSectors,
  getAllPrimarySectors,
  getSectorForName,
  getSectorForId
}
