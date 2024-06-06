import React from 'react'
import PropTypes from 'prop-types'
import InsetText from '@govuk-react/inset-text'
import ListItem from '@govuk-react/list-item'
import Paragraph from '@govuk-react/paragraph'
import UnorderedList from '@govuk-react/unordered-list'
import { WarningText } from 'govuk-react'

import { Step } from '../../../../components'

const ConfirmFDITypeChangeStep = ({ project }) => {
  return (
    <Step
      name="confirmation-step"
      data-test="confirmation-step-warning"
      backButton="Cancel"
    >
      <WarningText mb={4} data-test="warning-title">
        You are changing the FDI type of this project to 'Capital only'.
      </WarningText>
      <Paragraph data-test="warning-description">
        Changing the FDI type to 'Capital only' will overwrite the values in the
        following fields. These fields will also be hidden in the edit value
        section.
      </Paragraph>
      <InsetText data-test="warning-fields-to-change">
        <UnorderedList listStyleType="none" mb={0}>
          <ListItem data-test="item-number-new-jobs">
            Number of new jobs (currently:{' '}
            {project.numberNewJobs
              ? project.numberNewJobs
              : project.numberNewJobs === 0
                ? 0
                : 'null'}
            , will change to: 0)
          </ListItem>
          <ListItem data-test="item-average-salary">
            Average salary (currently:{' '}
            {project.averageSalary ? project.averageSalary.name : 'null'}, will
            change to: null)
          </ListItem>
          <ListItem data-test="item-number-safeguarded-jobs">
            Number of safeguarded jobs (currently:{' '}
            {project.numberSafeguardedJobs
              ? project.numberSafeguardedJobs
              : project.numberSafeguardedJobs === 0
                ? 0
                : 'null'}
            , will change to: 0)
          </ListItem>
        </UnorderedList>
      </InsetText>
      <Paragraph data-test="warning-confirmation">
        Are you sure you want to proceed?
      </Paragraph>
    </Step>
  )
}

ConfirmFDITypeChangeStep.propTypes = {
  project: PropTypes.object.isRequired,
}

export default ConfirmFDITypeChangeStep
