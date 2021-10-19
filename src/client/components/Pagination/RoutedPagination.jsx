import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
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
  ${MEDIA_QUERIES.MOBILE} {
    width: 100%;
    margin: 0;
    list-style: none;
    padding: 0;
    display: flex;
    justify-content: space-between;
  }
  ${MEDIA_QUERIES.TABLET} {
    display: block;
  }
`

const StyledPaginationPiece = styled('li')`
  ${MEDIA_QUERIES.MOBILE} {
    display: none;
    &:first-child,
    &:last-child {
      display: inline-block;
      ${({ isHidden }) =>
        isHidden &&
        css`
          display: none;
        `};
    }
    &:last-child {
      margin-left: auto;
    }
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
    padding: ${SPACING.SCALE_1} ${SPACING.SCALE_3};
    background-color: ${GREY_4};
    line-height: 1.9em;
    color: ${LINK_COLOUR};
    text-decoration: none;
    :hover {
      background-color: ${GREY_3};
    }
    ${({ isActive }) =>
      isActive &&
      css`
        color: ${TEXT_COLOUR};
        background-color: transparent;
      `};
  }
`

const Pagination = ({
  items,
  pageSize = 10,
  onChangePage = () => {},
  initialPage = 1,
}) => {
  useEffect(() => {
    if (items) {
      setPage(initialPage)
    }
  }, [items])

  const [pager, setPagerState] = useState({})
  const { pages, totalPages, currentPage } = pager

  const setPage = (page) => {
    if (page < 1 || page > totalPages) {
      return
    }

    // get new pager object for specified page
    const newPager = getPager(items, page, pageSize)

    // update state
    setPagerState(newPager)

    // call change page function in parent component
    onChangePage(newPager)
  }

  const getPager = (totalItems, currentPage, pageSize) => {
    // default to first page
    currentPage = currentPage || 1

    // default page size is 10
    pageSize = pageSize || 10

    // calculate total pages
    const totalPages = Math.ceil(totalItems / pageSize)

    let startPage, endPage
    if (totalPages <= 10) {
      // less than 10 total pages so show all
      startPage = 1
      endPage = totalPages
    } else {
      // more than 10 total pages so calculate start and end pages
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

    // calculate start and end item indexes
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1)

    // create an array of pages to repeat in the pager control
    const pages = [...Array(endPage + 1 - startPage).keys()].map(
      (i) => startPage + i
    )

    // return object with all pager properties required by the view
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
              <StyledPaginationPiece isHidden={currentPage === 1}>
                <StyledPaginationLink
                  onClick={(e) => handleOnClick(currentPage - 1, e)}
                  data-test="previous"
                  href="#"
                >
                  {PAGINATION_PIECE_PREVIOUS}
                </StyledPaginationLink>
              </StyledPaginationPiece>
              {pages.map((page, index) => {
                const isActive = currentPage === page
                return (
                  <StyledPaginationPiece key={index}>
                    <StyledPaginationLink
                      isActive={isActive}
                      onClick={(e) => handleOnClick(page, e)}
                      data-page-number={page}
                      data-test={`${isActive && 'page-number-active'}`}
                      href="#"
                    >
                      {page}
                    </StyledPaginationLink>
                  </StyledPaginationPiece>
                )
              })}
              <StyledPaginationPiece isHidden={currentPage === totalPages}>
                <StyledPaginationLink
                  onClick={(e) => handleOnClick(currentPage + 1, e)}
                  href="#"
                >
                  {PAGINATION_PIECE_NEXT}
                </StyledPaginationLink>
              </StyledPaginationPiece>
            </StyledPaginationList>
          </StyledNav>
        ) : null
      }}
    </Route>
  )
}

Pagination.propTypes = {
  items: PropTypes.array.isRequired,
  onChangePage: PropTypes.func,
  initialPage: PropTypes.number,
  pageSize: PropTypes.number,
}

export default Pagination
