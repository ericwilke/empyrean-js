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

`X` is an integer, and `STAT` refers to any of the player stats (`hp`, `str`, `dex`, `magic`, `armor`, `melee`, `range`)

The number after the "+" will be applied to the corresponding stat of the player.

Examples: `golden amulet (+2 armor)`, `silver ring (+1 range)`
