// These are date-fns format codes - see https://date-fns.org/v2.23.0/docs/format
const DATE_LONG_FORMAT_1 = 'd MMMM yyyy'
const DATE_LONG_FORMAT_2 = 'dd MMM yyyy'
const DATE_LONG_FORMAT_3 = 'yyyy-MM-dd'
const DATE_DAY_LONG_FORMAT = 'E, dd MMM yyyy'
const DATE_MEDIUM_FORMAT = 'd MMM yyyy'
const DATE_TIME_MEDIUM_FORMAT = 'd MMM yyyy, h:mmaaa'
const DATE_SHORT_FORMAT = 'yyyy-MM'
const DATE_SHORT_FORMAT_2 = 'MMMM yyyy'
const DATE_DAY_MONTH = 'dd MMM'
const INTERACTION_TIMESTAMP_FORMAT = 'y-MM-d'

const UNITED_KINGDOM_ID = '80756b9a-5d95-e211-a939-e4115bead28a'
const UNITED_STATES_ID = '81756b9a-5d95-e211-a939-e4115bead28a'
const CANADA_ID = '5daf72a6-5d95-e211-a939-e4115bead28a'
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
const OPTION_YES = 'yes'
const OPTION_NO = 'no'
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
  DATE_DAY_LONG_FORMAT,
  DATE_DAY_MONTH,
  DATE_LONG_FORMAT_1,
  DATE_LONG_FORMAT_2,
  DATE_LONG_FORMAT_3,
  DATE_MEDIUM_FORMAT,
  DATE_TIME_MEDIUM_FORMAT,
  DATE_SHORT_FORMAT,
  DATE_SHORT_FORMAT_2,
  INTERACTION_TIMESTAMP_FORMAT,
  UNITED_KINGDOM_ID,
  UNITED_STATES_ID,
  CANADA_ID,
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
