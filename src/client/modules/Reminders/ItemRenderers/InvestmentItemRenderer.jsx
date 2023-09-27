import React from 'react'
import GridRow from '@govuk-react/grid-row'
import GridCol from '@govuk-react/grid-col'
import { Link } from 'govuk-react'

import {
  ListItem,
  ItemHeader,
  ItemContent,
  ItemFooter,
  DeleteButton,
  RightCol,
} from './styled'

import { formatMediumDate } from '../../../utils/date'
import { BLACK, DARK_GREY } from '../../../utils/colours'
import urls from '../../../../lib/urls'

const InvestmentItemRenderer = (item, onDeleteReminder, disableDelete) => (
  <ListItem key={item.id} data-test="reminders-list-item">
    <GridRow>
      {item.deleted ? (
        <GridCol>
          <ItemHeader data-test="item-header">Reminder deleted</ItemHeader>
          <ItemContent colour={DARK_GREY} data-test="item-content">
            {item.event} for {item.project.name}
          </ItemContent>
          <ItemFooter data-test="item-footer"></ItemFooter>
        </GridCol>
      ) : (
        <>
          <GridCol>
            <ItemHeader data-test="item-header">
              Received {formatMediumDate(item.created_on)}
            </ItemHeader>
            <ItemContent colour={BLACK} data-test="item-content">
              {item.event} for{' '}
              <Link
                href={`${urls.investments.projects.details(item.project.id)}`}
              >
                {item.project.name}
              </Link>
            </ItemContent>
            <ItemFooter data-test="item-footer">
              Project code {item.project.project_code}
            </ItemFooter>
            {/* Display on mobile only */}
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

export default InvestmentItemRenderer
