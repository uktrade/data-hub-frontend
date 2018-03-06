@companies-interaction-collection @collection
Feature: View collection of interactions for a company

  @companies-interactions-collection--view
  Scenario: View companies interaction collection
    When I navigate to the `companies.Interactions` page using `company` `Venus Ltd` fixture
    And the results summary for a interaction collection is present
    And I can view the collection

  @companies-interactions-collection--filter # TODO

  @companies-interactions-collection--sort # TODO

  @companies-interactions-collection--lep @lep
  Scenario: Navigate to interactions as LEP
    When I navigate to the `companies.Interactions` page using `company` `Lambda plc` fixture
    Then I see the 403 error page

  @companies-interactions-collection--da @da
  Scenario: Navigate to interactions as DA
    When I navigate to the `companies.Interactions` page using `company` `Lambda plc` fixture
    Then I see the 403 error page
