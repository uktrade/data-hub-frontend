import React from 'react'
import { SPACING } from '@govuk-react/constants'
import GridRow from '@govuk-react/grid-row'
import GridCol from '@govuk-react/grid-col'
import { Link } from 'govuk-react'
import styled from 'styled-components'

import { ListItem, ItemHeader, ItemFooter } from '../styled'
import { formatDate, DATE_FORMAT_FULL_DAY } from '../../../../utils/date-utils'
import urls from '../../../../../lib/urls'

const ItemContent = styled('div')({
  marginBottom: SPACING.SCALE_2,
  marginTop: SPACING.SCALE_2,
})

const InvestmentOPListItemRenderer = (item) => (
  <ListItem key={item.id} data-test="reminders-list-item">
    <GridRow>
      <GridCol>
        <ItemHeader data-test="item-header">
          Due {formatDate(item.deadline, DATE_FORMAT_FULL_DAY)}
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
