import React, { useState } from 'react'

import DataHubHeader from '.'

const Wrapper = () => {
  const [showVerticalNav, setShowVerticalNav] = useState(false)

  return (
    <DataHubHeader
      showVerticalNav={showVerticalNav}
      onShowVerticalNav={setShowVerticalNav}
      disableReactRouter={true}
    />
  )
}

export default Wrapper
