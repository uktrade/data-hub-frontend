@companies-omis-collection @collection
Feature: View collection of orders for a company

  @companies-omis-collection--view--da
  Scenario: View companies OMIS collection as DA
    When I navigate to the `companies.orders` page using `company` `Lambda plc` fixture
    And the results summary for a order collection is present
