import React from 'react'
import { SPACING, FONT_SIZE, HEADING_SIZES } from '@govuk-react/constants'
import { GREY_2 } from 'govuk-colours'
import GridRow from '@govuk-react/grid-row'
import GridCol from '@govuk-react/grid-col'
import { Link } from 'govuk-react'
import styled from 'styled-components'

import { DATE_DAY_LONG_FORMAT } from '../../../../common/constants'
import { DARK_GREY } from '../../../utils/colors'
import { format } from '../../../utils/date'
import urls from '../../../../lib/urls'

const ListItem = styled('li')({
  borderBottom: `solid 1px ${GREY_2}`,
})

const ItemHeader = styled('div')({
  fontSize: HEADING_SIZES.SMALL,
  marginTop: SPACING.SCALE_3,
  marginBottom: SPACING.SCALE_4,
})

const ItemContent = styled('div')({
  marginBottom: SPACING.SCALE_2,
  marginTop: SPACING.SCALE_2,
})

const ItemFooter = styled('div')({
  color: DARK_GREY,
  fontSize: FONT_SIZE.SIZE_16,
  marginBottom: SPACING.SCALE_4,
})

const InvestmentOPListItemRenderer = (item) => (
  <ListItem key={item.id} data-test="reminders-list-item">
    <GridRow>
      <GridCol>
        <ItemHeader data-test="item-header">
          Due {format(item.deadline, DATE_DAY_LONG_FORMAT)}
        </ItemHeader>
        <ItemContent data-test="item-content">
          <Link
            href={`${urls.investments.projects.propositions(
              item.investment_project.id
            )}`}
          >
            {item.name}
          </Link>
        </ItemContent>
        <ItemFooter data-test="item-footer">
          Project code {item.investment_project.project_code}
        </ItemFooter>
      </GridCol>
    </GridRow>
  </ListItem>
)

export default InvestmentOPListItemRenderer
