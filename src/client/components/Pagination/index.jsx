import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { GREY_1, GREY_3, GREY_4, LINK_COLOUR, TEXT_COLOUR } from 'govuk-colours'
import { FONT_SIZE, MEDIA_QUERIES, SPACING } from '@govuk-react/constants'
import Link from '@govuk-react/link'

import computeVisiblePieces from './computeVisiblePieces'

import {
  PAGINATION_PIECE_ELLIPSIS,
  PAGINATION_PIECE_NEXT,
  PAGINATION_PIECE_PAGE_NUMBER,
  PAGINATION_PIECE_PREVIOUS,
} from './constants'

const StyledNav = styled('nav')`
  text-align: center;
  line-height: 1;
  display: flex;
  justify-content: space-around;
  padding: ${SPACING.SCALE_3};

  ${MEDIA_QUERIES.TABLET} {
    display: block;
  }
`

const StyledPaginationList = styled('ul')`
  margin: 0;
  list-style: none;
`

const StyledPaginationPiece = styled('li')`
  display: inline-block;

  & + & {
    margin-left: ${SPACING.SCALE_1};
  }
`

const StyledPaginationLink = styled(Link)`
  font-weight: bold;
  font-size: ${FONT_SIZE.SIZE_16};
  display: inline-block;
  padding: ${SPACING.SCALE_1} ${SPACING.SCALE_3};
  background-color: ${GREY_4};
  line-height: 1.9em;
  color: ${LINK_COLOUR};
  text-decoration: none;

  :hover {
    background-color: ${GREY_3};
  }
`

const StyledActivePaginationLink = styled(StyledPaginationLink)`
  :link {
    color: ${TEXT_COLOUR};
    background-color: transparent;
  }
`

const StyledPagesTruncation = styled('span')`
  font-weight: bold;
  font-size: ${FONT_SIZE.SIZE_16};
  display: inline-block;
  padding: ${SPACING.SCALE_2};
  background-color: transparent;
  line-height: ${FONT_SIZE.SIZE_24};
  color: ${GREY_1};
`

function Pagination({ totalPages, activePage, onPageClick, getPageUrl }) {
  const visiblePieces = computeVisiblePieces(totalPages, activePage)

  if (totalPages < 2) {
    return null
  }

  return (
    <StyledNav aria-label={`pagination: total ${totalPages} pages`}>
      <StyledPaginationList>
        {visiblePieces.map(
          ({ type, pageNumber, isActive, isDisabled }, index) => {
            const key = `${type}-${index}`
            const onClick = (event) => onPageClick(pageNumber, event)

            const PageNumberLink = isActive
              ? StyledActivePaginationLink
              : StyledPaginationLink

            if (isDisabled) {
              return null
            }

            return (
              <StyledPaginationPiece key={key}>
                {type === PAGINATION_PIECE_PREVIOUS && (
                  <StyledPaginationLink
                    data-test="prev"
                    onClick={onClick}
                    href={getPageUrl(pageNumber)}
                  >
                    Previous
                  </StyledPaginationLink>
                )}

                {type === PAGINATION_PIECE_ELLIPSIS && (
                  <StyledPagesTruncation data-test="ellipsis">
                    …
                  </StyledPagesTruncation>
                )}

                {type === PAGINATION_PIECE_PAGE_NUMBER && (
                  <PageNumberLink
                    data-test={isActive ? 'page-number-active' : 'page-number'}
                    onClick={onClick}
                    href={getPageUrl(pageNumber)}
                  >
                    {pageNumber}
                  </PageNumberLink>
                )}

                {type === PAGINATION_PIECE_NEXT && (
                  <StyledPaginationLink
                    data-test="next"
                    onClick={onClick}
                    href={getPageUrl(pageNumber)}
                  >
                    Next
                  </StyledPaginationLink>
                )}
              </StyledPaginationPiece>
            )
          }
        )}
      </StyledPaginationList>
    </StyledNav>
  )
}

Pagination.propTypes = {
  totalPages: PropTypes.number.isRequired,
  activePage: PropTypes.number,
  onPageClick: PropTypes.func,
  getPageUrl: PropTypes.func,
}

Pagination.defaultProps = {
  activePage: 1,
  onPageClick: null,
  getPageUrl: () => '#',
}

export default Pagination
