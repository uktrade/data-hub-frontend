import PropTypes from 'prop-types'

export const PipeLineItemPropType = PropTypes.shape({
  company: PropTypes.shape({
    export_potential: PropTypes.any,
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    turnover: PropTypes.any,
  }).isRequired,
  contact: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }),
  created_on: PropTypes.string.isRequired,
  expected_win_date: PropTypes.string,
  id: PropTypes.string.isRequired,
  likelihood_to_win: PropTypes.number,
  name: PropTypes.string.isRequired,
  potential_value: PropTypes.string,
  sector: PropTypes.shape({
    id: PropTypes.string.isRequired,
    segment: PropTypes.string.isRequired,
  }),
  status: PropTypes.string.isRequired,
}).isRequired
