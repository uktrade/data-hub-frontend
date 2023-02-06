import React, { useState, useEffect } from 'react'
import { LOCAL_NAV } from '../../../apps/companies/constants'

const CompanyTabbedLocalNavigation = (props) => {
  const {
    company: { id },
  } = props

  const generateFullUrl = (navItemPath) => `/companies/${id}/${navItemPath}`

  const [active, setActive] = useState('tab-0')

  useEffect(() => {
    setActive(localStorage.getItem('active'))
  }, [])

  useEffect(() => {
    localStorage.setItem('active', active)
  }, [active])

  const handleClick = (e) => {
    const index = e.target.id
    if (index !== active) {
      setActive(index)
    }
  }

  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-full">
        <nav
          className="govuk-tabs"
          aria-label="local navigation"
          data-test="tabbedLocalNav"
        >
          <ul className="govuk-tabs__list govuk-tabs__list--full">
            {LOCAL_NAV.map((navItem, index) => {
              return (
                <li
                  className="govuk-tabs__list-item govuk-tabs__list-item--full"
                  key={`tab-${index}`}
                >
                  <a
                    className={
                      active == `tab-${index}`
                        ? 'govuk-tabs__tab govuk-tabs__tab--selected'
                        : 'govuk-tabs__tab'
                    }
                    href={generateFullUrl(navItem.path)}
                    id={`tab-${index}`}
                    onClick={handleClick}
                    aria-label={navItem.ariaDescription}
                  >
                    {navItem.label}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </div>
  )
}

export default CompanyTabbedLocalNavigation
