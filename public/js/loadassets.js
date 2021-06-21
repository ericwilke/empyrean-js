//////////////// LOAD RESOURCES ////////////////

// Music
let currentMusic = null;
const shortActionMusic = new Audio('sound/short-action.mp3');
const epicAdventureMusic = new Audio('sound/epic-adventure.mp3');
const dramaticAdventureMusic = new Audio('sound/dramatic-adventure.mp3');
const mellowAdventureMusic = new Audio('sound/mellow-adventure.mp3');
const epicThemeMusic = new Audio('sound/epic-theme.mp3');
const medievalThemeMusic = new Audio('sound/medieval-music.mp3');
const villageMusic = new Audio('sound/village.mp3');
const dungeonMysticalMusic = new Audio('sound/dungeon-mystical.mp3');

// Sound Effects
const blockedSound = new Audio('sound/blocked.mp3');

// Images
const tile_grass = new Image(); tile_grass.src = 'img/grass2.png';
const tile_mountains = new Image(); tile_mountains.src = 'img/mountains.png';
const tile_desert = new Image(); tile_desert.src = 'img/desert.png';
const tile_cave = new Image(); tile_cave.src = 'img/cave.png';
const tile_forest_pine = new Image(); tile_forest_pine.src = 'img/tree1.png';
const tile_forest_oak = new Image(); tile_forest_oak.src = 'img/tree3.png';
const tile_forest_other = new Image(); tile_forest_other.src = 'img/tree2.png';
const tile_castle = new Image(); tile_castle.src = 'img/castle2.png';
const tile_door = new Image(); tile_door.src = 'img/door.png';
const tile_inn = new Image(); tile_inn.src = 'img/inn.png';
const tile_road_stone = new Image(); tile_road_stone.src = 'img/road-brick.png';
const tile_road_dirt = new Image(); tile_road_dirt.src = 'img/road-dirt.png';
const tile_ruins = new Image(); tile_ruins.src = 'img/ruins.png';
const tile_runestone = new Image(); tile_runestone.src = 'img/runestone1.png';
const tile_sign = new Image(); tile_sign.src = 'img/sign.png';
const tile_stairs = new Image(); tile_stairs.src = 'img/stairs.png';
const tile_wall_white_square = new Image(); tile_wall_white_square.src = 'img/stone-white-square.png';
const tile_secret_wall_white_square = new Image(); tile_secret_wall_white_square.src = 'img/secret-stone-white-square.png';
const tile_wall_white_rough = new Image(); tile_wall_white_rough.src = 'img/stone-white-rough.png';
const tile_wall_brown_rough = new Image(); tile_wall_brown_rough.src = 'img/stone-brown.png';
const tile_secret_wall_brown_rough = new Image(); tile_secret_wall_brown_rough.src = 'img/secret-stone-brown.png';
const tile_wall_gray = new Image(); tile_wall_gray.src = 'img/wall-stone-gray.png';
const tile_swamp = new Image(); tile_swamp.src = 'img/swamp.png';
const tile_town = new Image(); tile_town.src = 'img/town.png';
const tile_water_shallow = new Image(); tile_water_shallow.src = 'img/water-shallow.png';
const tile_water_deep = new Image(); tile_water_deep.src = 'img/water-deep.png';
const tile_wood = new Image(); tile_wood.src = 'img/wood.png';
const tile_portal = new Image(); tile_portal.src = 'img/portal.png';
const tile_counter_horizontal = new Image(); tile_counter_horizontal.src = 'img/counter-horizontal.png';
const tile_counter_vertical = new Image(); tile_counter_vertical.src = 'img/counter-vertical.png';

const tile_player = new Image(); tile_player.src = 'img/player.png';
const tile_king = new Image(); tile_king.src = 'img/king.png';
const tile_castle_guard = new Image(); tile_castle_guard.src = 'img/castle-guard.png';
const tile_old_man = new Image(); tile_old_man.src = 'img/old-man.png';
const tile_commoner_1 = new Image(); tile_commoner_1.src = 'img/commoner1.png';
const tile_commoner_2 = new Image(); tile_commoner_2.src = 'img/commoner2.png';
const tile_commoner_3 = new Image(); tile_commoner_3.src = 'img/commoner3.png';
const tile_commoner_4 = new Image(); tile_commoner_4.src = 'img/commoner4.png';
const tile_commoner_5 = new Image(); tile_commoner_5.src = 'img/commoner5.png';

const tile_beholder = new Image(); tile_beholder.src = 'img/beholder.png';
const tile_goblin = new Image(); tile_goblin.src = 'img/goblin.png';
const tile_zombie = new Image(); tile_zombie.src = 'img/zombie.png';
const tile_zombie_king = new Image(); tile_zombie_king.src = 'img/zombie-king.png';
const tile_skeleton = new Image(); tile_skeleton.src = 'img/skeleton.png';
const tile_skeleton_guard = new Image(); tile_skeleton_guard.src = 'img/skeleton-guard.png';
const tile_scorpion = new Image(); tile_scorpion.src = 'img/scorpion.png';
const tile_rat = new Image(); tile_rat.src = 'img/rat.png';
const tile_mummy = new Image(); tile_mummy.src = 'img/mummy.png';
