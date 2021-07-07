MONSTERS = {
    "goblin": {
        "desc": "Small humanoid.",
        "hp": "2:5",
        "resists": "",
        "prevelance": "common",
        "attack":
            {"name": "short sword", "range": 1, "damage": "slashing-3", "bonus": 0},
        "armor_class": 11,
        "gold": "0:5",
        "level": 1,
        "xp": 3,
        "special_items": "none",
        "movement": "random"
    },
    "orc": {
        "desc": "Warrior humanoid.",
        "hp": "4:14",
        "resists": "",
        "prevelance": "common",
        "attack":
            {"name": "sword", "range": 1, "damage": "slashing-6", "bonus": 0},
        "armor_class": 12,
        "gold": "0:8",
        "level": 1,
        "xp": 5,
        "special_items": "none",
        "movement": "random"
    },
    "kobold": {
        "desc": "Small lizard-like humanoid.",
        "hp": "1:4",
        "resists": "",
        "prevelance": "frequent",
        "attack":
            {"name": "spear", "range": 1, "damage": "piercing-3", "bonus": 0},
        "armor_class": 10,
        "gold": "0:5",
        "level": 1,
        "xp": 3,
        "special_items": "none",
        "movement": "random"
    },
    "scorpion": {
        "desc": "Giant, poisonous scorpion.",
        "hp": "3:14",
        "resists": "poison",
        "prevelance": "rare",
        "attack":
            {"name": "sting", "range": 1, "damage": "piercing-4/poison-3", "bonus": 0},
        "armor_class": 14,
        "gold": "0:0",
        "level": 1,
        "xp": 5,
        "special_items": "none",
        "movement": "random"
    },
    "rat": {
        "desc": "Giant dungeon rat.",
        "hp": "1:2",
        "resists": "",
        "prevelance": "frequent",
        "attack":
            {"name": "sting", "range": 1, "damage": "piercing-4", "bonus": 0},
        "armor_class": 8,
        "gold": "0:0",
        "level": 1,
        "xp": 1,
        "special_items": "none",
        "movement": "random"
    },
    "skeleton": {
        "desc": "Animated undead skeleton.",
        "hp": "2:6",
        "resists": "range lightning psychic",
        "prevelance": "common",
        "attack":
            {"name": "sword", "range": 1, "damage": "slashing-4", "bonus": 0},
        "armor_class": 12,
        "gold": "0:5",
        "level": 1,
        "xp": 4,
        "special_items": "none",
        "movement": "random"
    },
    "skeleton guard": {
        "desc": "Animated undead skeleton.",
        "hp": "3:8",
        "resists": "range lightning psychic",
        "prevelance": "common",
        "attack":
            {"name": "sword", "range": 1, "damage": "slashing-5", "bonus": 0},
        "armor_class": 12,
        "gold": "0:5",
        "level": 1,
        "xp": 5,
        "special_items": "none",
        "movement": "static"
    },
    "zombie": {
        "desc": "Rotting undead.",
        "hp": "3:8",
        "resists": "fire lightning psychic",
        "prevelance": "common",
        "attack":
            {"name": "bludgeon", "range": 1, "damage": "bludgeoning-4/poison-2", "bonus": 0},
        "armor_class": 8,
        "gold": "0:0",
        "level": 1,
        "xp": 4,
        "special_items": "none",
        "movement": "random"
    },
    "zombie king": {
        "desc": "King of the rotting undead.",
        "hp": "7:18",
        "resists": "fire lightning ice",
        "prevelance": "very rare",
        "attack":
            {"name": "bludgeon", "range": 1, "damage": "bludgeoning-8/poison-3", "bonus": 2},
        "armor_class": 10,
        "gold": "5:15",
        "level": 2,
        "xp": 8,
        "special_items": "none",
        "movement": "static"
    },
    "mummy": {
        "desc": "Dead wraped in cloth.",
        "hp": "5:10",
        "resists": "lightning",
        "prevelance": "common",
        "attack":
            {"name": "bludgeon", "range": 1, "damage": "bludgeoning-6", "bonus": 0},
        "armor_class": 7,
        "gold": "0:0",
        "level": 2,
        "xp": 6,
        "special_items": "none",
        "movement": "random"
    },
    "beholder": {
        "desc": "Deadly magical beast.",
        "hp": "150:180",
        "resists": "lightning fire force psychic",
        "prevelance": "very rare",
        "attack":
            {"name": "blast", "range": 4, "damage": 40, "type": "lightning-10/psychic-10/force-10/fire-10", "bonus": 6},
        "armor_class": 18,
        "gold": "50:200",
        "level": 13,
        "xp": 9000,
        "special_items": "none",
        "movement": "random"
    },
    "cultist": {
        "desc": "Follower of the Cult.",
        "hp": "8:14",
        "resists": "fire",
        "prevelance": "rare",
        "attack":
            {"name": "staff", "range": 1, "damage": "bludgeoning-8", "bonus": 2},
        "armor_class": 13,
        "gold": "0:0",
        "level": 3,
        "xp": 12,
        "special_items": "none",
        "movement": "random"
    },
    "cult leader": {
        "desc": "Leader of the Cult.",
        "hp": "15:20",
        "resists": "fire",
        "prevelance": "very rare",
        "attack":
            {"name": "sword", "range": 1, "damage": "slashing-12", "bonus": 3},
        "armor_class": 15,
        "gold": "0:0",
        "level": 3,
        "xp": 20,
        "special_items": "none",
        "movement": "static"
    },
    "fire elemental": {
        "desc": "Living fire.",
        "hp": "20:30",
        "resists": "fire",
        "prevelance": "very rare",
        "attack":
            {"name": "fire", "range": 1, "damage": "fire-18", "bonus": 3},
        "armor_class": 13,
        "gold": "0:0",
        "level": 3,
        "xp": 30,
        "special_items": "none",
        "movement": "random"
    }
}
