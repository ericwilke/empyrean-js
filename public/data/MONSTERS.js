MONSTERS = {
    "goblin": {
        "desc": "Small humanoid.",
        "hp": "2:5",
        "resists": "",
        "prevelance": "common",
        "attack":
            {"name": "short sword", "range": 1, "damage": 3, "type": "melee", "bonus": 0},
        "armor class": 11,
        "gold": "0:5",
        "level": 1,
        "xp": 3,
        "special items": "none",
        "movement": "random"
    },
    "orc": {
        "desc": "Warrior humanoid.",
        "hp": "4:14",
        "resists": "",
        "prevelance": "common",
        "attack":
            {"name": "sword", "range": 1, "damage": 6, "type": "melee", "bonus": 0},
        "armor class": 12,
        "gold": "0:8",
        "level": 1,
        "xp": 5,
        "special items": "none",
        "movement": "random"
    },
    "kobold": {
        "desc": "Small lizard-like humanoid.",
        "hp": "1:4",
        "resists": "",
        "prevelance": "frequent",
        "attack":
            {"name": "spear", "range": 1, "damage": 3, "type": "melee", "bonus": 0},
        "armor class": 10,
        "gold": "0:5",
        "level": 1,
        "xp": 3,
        "special items": "none",
        "movement": "random"
    },
    "scorpion": {
        "desc": "Giant, poisonous scorpion.",
        "hp": "3:14",
        "resists": "",
        "prevelance": "rare",
        "attack":
            {"name": "sting", "range": 1, "damage": 4, "type": "melee", "bonus": 0},
        "armor class": 14,
        "gold": "0:0",
        "level": 1,
        "xp": 5,
        "special items": "none",
        "movement": "random"
    },
    "rat": {
        "desc": "Giant dungeon rat.",
        "hp": "1:2",
        "resists": "",
        "prevelance": "frequent",
        "attack":
            {"name": "sting", "range": 1, "damage": 4, "type": "melee", "bonus": 0},
        "armor class": 8,
        "gold": "0:0",
        "level": 1,
        "xp": 1,
        "special items": "none",
        "movement": "random"
    },
    "skeleton": {
        "desc": "Animated undead skeleton.",
        "hp": "2:6",
        "resists": "range shock",
        "prevelance": "common",
        "attack":
            {"name": "sword", "range": 1, "damage": 4, "type": "melee", "bonus": 0},
        "armor class": 12,
        "gold": "0:5",
        "level": 1,
        "xp": 4,
        "special items": "none",
        "movement": "random"
    },
    "skeleton guard": {
        "desc": "Animated undead skeleton.",
        "hp": "3:8",
        "resists": "range shock",
        "prevelance": "common",
        "attack":
            {"name": "sword", "range": 1, "damage": 5, "type": "melee", "bonus": 0},
        "armor class": 12,
        "gold": "0:5",
        "level": 1,
        "xp": 5,
        "special items": "none",
        "movement": "static"
    },
    "zombie": {
        "desc": "Rotting undead.",
        "hp": "3:8",
        "resists": "fire shock",
        "prevelance": "common",
        "attack":
            {"name": "bludgeon", "range": 1, "damage": 4, "type": "melee", "bonus": 0},
        "armor class": 8,
        "gold": "0:0",
        "level": 1,
        "xp": 4,
        "special items": "none",
        "movement": "random"
    },
    "zombie king": {
        "desc": "King of the rotting undead.",
        "hp": "7:18",
        "resists": "fire shock frost",
        "prevelance": "very rare",
        "attack":
            {"name": "bludgeon", "range": 1, "damage": 8, "type": "melee", "bonus": 2},
        "armor class": 10,
        "gold": "0:10",
        "level": 2,
        "xp": 8,
        "special items": "none",
        "movement": "static"
    },
    "mummy": {
        "desc": "Dead wraped in cloth.",
        "hp": "5:10",
        "resists": "shock",
        "prevelance": "common",
        "attack":
            {"name": "bludgeon", "range": 1, "damage": 6, "type": "melee", "bonus": 0},
        "armor class": 7,
        "gold": "0:0",
        "level": 2,
        "xp": 6,
        "special items": "none",
        "movement": "random"
    },
    "beholder": {
        "desc": "Deadly magical beast.",
        "hp": "150:180",
        "resists": "",
        "prevelance": "very rare",
        "attack":
            {"name": "blast", "range": 4, "damage": 40, "type": "shock", "bonus": 6},
        "armor class": 18,
        "gold": "50:200",
        "level": 13,
        "xp": 9000,
        "special items": "none",
        "movement": "random"
    },
    "cultist": {
        "desc": "Follower of the Cult.",
        "hp": "8:14",
        "resists": "fire",
        "prevelance": "rare",
        "attack":
            {"name": "staff", "range": 1, "damage": 8, "type": "melee", "bonus": 2},
        "armor class": 13,
        "gold": "0:0",
        "level": 3,
        "xp": 12,
        "special items": "none",
        "movement": "random"
    },
    "cult leader": {
        "desc": "Leader of the Cult.",
        "hp": "15:20",
        "resists": "fire",
        "prevelance": "very rare",
        "attack":
            {"name": "sword", "range": 1, "damage": 12, "type": "melee", "bonus": 3},
        "armor class": 15,
        "gold": "0:0",
        "level": 3,
        "xp": 20,
        "special items": "none",
        "movement": "static"
    },
    "fire elemental": {
        "desc": "Living fire.",
        "hp": "20:30",
        "resists": "fire",
        "prevelance": "very rare",
        "attack":
            {"name": "fire", "range": 1, "damage": 18, "type": "fire", "bonus": 3},
        "armor class": 13,
        "gold": "0:0",
        "level": 3,
        "xp": 30,
        "special items": "none",
        "movement": "random"
    }
}
