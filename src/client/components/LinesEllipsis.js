import styled from 'styled-components'

const LinesEllipsis = styled.div({
  display: '-webkit-box',
  WebkitLineClamp: ({ maxLine }) => maxLine,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
})

export default LinesEllipsis
