import React from 'react'

import SecondaryContainer from './SecondaryContainer'

const Main = ({ children }) => (
  <main role="main" id="main-content" data-auto-id="bodyMainContent">
    {children.map((child, i) => (
      <SecondaryContainer key={i}>{child}</SecondaryContainer>
    ))}
  </main>
)

export default Main
