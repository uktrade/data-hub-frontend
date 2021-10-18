import { css, keyframes } from 'styled-components'

const shimmer = keyframes`
  0% {
    background-position: -500px 0;
  }
  100% {
    background-position: 500px 0;
  }
`

const animation = css`
  animation-duration: 1.5s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
  animation-name: ${shimmer};
  background: linear-gradient(to right, #eee 8%, #ddd 18%, #eee 33%);
  background-size: 1000px 104px;
`

// Min and max inclusive
const randomNumberMinToMax = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min)

export { animation, randomNumberMinToMax }
