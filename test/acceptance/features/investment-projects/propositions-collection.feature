@investment-projects-proposition-collection @collection
Feature: View collection of propositions for an investment project

  @investment-projects-propositions-collection--view
  Scenario: View investment projects proposition collection

    When I navigate to the `investments.propositions` page using `investment project` `New hotel (FDI)` fixture
    And I can view the collection

  @investment-projects-propositions-collection--view--da @da
  Scenario: View investment projects proposition collection

    When I navigate to the `investments.propositions` page using `investment project` `New golf course (DA)` fixture
    And I can view the collection

  @investment-projects-propositions-collection--da @da
  Scenario: Navigate to propositions of a different investment project as DA

    When I navigate to the `investments.propositions` page using `investment project` `New zoo (LEP)` fixture
    Then I see the 403 error page
    