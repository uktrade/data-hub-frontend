import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { SPACING } from '@govuk-react/constants'
import { Details, ListItem, UnorderedList } from 'govuk-react'

import { Step, FieldRadios } from '../../../../../client/components'
import { FieldFDIType } from '../../../../../client/modules/Investments/Projects/InvestmentFormFields'

const FDI = 'FDI'
const NON_FDI = 'Non-FDI'
const COMMITMENT_TO_INVEST = 'Commitment to invest'

const StyledDetails = styled(Details)`
  margin: ${SPACING.SCALE_3} 0 0 0;
`

const InvestmentTypeStep = ({ investmentTypes = [] }) => (
  <Step name="investmentType">
    <FieldRadios
      name="investment_type"
      legend="Investment type"
      required="Specify the type of investment"
      options={investmentTypes.map((option) => ({
        ...option,
        ...(option.label === FDI && {
          link: (
            <StyledDetails
              summary="Is this a Foreign Direct Investment (FDI) project?"
              data-test="fdi-info"
            >
              <UnorderedList listStyleType="bullet">
                <ListItem>
                  Is there a foreign direct investor involved in the Project and
                  is the global HQ of the company based outside the UK?
                </ListItem>
                <ListItem>
                  Is there a new (additional) financial investment being made in
                  the UK as a result of the Project?
                </ListItem>
                <ListItem>
                  Is there a UK Foreign Direct Enterprise established in the UK
                  with at least 10% foreign ownership?
                </ListItem>
                <ListItem>
                  Will the UK foreign direct enterprise be involved in a
                  business (commercial) activity in the UK which is expected to
                  last at least 3 years?
                </ListItem>
                <ListItem>
                  Is there at least 1 new job created as a result of the Project
                  (or safeguarded jobs for Retentions or M&As)?
                </ListItem>
                <ListItem>
                  If a Retention or M&A project is being claimed, is there
                  evidence that the UK jobs were at risk?
                </ListItem>
              </UnorderedList>
            </StyledDetails>
          ),
          children: <FieldFDIType />,
        }),
        ...(option.label === NON_FDI && {
          link: (
            <StyledDetails
              summary="Is this a Non-FDI project?"
              data-test="non-fdi-info"
            >
              <UnorderedList listStyleType="bullet">
                <ListItem>
                  Is there a foreign investor/partner involved in the project?
                </ListItem>
                <ListItem>
                  Is it clear who is the UK recipient organisation in the
                  proposed collaboration and partnership project?
                </ListItem>
                <ListItem>
                  Is the R&D Collaboration or partnership aimed at creating (or
                  validating) new to the world technology, products or services
                  that will lead to creation (or testing) new intellectual
                  property (IP) in the UK?
                </ListItem>
                <ListItem>
                  Will there be a new IP created (or validated) by the R&D
                  collaboration or partnership be registered or used in the UK?
                </ListItem>
                <ListItem>
                  Will the project create or maintain (directly or indirectly)
                  at least 1 job in the UK partner organisation for a duration
                  of at least 6 months?
                  <br />
                  <br />
                  OR
                  <br />
                  <br />
                  Is there additional financial support from the foreign partner
                  which will ensure the continuation of the R&D Collaboration or
                  partnership project in the UK site for a minimum of 6 months?
                </ListItem>
              </UnorderedList>
            </StyledDetails>
          ),
        }),
        ...(option.label === COMMITMENT_TO_INVEST && {
          link: (
            <StyledDetails
              summary="Is this a Commitment to Invest project?"
              data-test="cti-info"
            >
              Is this a Commitment to Invest – a project where a company is
              investing money into a large and multi-component investment
              project with a long period of preparation and implementation (e.g.
              infrastructure or regeneration)?
            </StyledDetails>
          ),
        }),
      }))}
    />
  </Step>
)

const optionProp = PropTypes.shape({
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
})

InvestmentTypeStep.propTypes = {
  investmentTypes: PropTypes.arrayOf(optionProp),
}

export default InvestmentTypeStep
