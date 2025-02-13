/**
 * Adds a Cypress command with nice logging. In particular, solves the problem
 * when the created shapshot doesn't highlight the selected DOM element.
 * @param {Object} options
 * @param {String} options.name - The command name
 * @param {String} options.logName - The name of the log message e.g. 'GET'
 * @param {(...args) => Promise} options.command - The actual implementation of
 * the command It can take any number of arguments, but the last one is treated
 * as options. It should return the Cypress promise, if it's a continuation
 * command.
 * @param {(...args) => String} options.getLogMessage - A function which takes
 * all the command arguments an should return a string which will be used as
 * the log message.
 * @returns undefined
 */
const addLoggedCommand = ({
  name,
  logName,
  command,
  getLogMessage,
  options = {},
}) =>
  Cypress.Commands.add(name, options, (...args) => {
    const { log = true, nestedLog = false } = args[args.length - 1] || {}
    const logOptions = {
      name: logName,
      message: getLogMessage(...args),
    }
    const result = command(...args)

    if (!log) {
      return
    }

    if (nestedLog) {
      result.then(($el) => {
        Cypress.log({ ...logOptions, $el })
        return $el
      })
    } else {
      // If we want to avoid the leading dash in the log name, we must
      // instantiate the log outside of .then().
      const _log = Cypress.log(logOptions)
        // This is to avoid creation of a snapshot at this stage
        .end()

      result.then(($el) => {
        _log
          // This will enable highlighting of the selected area
          .set({ $el })
          // This is the stage when we want to make the snapshot
          .snapshot()
        return $el
      })
    }
  })

/**
 * _Gets_ the accessible _tablist_ element.
 * @param {string} label - The label to look for
 */
addLoggedCommand({
  name: 'getDhTablist',
  logName: 'DH GET',
  getLogMessage: (label) => `TABLIST: ${label}`,
  command: (label) =>
    cy.get(`[role=tablist][aria-label=${label}]`, { log: false }),
})

/**
 * _Gets_ the _tabpanel_ element of the `TabNav` component by its _tablist_ label.
 * @param {string} label - The TabNav label to look for
 */
addLoggedCommand({
  name: 'getDhTabNavPanel',
  logName: 'DH GET',
  getLogMessage: (label) => `TABPANEL: ${label}`,
  command: (label, options) =>
    cy
      .getDhTablist(label, { ...options, nestedLog: true })
      .parent(options)
      .find('[role=tabpanel]', options),
})

/**
 * _Gets_ an accessible _tab_ element by its label.
 * @param {string} label - The label to look for
 */
addLoggedCommand({
  name: 'getDhTab',
  logName: 'DH GET',
  getLogMessage: (label) => `TAB: ${label}`,
  command: (label, { verbose } = {}) =>
    cy.get(`[role=tab]:contains(${label})`, { log: !!verbose }),
})

/**
 * _Gets_ the _tab_ element of an accessible _tablist_ element.
 * @param {string} tabListLabel - The _tablist_ label
 * @param {string} tabLabel - The _tab_ label
 * @param {options} options
 * @param {Boolean} options.log - Whether the command should log
 * @param {Boolean} options.nestedLog - Whether the log name should be prefixed
 * with a dash e.g. `'-GET'` if in a nested context like `.witin()`
 */
Cypress.Commands.add('getDhTablistTab', (tablistLabel, tabLabel, options) => {
  cy.getDhTablist(tablistLabel, options).getDhTab(tabLabel, {
    ...options,
    nestedLog: true,
  })
})

Cypress.Commands.add(
  'selectTypeaheadOption',
  { prevSubject: 'element' },
  (subject, text) => {
    cy.wrap(subject).find('input').click().clear().type(text)
    cy.get('[data-test="typeahead-menu-option"]').should('be.visible')
    cy.wrap(subject).find('input').type('{downarrow}{enter}{esc}')
    return cy.wrap(subject)
  }
)

Cypress.Commands.add(
  'selectTypeaheadOptionInFieldset',
  { prevSubject: 'element' },
  (subject, text) => {
    cy.wrap(subject).children().find('input').click().clear().type(text)
    cy.get('[data-test="typeahead-menu-option"]').should('be.visible')
    cy.wrap(subject).children().find('input').type('{downarrow}{enter}{esc}')
    return cy.wrap(subject)
  }
)

