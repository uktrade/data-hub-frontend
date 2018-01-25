@companies-interaction-collection @collection
Feature: View collection of interactions for a company

  @companies-interactions-collection--view
  Scenario: View companies interaction collection

    Given I navigate to company fixture Venus Ltd
    When I click the Interactions local nav link
    Then the results count header for interaction is present
    And I can view the collection

  @companies-interactions-collection--filter # TODO

  @companies-interactions-collection--sort # TODO

  @companies-interactions-collection--lep @lep
  Scenario: Navigate to interactions as LEP

    When I navigate directly to /interactions of company fixture Lambda plc
    Then I see the 403 error page

  @companies-interactions-collection--da @da
  Scenario: Navigate to interactions as DA

    When I navigate directly to /interactions of company fixture Lambda plc
    Then I see the 403 error page
