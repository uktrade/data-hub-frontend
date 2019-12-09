const ERROR = {
  SELECT_AN_OPTION: 'You must select an option',
  ENTER_A_DATE: 'You must enter a date',
}

const EXPORT_INTEREST_STATUS = {
  FUTURE_INTEREST: 'future_interest',
  EXPORTING_TO: 'currently_exporting',
  NOT_INTERESTED: 'not_interested',
}

const NEW_COUNTRIES_FEATURE = 'interaction-add-countries'

module.exports = {
  ERROR,
  EXPORT_INTEREST_STATUS,
  EXPORT_INTEREST_STATUS_VALUES: Object.values(EXPORT_INTEREST_STATUS),
  NEW_COUNTRIES_FEATURE,
}
