@companies-omis-collection @collection
Feature: View collection of orders for a company

  @companies-omis-collection--view
  Scenario: View companies OMIS collection

    When I navigate to the `companies.Fixture` page using `company` `Lambda plc` fixture
    And I click the Orders (OMIS) local nav link
    And the results summary for a order collection is present

  @companies-omis-collection--view--da
  Scenario: View companies OMIS collection as DA

    When I navigate to the `companies.Fixture` page using `company` `Lambda plc` fixture
    And I click the Orders (OMIS) local nav link
    And the results summary for a order collection is present

  @companies-omis-collection--filter # TODO

  @companies-omis-collection--sort # TODO

  @companies-omis-collection--lep @lep
  Scenario: Navigate to OMIS as LEP

    When I navigate to the `companies.Orders` page using `company` `Lambda plc` fixture
    Then I see the 403 error page
