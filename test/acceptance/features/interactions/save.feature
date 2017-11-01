@interaction-save
Feature: Save a new interaction in Data hub
  As an Data Hub user
  I would like to add an interaction record to data hub
  So that I can enable the collection of key interaction data

  Background:
    Given I am an authenticated user on the data hub website

  @interaction-save--companies-interaction-submit
  Scenario: Companies interaction is saved

    And a company is created for interactions
    And a company contact is created for interactions
    When navigating to the create company interactions and services step 1 page
    And selecting interaction
    And adding an interaction
    Then I see the success message

  @interaction-save--companies-service-delivery-submit
  Scenario: Companies service delivery is saved

    And a company is created for interactions
    And a company contact is created for interactions
    When navigating to the create company interactions and services step 1 page
    And selecting service delivery
    And adding a service delivery
    Then I see the success message
