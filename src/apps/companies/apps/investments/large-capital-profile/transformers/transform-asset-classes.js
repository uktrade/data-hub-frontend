/* eslint-disable camelcase */
const transformAssetClasses = ({ id, name, asset_class_interest_sector }) => {
  return {
    value: id,
    text: name,
    sector: asset_class_interest_sector.name,
  }
}

module.exports = transformAssetClasses
