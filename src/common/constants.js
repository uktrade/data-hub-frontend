const UNITED_KINGDOM_ID = '80756b9a-5d95-e211-a939-e4115bead28a'
const UNITED_STATES_ID = '81756b9a-5d95-e211-a939-e4115bead28a'
const CANADA_ID = '5daf72a6-5d95-e211-a939-e4115bead28a'

const UK_REGIONS = {
  EAST_MIDLANDS: '844cd12a-6095-e211-a939-e4115bead28a',
  EAST_OF_ENGLAND: '864cd12a-6095-e211-a939-e4115bead28a',
  LONDON: '874cd12a-6095-e211-a939-e4115bead28a',
  NORTH_EAST: '814cd12a-6095-e211-a939-e4115bead28a',
  NORTHERN_IRELAND: '8e4cd12a-6095-e211-a939-e4115bead28a',
  NORTH_WEST: '824cd12a-6095-e211-a939-e4115bead28a',
  SCOTLAND: '8c4cd12a-6095-e211-a939-e4115bead28a',
  SOUTH_EAST: '884cd12a-6095-e211-a939-e4115bead28a',
  SOUTH_WEST: '894cd12a-6095-e211-a939-e4115bead28a',
  WALES: '8d4cd12a-6095-e211-a939-e4115bead28a',
  WEST_MIDLANDS: '854cd12a-6095-e211-a939-e4115bead28a',
  YORKSHIRE_AND_THE_HUMBER: '834cd12a-6095-e211-a939-e4115bead28a',
}

const PRIMARY_LINK_PARAMS = {
  companies: '?archived[0]=false&sortby=modified_on:desc&page=1',
  contacts: '?archived[0]=false&sortby=modified_on:desc&page=1',
  events: '?page=1&sortby=modified_on:desc',
  interactions: '?page=1&sortby=date:desc',
  investments: '?page=1&sortby=created_on:desc',
  omis: '?page=1&sortby=created_on:desc',
  reconciliation: '?page=1&sortby=payment_due_date:asc&status=quote_accepted',
}
const INVESTMENT_LINK_PARAM = '?sortby=-created_on&page=1'
const GENERIC_PHONE_NUMBER_REGEX = /^$|([0-9]|#|\+|\s|\(|\))+$/
const OPTION_YES = 'Yes'
const OPTION_NO = 'No'
const OPTIONS_YES_NO = [
  { label: 'Yes', value: OPTION_YES },
  { label: 'No', value: OPTION_NO },
]

const FORM_LAYOUT = {
  THREE_QUARTERS: 'three-quarters',
  ONE_THIRD: 'one-third',
  TWO_THIRDS: 'two-thirds',
  ONE_HALF: 'one-half',
}

const METHOD_PATCH = 'PATCH'
const METHOD_POST = 'POST'

// The order here controls the order they are displayed to the user
// either on a form or when displaying the values
const EXPORT_INTEREST_STATUS = {
  EXPORTING_TO: 'currently_exporting',
  FUTURE_INTEREST: 'future_interest',
  NOT_INTERESTED: 'not_interested',
}

module.exports = {
  UNITED_KINGDOM_ID,
  UNITED_STATES_ID,
  CANADA_ID,
  UK_REGIONS,
  PRIMARY_LINK_PARAMS,
  INVESTMENT_LINK_PARAM,
  GENERIC_PHONE_NUMBER_REGEX,
  OPTIONS_YES_NO,
  OPTION_YES,
  OPTION_NO,
  FORM_LAYOUT,
  METHOD_PATCH,
  METHOD_POST,
  EXPORT_INTEREST_STATUS,
  EXPORT_INTEREST_STATUS_VALUES: Object.values(EXPORT_INTEREST_STATUS),
}
