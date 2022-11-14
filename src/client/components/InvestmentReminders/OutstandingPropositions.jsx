import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { H5 } from '@govuk-react/heading'
import { FONT_SIZE, FONT_WEIGHTS, SPACING } from '@govuk-react/constants'

import urls from '../../../lib/urls'

const StyledSubHeading = styled(H5)`
  font-size: ${FONT_SIZE.SIZE_10};
  font-weight: ${FONT_WEIGHTS.bold};
  margin-top: ${SPACING.SCALE_2};
  margin-bottom: ${SPACING.SCALE_2};
`

const StyledDivListItems = styled('div')`
  padding-left: ${SPACING.SCALE_2};
  margin-bottom: ${SPACING.SCALE_5};
`

const StyledTextLink = styled('a')`
  position: relative;
  margin-left: ${SPACING.SCALE_1};
  margin-right: ${SPACING.SCALE_1};
`

const StyledDivItem = styled('div')`
  display: list-item;
  list-style-type: disc;
  margin-top: ${SPACING.SCALE_1};
  margin-bottom: ${SPACING.SCALE_1};
`

const checkRemindersLoaded = (reminders) => {
  return reminders || { count: 0 }
}

const investmentRemindersListItems = (
  investmentELD,
  investmentNRI,
  investmentOP
) => {
  return [
    {
      href: urls.reminders.investments.estimatedLandDate(),
      text: 'Approaching estimated land dates',
      count: checkRemindersLoaded(investmentELD).count,
    },
    {
      href: urls.reminders.investments.noRecentInteraction(),
      text: 'Projects with no recent interactions',
      count: checkRemindersLoaded(investmentNRI).count,
    },
    {
      href: urls.reminders.investments.outstandingPropositions(),
      text: 'Outstanding propositions',
      count: checkRemindersLoaded(investmentOP).count,
    },
  ]
}

const exportRemindersListItems = (investmentELD) => {
  return [
    {
      href: urls.reminders.investments.noRecentInteraction(),
      text: 'Companies with no recent interactions',
      count: checkRemindersLoaded(investmentELD).count,
    },
    {
      href: urls.reminders.investments.estimatedLandDate(),
      text: 'Companies with new interactions',
      count: checkRemindersLoaded(investmentELD).count,
    },
  ]
}

const OutstandingPropositions = ({
  investmentELD,
  investmentNRI,
  investmentOP,
}) => (
  <>
    <div data-test="outstanding-propositions">
      <StyledSubHeading data-test="investment-heading">
        Investment
      </StyledSubHeading>
      <StyledDivListItems>
        {investmentRemindersListItems(
          investmentELD,
          investmentNRI,
          investmentOP
        ).map((item) => (
          <StyledDivItem>
            <StyledTextLink href={item.href}>{item.text}</StyledTextLink>(
            {item.count})
          </StyledDivItem>
        ))}
      </StyledDivListItems>
      <StyledSubHeading data-test="export-heading">Export</StyledSubHeading>
      <StyledDivListItems>
        {exportRemindersListItems(investmentELD).map((item) => (
          <StyledDivItem>
            <StyledTextLink href={item.href}>{item.text}</StyledTextLink>(
            {item.count})
          </StyledDivItem>
        ))}
      </StyledDivListItems>
      <StyledTextLink href={urls.reminders.settings.index()}>
        Reminders and email notification section
      </StyledTextLink>
    </div>
  </>
)

OutstandingPropositions.propTypes = {
  investmentELD: PropTypes.object.isRequired,
  investmentNRI: PropTypes.object.isRequired,
  investmentOP: PropTypes.object.isRequired,
}

export default OutstandingPropositions
