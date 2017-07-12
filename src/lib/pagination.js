const { range, take, uniq, get } = require('lodash')
const { buildQueryString } = require('./url-helpers')

const NEXTLABEL = 'Next'
const PREVIOUSLABEL = 'Previous'

// Figure out the start, end, next and previous pages indexes
// for pagination
function getPageIndexes (req, result) {
  let pageIndex = {}
  let currentPage = Math.max(parseInt((req.query.page || 1), 10), 1)

  let totalPages = Math.ceil(result.count / 10)

  pageIndex.startPage = Math.max((currentPage - 2), 1)
  pageIndex.endPage = Math.min((pageIndex.startPage + 4), totalPages)

  if (currentPage !== 1) {
    pageIndex.previousPage = currentPage - 1
  }

  if (currentPage !== totalPages) {
    pageIndex.nextPage = currentPage + 1
  }

  // Adjust in case of near the end of result set.
  if (pageIndex.endPage < (currentPage + 2)) {
    pageIndex.startPage = pageIndex.endPage - 4
    if (pageIndex.startPage < 1) pageIndex.startPage = 1
  }

  return pageIndex
}

function getPagination (req, result) {
  let pagination = []
  let currentPage = parseInt((req.query.page || 1), 10) || 1

  if (result.count === 0) {
    return pagination
  }

  let pageIndexes = getPageIndexes(req, result)

  // Create an array of pagination items
  if (currentPage > 1) {
    pagination.push({
      label: PREVIOUSLABEL,
      link: getPageLink(currentPage - 1, req),
    })
  }

  for (let pos = pageIndexes.startPage; pos <= pageIndexes.endPage; pos += 1) {
    pagination.push({
      label: `${pos}`,
      link: getPageLink(pos, req),
      currentPage: (pos === currentPage),
    })
  }

  if (pageIndexes.nextPage) {
    pagination.push({
      label: NEXTLABEL,
      link: getPageLink(pageIndexes.nextPage, req),
    })
  }

  if (pagination.length === 1) {
    return []
  }

  return pagination
}

function getPageLink (page, req) {
  const query = Object.assign({}, req.query, {
    page,
  })
  return buildQueryString(query)
}

function truncatePages (pagination, blockSize) {
  const pages = pagination.pages

  if (!pages.length) { return pagination }

  const currentPageNum = pagination.currentPage
  const currentPageIndex = pagination.currentPage - 1
  const firstPage = pages[0]
  const lastPage = pages[pages.length - 1]
  const truncationSymbol = '…'

  const blockPivot = Math.round(blockSize / 2)
  const startOfCurrentBlock = Math.abs(currentPageNum - blockPivot)
  const startOfLastBlock = lastPage.label - blockSize
  const blockStartIndex = Math.min(startOfCurrentBlock, startOfLastBlock, currentPageIndex)

  let truncatedPages = take(pages.slice(blockStartIndex), blockSize)
  truncatedPages.unshift(firstPage)
  truncatedPages.push(lastPage)

  truncatedPages = uniq(truncatedPages)

  if (pagination.totalPages > blockSize + 1) {
    // Add truncation after the first page number
    if (currentPageNum > firstPage.label + blockPivot) {
      truncatedPages.splice(1, 0, { label: truncationSymbol })
    }
    // Add truncation before the last page number
    if (currentPageNum < lastPage.label - blockPivot) {
      truncatedPages.splice(-1, 0, { label: truncationSymbol })
    }
  }

  pagination.pages = truncatedPages

  return pagination
}

function buildPagination (req, results, truncate = 4) {
  const limit = results.limit || Math.max(get(results, 'results.length', 10), 10)
  const totalPages = results.count ? Math.ceil(results.count / limit) : 0
  results.page = parseInt(results.page, 10)

  if (!results.page || totalPages < 2) { return null }

  const pagination = {
    totalPages,
    currentPage: results.page,
    prev: results.page > 1 ? getPageLink(results.page - 1, req) : null,
    next: results.page === totalPages ? null : getPageLink(results.page + 1, req),
    pages: range(0, totalPages).map((page, idx) => {
      return {
        label: idx + 1,
        url: getPageLink(idx + 1, req),
      }
    }),
  }

  return truncatePages(pagination, truncate)
}

module.exports = {
  getPageIndexes,
  getPagination,
  getPageLink,
  buildPagination,
}
