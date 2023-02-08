import React from 'react'

const CompanyLocalTab = (props) => {
  const { navItem, index, active, handleClick, id, finalTabIndex } = props
  const generateFullUrl = (navItemPath) => `/companies/${id}/${navItemPath}`

  return (
    <li
      className="govuk-tabs__list-item govuk-tabs__list--full govuk-tabs__react-list-item--full"
      key={`tab-${index}`}
    >
      <a
        className={
          active == `tab-${index}` && index == finalTabIndex
            ? 'govuk-tabs__tab govuk-tabs__tab--selected last-child'
            : active == `tab-${index}`
            ? 'govuk-tabs__tab govuk-tabs__tab--selected'
            : index == 5
            ? 'govuk-tabs__tab last-child'
            : 'govuk-tabs__tab other-children'
        }
        href={generateFullUrl(navItem.path)}
        id={`tab-${index}`}
        key={`tab-link-${index}`}
        onClick={handleClick}
        aria-label={navItem.ariaDescription}
      >
        {navItem.label}
      </a>
    </li>
  )
}

export default CompanyLocalTab
