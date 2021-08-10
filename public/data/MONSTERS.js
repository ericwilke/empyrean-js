// frequency can be "frequent", "common", "rare", and "very rare"

MONSTERS = {
    "goblin": {
        "desc": "Small humanoid.",
        "hp": "2:5",
        "resists": "",
        "weakness": "",
        "prevelance": "common",
        "attack":
            {"name": "short sword", "range": 1, "damage": "slashing-3", "bonus": 0},
        "armor_class": 11,
        "gold": "0:5",
        "special_items": "",
        "movement": "random"
    },
    "orc": {
        "desc": "Warrior humanoid.",
        "hp": "4:14",
        "resists": "",
        "weakness": "",
        "prevelance": "common",
        "attack":
            {"name": "sword", "range": 1, "damage": "slashing-6", "bonus": 0},
        "armor_class": 12,
        "gold": "0:8",
        "special_items": "orc tusk",
        "movement": "random"
    },
    "kobold": {
        "desc": "Small lizard-like humanoid.",
        "hp": "1:4",
        "resists": "",
        "weakness": "",
        "prevelance": "frequent",
        "attack":
            {"name": "spear", "range": 1, "damage": "piercing-3", "bonus": 0},
        "armor_class": 10,
        "gold": "0:5",
        "special_items": "kobold hide",
        "movement": "random"
    },
    "scorpion": {
        "desc": "Giant, poisonous scorpion.",
        "hp": "7:14",
        "resists": "poison",
        "weakness": "",
        "prevelance": "rare",
        "attack":
            {"name": "sting", "range": 1, "damage": "piercing-4/poison-3", "bonus": 0},
        "armor_class": 14,
        "gold": "0:0",
        "special_items": "poison sac",
        "movement": "random"
    },
    "rat": {
        "desc": "Giant dungeon rat.",
        "hp": "1:2",
        "resists": "",
        "weakness": "",
        "prevelance": "frequent",
        "attack":
            {"name": "sting", "range": 1, "damage": "piercing-4", "bonus": 0},
        "armor_class": 8,
        "gold": "0:0",
        "special_items": "",
        "movement": "random"
    },
    "skeleton": {
        "desc": "Animated undead skeleton.",
        "hp": "2:6",
        "resists": "range piercing lightning psychic",
        "weakness": "",
        "prevelance": "common",
        "attack":
            {"name": "sword", "range": 1, "damage": "slashing-4", "bonus": 0},
        "armor_class": 12,
        "gold": "0:5",
        "special_items": "",
        "movement": "random"
    },
    "skeleton guard": {
        "desc": "Animated undead skeleton.",
        "hp": "3:8",
        "resists": "range piercing lightning psychic",
        "weakness": "",
        "prevelance": "common",
        "attack":
            {"name": "sword", "range": 1, "damage": "slashing-5", "bonus": 0},
        "armor_class": 12,
        "gold": "0:5",
        "special_items": "",
        "movement": "static"
    },
    "zombie": {
        "desc": "Rotting undead.",
        "hp": "3:8",
        "resists": "fire lightning psychic",
        "weakness": "",
        "prevelance": "common",
        "attack":
            {"name": "bludgeon", "range": 1, "damage": "bludgeoning-4/poison-2", "bonus": 0},
        "armor_class": 8,
        "gold": "0:0",
        "special_items": "",
        "movement": "random"
    },
    "zombie king": {
        "desc": "King of the rotting undead.",
        "hp": "10:20",
        "resists": "fire lightning ice",
        "weakness": "",
        "prevelance": "very rare",
        "attack":
            {"name": "bludgeon", "range": 1, "damage": "bludgeoning-8/poison-3", "bonus": 2},
        "armor_class": 15,
        "gold": "25:45",
        "special_items": "",
        "movement": "static"
    },
    "mummy": {
        "desc": "Dead wraped in cloth.",
        "hp": "5:10",
        "resists": "lightning",
        "weakness": "",
        "prevelance": "common",
        "attack":
            {"name": "bludgeon", "range": 1, "damage": "bludgeoning-6", "bonus": 0},
        "armor_class": 7,
        "gold": "10:20",
        "special_items": "",
        "movement": "random"
    },
    "beholder": {
        "desc": "Deadly magical beast.",
        "hp": "150:180",
        "resists": "lightning fire force psychic",
        "weakness": "",
        "prevelance": "very rare",
        "attack":
            {"name": "blast", "range": 4, "damage": 40, "type": "lightning-10/psychic-10/force-10/fire-10", "bonus": 6},
        "armor_class": 18,
        "gold": "50:200",
        "special_items": "beholder eye",
        "movement": "random"
    },
    "cultist": {
        "desc": "Follower of the Cult.",
        "hp": "8:14",
        "resists": "fire",
        "weakness": "",
        "prevelance": "rare",
        "attack":
            {"name": "staff", "range": 1, "damage": "bludgeoning-8", "bonus": 2},
        "armor_class": 13,
        "gold": "0:0",
        "special_items": "",
        "movement": "random"
    },
    "cult leader": {
        "desc": "Leader of the Cult.",
        "hp": "15:20",
        "resists": "fire",
        "weakness": "",
        "prevelance": "very rare",
        "attack":
            {"name": "sword", "range": 1, "damage": "slashing-12", "bonus": 3},
        "armor_class": 15,
        "gold": "0:0",
        "special_items": "",
        "movement": "static"
    },
    "fire elemental": {
        "desc": "Living fire.",
        "hp": "20:30",
        "resists": "fire",
        "weakness": "water cold ice",
        "prevelance": "very rare",
        "attack":
            {"name": "fire", "range": 1, "damage": "fire-18", "bonus": 3},
        "armor_class": 13,
        "gold": "0:0",
        "special_items": "fire crystal",
        "movement": "random"
    },
    "snake": {
        "desc": "Giant snake.",
        "hp": "15:25",
        "resists": "",
        "weakness": "fire",
        "prevelance": "very rare",
        "attack":
            {"name": "bite", "range": 1, "damage": "piercing-12/poison-4", "bonus": 3},
        "armor_class": 15,
        "gold": "0:0",
        "special_items": "",
        "movement": "random"
    },
    "troll": {
        "desc": "Ulgy troll.",
        "hp": "35:45",
        "resists": "fire slashing piercing bludgeoning",
        "weakness": "",
        "prevelance": "very rare",
        "attack":
            {"name": "club", "range": 1, "damage": "bludgeoning-12", "bonus": 5},
        "armor_class": 17,
        "gold": "30:70",
        "special_items": "troll snot",
        "movement": "random"
    },
    "troll guard": {
        "desc": "Ulgy troll.",
        "hp": "35:45",
        "resists": "fire slashing piercing bludgeoning",
        "weakness": "",
        "prevelance": "very rare",
        "attack":
            {"name": "club", "range": 1, "damage": "bludgeoning-12", "bonus": 5},
        "armor_class": 17,
        "gold": "30:70",
        "special_items": "troll snot",
        "movement": "random"
    },
    "giant fly": {
        "desc": "Humongous hairy fly.",
        "hp": "5:8",
        "resists": "",
        "weakness": "",
        "prevelance": "frequent",
        "attack":
            {"name": "bite", "range": 1, "damage": "piercing-4", "bonus": 0},
        "armor_class": 10,
        "gold": "0:0",
        "special_items": "",
        "movement": "random"
    },
    "giant spider": {
        "desc": "Giant spider.",
        "hp": "25:35",
        "resists": "poison",
        "weakness": "fire",
        "prevelance": "rare",
        "attack":
            {"name": "bite", "range": 1, "damage": "piercing-4/poison-10", "bonus": 2},
        "armor_class": 15,
        "gold": "0:0",
        "special_items": "spider eye",
        "movement": "random"
    },
    "wyvern": {
        "desc": "Medium-sized dragon-like animal.",
        "hp": "55:75",
        "resists": "fire ice cold",
        "weakness": "",
        "prevelance": "very rare",
        "attack":
            {"name": "bite", "range": 1, "damage": "piercing-4/poison-10", "bonus": 4},
        "armor_class": 17,
        "gold": "0:0",
        "special_items": "",
        "movement": "random"
    },
    "wyvern guard": {
        "desc": "Medium-sized dragon-like animal.",
        "hp": "55:75",
        "resists": "fire ice cold",
        "weakness": "",
        "prevelance": "very rare",
        "attack":
            {"name": "bite", "range": 1, "damage": "piercing-4/poison-10", "bonus": 4},
        "armor_class": 17,
        "gold": "0:0",
        "special_items": "",
        "movement": "static"
    },
    "dragon": {
        "desc": "Awesome, fearful, massive dragon.",
        "hp": "350:575",
        "resists": "fire ice cold lightning poison",
        "weakness": "force",
        "prevelance": "very rare",
        "attack":
            {"name": "bite", "range": 2, "damage": "piercing-40/fire-20", "bonus": 10},
        "armor_class": 20,
        "gold": "1000:2000",
        "special_items": "dragon scale",
        "movement": "static"
    },
    "hag": {
        "desc": "Hunched, ugly old hag.",
        "hp": "20:30",
        "resists": "fire ice cold lightning poison force",
        "weakness": "",
        "prevelance": "very rare",
        "attack":
            {"name": "spell", "range": 4, "damage": "force-20", "bonus": 4},
        "armor_class": 15,
        "gold": "100:200",
        "special_items": "",
        "movement": "static"
    },
    "bandit": {
        "desc": "Highway bandit.",
        "hp": "10:20",
        "resists": "",
        "weakness": "",
        "prevelance": "frequent",
        "attack":
            {"name": "sword", "range": 1, "damage": "slashing-8", "bonus": 0},
        "armor_class": 12,
        "gold": "1:30",
        "special_items": "",
        "movement": "random"
    },
    "owlbear": {
        "desc": "A bear-like craeture with a beek.",
        "hp": "30:45",
        "resists": "",
        "weakness": "",
        "prevelance": "rare",
        "attack":
            {"name": "claw", "range": 1, "damage": "slashing-8", "bonus": 2},
        "armor_class": 14,
        "gold": "0:0",
        "special_items": "",
        "movement": "random"
    },
    "gelatinous cube": {
        "desc": "Nearly invisible cube.",
        "hp": "50:65",
        "resists": "lightning fire ice cold bludgeoning slashing piercing",
        "weakness": "",
        "prevelance": "very rare",
        "attack":
            {"name": "acid digestion", "range": 1, "damage": "acid-20", "bonus": 2},
        "armor_class": 12,
        "gold": "150:300",
        "special_items": "",
        "movement": "static"
    },
    "dwarf": {
        "desc": "Stout dwarf warrior.",
        "hp": "10:20",
        "resists": "",
        "weakness": "",
        "prevelance": "frequent",
        "attack":
            {"name": "axe", "range": 1, "damage": "slashing-12", "bonus": 3},
        "armor_class": 12,
        "gold": "10:30",
        "special_items": "",
        "movement": "random"
    },
    "pirate": {
        "desc": "Dangerous pirate.",
        "hp": "10:20",
        "resists": "",
        "weakness": "",
        "prevelance": "frequent",
        "attack":
            {"name": "sword", "range": 1, "damage": "slashing-8", "bonus": 2},
        "armor_class": 12,
        "gold": "15:30",
        "special_items": "",
        "movement": "random"
    },
    "monk": {
        "desc": "Seemingly harmless monk.",
        "hp": "10:20",
        "resists": "",
        "weakness": "",
        "prevelance": "frequent",
        "attack":
            {"name": "bow", "range": 4, "damage": "piercing-8", "bonus": 3},
        "armor_class": 12,
        "gold": "1:5",
        "special_items": "",
        "movement": "random"
    }
}
