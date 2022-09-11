Feature: Playerinfo in a current game
    As a User
    I want to get my current player info like the stones I have or which color I am
    So that I know my own game state

  Scenario Outline: On game start
    When Bop initializes a game with the parameters
      | size | <size> |
    Then Player 1 has <amountNormal> normal stones and <amountCap> capstones
    And Player 2 has <amountNormal> normal stones and <amountCap> capstones

    Examples:
      | size | amountNormal | amountCap |
      |    3 |           10 |         0 |
      |    4 |           15 |         0 |
      |    5 |           21 |         1 |
      |    6 |           30 |         1 |
      |    8 |           50 |         2 |

  Scenario Outline: Player Info after first round
    Given Bop initializes a game with the parameters
      | size | <size> |
    When Bop places a flat stone at a1
    And Bop places a flat stone at a2
    Then Player 1 has <amountNormal> normal stones and <amountCap> capstones
    And Player 2 has <amountNormal> normal stones and <amountCap> capstones

    Examples:
      | size | amountNormal | amountCap |
      |    3 |            9 |         0 |
      |    8 |           49 |         2 |

  Scenario Outline: special Stones
    Given Bop initializes a game with the parameters
      | size | <size> |
    And Bop places a flat stone at a1
    And Bop places a flat stone at a2
    When Bop places a <stoneType> at a3
    And Bop places a <stoneType> at b1
    Then Player 1 has <amountNormal> normal stones and <amountCap> capstones
    And Player 2 has <amountNormal> normal stones and <amountCap> capstones

    Examples:
      | size | stoneType      | amountNormal | amountCap |
      |    3 | standing stone |            8 |         0 |
      |    8 | standing stone |           48 |         2 |
      |    8 | capstone       |           49 |         1 |
