module.exports = (dataTest) => {
  const tableSelector = `[data-test="${dataTest}"]`
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
