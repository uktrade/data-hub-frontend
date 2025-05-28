import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { SummaryTableHighlight } from '../../../../components'
import { buildCellContents } from './transformers'
import { CompanyKingsAwardsResource } from '../../../../components/Resource'

const CardContainer = styled('div')`
  border: 1px solid #b1b4b6;
  padding: 20px;
  margin-bottom: 20px;
`

const AccoladesCard = ({ companyId }) => {
  return (
    <CompanyKingsAwardsResource id={companyId}>
      {(kingsAwards) =>
        kingsAwards && kingsAwards.length ? (
          <CardContainer>
            <SummaryTableHighlight
              caption="Accolades"
              data-test="accolades-container"
            >
              <SummaryTableHighlight.HighlightRow
                isHalf={false}
                heading="Number of accolades"
                children={kingsAwards.length}
              />
            </SummaryTableHighlight>
            {kingsAwards.map((award) => (
              <SummaryTableHighlight
                caption="The King’s Award for Enterprise"
                data-test="kings-award-container"
              >
                <SummaryTableHighlight.Row
                  heading="Year awarded"
                  children={buildCellContents(
                    award.yearAwarded,
                    <span>{award.yearAwarded}</span>
                  )}
                />
                <SummaryTableHighlight.Row
                  heading="Award category"
                  children={buildCellContents(
                    award.category,
                    <span>{award.category}</span>
                  )}
                />
                <SummaryTableHighlight.Row
                  heading="Reason"
                  children={buildCellContents(
                    award.citation,
                    <span>{award.citation}</span>
                  )}
                />
                <SummaryTableHighlight.Row
                  heading="Award expiry year"
                  children={buildCellContents(
                    award.yearExpired,
                    <span>{award.yearExpired}</span>
                  )}
                />
              </SummaryTableHighlight>
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
