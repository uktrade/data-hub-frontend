import {
  DEFAULT_MAX_PAGE_NUMBER_LINKS,
  PAGINATION_PIECE_ELLIPSIS,
  PAGINATION_PIECE_NEXT,
  PAGINATION_PIECE_PAGE_NUMBER,
  PAGINATION_PIECE_PREVIOUS,
} from './constants'

function computeVisiblePieces(
  numberOfPages,
  activePage,
  maxPageNumbers = DEFAULT_MAX_PAGE_NUMBER_LINKS
) {
  const visiblePieces = []
  let lowerLimit = activePage
  let upperLimit = activePage

  visiblePieces.push({
    type: PAGINATION_PIECE_PREVIOUS,
    pageNumber: Math.max(1, activePage - 1),
    isDisabled: activePage === 1,
  })

  for (let i = 1; i < maxPageNumbers && i < numberOfPages; ) {
    if (lowerLimit > 1) {
      lowerLimit -= 1
      i += 1
    }

    if (i < maxPageNumbers && upperLimit < numberOfPages) {
      upperLimit += 1
      i += 1
    }
  }

  if (lowerLimit > 1) {
    visiblePieces.push({
      type: PAGINATION_PIECE_PAGE_NUMBER,
      pageNumber: 1,
      isActive: activePage === 1,
    })
    visiblePieces.push({ type: PAGINATION_PIECE_ELLIPSIS })
  }

  for (let i = lowerLimit; i <= upperLimit; i += 1) {
    visiblePieces.push({
      type: PAGINATION_PIECE_PAGE_NUMBER,
      pageNumber: i,
      isActive: activePage === i,
    })
  }

  if (activePage < numberOfPages - 2 && numberOfPages > maxPageNumbers) {
    visiblePieces.push({ type: PAGINATION_PIECE_ELLIPSIS })
    visiblePieces.push({
      type: PAGINATION_PIECE_PAGE_NUMBER,
      pageNumber: numberOfPages,
      isActive: activePage === numberOfPages,
    })
  }

  visiblePieces.push({
    type: PAGINATION_PIECE_NEXT,
    pageNumber: Math.min(numberOfPages, activePage + 1),
    isDisabled: activePage === numberOfPages,
  })

  return visiblePieces
}

export default computeVisiblePieces
