import React from 'react'
import moment from 'moment'
import styled from 'styled-components'
import { PipeLineItemPropType } from './types'
import Button from '@govuk-react/button'
import Link from '@govuk-react/link'
import GridRow from '@govuk-react/grid-row'
import GridCol from '@govuk-react/grid-col'
import { SPACING, MEDIA_QUERIES } from '@govuk-react/constants'
import { BLUE, GREEN } from 'govuk-colours'
import {
  Card,
  CardDetailsList,
  CardHeader,
} from 'data-hub-components/dist/activity-feed/activities/card'
import { Badge, NumberUtils } from 'data-hub-components'

import urls from '../../../lib/urls'

const StyledGridCol = styled(GridCol)`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: space-between;
  a {
    margin: ${SPACING.SCALE_3} 0 0 0;
  }
  ${MEDIA_QUERIES.TABLET} {
    align-items: flex-end;
  }
`
const StyledGridValue = styled(GridCol)`
  flex: 1;
  margin-top: ${SPACING.SCALE_1};
  ${MEDIA_QUERIES.TABLET} {
    margin-top: 0;
  }
`
const StyledGridLabel = styled(StyledGridValue)`
  font-weight: bold;
  margin-top: ${SPACING.SCALE_2};
  ${MEDIA_QUERIES.TABLET} {
    flex: 0 0 200px;
    margin-top: 0;
  }
`

const StyledGridRow = styled(GridRow)`
  padding-top: ${SPACING.SCALE_3};

  ${MEDIA_QUERIES.TABLET} {
    padding-top: 0;
  }
`

const StyledBadgeSpacing = styled.span`
  margin: ${SPACING.SCALE_3} 0 0 0;
  ${MEDIA_QUERIES.TABLET} {
    margin: 0;
  }
  & > span {
    display: block;
    width: 100%;
    box-sizing: border-box;
  }
`

const LIKELIHOOD_TO_WIN = {
  1: 'Low',
  2: 'Medium',
  3: 'High',
}

function buildMetaList({
  potential_value,
  sector,
  contact,
  expected_win_date,
}) {
  const list = [
    sector && { id: 0, label: 'Project sector', value: sector.segment },
    contact && { id: 1, label: 'Company contact', value: contact.name },
    potential_value && {
      id: 2,
      label: 'Potential export value',
      value: NumberUtils.currencyGBP(potential_value),
    },
    expected_win_date && {
      id: 3,
      label: 'Expected date for win',
      value: moment(expected_win_date).format('MMM Y'),
    },
  ]
  // remove falsy values
  return list.filter(Boolean)
}

const PipelineItemMeta = ({ label, value }) => (
  <GridRow>
    <StyledGridLabel>{label}</StyledGridLabel>
    <StyledGridValue>{value}</StyledGridValue>
  </GridRow>
)
const PipelineItem = ({
  item: { id, name, company, created_on, likelihood_to_win, ...meta },
}) => (
  <Card>
    <CardHeader
      company={{ name }}
      heading={
        <Link href={urls.companies.detail(company.id)}>{company.name}</Link>
      }
      startTime={created_on}
    />
    <StyledGridRow>
      <GridCol>
        <CardDetailsList
          itemRenderer={(metaItem) => <PipelineItemMeta {...metaItem} />}
          items={buildMetaList(meta)}
        />
      </GridCol>
      <StyledGridCol>
        {LIKELIHOOD_TO_WIN[likelihood_to_win] && (
          <StyledBadgeSpacing>
            <Badge
              borderColour={GREEN}
            >{`Likelihood to succeed - ${LIKELIHOOD_TO_WIN[likelihood_to_win]}`}</Badge>
          </StyledBadgeSpacing>
        )}

        <Button as={Link} href={urls.pipeline.edit(id)} buttonColour={BLUE}>
          Edit
        </Button>
      </StyledGridCol>
    </StyledGridRow>
  </Card>
)

PipelineItem.propTypes = {
  item: PipeLineItemPropType,
}

export default PipelineItem
