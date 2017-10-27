@dashboard
Feature: Search
  As an existing user
  I would like to search the data hub
  So search for entities

  Background:
    Given I am an authenticated user on the data hub website

  @dashboard--global-nav
  Scenario: Display global nav
    When I navigate to the dashboard
    Then there should be global nav links
