/**
 * @function assertBreadcrumbs
 * @description Asserts the presence of breadcrumbs with minimal knowledge about
 * implementation details e.g. class names and ids.
 * @param {Object} specs - A map of expected breadcrumb item labels to hrefs.
 * @example
 * // Asserts that breadcrumbs: Home > Foo > Bar > Baz exist and that they have
 * // the expected texts and hrefs.
 * it('Should render foo > bar > baz breadcrumbs' =>
 *   assertBreadcrumbs({
 *     'Home': '/',
 *     'Foo': '/foo',
 *     'Bar': '/bar',
 *     'Baz': undefined,
 *   })
 * )
 */
const assertBreadcrumbs = specs => {
  const entries = Object.entries(specs)
  cy
    .contains(Object.keys(specs).join(''))
    .children('li')
    .should('have.length', entries.length)
    .each((x, i) => {
      const [expectedText, expectedHref] = entries[i]
      cy
        .get(x)
        .contains(expectedText)
        .invoke('attr', 'href')
        .should('eq', expectedHref)
    })
}

/**
 * @function describeBreadcrumbs
 * @description Same as asserBreadcrumbs but already wrapped in an `it` block.
 * @param {Object} specs - A map of expected breadcrumb item labels to hrefs.
 */
const describeBreadcrumbs = specs =>
  it('Should render correct breadcrumbs', () =>
    assertBreadcrumbs(specs)
  )

module.exports = {
  randomString: () => {
    return Math.random().toString(36).substring(7)
  },
  describeBreadcrumbs,
  assertBreadcrumbs,
}
