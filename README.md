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

If an NPC has a quest item to give to the player, include an `*` within the name of the quest item. The `*` will be removed in the player inventory list but tells the program to keep the item in the list of items with the NPC. Example: `*Mine of Hellis key`.
