/* eslint-disable camelcase */

function transformSicCodes ({
  sic_code_1,
  sic_code_2,
  sic_code_3,
  sic_code_4,
}) {
  return [
    sic_code_1,
    sic_code_2,
    sic_code_3,
    sic_code_4,
  ]
    .filter(item => item.length)
    .join(', ')
}

module.exports = {
  transformSicCodes,
}
