// armor has the following attributes:
//
// - armor_class (difficulty to hit player)
// - str_required (strenth needed to wear armor)
// - resists (the resistance to certain damage types [e.g. poison])
// - cost (the range for purchasing [e.g. "10-15"])

const ARMOR = {
  "none": {"armor_class": 10, "str_required": 0, "resists": "", "cost": "0,0"},
  "leather armor": {"armor_class": 12, "str_required": 0, "resists": "", "cost": "100,150"},
  "studded leather armor": {"armor_class": 13, "str_required": 0, "resists": "", "cost": "200,300"},
  "chain mail armor": {"armor_class": 14, "str_required": 2, "resists": "", "cost": "500,700"},
  "plate mail armor": {"armor_class": 15, "str_required": 3, "resists": "", "cost": "800,1100"}
}
