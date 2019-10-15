# TODO archived filters and sort
@companies-collection @collection
Feature: View collection of companies
  As an existing user
  I would like to view all the Companies in one place
  And be able to read the companies details as expected

  @companies-collection--view--da @da
  Scenario: View companies collection as DA
    When I navigate to the `companies.list` page
    Then I confirm I am on the Companies page
    And the results summary for a company collection is present
