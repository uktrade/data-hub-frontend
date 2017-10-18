@interactions-create
Feature: Create an Interaction in Data hub
  As a data hub user
  I would like to add an interaction to data hub
  So that I can collection interaction data

  Background:
    Given I am an authenticated user on the data hub website

  @interactions-create--step-1-from-companies
  Scenario: Verify interaction form fields from companies

    When browsing to companies
    And the "interactions" company details tab is clicked
    And the "Add interaction" button is clicked
    Then the Add interaction or service page is displayed
