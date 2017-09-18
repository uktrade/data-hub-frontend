@login
Feature: Login to Data Hub
  As an existing user
  I want to login to Data Hub

  @login-logout
  Scenario: Logging in and signing out

    Given I am on the Datahub login page
    When I enter my credentials
    And I submit the form
    Then I verify that I'm successfully logged in
    When I logout of Datahub website
    Then I see the "You have been successfully signed out." success message

  @login-navigate-to-login-page
  Scenario: Navigation link to sign in works on support page

    Given I am on the Datahub login page
    When I navigate to the support page
    Then I can navigate to the Datahub login page
