import React from 'react'
import { LOCAL_NAV } from '../../../apps/companies/constants'
import { Link } from 'govuk-react'

const CompanyTabbedLocalNavigation = () => {
  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-full">
        <nav
          className="govuk-tabs"
          aria-label="local navigation"
          data-test="tabbedLocalNav"
        >
          <ul className="govuk-tabs__list govuk-tabs__list--full">
            {LOCAL_NAV.map((navItem) => {
              return (
                <li className="govuk-tabs__list-item govuk-tabs__list-item--full">
                  <Link className="govuk-tabs__tab" href={navItem.path}>
                    {navItem.label}
                  </Link>
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
