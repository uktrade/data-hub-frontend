@investment-projects-interaction-collection @collection
Feature: View collection of interactions for an investment project

  @investment-projects-interactions-collection--view
  Scenario: View investment projects interaction collection

    When I navigate to the `investments.interactions` page using `investment project` `New hotel (FDI)` fixture
    And the results summary for a interaction collection is present
    And I can view the collection
    And the result count should be greater than 0

  @investment-projects-interactions-collection--filter # TODO

  @investment-projects-interactions-collection--sort # TODO

  @investment-projects-interactions-collection--da @da
  Scenario: Navigate to interactions of a different investment project as DA

    When I navigate to the `investments.interactions` page using `investment project` `New zoo (LEP)` fixture
    Then I see the 403 error page
