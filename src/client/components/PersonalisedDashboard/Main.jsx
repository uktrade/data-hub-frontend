import React from 'react'

const Main = ({ children }) => (
  <main role="main" id="main-content" data-test="bodyMainContent">
    {children}
  </main>
)

export default Main
