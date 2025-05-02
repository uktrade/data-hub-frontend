import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { FONT_SIZE } from '@govuk-react/constants'

import { SummaryTable } from '../../../../components'
import { buildCellContents } from './transformers'
import { StyledSummaryTable } from './components'
import { CompanyKingsAwardsResource } from '../../../../components/Resource'

const CardContainer = styled('div')`
  border: 1px solid #b1b4b6;
  padding: 20px;
  margin-bottom: 20px;
`

const StyledKingsAwardTable = styled(SummaryTable)`
  margin: 0;
  margin-top: 20px;
  & > tbody th {
    width: 50%;
  }
  caption {
    font-size: ${FONT_SIZE.SIZE_20};
  }
`

const AccoladesCard = ({ companyId }) => {
  return (
    <CompanyKingsAwardsResource id={companyId}>
      {(kingsAwards) =>
        kingsAwards && kingsAwards.length ? (
          <CardContainer>
            <StyledSummaryTable
              caption="Accolades"
              data-test="accolades-container"
            >
              <SummaryTable.Row
                heading="Number of accolades"
                children={kingsAwards.length}
              />
            </StyledSummaryTable>
            {kingsAwards.map((award) => (
              <StyledKingsAwardTable
                caption="The King’s Award for Enterprise"
                data-test="kings-award-container"
              >
                <SummaryTable.Row
                  heading="Year awarded"
                  children={buildCellContents(
                    award.yearAwarded,
                    <span>{award.yearAwarded}</span>
                  )}
                />
                <SummaryTable.Row
                  heading="Award category"
                  children={buildCellContents(
                    award.category,
                    <span>{award.category}</span>
                  )}
                />
                <SummaryTable.Row
                  heading="Reason"
                  children={buildCellContents(
                    award.citation,
                    <span>{award.citation}</span>
                  )}
                />
                <SummaryTable.Row
                  heading="Award expiry year"
                  children={buildCellContents(
                    award.yearExpired,
                    <span>{award.yearExpired}</span>
                  )}
                />
              </StyledKingsAwardTable>
            ))}
          </CardContainer>
        ) : null
      }
    </CompanyKingsAwardsResource>
  )
}

AccoladesCard.propTypes = {
  kingsAwards: PropTypes.array.isRequired,
}

export default AccoladesCard
