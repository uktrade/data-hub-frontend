import React from 'react'
import GridRow from '@govuk-react/grid-row'
import GridCol from '@govuk-react/grid-col'
import { Link } from 'govuk-react'
import styled from 'styled-components'

import { ListItem, ItemHeader, ItemContent, ItemHeaderLink } from './styled'
import { DATE_LONG_FORMAT_1 } from '../../../../common/constants'
import { format } from '../../../utils/date'
import urls from '../../../../lib/urls'
import { GREY_1 } from '../../../utils/colours'

const ItemHint = styled('span')({
  color: GREY_1,
})

const MyTasksDueDateApproachingItemRenderer = (item) => (
  <ListItem key={item.id} data-test="reminders-list-item">
    <GridRow>
      <GridCol>
        <ItemHeader data-test="item-header">
          <ul>
            <li>Received {format(item.created_on, DATE_LONG_FORMAT_1)}</li>
            <li>
              <ItemHeaderLink
                href={`${urls.tasks.details(
                  item.investment_project_task.task.id
                )}`}
              >
                {item.event}
              </ItemHeaderLink>
            </li>
          </ul>
        </ItemHeader>
        <ItemContent data-test="item-content">
          <ul>
            <li>
              <ItemHint>Company:</ItemHint>{' '}
              <Link
                href={`${urls.companies.detail(
                  item.investment_project_task.investment_project
                    .investor_company.id
                )}`}
              >
                {
                  item.investment_project_task.investment_project
                    .investor_company.name
                }
              </Link>
            </li>
            <li>
              <ItemHint>Date due:</ItemHint>{' '}
              {format(
                item.investment_project_task.task.due_date,
                DATE_LONG_FORMAT_1
              )}
            </li>
          </ul>
        </ItemContent>
      </GridCol>
    </GridRow>
  </ListItem>
)

export default MyTasksDueDateApproachingItemRenderer
