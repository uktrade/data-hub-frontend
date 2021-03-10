import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { H2 } from '@govuk-react/heading'
import { FONT_SIZE, FONT_WEIGHTS } from '@govuk-react/constants'

import { OUTSTANDING_PROPOSITIONS__LOADED } from '../../actions'
import Task from '../Task/index.jsx'
import NotificationBadge from '../NotificationBadge'

import OutstandingPropositions from './OutstandingPropositions'
import { ID, TASK_GET_OUTSTANDING_PROPOSITIONS, state2props } from './state'

const StyledHeading = styled(H2)`
  font-size: ${FONT_SIZE.SIZE_19};
  font-weight: ${FONT_WEIGHTS.bold};
  margin: 0;
`

const InvestmentReminders = ({ adviser, outstandingPropositions }) => (
  <Task.Status
    name={TASK_GET_OUTSTANDING_PROPOSITIONS}
    id={ID}
    progressMessage="Loading your investment projects"
    startOnRender={{
      payload: { adviser },
      onSuccessDispatch: OUTSTANDING_PROPOSITIONS__LOADED,
    }}
  >
    {() => (
      <>
        <StyledHeading>
          Reminders{' '}
          <NotificationBadge
            label={outstandingPropositions && outstandingPropositions.count}
          />
        </StyledHeading>
        <OutstandingPropositions
          outstandingPropositions={outstandingPropositions}
        />
      </>
    )}
  </Task.Status>
)

InvestmentReminders.propTypes = {
  adviser: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
  outstandingPropositions: PropTypes.shape({
    count: PropTypes.number.isRequired,
    results: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        investment_project: PropTypes.shape({
          id: PropTypes.string.is_required,
          name: PropTypes.string.isRequired,
          project_code: PropTypes.string.isRequired,
        }),
        deadline: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        adviser: PropTypes.shape({
          id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
          first_name: PropTypes.string.isRequired,
          last_name: PropTypes.string.isRequired,
        }),
      })
    ),
  }),
}

export default connect(state2props)(InvestmentReminders)
