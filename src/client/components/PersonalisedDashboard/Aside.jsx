import React from 'react'

import PrimaryContainer from './PrimaryContainer'

const Aside = ({ children }) => (
  <aside>
    {children.map((child, i) => (
      <PrimaryContainer key={i}>{child}</PrimaryContainer>
    ))}
  </aside>
)

export default Aside
