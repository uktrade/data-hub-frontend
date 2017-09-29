@contacts-filter
Feature: Filters collections for contact
  As an existing user
  I would like to filter contacts using possible options
  So that I can quickly drill down to find the correct information that I am looking for

  Background:
    Given I am an authenticated user on the data hub website

  @contacts-filter--sector
  Scenario: Filter contacts by sector

    When I navigate to contacts collection page
    And I filter the display by contacts sector
    Then I verify the display is changed based on the given sector for contact

  @contacts-filter--country
  Scenario: Filter contacts by country

    When I navigate to contacts collection page
    And I filter the display by country
    Then I verify the display is changed based on the given country

  @contacts-filter--region
  Scenario: Filter contacts by region

    When I navigate to contacts collection page
    And I filter the display by region
    Then I verify the display is changed based on the given region

  @contacts-filter--company
  Scenario: Filter contacts by company name

    When I navigate to contacts collection page
    And I filter the display by company name
    Then I verify the display is changed based on the given company name
