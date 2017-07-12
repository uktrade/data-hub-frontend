const { range, take, uniq, get } = require('lodash')
const { buildQueryString } = require('./url-helpers')

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
  getPageLink,
  buildPagination,
}
