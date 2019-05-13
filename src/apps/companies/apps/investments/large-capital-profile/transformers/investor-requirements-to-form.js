/* eslint-disable camelcase */
const {
  transformObjectToOption,
  checkMatchingItemById,
} = require('../../utils/transformers')

const transformDealTicketSizes = (dealTicketSizesMetaData, { dealTicketSizes }) => {
  return dealTicketSizesMetaData
    .map(transformObjectToOption)
    .map(checkMatchingItemById(dealTicketSizes.value))
}

module.exports = {
  transformDealTicketSizes,
}
