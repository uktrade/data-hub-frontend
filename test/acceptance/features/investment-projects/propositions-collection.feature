@investment-projects-proposition-collection @collection
Feature: View collection of propositions for an investment project

  @investment-projects-propositions-collection--view
  Scenario: View investment projects proposition collection

    When I navigate to the `investments.propositions` page using `investment project` `New hotel (FDI)` fixture
    And I can view the collection
    