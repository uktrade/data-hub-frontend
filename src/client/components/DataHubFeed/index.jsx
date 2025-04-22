import React from 'react'
import styled from 'styled-components'
import { SPACING, FONT_SIZE } from '@govuk-react/constants'
import ListItem from '@govuk-react/list-item'
import Paragraph from '@govuk-react/paragraph'
import { H3 } from '@govuk-react/heading'
import UnorderedList from '@govuk-react/unordered-list'

import { GREY_2 } from '../../utils/colours'
import urls from '../../../lib/urls'
import NewWindowLink from '../NewWindowLink'

const FeedContainer = styled.div({
  fontSize: FONT_SIZE.SIZE_14,
  borderTop: `2px solid ${GREY_2}`,
  padding: `${SPACING.SCALE_4} 0`,
})

const Date = styled('div')({
  display: `block`,
  fontSize: FONT_SIZE.SIZE_14,
})

const DataHubFeed = ({ items, feedLimit = 5 }) => (
  <FeedContainer>
    <H3 as="h2">What's new?</H3>
    {!!items.length && (
      <>
        <UnorderedList listStyleType="none">
          {items.slice(0, feedLimit).map((item, index) => (
            <ListItem key={index}>
              <NewWindowLink
                href={item.link}
                data-test={`data-hub-feed-link-${index}`}
                aria-labelledby="link-label"
              >
                {item.heading}
              </NewWindowLink>
              <Date data-test={`data-hub-feed-date-${index}`}>{item.date}</Date>
            </ListItem>
          ))}
        </UnorderedList>
        <NewWindowLink
          href={urls.external.helpCentre.allUpdates}
          data-test={`data-hub-feed-view-all`}
        >
          View all Data Hub updates
        </NewWindowLink>
      </>
    )}
    {!items.length && <Paragraph>No updates available</Paragraph>}
  </FeedContainer>
)

export default DataHubFeed
