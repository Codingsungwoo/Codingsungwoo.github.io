extends Node

var playerHP = 15
var Gold = 0
var currentHP = 15
var initialHP = 15
var current_world = 1
var current_subworld = 1
var max_world = 1
var max_subworld = 1
var previousScene = 'res://world/world1-1.tscn'

func save_current_world(scene_name: String):
	var suffix = scene_name.rsplit('world',true,1)[-1]
	suffix = suffix.replace('.tscn','').split('-')
	current_world = int(suffix[0])
	current_subworld = int(suffix[1])
	if current_world > max_world or \
		(current_world == max_world and \
		current_subworld >= max_subworld):
		max_world = current_world
		max_subworld = current_subworld
				
