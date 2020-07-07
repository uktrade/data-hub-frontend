import PropTypes from 'prop-types'
import urls from '../../../lib/urls'

export const PipelineItemPropType = PropTypes.exact({
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
})

export const PipelineItemsPropType = PropTypes.exact({
  companyId: PropTypes.string,
  count: PropTypes.number,
  results: PropTypes.arrayOf(PipelineItemPropType),
})

export const STATUSES = {
  LEADS: {
    value: 'leads',
    label: 'To do',
    url: urls.pipeline.index,
  },
  IN_PROGRESS: {
    value: 'in_progress',
    label: 'In progress',
    url: urls.pipeline.active,
  },
  WIN: {
    value: 'win',
    label: 'Done',
    url: urls.pipeline.won,
  },
}

export const STATUS_VALUES = Object.values(STATUSES)

export const LIKELIHOOD_VALUES = {
  A: {
    value: 1,
    label: 'Low',
  },
  B: {
    value: 2,
    label: 'Medium',
  },
  C: {
    value: 3,
    label: 'High',
  },
}
