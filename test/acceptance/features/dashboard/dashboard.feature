@dashboard
Feature: Search
  As an existing user
  I would like to search the data hub
  So search for entities

  @dashboard--global-nav
  Scenario: Display global nav

    When I navigate to the dashboard
    Then there should be global nav links

  @dashboard--support-page
  Scenario: Navigate to the support page

    When I navigate to the dashboard
    Then I navigate to the support page
