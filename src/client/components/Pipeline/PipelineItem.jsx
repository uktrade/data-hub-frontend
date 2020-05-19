import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Button from '@govuk-react/button'
import Link from '@govuk-react/link'
import GridRow from '@govuk-react/grid-row'
import GridCol from '@govuk-react/grid-col'
import { SPACING, MEDIA_QUERIES } from '@govuk-react/constants'
import { BLUE } from 'govuk-colours'
import Card from 'data-hub-components/dist/activity-feed/activities/card/Card'
import CardHeader from 'data-hub-components/dist/activity-feed/activities/card/CardHeader'

import urls from '../../../lib/urls'

const StyledButtonWrapper = styled(GridCol)`
  align-items: flex-start;
  display: flex;
  justify-content: flex-start;
  min-width: 100%;

  ${MEDIA_QUERIES.TABLET} {
    justify-content: flex-end;
    min-width: unset;
  }

  a {
    margin-bottom: 0;
  }
`

const StyledGridRow = styled(GridRow)`
  align-items: baseline;

  div {
    margin-top: ${SPACING.SCALE_3};

    ${MEDIA_QUERIES.TABLET} {
      margin-top: 0;
    }
  }
`

const PipelineItem = ({ id, companyId, companyName, projectName, date }) => (
  <Card>
    <CardHeader
      company={{ name: projectName }}
      heading={
        <Link href={urls.companies.detail(companyId)}>{companyName}</Link>
      }
      startTime={date}
    />
    <StyledGridRow>
      <StyledButtonWrapper>
        <Button as={Link} href={urls.pipeline.edit(id)} buttonColour={BLUE}>
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
}

export default PipelineItem
