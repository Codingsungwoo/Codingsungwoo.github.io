extends Node


const SAVE_PATH = "res://savegame.bin"


func saveGame():
	var file = FileAccess.open(SAVE_PATH, FileAccess.WRITE)
	var data: Dictionary = {
		"playerHP": Game.playerHP,
		"Gold": Game.Gold,
		"currentWorld": Game.current_world,
		"currentSubworld": Game.current_subworld,
		"maxWorld": Game.max_world,
		"maxSubworld": Game.max_subworld,
	}
	var jstr = JSON.stringify(data)
	file.store_line(jstr)
	
func loadGame():
	var file = FileAccess.open(SAVE_PATH, FileAccess.READ)
	if FileAccess.file_exists(SAVE_PATH) == true:
		if not file.eof_reached():
			var current_line = JSON.parse_string(file.get_line())
			if current_line:
				Game.playerHP = current_line["playerHP"]
				Game.Gold = current_line["Gold"]
				Game.currentHP = current_line["playerHP"]
				Game.current_world = current_line.get('currentWorld',1)
				Game.current_subworld = current_line.get('currentSubworld',1)
				Game.max_world = current_line.get('maxWorld',Game.current_world)
				Game.max_subworld = current_line.get('maxSubworld',Game.current_subworld)
func change_to_world(world:int,subworld:int):
	var world_file_name = "res://world/world%d-%d.tscn" % [world,subworld]
	var play = preload('res://play.tscn').instantiate()
	play.world_scene = load(world_file_name)
	var play_actual = PackedScene.new()
	play_actual.pack(play)
	get_tree().change_scene_to_packed(play_actual)
