Feature: TPS serialization

    As a User
    I want to get the TPS board representation my board
    so that I can share it

    Scenario Outline: bord tps comparison
        When I parse the PTN file
            """
            [Size "<size>"]
            [TPS "<tps>"]
            """
        Then The gamestate as TPS should be "<tps>"
        Examples:
            | size | tps                        |
            | 3    | 1,x2/x3/x3 2 1             |
            | 5    | 121212C,x4/x5/x5/x5/x5 2 1 |