Cypress.Commands.add(
  'checkNoTypeaheadOptionsDisplayed',
  { prevSubject: 'element' },
  (subject, text) => {
    cy.wrap(subject).find('input').click().clear().type(text)
    cy.get('[data-test="typeahead-no-options"]').should('be.visible')
    return cy.wrap(subject)
  }
)

/**
 * _Selects_ a _tab_ element of the `TabNav` component and _gets_ its _tabpanel_
 * element.
 * @param {string} tabListLabel - The _tablist_ label
 * @param {string} tabLabel - The _tab_ label
 * @param {options} options
 * @param {Boolean} options.log - Whether the command should log
 * @param {Boolean} options.nestedLog - Whether the log name should be prefixed
 * @param {Boolean} options.verbose - If true, also logs the underlying commands.
 */
addLoggedCommand({
  name: 'selectDhTablistTab',
  logName: 'DH SELECT',
  getLogMessage: (tabListLabel, tabLabel) =>
    `TABPANEL: ${tabListLabel} > ${tabLabel}`,
  command: (tabListLabel, tabLabel, { verbose = false } = {}) => {
    const options = { log: verbose }
    cy.getDhTablistTab(tabListLabel, tabLabel, options).click(options)
    return cy.getDhTabNavPanel(tabListLabel, options)
  },
})

Cypress.Commands.add(
  'removeAllTypeaheadValues',
  { prevSubject: 'element' },
  (subject) => {
    cy.wrap(subject)
      .find('[data-test="typeahead-chip"]')
      .each((el) => cy.wrap(el).click())
    return cy.wrap(subject)
  }
)

Cypress.Commands.add(
  'getTypeaheadValues',
  { prevSubject: 'element' },
  (subject) => {
    return cy.wrap(subject).find('[data-test="typeahead-chip-list"]')
  }
)

Cypress.Commands.add('setFeatureFlag', (name, isActive) => {
  const body = {
    code: name,
    is_active: isActive,
  }
  const backendUrl = Cypress.env('sandbox_url')
  const uri = '/sandbox/feature-flag'
  return cy.request('PUT', `${backendUrl}${uri}`, body)
})

Cypress.Commands.add('resetFeatureFlags', () => {
  const backendUrl = Cypress.env('sandbox_url')
  const uri = '/sandbox/reset-feature-flag'
  return cy.request('POST', `${backendUrl}${uri}`)
})

Cypress.Commands.add('reseed', () => {
  const backendUrl = Cypress.env('sandbox_url')
  const uri = '/testfixtureapi/reset-fixtures/'
  return cy.request('POST', `${backendUrl}${uri}`)
})

Cypress.Commands.add('createUser', (userData) => {
  const backendUrl = Cypress.env('sandbox_url')
  const uri = '/testfixtureapi/create-user/'
  return cy.request('POST', `${backendUrl}${uri}`, userData)
})

Cypress.Commands.add('loadFixture', (fixture) => {
  const backendUrl = Cypress.env('sandbox_url')
  const uri = '/testfixtureapi/load-fixture/'
  return cy.request('POST', `${backendUrl}${uri}`, {
    fixture: fixture,
  })
})

// This command helps us to check colours in cypress as cypress always return rgb, and our govuk-colours library uses hexes.
const compareColor = (color, property) => (targetElement) => {
  const tempElement = document.createElement('div')
  tempElement.style.color = color
  tempElement.style.display = 'none' // make sure it doesn't actually render
  document.body.appendChild(tempElement) // append so that `getComputedStyle` actually works

  const tempColor = getComputedStyle(tempElement).color
  const targetColor = getComputedStyle(targetElement[0])[property]

  document.body.removeChild(tempElement) // remove it because we're done with it

  expect(tempColor).to.equal(targetColor)
}

