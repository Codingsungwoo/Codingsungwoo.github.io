extends Area2D

var alive = true
@export var heal_rate = 3
const BASE_HEAL_RATE = 3
# Called when the node enters the scene tree for the first time.
func _ready():
	$AnimatedSprite2D.play("Idle")
	scale *= (heal_rate / BASE_HEAL_RATE)



func _on_body_entered(body):
	if body.name != 'Player':
		return
	
	$CollisionShape2D.set_deferred('disabled', true)
	$AnimatedSprite2D.play("consumed")
	body.health = mini(body.health + heal_rate,Game.playerHP)
	SoundDirector.get_node('ItemSound').play()
	await $AnimatedSprite2D.animation_finished
	queue_free()
