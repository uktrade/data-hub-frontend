const fixtures = require('../../fixtures')
const { assertBreadcrumbs } = require('../../support/assertions')
const urls = require('../../../../../src/lib/urls')
const exportSelectors = require('../../../../selectors/company/export')

const countrySelectors = exportSelectors.countries

describe('Companies Export', () => {
  context(
    'when viewing the export tab for an active company with no export information and 8 Export Wins',
    () => {
      before(() => {
        cy.visit(urls.companies.exports.index(fixtures.company.dnbCorp.id))
      })

      it('should render breadcrumbs', () => {
        assertBreadcrumbs({
          Home: '/',
          Companies: '/companies',
          [fixtures.company.dnbCorp.name]: urls.companies.detail(
            fixtures.company.dnbCorp.id
          ),
          Exports: null,
        })
      })

      it('should render "Exports" caption', () => {
        cy.get('table:first caption').should('have.text', 'Exports')
      })

      it('should render the "Exports" table', () => {
        cy.get('th')
          .first()
          .should('have.text', 'Export win category')
        cy.get('th')
          .eq(1)
          .should('have.text', 'great.gov.uk business profile')
        cy.get('th')
          .eq(2)
          .should('have.text', 'Export potential')
        cy.get('td')
          .first()
          .should('have.text', 'None')
        cy.get('td')
          .eq(1)
          .should('have.text', 'No profile')
        cy.get('td')
          .eq(2)
          .should('have.text', 'No score given')
      })

      it('should render the "What is export potential" dropdown', () => {
        cy.contains('What is export potential')
        cy.contains(
          "The export potential score is a prediction of a company's likelihood of exporting, and was originally created for the Find Exporters tool. DIT's data science team compared all HMRC export information with the features of all UK companies to find patterns; they then repeatedly tested their model against a subset of known-good data to improve it. The scores are as follows:Very High - Most companies like this one are exportersHigh - This business shares some features with successful exportersMedium - Some businesses that look like this one export, others don'tLow - This business shares many features with companies that do not exportVery Low - Most of the businesses like this aren't exportersWe are continuing to improve the algorithm so please do share your feedback or let us know of any anomalies through the support channel."
        )
        cy.contains('Find Exporters tool').should(
          'have.attr',
          'href',
          urls.external.findExporters()
        )
        cy.contains('Find Exporters tool').should(
          'have.attr',
          'aria-label',
          'opens in a new tab'
        )
      })

      it('should render the "Export countries information header', () => {
        cy.get('h3')
          .first()
          .should('have.text', 'Export countries information')
      })

      it('should render the link to exports history', () => {
        cy.contains('View full export countries history').should(
          'have.attr',
          'href',
          urls.companies.exports.history.index(fixtures.company.dnbCorp.id)
        )
      })

      it('should render the "Exports countries information" table', () => {
        cy.get('th')
          .eq(3)
          .should('have.text', 'Currently exporting to')
        cy.get('th')
          .eq(4)
          .should('have.text', 'Future countries of interest')
        cy.get('th')
          .eq(5)
          .should('have.text', 'Countries of no interest')
        cy.get('td')
          .eq(3)
          .should('have.text', 'None')
        cy.get('td')
          .eq(4)
          .should('have.text', 'None')
        cy.get('td')
          .eq(5)
          .should('have.text', 'None')
      })

      it('should render the "Edit export countries" button', () => {
        cy.contains('Edit export countries').should('have.prop', 'tagName', 'A')
      })

      it('should render the "Edit export countries" button with the correct link', () => {
        cy.contains('Edit export countries').should(
          'have.attr',
          'href',
          urls.companies.exports.edit(fixtures.company.dnbCorp.id)
        )
      })

      it('should render the "Export wins" header', () => {
        cy.get('h3')
          .eq(1)
          .should('have.text', 'Export wins')
      })

      it('should render the "Record your win on our Exports Wins site" paragraph', () => {
        cy.get('h3')
          .eq(1)
          .siblings('p')
          .should('have.text', 'Record your win on our Export Wins site')
      })

      it('should render the link to Export Wins', () => {
        cy.contains('Record your win').should(
          'have.attr',
          'href',
          urls.external.exportWins()
        )
        cy.contains('Record your win').should('have.attr', 'target', '_blank')
        cy.contains('Record your win').should(
          'have.attr',
          'aria-label',
          'opens in a new tab'
        )
      })

      it('should render the "What is an Export Win" details', () => {
        cy.contains('What is an Export Win')
        cy.contains(
          'Export wins capture the export deals that Department of International Trade (DIT)'
        )
      })

      it('should render the list of Export Wins without pagination', () => {
        cy.contains('8 results')
        cy.get('ul:last li a:last').should('not.have.text', 'Next')
        cy.get('ul:last li a:first').should('not.have.text', 'Previous')

        cy.contains(
          'Ut eius quisquam qui quaerat adipisci dolorum sit similique.'
        )
          .siblings()
          .should('contain', 'Won on 4 Dec 2019, 9:14am')
          .should('contain', 'HVC')
          .should('contain', 'Confirmed')
          .should(
            'contain',
            'Lead officer Lucinda McLaughlin (voluptate dolores vel sed atque beatae)'
          )
          .should(
            'contain',
            'Company contact Reyes Hamill (sint aut in - Patricia.Kemmer@hotmail.com)'
          )
          .should('contain', 'Customer nam consequatur iste')
          .should('contain', 'Type of export dolor dolores magnam')
          .should('contain', 'Total export value £47,100')
          .should('contain', 'Type of win est cum hic')
          .should('contain', 'Country exported to Burkina Faso')
          .should('contain', 'Sector et aut adipisci')
          .should('contain', 'Company type ut consequatur qui')
          .should('contain', 'Date confirmed 23 Jul 2019, 3:48am')
          .should('contain', 'HVC name E186: consequatur modi dolorem')

        cy.contains('Ut repellendus sint.')
          .siblings()
          .should('contain', 'Won on 3 Nov 2019, 1:51am')
          .should('not.contain', 'HVC')
          .should('not.contain', 'Confirmed')
          .should(
            'contain',
            'Lead officer Dejon Swift Sr. (totam officiis consequatur alias nostrum quod)'
          )
          .should(
            'contain',
            'Company contact Dell Heaney (temporibus vero rem - Pauline.McCullough37@hotmail.com)'
          )
          .should('contain', 'Customer tempora esse accusamus')
          .should('contain', 'Type of export commodi enim id')
          .should('contain', 'Total export value £41,800')
          .should('contain', 'Type of win numquam et quo')
          .should('contain', 'Country exported to French Guiana')
          .should('contain', 'Sector molestiae rerum nostrum')
          .should('contain', 'Company type quas ea ut')
          .should('not.contain', 'Date confirmed')
          .should('not.contain', 'HVC name')

        cy.contains('Dolorem nesciunt adipisci optio')
          .siblings()
          .should('contain', 'Won on 19 Dec 2019, 12:37am')
          .should('contain', 'HVC')
          .should('not.contain', 'Confirmed')
          .should(
            'contain',
            'Lead officer Noble Koss (ex laborum rerum ut itaque quibusdam)'
          )
          .should(
            'contain',
            'Company contact Darron Wisozk (maiores ex ut - Claudia.Mraz20@hotmail.com)'
          )
          .should('contain', 'Customer est nobis saepe')
          .should('contain', 'Type of export omnis consequatur non')
          .should('contain', 'Total export value £99,400')
          .should('contain', 'Type of win ratione dolore dolorem')
          .should('contain', 'Country exported to Lebanon')
          .should('contain', 'Sector et inventore tempore')
          .should('contain', 'Company type veritatis non ullam')
          .should('not.contain', 'Date confirmed')
          .should('contain', 'HVC name E198: quidem accusamus velit')
      })
    }
  )

  context(
    'when viewing the export tab for an active company with export information in each field',
    () => {
      before(() => {
        cy.visit(urls.companies.exports.index(fixtures.company.dnbLtd.id))
      })

      it('should render the "Exports" table', () => {
        cy.get('th')
          .first()
          .should('have.text', 'Export win category')
        cy.get('th')
          .eq(1)
          .should('have.text', 'great.gov.uk business profile')
        cy.get('th')
          .eq(2)
          .should('have.text', 'Export potential')
        cy.get('td')
          .first()
          .should('have.text', 'Increasing export turnover')
        cy.get('td')
          .eq(1)
          .should('have.text', '"Find a supplier" profile')
        cy.contains('"Find a supplier" profile').should(
          'have.attr',
          'href',
          urls.external.greatProfile(fixtures.company.dnbLtd.company_number)
        )
        cy.contains('"Find a supplier" profile').should(
          'have.attr',
          'target',
          '_blank'
        )
        cy.contains('"Find a supplier" profile').should(
          'have.attr',
          'aria-label',
          'opens in a new tab'
        )
        cy.get('td')
          .eq(2)
          .should('have.text', 'Medium')
      })

      it('should render the "Export countries information header', () => {
        cy.get('h3')
          .first()
          .should('have.text', 'Export countries information')
      })

      it('should render the link to exports history', () => {
        cy.contains('View full export countries history').should(
          'have.attr',
          'href',
          urls.companies.exports.history.index(fixtures.company.dnbLtd.id)
        )
      })

      it('should render the "Exports countries information" table', () => {
        cy.get('th')
          .eq(3)
          .should('have.text', 'Currently exporting to')
        cy.get('th')
          .eq(4)
          .should('have.text', 'Future countries of interest')
        cy.get('th')
          .eq(5)
          .should('have.text', 'Countries of no interest')
        cy.get('td')
          .eq(3)
          .should('have.text', 'France, Spain')
        cy.get('td')
          .eq(4)
          .should('have.text', 'Germany')
        cy.get('td')
          .eq(5)
          .should('have.text', 'Sweden')
      })
    }
  )

  context('when viewing exports for an archived company', () => {
    before(() => {
      cy.visit(urls.companies.exports.index(fixtures.company.archivedLtd.id))
    })

    it('the edit export countries button should not exist', () => {
      cy.contains('Edit export countries').should('not.exist')
    })
  })

  describe('Export Wins', () => {
    function visitExports(companyId) {
      cy.server()
      cy.route('**/export-win').as('exportWinsResults')
      cy.visit(urls.companies.exports.index(companyId))
      cy.wait('@exportWinsResults')
    }

    context('when the API for Export Wins returns a 501', () => {
      before(() => {
        visitExports(fixtures.company.lambdaPlc.id)
      })

      it('shold not have an Export Wins list', () => {
        cy.contains('8 results').should('not.exist')
        cy.contains('0 results').should('not.exist')
        cy.contains('Could not load Export wins').should('not.exist')
      })
    })

    context('when the API for Export Wins returns a 404', () => {
      before(() => {
        visitExports(fixtures.company.oneListCorp.id)
      })

      it('should show an error message', () => {
        cy.contains('8 results').should('not.exist')
        cy.contains('0 results').should('not.exist')
        cy.contains('Could not load Export wins').should('not.exist')
      })
    })

    context('When there is more than one page of results', () => {
      before(() => {
        visitExports(fixtures.company.marsExportsLtd.id)
      })

      it('should have the correct count and number of visible results', () => {
        cy.contains('15 results')
        cy.get(exportSelectors.exportWins.listItemHeadings).should(
          'have.length',
          10
        )
      })

      it('should display the next button', () => {
        cy.get('ul:last li a:last').should('have.text', 'Next')
      })

      it('should not display the previous button', () => {
        cy.get('ul:last li a:first').should('not.have.text', 'Previous')
      })

      it('the second page renders the collection list with 6 of the 15 results', () => {
        cy.get('a')
          .contains('2')
          .click()

        cy.get(exportSelectors.exportWins.listItemHeadings).should(
          'have.length',
          6
        )
        cy.contains(
          'Quis vel quidem quo cum nesciunt recusandae laboriosam dolor.'
        )
        cy.contains('Ut nam velit quis et.')
        cy.contains('Rerum ipsum eligendi quae rerum sunt.')
        cy.contains('Et deleniti et at beatae asperiores illo aut molestiae.')
        cy.contains('Et saepe ad praesentium quia illum voluptatum animi.')
        cy.contains('Vero ut aut saepe suscipit blanditiis repudiandae.')
      })

      it('should not display the next button', () => {
        cy.get('ul:last li a:last').should('not.have.text', 'Next')
      })

      it('should display the previous button', () => {
        cy.get('ul:last li a:first').should('have.text', 'Previous')
      })
    })
  })
})

