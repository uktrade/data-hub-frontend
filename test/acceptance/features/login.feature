@login
Feature: Login to Data Hub
  As an existing user
  I want to login to Data Hub

  Scenario: Logging in and signing out

    Given I am on the Data Hub login page
    When I enter my credentials
    And I submit the form
    Then I verify that I’m successfully logged in
    When I click on “Sign out” button
    Then I have been logged out
