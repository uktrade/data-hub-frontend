module.exports = (dataAutoId) => {
  const tableSelector = `[data-test="${dataAutoId}"]`
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
