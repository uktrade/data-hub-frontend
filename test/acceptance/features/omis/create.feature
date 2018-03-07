@omis @omis--create
Feature: Create new order using company ID

  Background: Create initial draft
    When I navigate to the `omis.create.start` page using `company` `Venus Ltd` fixture
    And I select a value for `contactField` on the `omis.create.contact` page
    And I submit the form
    And I select a value for `marketField` on the `omis.create.market` page
    And I submit the form
    And I choose the company’s primary sector
    And I submit the form
    Then I should see the correct text on the `omis.create.summary` page
      | elementPath     | expectedText                     |
      | contact.contact | omis.create.contact.contactField |
      | market.market   | omis.create.market.marketField   |
      | sector.sector   | omis.create.sector.sectorField   |

  Scenario: Save draft order
    When I submit the form
    Then I am on the `omis.order` page
    And I should see the correct text on the `omis.order` page
      | elementPath            | expectedText                     |
      | contact.name           | omis.create.contact.contactField |
      | internal.sector        | omis.create.sector.sectorField   |
      | header.status          | Draft                            |
      | header.metadata.market | omis.create.market.marketField   |

  Scenario: Edit steps from summary
    When I click `editContactLink` on the `omis.create.summary` page
    Then I am on the `omis.create.contact` page
    When I select a value for `contactField` on the `omis.create.contact` page
    And I submit the form
    Then I am on the `omis.create.summary` page
    And I should see the correct text on the `omis.create.summary` page
      | elementPath     | expectedText                     |
      | contact.contact | omis.create.contact.contactField |

    When I click `editMarketLink` on the `omis.create.summary` page
    Then I am on the `omis.create.market` page
    When I select a value for `marketField` on the `omis.create.market` page
    And I submit the form
    Then I am on the `omis.create.summary` page
    And I should see the correct text on the `omis.create.summary` page
      | elementPath     | expectedText                     |
      | market.market   | omis.create.market.marketField   |

    When I click `editSectorLink` on the `omis.create.summary` page
    Then I am on the `omis.create.sector` page
    When I click `useCustomSectorOption` on the `omis.create.sector` page
    And I select a value for `sectorField` on the `omis.create.sector` page
    And I submit the form
    Then I am on the `omis.create.summary` page
    And I should see the correct text on the `omis.create.summary` page
      | elementPath     | expectedText                     |
      | sector.sector   | omis.create.sector.sectorField   |
