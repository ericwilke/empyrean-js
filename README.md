# Empyrean: Manual

## Starting the Game

From the `terminal`, run the following command:

    node empyrean.js

Then go to the browser and enter the following URL:

    localhost:3000

## Building Worlds

### Creating Items

In the text of the item in the file ITEMS.json, adding any of the following text will have affects on the player:

    (+X STAT)

`X` is an integer, and `STAT` refers to any of the player stats (`hp`, `strength`, `dexterity`, `intelligence`, `wisdom`, `magic`, `armor`, `melee`, `range`)

The number after the "+" or "-" will be applied to the corresponding stat of the player.

Examples: `golden amulet (+2 armor)`, `silver ring (+1 range)`, `potion of healing (+10 hp)`, `ring of giant strength (+2 strength/-2 intelligence)`

### NPCs

**tile** is the tile that will be displayed for the NPC (see the `loadassests.js` file for a list of tiles).

**x** and **y** are the starting `x` and `y` position of the NPC on the map.

**Movement** of an NPC can be set to `random`, `static`, `pace-x`, or `pace-y`. Additionally, constraints on the X and Y limits can be set using:

  - constrain_low_x
  - constrain_high_x
  - constrain_low_y
  - constrain_high_y

For pacing movements, the `x-direction` or `y-direction` can be set to `+1` or '-1' for movement direction.

**greeting** is an array that will show a random greeting each time the player talks to the NPC.

**heal** can be set to `yes` or `no` to indicate if the NPC will heal the player.

**buy_sell** can be set to `yes` or `no` to indicate if the NPC can sell and buy items to and with the player.

**give_item** is an array of item(s) that will be given to the player. If an NPC has a quest item to give to the player, include an `*` within the name of the quest item. The `*` will be removed in the player inventory list but tells the program to keep the item in the list of items with the NPC. Example: `*Mine of Hellis key`.

**teach_spell** is a key-value pair that states the `spell` and the `msg` told the the player. For example:

    {"spell":"heal","msg":"I will teach you the HEAL spell."}

An example of a complete NPC json object is:

    { "Lord Stark": {
        "tile": "king",
        "x": 15,
        "y": 9,
        "movement": "static",
        "x_direction": 0,
        "y_direction": 0,
        "constrain_low_x": 0,
        "constrain_high_x": 0,
        "constrain_low_y": 0,
        "constrain_high_y": 0,
        "greeting": ["Hello.","I hear there is danger on the roads.","Take care in your quest.","Evil forces are in play."],
        "heal": "yes",
        "buy_sell": "no",
        "give_item": [],
        "teach_spell": {"spell":"heal","msg":"I will teach you the HEAL spell."}
      }
    }

### Quests

The following data points will be included in each QUEST (all quests are in a single JSON file):

NAME_of_QUEST

  - source_map
  - source_npc
  - status ("pending", "active", "completed")
  - dependent_on_complete_quest: quest name
  - quest_type ("talk", "find", "kill")
  - talk_target: {"mapname": "name", "npc": "npc name"} // completed when talking to the target (no need to return to source_npc)
  - item_target (name of item to collect) // must return to the source_npc to complete
  - kill_target
  - kill_quota (minimum needed to complete quest) // must return to the source_npc to complete
  - kill_current_count
  - start_message
  - completed_message
  - reward_items
  - reward_gp
  - reward_spell
  - reward_activate_quest (name of quest to activate once this one is done)
  - reward_change_tile {"x": x, "y": x, "value": "grass"}
  - reward_add_portal {"xy": "x,y", "mapname": "name of map where portal leads"}

`NOTE:` if the source_npc and the talk_target are the same, then complete quest instantly.
