Feature: Parse Moves

    As a User
    I want to parse moves in the PTN notation
    So that partial matches or completed matches can be read

    Scenario: first place move
        Given A the move "e5"
        When I parse the PTN move
        Then The Move is a place action
        And the position is e5

    Scenario Outline: simple move action
        Given A the move "<Amount><Pos><Direction><Drops>"
        When I parse the PTN move
        Then The Move is a move action
        And The starting position is <Pos>
        And The direction is <Direction>

        Examples:
            | Amount | Pos | Direction | Drops |
            | 2      | b3  | +         | 11    |
            | 3      | b1  | -         | 21    |
            | 4      | a2  | <         | 121   |
            | 5      | c2  | >         | 23    |