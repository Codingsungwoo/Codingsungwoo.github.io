extends Node2D

var score = 0
@export var max_score = 1
@export var next_stage: PackedScene

@export var time_limit = 0.0
var time_limit_in_effect = true
var actual_time_limit= 0.0
# Called when the node enters the scene tree for the first time.
func _ready():
	var victory_point_items = get_tree().get_nodes_in_group('victory_point_item')
	for item in victory_point_items: # javascript: for (const item of victory_point_items)
		item.score.connect(_on_item_score)
	Game.previousScene = scene_file_path
	Game.save_current_world(scene_file_path)
	Utils.saveGame()

	time_limit_in_effect = time_limit > 0.0
	if time_limit_in_effect:
		actual_time_limit = time_limit
# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	if time_limit_in_effect:
		actual_time_limit -= delta
		if actual_time_limit <=  0.0:
			$Player/Player.health = 0
			actual_time_limit = 0.0
		var times_in_seconds = ceili(actual_time_limit)
		var times_seconds = times_in_seconds % 60
		var times_minutes = times_in_seconds / 60
		$UI/Timer.text = "Time: %02d:%02d" % [times_minutes,times_seconds]
	# HP label
	$UI/Hp.text = "HP: " + str($Player/Player.health) + ' / ' + str(Game.playerHP)
	# Gold label
	$UI/Gold.text = "Gold: " + str(Game.Gold)
	# Score label
	$UI/Score.text = "Score: " + str(score) + ' / ' + str(max_score)
	

func _on_item_score():
	score += 1
	Game.currentHP = $Player/Player.health
	if score >= max_score:
		Game.initialHP = Game.currentHP
		$/root/Play.change_scene(next_stage)
