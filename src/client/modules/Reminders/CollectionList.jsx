import React from 'react'
import GridRow from '@govuk-react/grid-row'
import GridCol from '@govuk-react/grid-col'
import { Link } from 'govuk-react'
import styled from 'styled-components'
import { BLACK, GREY_2 } from 'govuk-colours'
import { H3 } from '@govuk-react/heading'
import {
  SPACING,
  FONT_SIZE,
  HEADING_SIZES,
  MEDIA_QUERIES,
} from '@govuk-react/constants'

import { formatMediumDate } from '../../utils/date'
import { DARK_GREY } from '../../utils/colors'
import urls from '../../../lib/urls'

const Button = styled('button')({
  padding: 0,
  background: 'transparent',
  border: 'none',
  fontSize: FONT_SIZE.SIZE_16,
  fontFamily: 'inherit',
  color: DARK_GREY,
  cursor: 'pointer',
  textDecoration: 'underline',
})

const DeleteButton = styled(Button)({
  display: ({ isMobile }) => (isMobile ? 'inline' : 'none'),
  marginBottom: SPACING.SCALE_4,
  [MEDIA_QUERIES.TABLET]: {
    display: ({ isMobile }) => (isMobile ? 'none' : 'inline'),
    margin: `${SPACING.SCALE_3} 0`,
  },
  [MEDIA_QUERIES.DESKTOP]: {
    display: ({ isMobile }) => (isMobile ? 'none' : 'inline'),
    margin: `${SPACING.SCALE_3} 0`,
  },
})

const RightCol = styled(GridCol)({
  display: 'none',
  textAlign: 'right',
  [MEDIA_QUERIES.TABLET]: {
    display: 'block',
  },
  [MEDIA_QUERIES.DESKTOP]: {
    display: 'block',
  },
})

const List = styled('ol')({
  listStyleType: 'none',
  padding: 0,
  marginTop: SPACING.SCALE_2,

  '& > li': {
    marginBottom: SPACING.SCALE_2,
  },
})

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

const CollectionList = ({ results, onDeleteReminder, disableDelete }) => {
  return (
    <List data-test="reminders-list">
      {results.map(({ id, created_on, event, project, deleted }) => (
        <ListItem key={id} data-test="reminders-list-item">
          <GridRow>
            {deleted ? (
              <GridCol>
                <ItemHeader data-test="item-header">
                  Reminder deleted
                </ItemHeader>
                <ItemContent colour={DARK_GREY} data-test="item-content">
                  {event} for {project.name}
                </ItemContent>
                <ItemFooter data-test="item-footer"></ItemFooter>
              </GridCol>
            ) : (
              <>
                <GridCol>
                  <ItemHeader data-test="item-header">
                    Received {formatMediumDate(created_on)}
                  </ItemHeader>
                  <ItemContent colour={BLACK} data-test="item-content">
                    {event} for{' '}
                    <Link
                      href={`${urls.investments.projects.details(project.id)}`}
                    >
                      {project.name}
                    </Link>
                  </ItemContent>
                  <ItemFooter data-test="item-footer">
                    Project code {project.project_code}
                  </ItemFooter>
                  {/* Display on mobile only */}
                  {onDeleteReminder && !disableDelete && (
                    <DeleteButton
                      isMobile={true}
                      data-test="delete-button"
                      onClick={() => onDeleteReminder(id)}
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
                        onClick={() => onDeleteReminder(id)}
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
      ))}
    </List>
  )
}

export default CollectionList
