import React from 'react'
import styled from 'styled-components'
import { SPACING, FONT_SIZE } from '@govuk-react/constants'
import { GREY_1, GREY_2 } from '../../utils/colours'
import { Link } from 'govuk-react'
import ListItem from '@govuk-react/list-item'
import Paragraph from '@govuk-react/paragraph'
import { H3 } from '@govuk-react/heading'
import UnorderedList from '@govuk-react/unordered-list'
import urls from '../../../lib/urls'

const FeedContainer = styled.div({
  fontSize: FONT_SIZE.SIZE_14,
  borderTop: `2px solid ${GREY_2}`,
  padding: `${SPACING.SCALE_4} 0`,
})

const Note = styled('div')({
  display: `inline`,
  color: GREY_1,
  fontSize: FONT_SIZE.SIZE_14,
})

const Date = styled('div')({
  display: `block`,
  fontSize: FONT_SIZE.SIZE_14,
})

const DataHubFeed = ({ items, feedLimit = 5 }) => (
  <FeedContainer>
    <H3>"What's new"</H3>
    {!!items.length && (
      <>
        <UnorderedList listStyleType="none">
          {items.slice(0, feedLimit).map((item, index) => (
            <ListItem key={index}>
              <Link
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                data-test={`data-hub-feed-link-${index}`}
                aria-labelledby="link-label"
              >
                {item.heading}
              </Link>
              &nbsp;
              <Note id="link-label" data-test={`data-hub-feed-note-${index}`}>
                (Link opens in a new window)
              </Note>
              <Date data-test={`data-hub-feed-date-${index}`}>{item.date}</Date>
            </ListItem>
          ))}
        </UnorderedList>
        <Link
          href={urls.external.helpCentre.allUpdates()}
          target="_blank"
          rel="noopener noreferrer"
          data-test={`data-hub-feed-view-all`}
          aria-label="Opens in a new window or tab"
        >
          View all Data Hub updates
        </Link>
      </>
    )}
    {!items.length && <Paragraph>No updates available</Paragraph>}
  </FeedContainer>
)

export default DataHubFeed
