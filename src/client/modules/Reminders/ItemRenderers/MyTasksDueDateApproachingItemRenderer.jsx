import React from 'react'
import { SPACING } from '@govuk-react/constants'
import GridRow from '@govuk-react/grid-row'
import GridCol from '@govuk-react/grid-col'
import { Link } from 'govuk-react'
import styled from 'styled-components'

import { ListItem, ItemHeader } from './styled'
import { DATE_LONG_FORMAT_1 } from '../../../../common/constants'
import { format } from '../../../utils/date'
import urls from '../../../../lib/urls'
import { GREY_1 } from '../../../utils/colours'

const ItemContent = styled('div')({
  marginBottom: SPACING.SCALE_2,
  marginTop: SPACING.SCALE_2,
})

const ItemHint = styled('span')({
  color: GREY_1,
})

const MyTasksDueDateApproachingItemRenderer = (item) => (
  <ListItem key={item.id} data-test="reminders-list-item">
    <GridRow>
      <GridCol>
        <ItemHeader data-test="item-header">
          Received {format(item.created_on, DATE_LONG_FORMAT_1)}
          <br />
          <Link href={`${urls.tasks.details(item.id)}`}>{item.event}</Link>
        </ItemHeader>
        <ItemContent data-test="item-content">
          <ul>
            <li>
              <ItemHint>Company:</ItemHint>{' '}
              <Link href={`${urls.companies.detail(item.company.id)}`}>
                {item.company.name}
              </Link>
            </li>
            <li>
              <ItemHint>Date due:</ItemHint>{' '}
              {format(item.due_date, DATE_LONG_FORMAT_1)}
            </li>
          </ul>
        </ItemContent>
      </GridCol>
    </GridRow>
  </ListItem>
)

export default MyTasksDueDateApproachingItemRenderer
