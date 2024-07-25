extends Node

@export var world_scene: PackedScene
var current_world

# Called when the node enters the scene tree for the first time.
func _ready():
	current_world = world_scene.instantiate()
	add_child(current_world)
	on_resuem()

func change_scene(new_scene: PackedScene):
	world_scene = new_scene
	current_world.queue_free()
	current_world = world_scene.instantiate()
	call_deferred("add_child",current_world)

# Called every frame. 'delta' is the elapsed time since the previous frame.


func _on_pause_button_button_down():
	$ControlLayer/PauseButton.modulate.r = 0.6
	$ControlLayer/PauseButton.modulate.g = 0.6
	$ControlLayer/PauseButton.modulate.b = 0.6

func _on_pause_button_button_up():
	$ControlLayer/PauseButton.modulate.r = 1.0
	$ControlLayer/PauseButton.modulate.g = 1.0
	$ControlLayer/PauseButton.modulate.b = 1.0

func on_pause():
	get_tree().paused = true
	$PausedLayer.show()
	$PausedLayer/ContinueButton.disabled = false
	$PausedLayer/RestartButton.disabled = false
	$PausedLayer/QuitButton.disabled = false
	$ControlLayer.hide()
	
func on_resuem():
	get_tree().paused = false
	$PausedLayer.hide()
	$PausedLayer/ContinueButton.disabled = true
	$PausedLayer/RestartButton.disabled = true
	$PausedLayer/QuitButton.disabled = true
	$ControlLayer.show()
func _on_pause_button_pressed():
	on_pause()


func _on_continue_button_pressed():
	on_resuem()


func _on_restart_button_pressed():
	current_world.queue_free()
	current_world = world_scene.instantiate()
	call_deferred("add_child",current_world)
	on_resuem()


func _on_quit_button_pressed():
	get_tree().paused = false
	Utils.saveGame()
	get_tree().change_scene_to_file("res://main.tscn")
