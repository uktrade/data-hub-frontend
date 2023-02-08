import React, { useState, useEffect } from 'react'
import { LOCAL_NAV } from '../../../apps/companies/constants'
import CompanyLocalTab from './CompanyLocalTab'
import './tab-local-nav.scss'

const CompanyTabbedLocalNavigation = (props) => {
  const {
    company: { id },
  } = props

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
          <ul
            className="govuk-tabs__list govuk-tabs__list--full"
            style={{ display: 'flex' }}
          >
            {LOCAL_NAV.map((navItem, index) => {
              return (
                <CompanyLocalTab
                  navItem={navItem}
                  index={index}
                  id={id}
                  active={active}
                  handleClick={handleClick}
                  key={`company-tab-${index}`}
                />
              )
            })}
          </ul>
        </nav>
      </div>
    </div>
  )
}

export default CompanyTabbedLocalNavigation
