@investment-projects-collection  @collection
Feature: View a list of Investment Projects
  As an Data hub user
  I would like to view a list of Investment Projects
  So I can search for Investment Projects and filter and sort the results

  @investment-projects-collection--view--da @da
  Scenario: View Investment Projects list as DA
    When I navigate to the `investments.list` page
    Then I confirm I am on the Investments page
    And the results summary for a project collection is present