Cypress.Commands.overwrite(
  'should',
  (originalFn, subject, expectation, ...args) => {
    const customMatchers = {
      'have.backgroundColour': compareColor(args[0], 'backgroundColor'),
      'have.colour': compareColor(args[0], 'color'),
    }

    // See if the expectation is a string and if it is a member of Jest's expect
    if (typeof expectation === 'string' && customMatchers[expectation]) {
      return originalFn(subject, customMatchers[expectation])
    }
    return originalFn(subject, expectation, ...args)
  }
)

Cypress.Commands.add('setUserDitTeam', (id) => {
  return cy.request('PUT', `${Cypress.env('sandbox_url')}/whoami`, {
    dit_team_id: id,
  })
})

Cypress.Commands.add('setUserFeatures', (features) => {
  return cy.request('PUT', `${Cypress.env('sandbox_url')}/whoami`, {
    active_features: features,
  })
})

Cypress.Commands.add('setUserFeatureGroups', (groups) => {
  return cy.request('PUT', `${Cypress.env('sandbox_url')}/whoami`, {
    active_feature_groups: groups,
  })
})

Cypress.Commands.add('setAdviserId', (id) => {
  return cy.request('PUT', `${Cypress.env('sandbox_url')}/whoami`, { id })
})

Cypress.Commands.add('resetUser', () => {
  return cy.request('POST', `${Cypress.env('sandbox_url')}/whoami`)
})

Cypress.Commands.add('checkRadioGroup', (label, option) =>
  cy
    .contains(label)
    .parent()
    .within(() => cy.get(`[aria-label="${option}"]`).check())
)

Cypress.Commands.add('getSubmitButtonByLabel', (label) =>
  cy.get('form').contains(label)
)

Cypress.Commands.add('typeIntoInputs', (labelValueMap) =>
  Object.entries(labelValueMap).forEach(([label, value]) =>
    cy.contains(label).type(value)
  )
)

Cypress.Commands.add('checkRadioGroup', (label, option) =>
  cy.contains(label).parent().find(`[aria-label="${option}"]`).check()
)

Cypress.Commands.add('clickSubmitButton', (label) =>
  cy.get('form').contains('button', label).click()
)

Cypress.Commands.add('setModulePermissions', (permissions) => {
  return cy.request('put', `${Cypress.env('sandbox_url')}/whoami`, {
    permissions,
  })
})

Cypress.Commands.add('clearSessionStorage', () => {
  cy.window().then((win) => win.sessionStorage.clear())
})

Cypress.Commands.add('localStorage', (key, value) => {
  cy.window().then((win) => win.localStorage.setItem(key, value))
})

Cypress.Commands.add('getViewport', () => {
  cy.document().then((doc) => {
    return doc.documentElement.getBoundingClientRect()
  })
})

Cypress.Commands.add('isNotInViewport', (element) => {
  cy.get(element).then(($el) => {
    const bottom = Cypress.$(cy.state('window')).height()
    const rect = $el[0].getBoundingClientRect()

    expect(rect.top).to.be.greaterThan(bottom)
    expect(rect.bottom).to.be.greaterThan(bottom)
    expect(rect.top).to.be.greaterThan(bottom)
    expect(rect.bottom).to.be.greaterThan(bottom)
  })
})

Cypress.Commands.add('isInViewport', (element) => {
  cy.get(element).then(($el) => {
    const bottom = Cypress.$(cy.state('window')).height()
    const rect = $el[0].getBoundingClientRect()

    expect(rect.top).not.to.be.greaterThan(bottom)
    expect(rect.bottom).not.to.be.greaterThan(bottom)
    expect(rect.top).not.to.be.greaterThan(bottom)
    expect(rect.bottom).not.to.be.greaterThan(bottom)
  })
})

Cypress.Commands.add('isScrolledTo', (element) => {
  cy.get(element).should(($el) => {
    const bottom = Cypress.$(cy.state('window')).height()
    const rect = $el[0].getBoundingClientRect()

    expect(rect.top).not.to.be.greaterThan(
      bottom,
      `Expected element not to be below the visible scrolled area`
    )
    expect(rect.top).to.be.greaterThan(
      0 - rect.height,
      `Expected element not to be above the visible scrolled area`
    )
  })
})

Cypress.Commands.add('dataTest', (value) => cy.get(`[data-test="${value}"]`))
