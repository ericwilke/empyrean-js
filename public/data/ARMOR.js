// armor has the following attributes:
//
// - armor_class (difficulty to hit player)
// - str_required (strenth needed to wear armor)
// - resists (the resistance to certain damage types [e.g. poison])
// - cost (the range for purchasing [e.g. "10-15"])

const ARMOR = {
  "none": {"armor_class": 10, "str_required": 0, "resists": "", "cost": "0-0"},
  "leather armor": {"armor_class": 12, "str_required": 0, "resists": "", "cost": "10-15"},
  "studded leather armor": {"armor_class": 13, "str_required": 0, "resists": "", "cost": "20-30"},
  "chain mail armor": {"armor_class": 14, "str_required": 2, "resists": "", "cost": "50-70"},
  "plate mail armor": {"armor_class": 15, "str_required": 3, "resists": "", "cost": "90-110"}
}
