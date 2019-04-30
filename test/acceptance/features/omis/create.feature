@omis @omis--create
Feature: Create new order using company ID

  Scenario: Save draft order
    Given I navigate to the `omis.create.start` page using `company` `Venus Ltd` fixture
    When I select a value for `contactField` on the `omis.create.contact` page
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
    When I submit the form
    Then I am on the `omis.order` page
    And I should see the correct text on the `omis.order` page
      | elementPath            | expectedText                     |
      | contact.name           | omis.create.contact.contactField |
      | internal.sector        | omis.create.sector.sectorField   |
      | header.status          | Draft                            |
      | header.metadata.market | omis.create.market.marketField   |
