module.exports = (dataAutoId) => {
  const tableSelector = `[data-auto-id="${dataAutoId}"]`
  return {
    keyCell: (rowNumber) => {
      return `${tableSelector} tr:nth-child(${rowNumber}) th`
    },
    valueCell: (rowNumber) => {
      return `${tableSelector} tr:nth-child(${rowNumber}) td`
    },
    valueCellLink: (rowNumber) => {
      return `${tableSelector} tr:nth-child(${rowNumber}) td a`
    },
  }
}
