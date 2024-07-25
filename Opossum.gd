extends CharacterBody2D

@export var SPEED = 200
@export var playerdetection = 1.0
@export var boost = 1.0
@export var faster = false
@export var max_speed_limit = 500.0
var gravity = ProjectSettings.get_setting("physics/2d/default_gravity")
var player
var chase = false
var alive = true

func _ready():
	$AnimatedSprite2D.animation = 'Move'
	$AnimatedSprite2D.frame = 1
	$AnimatedSprite2D.pause()
	$PlayerDetection.scale *= playerdetection
func _physics_process(delta):
	if not alive:
		velocity = Vector2.ZERO
		return
	velocity.y += gravity * delta
	if chase == true:
		$AnimatedSprite2D.play()
		player = get_node("../../Player/Player")
		var direction = (player.global_position - self.global_position).normalized()
		$AnimatedSprite2D.flip_h = direction.x > 0
		velocity.x = direction.x * SPEED
		if faster:
			if SPEED >= max_speed_limit:
				SPEED = max_speed_limit
			else:
				SPEED += boost
	else:
		if $AnimatedSprite2D.animation != "Death":
			$AnimatedSprite2D.frame = 1
			$AnimatedSprite2D.pause()
		velocity.x = 0
	move_and_slide()
func _on_player_detection_body_entered(body):
	if body.name == "Player" and alive:
		player = body
		chase = true


func _on_player_detection_body_exited(body):
	if body.name == "Player" and alive:
		player = body
		chase = false


func _on_player_death_body_entered(body):
	if body.name == "Player" and alive:
		player = body
		body.health -= 5
		death()

func _on_player_collision_body_entered(body):
	if body.name == "Player" and alive:
		player = body
		body.velocity.y = body.JUMP_VELOCITY * 0.75
		SoundDirector.get_node('BounceSound').play()
		death()
	
func death():
	alive = false
	set_deferred('collision_mask', 0)
	set_deferred('collision_layer', 0)
	Game.Gold += 5
	Utils.saveGame()
	chase = false
	$AnimatedSprite2D.play("Death")
	await $AnimatedSprite2D.animation_finished
	self.queue_free()