describe('Company History', () => {
  function checkListItems(items) {
    items.forEach(([text, by, date]) => {
      cy.contains(text)
        .siblings()
        .should('contain', by)
        .should('contain', date)
    })
  }

  function visitHistory(companyId) {
    cy.server()
    cy.route('POST', '**/export-country-history').as('exportHistoryResults')
    cy.visit(urls.companies.exports.history.index(companyId))
    cy.wait('@exportHistoryResults')
  }

  describe('Full history', () => {
    context('when there is no history', () => {
      before(() => {
        visitHistory(fixtures.company.lambdaPlc.id)
      })

      it('should render breadcrumbs', () => {
        assertBreadcrumbs({
          Home: urls.dashboard(),
          Companies: urls.companies.index(),
          [fixtures.company.lambdaPlc.name]: urls.companies.detail(
            fixtures.company.lambdaPlc.id
          ),
          Exports: urls.companies.exports.index(fixtures.company.lambdaPlc.id),
          'Export countries history': null,
        })
      })

      it('renders the title', () => {
        cy.contains('Export countries history')
      })

      it('renders the collection list with the 0 results', () => {
        cy.contains('0 results')
        cy.get(countrySelectors.listItemHeadings).should('have.length', 0)
      })
    })

    context('when there is history with multiple pages', () => {
      before(() => {
        visitHistory(fixtures.company.dnbCorp.id)
      })

      it('renders the title', () => {
        cy.contains('Export countries history')
      })

      it('renders the collection list with 10 of the 12 results', () => {
        cy.contains('12 results')
        cy.get(countrySelectors.listItemHeadings).should('have.length', 10)

        checkListItems([
          [
            'Belarus added to countries of no interest',
            'By DIT Staff',
            'Date 11 Feb 2020, 10:47am',
          ],
          [
            'Botswana added to future countries of interest',
            'By DIT Staff',
            'Date 11 Feb 2020, 10:47am',
          ],
          [
            'Georgia added to currently exporting',
            'By DIT Staff',
            'Date 11 Feb 2020, 10:48am',
          ],
          [
            'France added to currently exporting',
            'By DIT Staff',
            'Date 11 Feb 2020, 10:47am',
          ],
          [
            'Fiji added to currently exporting',
            'By DIT Staff',
            'Date 11 Feb 2020, 10:46am',
          ],
          [
            'Argentina added to currently exporting',
            'By DIT Staff',
            'Date 6 Feb 2020, 4:06pm',
          ],
          [
            'Andorra added to currently exporting',
            'By DIT Staff',
            'Date 6 Feb 2020, 4:05pm',
          ],
          [
            'Afghanistan added to future countries of interest',
            'By DIT Staff',
            'Date 6 Feb 2020, 3:42pm',
          ],
          [
            'Andorra removed from future countries of interest',
            'By DIT Staff',
            'Date 6 Feb 2020, 3:41pm',
          ],
          [
            'Angola added to countries of no interest',
            'By DIT Staff',
            'Date 6 Feb 2020, 3:41pm',
          ],
        ])
      })

      it('should display the next button', () => {
        cy.get('ul:last li a:last').should('have.text', 'Next')
      })

      it('should not display the previous button', () => {
        cy.get('ul:last li a:first').should('not.have.text', 'Previous')
      })

      it('the second page renders the collection list with 2 of the 12 results', () => {
        cy.get('a')
          .contains('2')
          .click()
        cy.get(countrySelectors.listItemHeadings).should('have.length', 2)

        checkListItems([
          [
            'Andorra removed from future countries of interest',
            'By DIT Staff',
            'Date 6 Feb 2020, 3:41pm',
          ],
          [
            'Angola added to countries of no interest',
            'By DIT Staff',
            'Date 6 Feb 2020, 3:41pm',
          ],
        ])
      })

      it('should not display the next button', () => {
        cy.get('ul:last li a:last').should('not.have.text', 'Next')
      })

      it('should display the previous button', () => {
        cy.get('ul:last li a:first').should('have.text', 'Previous')
      })
    })

    context('when there is history that can be grouped', () => {
      before(() => {
        visitHistory(fixtures.company.dnbGlobalUltimate.id)
      })

      it('renders the title', () => {
        cy.contains('Export countries history')
      })

      it('renders the collection list with 10 results', () => {
        cy.contains('10 results')
        cy.get(countrySelectors.listItemHeadings).should('have.length', 10)

        checkListItems([
          [
            'Barbados, Bangladesh, Bahrain, Afghanistan added to countries of no interest',
            'By Stephan Padberg',
            'Date 4 Mar 2020, 4:33pm',
          ],
          [
            'France removed from future countries of interest',
            'By Stephan Padberg',
            'Date 4 Mar 2020, 4:33pm',
          ],
          [
            'Spain added to currently exporting',
            'By Stephan Padberg',
            'Date 4 Mar 2020, 4:33pm',
          ],
          [
            'Albania, Brazil, Gibraltar removed from currently exporting',
            'By Stephan Padberg',
            'Date 4 Mar 2020, 8:55am',
          ],
          [
            'France added to future countries of interest',
            'By Stephan Padberg',
            'Date 4 Mar 2020, 8:55am',
          ],
          [
            'Albania, Gibraltar, Brazil added to currently exporting',
            'By Stephan Padberg',
            'Date 4 Mar 2020, 8:55am',
          ],
          [
            'Germany, Spain removed from future countries of interest',
            'By Stephan Padberg',
            'Date 4 Mar 2020, 8:54am',
          ],
          [
            'France removed from currently exporting',
            'By Stephan Padberg',
            'Date 4 Mar 2020, 8:54am',
          ],
          [
            'Germany, Spain added to future countries of interest',
            'By Stephan Padberg',
            'Date 4 Mar 2020, 8:54am',
          ],
          [
            'France added to currently exporting',
            'By Stephan Padberg',
            'Date 4 Mar 2020, 8:53am',
          ],
        ])
      })

      it('should not display the pagination', () => {
        cy.get('#company-export-full-history ul').should('not.exist')
      })
    })

    context('when the user is unknown', () => {
      context('With a single history item', () => {
        before(() => {
          visitHistory(fixtures.company.marsExportsLtd.id)
        })

        it('renders the title', () => {
          cy.contains('Export countries history')
        })

        it('renders the collection list with the one result', () => {
          cy.contains('1 result')
          cy.get(countrySelectors.listItemHeadings).should('have.length', 1)

          checkListItems([
            [
              'Andorra removed from future countries of interest',
              'By unknown',
              'Date 6 Feb 2020, 3:41pm',
            ],
          ])
        })
      })

      context('With grouped history items', () => {
        before(() => {
          visitHistory(fixtures.company.minimallyMinimalLtd.id)
        })

        it('renders the title', () => {
          cy.contains('Export countries history')
        })

        it('renders the collection list with the four results', () => {
          cy.contains('4 results')
          cy.get(countrySelectors.listItemHeadings).should('have.length', 4)

          checkListItems([
            [
              'Maldives, Gibraltar added to currently exporting',
              'By unknown',
              'Date 6 Feb 2020, 5:07pm',
            ],
            [
              'Angola moved to currently exporting',
              'By unknown',
              'Date 6 Feb 2020, 5:07pm',
            ],
            [
              'Andorra added to currently exporting',
              'By unknown',
              'Date 6 Feb 2020, 5:07pm',
            ],
            [
              'Kiribati, Hong Kong, Czechia, Angola added to future countries of interest',
              'By unknown',
              'Date 6 Feb 2020, 5:06pm',
            ],
          ])
        })
      })
    })

    context('when the only item is an "update" item', () => {
      before(() => {
        visitHistory(fixtures.company.dnbSubsidiary.id)
      })

      it('should not filter out the update', () => {
        cy.get(countrySelectors.listItemHeadings).should('have.length', 1)
        checkListItems([
          [
            'Andorra moved to future countries of interest',
            'By unknown',
            'Date 6 Feb 2020, 3:41pm',
          ],
        ])
      })
    })

    context('when viewing a company with interactions in the history', () => {
      before(() => {
        visitHistory(fixtures.company.investigationLimited.id)
      })

      it('renders the title', () => {
        cy.contains('Export countries history')
      })

      it('renders the collection list with 5 results', () => {
        const historyItems = fixtures.export.historyWithInteractions.results

        function checkInteraction(assertions, index) {
          const item = historyItems[index]
          const interaction = 'interaction' + index
          const link = 'interactionLink' + index
          const subHeading = 'interactionSubHeading' + index
          const assertionTasks = []

          assertions.forEach(([assertion, values]) => {
            values.forEach((value) => {
              assertionTasks.push({ assertion, value })
            })
          })

          cy.contains(item.subject)
            .as(link)
            .parent()
            .siblings('h4')
            .as(subHeading)
            .parent()
            .as(interaction)

          cy.get('@' + link).should(
            'have.attr',
            'href',
            urls.interactions.detail(item.id)
          )

          cy.get('@' + interaction)
            .find('div span')
            .should('contain', 'Interaction')

          assertionTasks.reduce(($details, { assertion, value }) => {
            return $details.should(assertion, value)
          }, cy.get('@' + interaction).find('details'))
        }

        cy.contains('5 results')
        cy.get(countrySelectors.listItemHeadings).should('have.length', 5)

        const interactionDetails = [
          [
            [
              'contain',
              [
                'Company contacts Stephan Padberg, Stephanie Stokes',
                'Advisers Mr. Genesis Kub (et nihil repudiandae), Solon Lynch (ea est totam), Dr. Meda Mraz (fuga corporis architecto)',
                'Service Deserunt magni sapiente soluta praesentium sapiente.',
                'Countries currently exporting to Benin',
                'Future countries of interest Brunei Darussalam, French Polynesia',
              ],
            ],
            ['not.contain', ['Countries not interested in']],
          ],
          [
            [
              'contain',
              [
                'Company contact Justus Simonis',
                'Adviser Carolanne Langworth (sit delectus recusandae)',
                'Service Ipsa dicta omnis pariatur.',
                'Countries currently exporting to Christmas Island, Indonesia, Martinique',
                'Countries not interested in Serbia',
              ],
            ],
            ['not.contain', ['Future countries of interest']],
          ],
          [
            [
              'contain',
              [
                'Company contacts Karen Mayer Jr., Ari Von',
                'Adviser Horace Orn (nisi ipsa quisquam)',
                'Service Architecto suscipit et aliquam architecto.',
                'Countries currently exporting to Burkina Faso',
                'Future countries of interest Kyrgyz Republic, Trinidad and Tobago',
              ],
            ],
            ['not.contain', ['Countries not interested in']],
          ],
          [
            [
              'contain',
              [
                'Company contact Leonie Deckow',
                'Advisers Napoleon Powlowski (veritatis temporibus unde), Giovanna Anderson (delectus repellendus ducimus), Tessie Hane (perferendis nihil nam)',
                'Service Repellat quia fugiat velit delectus expedita omnis doloribus.',
                'Countries currently exporting to Bolivia, Cameroon',
                'Future countries of interest Bolivia, Qatar',
                'Countries not interested in Australia, Greenland',
              ],
            ],
          ],
        ]

        interactionDetails.forEach(checkInteraction)

        cy.get('@interactionSubHeading0').should(
          'contain',
          'Created 8 Jun 2019, 7:24am'
        )
        cy.get('@interactionSubHeading1').should(
          'contain',
          'Created 21 Jun 2019, 5:07am'
        )
        cy.get('@interactionSubHeading2').should(
          'contain',
          'Created 17 Sep 2019, 12:13am'
        )
        cy.get('@interactionSubHeading3').should(
          'contain',
          'Created 5 Jan 2020, 1:27pm'
        )

        cy.contains('Belarus added to countries of no interest')
          .siblings()
          .should('contain', 'By DIT Staff')
          .should('contain', 'Date 11 Feb 2020, 10:47am')
      })
    })
  })

  describe('Country specific history', () => {
    function visitCountryHistory(companyId, countryId) {
      cy.server()
      cy.route('POST', '**/export-country-history').as(
        'exportCountryHistoryResults'
      )
      cy.visit(urls.companies.exports.history.country(companyId, countryId))
      cy.wait('@exportCountryHistoryResults')
    }

    before(() => {
      visitCountryHistory(
        fixtures.company.dnbCorp.id,
        '975f66a0-5d95-e211-a939-e4115bead28a'
      )
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: urls.dashboard(),
        Companies: urls.companies.index(),
        [fixtures.company.dnbCorp.name]: urls.companies.detail(
          fixtures.company.dnbCorp.id
        ),
        Exports: urls.companies.exports.index(fixtures.company.dnbCorp.id),
        'Andorra exports history': null,
      })
    })

    it('renders the title', () => {
      cy.contains('Andorra exports history')
    })

    it('renders the collection list with 2 results', () => {
      cy.contains('2 results')
      cy.get(countrySelectors.listItemHeadings).should('have.length', 2)

      checkListItems([
        [
          'Andorra added to currently exporting',
          'By DIT Staff',
          'Date 6 Feb 2020, 4:06pm',
        ],
        [
          'Andorra removed from future countries of interest',
          'By DIT Staff',
          'Date 6 Feb 2020, 3:41pm',
        ],
      ])
    })
  })
})
