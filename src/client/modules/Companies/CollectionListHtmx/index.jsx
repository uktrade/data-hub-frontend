import React, { useEffect, useState } from 'react'

import { DefaultLayout } from '../../../components'

function CompaniesCollectionHtmx() {
  const [error] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    fetch('/api-proxy/v4/company-filters', {
      headers: { Accept: 'text/html' },
    })
      .then((res) => res.text())
      .then((html) => {
        setIsLoaded(true)
        const target = document.getElementById('target')
        // Using state prevents htmx finding the htmx, so innerHTML required.
        target.innerHTML = html
        // Required to tell htmx to look for newly added htmx
        window.htmx.process(target)
      })
      .then(() => {})
  }, [])

  if (error) {
    return <div>Error: {error.message}</div>
  }
  return (
    <DefaultLayout heading="Companies HTMX" pageTitle="Companies HTMX">
      {/* Where to put HTML response from API for the filters */}
      <div id="target">{isLoaded ? <div /> : <div>Loading...</div>}</div>
    </DefaultLayout>
  )
}

export default CompaniesCollectionHtmx
