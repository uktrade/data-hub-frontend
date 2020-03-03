const ERROR = {
  SELECT_AN_OPTION: 'You must select an option',
  ENTER_A_DATE: 'You must enter a date',
}

// The order here controls the order they are displayed to the user
// either on a form or when displaying the values
const EXPORT_INTEREST_STATUS = {
  EXPORTING_TO: 'currently_exporting',
  FUTURE_INTEREST: 'future_interest',
  NOT_INTERESTED: 'not_interested',
}

module.exports = {
  ERROR,
  EXPORT_INTEREST_STATUS,
  EXPORT_INTEREST_STATUS_VALUES: Object.values(EXPORT_INTEREST_STATUS),
}
