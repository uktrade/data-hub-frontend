@companies-omis-collection @collection
Feature: View collection of orders for a company

  @companies-omis-collection--view
  Scenario: View companies OMIS collection

    Given I navigate to company fixture Lambda plc
    When I click the Orders (OMIS) local nav link
    Then the results count header for order is present

  @companies-omis-collection--view--da
  Scenario: View companies OMIS collection as DA

    Given I navigate to company fixture Lambda plc
    When I click the Orders (OMIS) local nav link
    Then the results count header for order is present

  @companies-omis-collection--filter # TODO

  @companies-omis-collection--sort # TODO

  @companies-omis-collection--lep @lep
  Scenario: Navigate to OMIS as LEP

    When I navigate directly to /orders of company fixture Lambda plc
    Then I see the 403 error page
