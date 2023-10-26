import React from 'react'
import GridRow from '@govuk-react/grid-row'
import GridCol from '@govuk-react/grid-col'
import { Link } from 'govuk-react'
import styled from 'styled-components'

import {
  ListItem,
  ItemHeader,
  ItemContent,
  ItemHeaderLink,
  DeleteButton,
  RightCol,
} from './styled'
import { DATE_LONG_FORMAT_1 } from '../../../../common/constants'
import { format } from '../../../utils/date'
import urls from '../../../../lib/urls'
import { DARK_GREY, GREY_1 } from '../../../utils/colours'

const ItemHint = styled('span')({
  color: GREY_1,
})

const MyTasksDueDateApproachingItemRenderer = (
  item,
  onDeleteReminder,
  disableDelete
) => (
  <ListItem key={item.id} data-test="reminders-list-item">
    <GridRow>
      {item.deleted ? (
        <GridCol>
          <ItemHeader data-test="item-header">Reminder deleted</ItemHeader>
          <ItemContent colour={DARK_GREY} data-test="item-content">
            {`${item.event} for ${item.task.investment_project_task.investment_project.name}`}
          </ItemContent>
        </GridCol>
      ) : (
        <>
          <GridCol>
            <ItemHeader data-test="item-header">
              <ul>
                <li>Received {format(item.created_on, DATE_LONG_FORMAT_1)}</li>
                <li>
                  <ItemHeaderLink href={urls.tasks.details(item.task.id)}>
                    {item.event}
                  </ItemHeaderLink>
                </li>
              </ul>
            </ItemHeader>
            <ItemContent data-test="item-content">
              <ul>
                <li>
                  <ItemHint>Company: </ItemHint>
                  <Link
                    href={urls.companies.detail(
                      item.task.investment_project_task.investment_project
                        .investor_company.id
                    )}
                  >
                    {
                      item.task.investment_project_task.investment_project
                        .investor_company.name
                    }
                  </Link>
                </li>
                <li>
                  <ItemHint>Date due: </ItemHint>
                  {format(item.task.due_date, DATE_LONG_FORMAT_1)}
                </li>
              </ul>
            </ItemContent>
            {onDeleteReminder && (
              <DeleteButton
                isMobile={true}
                data-test="delete-button"
                onClick={() => onDeleteReminder(item.id)}
                disabled={disableDelete}
              >
                Delete reminder
              </DeleteButton>
            )}
          </GridCol>
          {/* Display on Tablet and Desktop only */}
          {onDeleteReminder && (
            <RightCol setWidth="one-quarter">
              <DeleteButton
                data-test="delete-button"
                onClick={() => onDeleteReminder(item.id)}
                disabled={disableDelete}
              >
                Delete reminder
              </DeleteButton>
            </RightCol>
          )}
        </>
      )}
    </GridRow>
  </ListItem>
)

export default MyTasksDueDateApproachingItemRenderer
