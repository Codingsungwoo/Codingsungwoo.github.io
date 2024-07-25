extends CharacterBody2D

@export var spring = 1.8
@export var reverse = false
func _ready():
	$AnimatedSprite2D.stop()
func _physics_process(delta):
	pass

func _on_player_collision_body_entered(body):
	if body.name == "Player":
		if reverse:
			body.velocity.y = -body.JUMP_VELOCITY * spring
		else:
			body.velocity.y = body.JUMP_VELOCITY * spring
		SoundDirector.get_node('BounceSound').play()
		$AnimatedSprite2D.play("Jump")

