const EXPORT_COUNTRIES = 'export_countries'

module.exports = (errors) => {
  if (errors.hasOwnProperty(EXPORT_COUNTRIES)) {
    errors.were_countries_discussed = errors[EXPORT_COUNTRIES]
    delete errors[EXPORT_COUNTRIES]
  }

  return errors
}
