import React from 'react'
import { SPACING, FONT_SIZE, HEADING_SIZES } from '@govuk-react/constants'
import { BLACK, GREY_2 } from 'govuk-colours'
import GridRow from '@govuk-react/grid-row'
import GridCol from '@govuk-react/grid-col'
import { H3 } from '@govuk-react/heading'
import { Link } from 'govuk-react'
import styled from 'styled-components'

import DeleteButton from './components/DeleteButton'
import RightCol from './components/RightCol'

import { formatMediumDate } from '../../../utils/date'
import { DARK_GREY } from '../../../utils/colors'
import urls from '../../../../lib/urls'

const ListItem = styled('li')({
  borderBottom: `solid 1px ${GREY_2}`,
})

const ItemHeader = styled(H3)({
  fontSize: HEADING_SIZES.SMALL,
  marginTop: SPACING.SCALE_3,
  marginBottom: SPACING.SCALE_4,
})

const ItemContent = styled('div')({
  color: ({ colour }) => colour,
  marginBottom: SPACING.SCALE_3,
})

const ItemFooter = styled('div')({
  color: DARK_GREY,
  fontSize: FONT_SIZE.SIZE_16,
  marginBottom: SPACING.SCALE_4,
})

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
            {onDeleteReminder && !disableDelete && (
              <DeleteButton
                isMobile={true}
                data-test="delete-button"
                onClick={() => onDeleteReminder(item.id)}
              >
                Delete reminder
              </DeleteButton>
            )}
          </GridCol>
          {/* Display on Tablet and Desktop only */}
          {onDeleteReminder && (
            <RightCol setWidth="one-quarter">
              {!disableDelete && (
                <DeleteButton
                  data-test="delete-button"
                  onClick={() => onDeleteReminder(item.id)}
                >
                  Delete reminder
                </DeleteButton>
              )}
            </RightCol>
          )}
        </>
      )}
    </GridRow>
  </ListItem>
)

export default InvestmentItemRenderer
