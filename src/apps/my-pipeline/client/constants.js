import PropTypes from 'prop-types'
import urls from '../../../lib/urls'

export const PipelineItemPropType = PropTypes.exact({
  company: PropTypes.exact({
    export_potential: PropTypes.string,
    id: PropTypes.string,
    name: PropTypes.string,
    turnover: PropTypes.string,
  }),
  created_on: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  status: PropTypes.string,
})

export const PipelineItemsPropType = PropTypes.exact({
  companyId: PropTypes.string,
  count: PropTypes.number,
  results: PropTypes.arrayOf(PipelineItemPropType),
})

export const STATUSES = {
  LEADS: {
    value: 'leads',
    label: 'Prospect',
    url: urls.pipeline.index,
  },
  IN_PROGRESS: {
    value: 'in_progress',
    label: 'Active',
    url: urls.pipeline.active,
  },
  WIN: {
    value: 'win',
    label: 'Won',
    url: urls.pipeline.won,
  },
}

export const STATUS_VALUES = Object.values(STATUSES)
