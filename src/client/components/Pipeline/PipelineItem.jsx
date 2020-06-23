import React from 'react'
import moment from 'moment'
import styled from 'styled-components'
import { escape } from 'lodash'
import Button from '@govuk-react/button'
import Link from '@govuk-react/link'
import GridRow from '@govuk-react/grid-row'
import GridCol from '@govuk-react/grid-col'
import { SPACING, MEDIA_QUERIES, FONT_SIZE } from '@govuk-react/constants'
import { BLUE, GREY_1, BLACK } from 'govuk-colours'
import { Card } from 'data-hub-components/dist/activity-feed/activities/card'
import { NumberUtils } from 'data-hub-components'

import { newlineToBr } from '../../../lib/text-formatting'
import { PipeLineItemPropType } from './types'
import urls from '../../../lib/urls'
import Tag from '../Tag'
import LIKELIHOOD_TO_SUCCEED from './constants'

const StyledH3 = styled('h3')`
  font-size: ${FONT_SIZE.SIZE_27};
  font-weight: bold;
  margin-bottom: ${SPACING.SCALE_2};
  color: ${(props) => (props.archived ? GREY_1 : BLACK)};
`

const StyledGridCol = styled(GridCol)`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: space-between;
  a {
    margin: ${SPACING.SCALE_3} 0 0 0;
  }
  ${MEDIA_QUERIES.TABLET} {
    align-items: flex-end;
  }
`

const StyledListItem = styled('li')`
  display: grid;
  ${MEDIA_QUERIES.TABLET} {
    display: block;
  }
`

const StyledLabel = styled('span')`
  color: ${GREY_1};
  font-size: ${FONT_SIZE.SIZE_19};
`

const StyledValueSubtle = styled(StyledLabel)`
  ${MEDIA_QUERIES.TABLET} {
    margin-left: ${SPACING.SCALE_1};
  }
`

const StyledValue = styled(StyledValueSubtle)`
  color: ${BLACK};
`

const StyledGridRow = styled(GridRow)`
  padding-top: ${SPACING.SCALE_3};

  ${MEDIA_QUERIES.TABLET} {
    padding-top: 0;
  }
`

const StyledTagSpacing = styled('span')`
  display: flex;
  margin: ${SPACING.SCALE_3} 0 0 0;
  strong:not(:first-child) {
    margin-left: ${SPACING.SCALE_3};
  }
  & > span {
    display: block;
    width: 100%;
    box-sizing: border-box;
  }
  ${MEDIA_QUERIES.TABLET} {
    flex-direction: column;
    margin: 0;
    strong:not(:first-child) {
      margin-left: 0;
      margin-top: ${SPACING.SCALE_3};
    }
  }
  ${MEDIA_QUERIES.DESKTOP} {
    flex-direction: row;
    strong:not(:first-child) {
      margin-left: ${SPACING.SCALE_3};
      margin-top: 0;
    }
  }
`

const StyledUnorderedList = styled('ul')`
  li:not(:last-child) {
    margin-bottom: ${SPACING.SCALE_2};
  }
`

const StyledLink = styled(Link)`
  text-decoration-line: none;
`

const StyledUnderlinedLink = styled(Link)`
  margin-left: ${SPACING.SCALE_2};
`

const StyledLinkWrapper = styled('div')`
  a:not(:first-child) {
    margin-left: ${SPACING.SCALE_5};
  }
`

function buildMetaList({
  company,
  potential_value,
  sector,
  contact,
  expected_win_date,
  created_on,
  archived,
  archived_on,
  archived_reason,
}) {
  const list = [
    {
      id: 0,
      label: 'Company',
      value: company.name,
      href: urls.companies.detail(company.id),
    },
    sector && { id: 1, label: 'Project sector', value: sector.segment },
    contact && {
      id: 2,
      label: 'Company contact',
      value: contact.name,
      href: urls.contacts.contact(contact.id),
    },
    potential_value && {
      id: 3,
      label: 'Potential export value',
      value: NumberUtils.currencyGBP(potential_value),
    },
    expected_win_date && {
      id: 4,
      label: 'Expected date for win',
      value: moment(expected_win_date).format('MMM Y'),
    },
    {
      id: 5,
      label: 'Created',
      value: moment(created_on).format('DD MMM Y'),
      linkText: 'Archive this project',
      subtle: true,
    },
    archived &&
      archived_reason && {
        id: 6,
        label: 'Archive reason',
        value: (
          <span
            dangerouslySetInnerHTML={{
              __html: newlineToBr(escape(archived_reason)),
            }}
          />
        ),
      },
    archived && {
      id: 7,
      label: 'Archived',
      value: moment(archived_on).format('DD MMM Y'),
      subtle: true,
    },
  ]
  // remove falsy values
  return list.filter(Boolean)
}

const PipelineItemMeta = ({
  label,
  value,
  href,
  subtle,
  linkText,
  id,
  archived,
}) => (
  <StyledListItem>
    <StyledLabel>{label}</StyledLabel>
    {href ? (
      <StyledValue>
        <StyledLink href={href}>{value}</StyledLink>
      </StyledValue>
    ) : subtle ? (
      <StyledValueSubtle>
        {value}
        {linkText && !archived && (
          <StyledUnderlinedLink href={urls.pipeline.archive(id)}>
            Archive this project
          </StyledUnderlinedLink>
        )}
      </StyledValueSubtle>
    ) : (
      <StyledValue>{value}</StyledValue>
    )}
  </StyledListItem>
)

const PipelineItem = ({
  item: {
    id,
    name,
    likelihood_to_win,
    archived,
    archived_on,
    archived_reason,
    ...meta
  },
}) => {
  const metaListItems = buildMetaList({
    ...meta,
    archived,
    archived_on,
    archived_reason,
  })

  return (
    <Card>
      <StyledH3 archived={archived}>{name}</StyledH3>
      <StyledGridRow>
        <GridCol>
          <StyledUnorderedList>
            {metaListItems.map(({ label, value, href, subtle, linkText }) => (
              <PipelineItemMeta
                key={label}
                label={label}
                value={value}
                href={href}
                subtle={subtle}
                linkText={linkText}
                id={id}
                archived={archived}
              />
            ))}
          </StyledUnorderedList>
        </GridCol>
        <StyledGridCol>
          {LIKELIHOOD_TO_SUCCEED[likelihood_to_win] && (
            <StyledTagSpacing aria-label="Likelihood to succeed">
              <Tag
                colour={LIKELIHOOD_TO_SUCCEED[likelihood_to_win].colour}
              >{`${LIKELIHOOD_TO_SUCCEED[likelihood_to_win].text}`}</Tag>
              {archived && <Tag colour="grey">Archived</Tag>}
            </StyledTagSpacing>
          )}
          {archived ? (
            <StyledLinkWrapper>
              <Link href={urls.pipeline.delete(id)}>Delete</Link>
              <Link href={urls.pipeline.unarchive(id)}>Unarchive</Link>
            </StyledLinkWrapper>
          ) : (
            <Button as={Link} href={urls.pipeline.edit(id)} buttonColour={BLUE}>
              Edit
            </Button>
          )}
        </StyledGridCol>
      </StyledGridRow>
    </Card>
  )
}

PipelineItem.propTypes = {
  item: PipeLineItemPropType,
}

export default PipelineItem
