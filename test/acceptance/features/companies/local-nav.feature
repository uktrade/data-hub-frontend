@companies-local-nav  @details
Feature: Companies local nav

  @companies-local-nav--staff
  Scenario: Companies local nav as DIT staff

    When I navigate to the `companies.fixture` page using `company` `One List Corp` fixture
    Then there should be a tabbed local nav
      | text                      |
      | Activity                  |
      | Company contacts          |
      | Core team                 |
      | Investment                |
      | Export                    |
      | Orders                    |

  @companies-local-nav--lep @lep
  Scenario: Companies local nav as LEP

    When I navigate to the `companies.fixture` page using `company` `One List Corp` fixture
    Then there should be a tabbed local nav
      | text                      |
      | Company contacts          |
      | Core team                 |
      | Investment                |
      | Export                    |

  @companies-local-nav--da @da
  Scenario: Companies local nav as DA

    When I navigate to the `companies.fixture` page using `company` `One List Corp` fixture
    Then there should be a tabbed local nav
      | text                      |
      | Company contacts          |
      | Core team                 |
      | Investment                |
      | Export                    |
      | Orders                    |
