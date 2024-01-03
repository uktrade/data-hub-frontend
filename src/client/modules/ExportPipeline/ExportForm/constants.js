export const POSITIVE_INT_REGEX = /^[0-9]{1,19}$/

export const ERROR_MESSAGES = {
  title: 'Enter an export title',
  owner: 'Enter an owner',
  team_members: 'You can only add 5 team members',
  estimated_export_value_years: 'Select an estimated years',
  estimated_export_value_empty: 'Enter the estimated value in GBP',
  estimated_export_value_amount:
    'The value must not contain letters, be negative or over 19 digits',
  estimated_win_date: {
    required: 'Enter an estimated date for win',
    invalid: 'Enter a valid date',
  },
  destination_country: 'Enter a destination',
  sector: 'Enter a main sector',
  status: 'Select an export status',
  export_potential: 'Select an export potential',
  contacts: 'Select a contact',
}
