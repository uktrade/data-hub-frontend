import React, { useEffect, useState } from 'react'

import { DefaultLayout } from '../../../components'

function CompaniesCollectionHtmx() {
  const [error] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [html, setHTML] = useState({ __html: '' })

  useEffect(() => {
    fetch('/api-proxy/v4/company/htmx')
      .then((res) => res.text())
      .then((html) => {
        setIsLoaded(true)
        setHTML({ __html: html })
      })
  }, [])

  if (error) {
    return <div>Error: {error.message}</div>
  } else if (!isLoaded) {
    return <div>Loading...</div>
  } else {
    return (
      <DefaultLayout heading="Companies HTMX" pageTitle="Companies HTMX">
        <div id="target">
          <h1>Hello</h1>
          <div dangerouslySetInnerHTML={html} />
        </div>
      </DefaultLayout>
    )
  }
}

export default CompaniesCollectionHtmx
