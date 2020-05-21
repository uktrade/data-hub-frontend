import PropTypes from 'prop-types'

export const URL_MAP = {
  leads: 'index',
  in_progress: 'active',
  win: 'won',
}

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
