@companies-list @ignore
Feature: View company collection
  As an existing user
  I would like to view all the companies in one place
  And be able to read the company details as expected
  And be able to navigate to a chosen company page

  Background:
    Given I am an authenticated user on the data hub website
    When I create a "UK private or public limited company"

  @companies-list--name
  Scenario: View company name in collection results

    Then I see the success message
    And The company name is present in the collections results

  @companies-list--sector
  Scenario: View company sector in collection results

    Then I see the success message
    And The company sector is present in the collections results

  @companies-list--region
  Scenario: View company region in collection results

    Then I see the success message
    And The company region is present in the collections results

  @companies-list--trading-address
  Scenario: View company registered address in collection results

    Then I see the success message
    And The company registered address is present in the collections results

  @companies-list--link
  Scenario: Verify company link to company details page in collection results

    Then I see the success message
    And The company name is present in the collections results
    Then Clicking the company name takes me to the companies page
