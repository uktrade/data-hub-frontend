import React from 'react'
import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <div>
      <header
        class="datahub-header js-datahub-header datahub-header--max-width js-datahub-header-enabled"
        role="banner"
        data-module="header"
      >
        <div class="datahub-header__logo-container">
          <div class="datahub-header__logo">
            <span class="datahub-header__logo__site-name">
              Department for International Trade
            </span>{' '}
            <a href="/" class="datahub-header__logo__link">
              <span class="datahub-header__logo__text">Data Hub</span>
            </a>{' '}
            <strong class="datahub-header__logo__tag">beta</strong>
          </div>
          <ul
            id="logo-navigation"
            class="datahub-header__links"
            aria-label="Header links"
          >
            <li class="datahub-header__links__item">
              <a
                class="datahub-header__links__item__text"
                href="https://data.trade.gov.uk"
              >
                Switch to Data Workspace
              </a>
            </li>
          </ul>
        </div>
        <button
          role="button"
          class="datahub-header__menu-button js-datahub-header-toggle"
          aria-controls="navigation sub-navigation logo-navigation"
          aria-label="Show or hide navigation"
        >
          Menu
        </button>
        <div class="datahub-header__navigation-container">
          <nav
            class="datahub-header__navigation-wrapper"
            aria-labelledby="navigation"
          >
            <ul
              id="navigation"
              class="datahub-header__navigation"
              aria-label="Top Level Navigation"
            >
              <li class="datahub-header__navigation__item">
                <Link
                  className="datahub-header__navigation__item__link"
                  to="/companies/react?archived%5B0%5D=false&sortby=modified_on%3Adesc&page=1"
                >
                  Companies
                </Link>
              </li>
              <li class="datahub-header__navigation__item">
                <Link
                  className="datahub-header__navigation__item__link"
                  to="/contacts/react?archived%5B0%5D=false&sortby=modified_on%3Adesc&page=1"
                >
                  Contacts
                </Link>
              </li>
              <li class="datahub-header__navigation__item">
                <Link
                  className="datahub-header__navigation__item__link"
                  to="/events/react?page=1&sortby=modified_on%3Adesc"
                >
                  Events
                </Link>
              </li>
              <li class="datahub-header__navigation__item">
                <Link
                  className="datahub-header__navigation__item__link"
                  to="/interactions/react?sortby=date%3Adesc&page=1"
                >
                  Interaction
                </Link>
              </li>
              <li class="datahub-header__navigation__item">
                <Link
                  className="datahub-header__navigation__item__link"
                  to="/investments/react?page=1&sortby=created_on%3Adesc"
                >
                  Investments
                </Link>
              </li>
              <li class="datahub-header__navigation__item">
                <Link
                  className="datahub-header__navigation__item__link"
                  to="/omis/react?page=1&sortby=created_on%3Adesc"
                >
                  Orders
                </Link>
              </li>
              <li class="datahub-header__navigation__item">
                <a
                  class="datahub-header__navigation__item__link"
                  href="https://find-exporters.datahub.trade.gov.uk/"
                >
                  Find exporters
                </a>
              </li>
              <li class="datahub-header__navigation__item">
                <a
                  class="datahub-header__navigation__item__link"
                  href="https://market-access.trade.gov.uk/"
                >
                  Market Access
                </a>
              </li>
              <li class="datahub-header__navigation__item">
                <a
                  class="datahub-header__navigation__item__link"
                  href="/support"
                >
                  Support
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </div>
  )
}

export default Header
