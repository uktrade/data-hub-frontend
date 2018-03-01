@investment-projects-interaction-collection @collection
Feature: View collection of interactions for an investment project

  @investment-projects-interactions-collection--view
  Scenario: View investment projects interaction collection

    When I navigate to the `investments.Fixture` page using `investment project` `New hotel (FDI)` fixture
    And I click the Interactions local nav link
    And the results summary for a interaction collection is present
    And I can view the collection

  @investment-projects-interactions-collection--view--lep @lep
  Scenario: View investment projects interaction collection

    When I navigate to the `investments.Fixture` page using `investment project` `New zoo (LEP)` fixture
    And I click the Interactions local nav link
    And the results summary for a interaction collection is present
    And I can view the collection

  @investment-projects-interactions-collection--view--da @da
  Scenario: View investment projects interaction collection

    When I navigate to the `investments.Fixture` page using `investment project` `New golf course (DA)` fixture
    And I click the Interactions local nav link
    And the results summary for a interaction collection is present
    And I can view the collection

  @investment-projects-interactions-collection--filter # TODO

  @investment-projects-interactions-collection--sort # TODO

  @investment-projects-interactions-collection--lep @lep
  Scenario: Navigate to interactions of a different investment project as LEP

    When I navigate directly to /interactions of investment project fixture New golf course (DA)
    Then I see the 403 error page

  @investment-projects-interactions-collection--da @da
  Scenario: Navigate to interactions of a different investment project as DA

    When I navigate directly to /interactions of investment project fixture New zoo (LEP)
    Then I see the 403 error page
