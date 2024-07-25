extends CharacterBody2D

@export var SPEED = 100
var gravity = ProjectSettings.get_setting("physics/2d/default_gravity")
var player
var chase = false
var alive = true

func _ready():
	get_node("AnimatedSprite2D").play("Idle")
func _physics_process(delta):
	if not alive:
		velocity = Vector2.ZERO
		return
	velocity.y += gravity * delta
	if chase == true:
		if get_node("AnimatedSprite2D").animation != "Death":
			get_node("AnimatedSprite2D").play("Jump")
		player = get_node("../../Player/Player")
		var direction = (player.global_position - self.global_position).normalized()
		if direction.x > 0:
			get_node("AnimatedSprite2D").flip_h = true
		else:
			get_node("AnimatedSprite2D").flip_h = false
		velocity.x = direction.x * SPEED
	else:
		if get_node("AnimatedSprite2D").animation != "Death":
			get_node("AnimatedSprite2D").play("Idle")
		velocity.x = 0
	move_and_slide()
func _on_player_detection_body_entered(body):
	if body.name == "Player" and alive:
		chase = true


func _on_player_detection_body_exited(body):
	if body.name == "Player" and alive:
		chase = false


func _on_player_death_body_entered(body):
	if body.name == "Player" and alive:
		body.health -= 3
		death()

func _on_player_collision_body_entered(body):
	if body.name == "Player" and alive:
		# reflect the player
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
	get_node("AnimatedSprite2D").play("Death")
	await get_node("AnimatedSprite2D").animation_finished
	self.queue_free()
