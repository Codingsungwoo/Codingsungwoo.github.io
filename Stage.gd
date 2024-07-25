extends Node

var max_sub_worlds = [0, 10, 10, 8]

# Called when the node enters the scene tree for the first time.
func _ready():
	for i in len(max_sub_worlds):
		for j in max_sub_worlds[i]:
			var button = $ScrollContainer/VBoxContainer/ButtonTemplate.duplicate(7)
			button.text = '%d-%d' % [i,j+1]
			if i > Game.max_world or (i == Game.max_world and j+1 > Game.max_subworld):
				break
			$ScrollContainer/VBoxContainer.add_child(button)
			button.pressed.connect(func ():Utils.change_to_world(i,j+1))
	var template = $ScrollContainer/VBoxContainer/ButtonTemplate
	$ScrollContainer/VBoxContainer.remove_child(template)
	template.queue_free()


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	pass


func _on_button_pressed():
	get_tree().change_scene_to_file('res://main.tscn')
