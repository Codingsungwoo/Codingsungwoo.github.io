extends Node2D


# Called when the node enters the scene tree for the first time.
func _ready():
	#Utils.saveGame()
	Utils.loadGame()


func _on_quit_pressed():
	get_tree().quit()


func _on_play_pressed():
	get_tree().change_scene_to_file("res://play.tscn")


func _on_stage_pressed():
	get_tree().change_scene_to_file('res://stage.tscn')


func _on_continue_pressed():
	Utils.change_to_world(Game.current_world,Game.current_subworld)


func _on_reset_progress_button_pressed():
	Game.current_world = 1
	Game.max_world = 1
	Game.max_subworld = 1
	Game.current_subworld = 1
	Utils.saveGame()
