import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Button from '@govuk-react/button'
import Link from '@govuk-react/link'
import GridRow from '@govuk-react/grid-row'
import GridCol from '@govuk-react/grid-col'
import { SPACING, MEDIA_QUERIES } from '@govuk-react/constants'
import { GREEN, YELLOW, RED, BLUE } from 'govuk-colours'
import { Badge } from 'data-hub-components'
import Card from 'data-hub-components/dist/activity-feed/activities/card/Card'
import CardHeader from 'data-hub-components/dist/activity-feed/activities/card/CardHeader'

import urls from '../../../lib/urls'

const StyledButtonWrapper = styled(GridCol)`
  align-items: flex-start;
  display: flex;
  justify-content: flex-start;

  ${MEDIA_QUERIES.TABLET} {
    justify-content: flex-end;
  }

  a {
    margin-bottom: 0;
  }
`

const StyledBadgeWrapper = styled(GridCol)`
  margin: ${SPACING.SCALE_3} 0;

  ${MEDIA_QUERIES.TABLET} {
    margin: 0;
  }
`

const StyledGridRow = styled(GridRow)`
  align-items: baseline;
`

const likelihoodConstants = {
  HIGH: { text: 'high', colour: GREEN },
  MEDIUM: { text: 'medium', colour: YELLOW },
  LOW: { text: 'low', colour: RED },
}

const PipelineItem = ({
  id,
  companyId,
  companyName,
  projectName,
  date,
  likelihood,
}) => (
  <Card>
    <CardHeader
      company={{ name: projectName }}
      heading={
        <Link href={urls.companies.detail(companyId)}>{companyName}</Link>
      }
      startTime={date}
    />
    <StyledGridRow>
      <StyledBadgeWrapper>
        {likelihood && (
          <Badge
            borderColour={likelihoodConstants[likelihood].colour}
          >{`Likelihood to succeed - ${likelihoodConstants[likelihood].text}`}</Badge>
        )}
      </StyledBadgeWrapper>
      <StyledButtonWrapper>
        <Button as={Link} href={`/${id}`} buttonColour={BLUE}>
          Edit
        </Button>
      </StyledButtonWrapper>
    </StyledGridRow>
  </Card>
)

PipelineItem.propTypes = {
  id: PropTypes.string.isRequired,
  companyId: PropTypes.string.isRequired,
  companyName: PropTypes.string.isRequired,
  projectName: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  likelihood: PropTypes.string,
}

PipelineItem.defaultProps = {
  likelihood: null,
}

export default PipelineItem
