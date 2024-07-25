extends Node


# Called when the node enters the scene tree for the first time.
func _ready():
	$/root/Play/ControlLayer.visible = false


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	pass


func _on_timer_timeout():
	var previous_scene = load(Game.previousScene)
	$/root/Play/ControlLayer.visible = true
	$/root/Play.change_scene(previous_scene)
