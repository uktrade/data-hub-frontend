import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Route } from 'react-router-dom'
import qs from 'qs'
import { FONT_SIZE, MEDIA_QUERIES, SPACING } from '@govuk-react/constants'
import Link from '@govuk-react/link'
import { GREY_3, GREY_4, LINK_COLOUR, TEXT_COLOUR } from 'govuk-colours'
import { PAGINATION_PIECE_PREVIOUS, PAGINATION_PIECE_NEXT } from './constants'

const StyledNav = styled('nav')`
  text-align: center;
  line-height: 1;
  display: flex;
  justify-content: space-around;
  padding: ${SPACING.SCALE_3} 0;

  ${MEDIA_QUERIES.TABLET} {
    display: block;
  }
`

const StyledPaginationList = styled('ul')`
  width: 100%;
  margin: 0;
  list-style: none;
  padding: 0;
  display: flex;
  justify-content: space-between;

  ${MEDIA_QUERIES.TABLET} {
    display: block;
  }
`

const StyledPaginationPiece = styled('li')`
  display: none;
  &:first-child,
  &:last-child {
    display: inline-block;
  }
  &:first-child {
    margin-right: auto;
  }
  &:last-child {
    margin-left: auto;
  }

  ${MEDIA_QUERIES.TABLET} {
    display: inline-block;

    & + & {
      margin-left: ${SPACING.SCALE_1};
      margin-bottom: ${SPACING.SCALE_1};
    }
  }
`

const StyledPaginationLink = styled(Link)`
  &:link {
    cursor: pointer;
    font-weight: bold;
    font-size: ${FONT_SIZE.SIZE_16};
    display: inline-block;
    padding: ${SPACING.SCALE_1} 12px;
    background-color: ${GREY_4};
    line-height: 1.9em;
    text-decoration: none;
    :hover {
      background-color: ${GREY_3};
    }
    ${({ isActive }) =>
      isActive
        ? `
        color: ${TEXT_COLOUR};
        background-color: transparent;
       `
        : `
        color: ${LINK_COLOUR};
      `}
    ${(props) => props['data-page-number'] && `display: none;`}
    ${MEDIA_QUERIES.TABLET} {
      ${(props) => props['data-page-number'] && `display: block;`}
    }
  }
`

const Pagination = ({
  items,
  pageSize = 10,
  onChangePage = () => {},
  initialPage = 1,
}) => {
  const linkRefs = useRef([])
  const [pager, setPagerState] = useState({})
  const { pages, totalPages, currentPage } = pager

  useEffect(() => {
    if (items) {
      setPage(initialPage)
    }
  }, [items])

  useEffect(() => {
    linkRefs.current.map(
      (link) =>
        parseInt(link?.dataset.pageNumber, 10) === currentPage && link.focus()
    )
  })

  const setPage = (page) => {
    if (page < 1 || page > totalPages) {
      return
    }

    const newPager = getPager(items, page, pageSize)

    setPagerState(newPager)

    onChangePage(newPager)
  }

  const getStartAndEndPage = (totalPages, currentPage) => {
    let startPage, endPage

    if (totalPages <= 10) {
      startPage = 1
      endPage = totalPages
    } else {
      if (currentPage <= 6) {
        startPage = 1
        endPage = 10
      } else if (currentPage + 4 >= totalPages) {
        startPage = totalPages - 9
        endPage = totalPages
      } else {
        startPage = currentPage - 5
        endPage = currentPage + 4
      }
    }
    return {
      startPage,
      endPage,
    }
  }

  const getPager = (totalItems, currentPage, pageSize) => {
    currentPage = currentPage || 1

    pageSize = pageSize || 10

    const totalPages = Math.ceil(totalItems / pageSize)

    const { startPage, endPage } = getStartAndEndPage(totalPages, currentPage)

    const startIndex = (currentPage - 1) * pageSize
    const endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1)

    const pages = [...Array(endPage + 1 - startPage).keys()].map(
      (i) => startPage + i
    )

    return {
      totalItems,
      currentPage,
      pageSize,
      totalPages,
      startPage,
      endPage,
      startIndex,
      endIndex,
      pages,
    }
  }

  return (
    <Route>
      {({ history, location }) => {
        const qsParams = qs.parse(location.search.slice(1))
        const handleOnClick = (pageNumber, e) => {
          e.preventDefault()
          setPage(pageNumber)
          window.scrollTo({ top: 0 })
          history.push({
            search: qs.stringify({
              ...qsParams,
              page: pageNumber,
            }),
          })
        }
        return pages?.length > 1 ? (
          <StyledNav
            data-test="pagination"
            aria-label={`Pagination: total ${totalPages}`}
            data-total-pages={totalPages}
          >
            <StyledPaginationList>
              {currentPage !== 1 && (
                <StyledPaginationPiece>
                  <StyledPaginationLink
                    onClick={(e) => handleOnClick(currentPage - 1, e)}
                    data-test="previous"
                    href="#"
                  >
                    {PAGINATION_PIECE_PREVIOUS}
                  </StyledPaginationLink>
                </StyledPaginationPiece>
              )}
              {pages.map((page, index) => {
                const isActive = currentPage === page
                return (
                  <StyledPaginationPiece key={index}>
                    <StyledPaginationLink
                      isActive={isActive}
                      onClick={(e) => handleOnClick(page, e)}
                      data-page-number={page}
                      data-test={`${isActive && 'page-number-active'}`}
                      ref={(el) => (linkRefs.current[index] = el)}
                      href="#"
                    >
                      {page}
                    </StyledPaginationLink>
                  </StyledPaginationPiece>
                )
              })}
              {currentPage !== totalPages && (
                <StyledPaginationPiece>
                  <StyledPaginationLink
                    onClick={(e) => handleOnClick(currentPage + 1, e)}
                    data-test="next"
                    href="#"
                  >
                    {PAGINATION_PIECE_NEXT}
                  </StyledPaginationLink>
                </StyledPaginationPiece>
              )}
            </StyledPaginationList>
          </StyledNav>
        ) : null
      }}
    </Route>
  )
}

Pagination.propTypes = {
  items: PropTypes.number.isRequired,
  onChangePage: PropTypes.func,
  initialPage: PropTypes.number,
  pageSize: PropTypes.number,
}

export default Pagination
