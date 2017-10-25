@interactions-create
Feature: Save an Interaction in Data hub
  As a data hub user
  I would like to add an interaction to data hub
  So that I can collection interaction data

Background:
  Given I am an authenticated user on the data hub website

  @interactions-create--companies-interaction
  Scenario: Interaction fields from companies

    And a company is created for interactions
    And a company contact is created for interactions
    When navigating to the create company interactions and services step 1 page
    And selecting interaction
    Then there are interaction fields
    And interaction fields are pre-populated

  @interactions-create--contacts-interaction
  Scenario: Interaction fields from contacts

    And a company is created for interactions
    And a company contact is created for interactions
    When navigating to the create contact interactions and services step 1 page
    And selecting interaction
    Then there are interaction fields
    And interaction fields are pre-populated

  @interactions-create--investment-projects-interaction @ignore
  Scenario: Interaction fields from investment projects

    And a company is created for interactions
    And a company contact is created for interactions
    And a company investment project is created for interactions
    When navigating to the create investment project interaction page
    Then there are interaction fields
    And interaction fields are pre-populated

  @interactions-create--companies-service-delivery
  Scenario: Service delivery fields from companies

    And a company is created for interactions
    And a company contact is created for interactions
    When navigating to the create company interactions and services step 1 page
    And selecting service delivery
    Then there are service delivery fields
    And interaction fields are pre-populated

  @interactions-create--contacts-service-delivery
  Scenario: Service delivery fields from contacts

    And a company is created for interactions
    And a company contact is created for interactions
    When navigating to the create contact interactions and services step 1 page
    And selecting service delivery
    Then there are service delivery fields
    And interaction fields are pre-populated

  @interactions-create--events-toggle
  Scenario: Toggle service delivery event association

    And a company is created for interactions
    And a company contact is created for interactions
    When navigating to the create company interactions and services step 1 page
    And selecting service delivery
    Then there are service delivery fields
    When the interaction events Yes option is chosen
    Then the interaction events is displayed
    When the interaction events No option is chosen
    Then the interaction events is not displayed
