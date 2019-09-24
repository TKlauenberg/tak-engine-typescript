Feature: StoneUnmovable

    As a developer
    I want to know if a Stone is not movable
    when I have only the information about the Stone

    Scenario: Stone Position after taking Moves
        Given I initialize a game with the parameters
            | size | 5 |
        When I execute these moves
            | a1  |
            | b1  |
            | b2  |
            | a1> |
            | b2- |
            | a1  |
            | b2  |
            | a1> |
            | b2- |
            | a1  |
            | b2  |
            | a1> |
            | b2- |
        Then all unmovable stones should have the information movable -> false

    Scenario: Imovable Stones
        Given I initialize a game with the parameters
            | size | 5                         |
            | tps  | 12121212,x4/x5/x5/x5/x5 1 1 |
        Then all unmovable stones should have the information movable -> false

