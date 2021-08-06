import React from 'react'

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
                <a
                  class="datahub-header__navigation__item__link"
                  href="/companies"
                >
                  Companies
                </a>
              </li>
              <li class="datahub-header__navigation__item">
                <a
                  class="datahub-header__navigation__item__link"
                  href="/contacts"
                >
                  Contacts
                </a>
              </li>
              <li class="datahub-header__navigation__item">
                <a
                  class="datahub-header__navigation__item__link"
                  href="/events"
                >
                  Events
                </a>
              </li>
              <li class="datahub-header__navigation__item">
                <a
                  class="datahub-header__navigation__item__link"
                  href="/interactions"
                >
                  Interactions
                </a>
              </li>
              <li class="datahub-header__navigation__item">
                <a
                  class="datahub-header__navigation__item__link"
                  href="/investments"
                >
                  Investments
                </a>
              </li>
              <li class="datahub-header__navigation__item">
                <a class="datahub-header__navigation__item__link" href="/omis">
                  Orders
                </a>
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
