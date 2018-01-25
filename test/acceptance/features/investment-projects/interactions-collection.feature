@investment-projects-interaction-collection @collection
Feature: View collection of interactions for an investment project

  @investment-projects-interactions-collection--view
  Scenario: View investment projects interaction collection

    Given I navigate to investment project fixture New hotel (FDI)
    When I click the Interactions local nav link
    Then the results count header for interaction is present
    And I can view the collection

  @investment-projects-interactions-collection--view--lep @lep
  Scenario: View investment projects interaction collection

    Given I navigate to investment project fixture New zoo (LEP)
    When I click the Interactions local nav link
    Then the results count header for interaction is present
    And I can view the collection

  @investment-projects-interactions-collection--view--da @da
  Scenario: View investment projects interaction collection

    Given I navigate to investment project fixture New golf course (DA)
    When I click the Interactions local nav link
    Then the results count header for interaction is present
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
