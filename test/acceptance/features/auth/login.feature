@auth-login
Feature: Login to Data Hub
  As an existing user
  I want to login to Data Hub

  @auth-login--logout
  Scenario: Logging in and signing out

    Given I am on the Data Hub login page
    When I enter correct credentials
    And I submit the form
    Then I should be successfully logged in
    When I log out of Data Hub website
    Then I see the success message

  @auth-login--error
  Scenario: Incorrect username or password

    Given I am on the Data Hub login page
    When I enter incorrect credentials
    And I submit the form
    Then I see the error message

  @auth-login--support-page
  Scenario: Navigation link to sign in works on support page

    Given I am on the Data Hub login page
    And I am not logged in
    When I navigate to the support page
    Then I can navigate to the Data Hub login page
