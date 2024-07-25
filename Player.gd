extends CharacterBody2D

var health = 15
@export var SPEED = 200.0
const CROUCHING_SPEED = 150.0
const JUMP_VELOCITY = -390.0
const JUMP_VELOCITY_FLOATING = -58.5
const INVUL_TIME = 0.5
var invul_timer = 0.0
var sky_dash = false
var shrinked = false
@export var low_gravity_mode = false
@export var dash_mode = false
@export var landing = false
@export var fast_run = false
@export var shrink = false
# Get the gravity from the project settings to be synced with RigidBody nodes.

var gravity = ProjectSettings.get_setting("physics/2d/default_gravity")
var gravity_hard_land = gravity * 10.0
var alive = true
var crouching = false

@onready var anim = get_node("AnimationPlayer")

func _ready():
	health = mini(Game.playerHP,Game.initialHP + 5)
	if low_gravity_mode:
		gravity *= 0.08

func _physics_process(delta):
	if not alive:
		return
	if invul_timer > 0:
		invul_timer -= delta
	# Add the gravity.
	if not is_on_floor():
		velocity.y += gravity * delta
	
	var crouching_previous = crouching
	crouching = false
	var colliding_ceiling = false
	for node in $StandingCast.get_overlapping_bodies():
		if node is TileMap:
			colliding_ceiling = true
			break
	# Handle Jump.
	if Input.is_action_just_pressed("ui_accept") and (is_on_floor() or low_gravity_mode) and not crouching_previous:
		if low_gravity_mode and shrinked:
			velocity.y = JUMP_VELOCITY_FLOATING * 0.7
		elif low_gravity_mode:
			velocity.y = JUMP_VELOCITY_FLOATING
		elif shrinked:
			velocity.y = JUMP_VELOCITY * 0.7
		else:
			velocity.y = JUMP_VELOCITY
		anim.play("Jump")
		SoundDirector.get_node('JumpSound').play()
	elif Input.is_action_pressed("ui_down") and not sky_dash and not is_on_floor() and landing:
		velocity.y += gravity_hard_land * delta
	elif not is_on_floor() and dash_mode:
		if low_gravity_mode:
			if Input.is_action_pressed("ui_up"):
				sky_dash = true
				velocity.y = 0
				$AnimationPlayer.play("sky")
			else:
				sky_dash = false
	elif is_on_floor() and (Input.is_action_pressed("ui_down") or (crouching_previous and colliding_ceiling)) and not sky_dash:
		crouching = true
		
	if Input.is_action_just_pressed("shrink") and shrink:
		if not shrinked:
			shrinked = true
			scale.x = 0.7
			scale.y = 0.7
		elif shrinked:
			shrinked = false
			scale.x = 1.0
			scale.y = 1.0
	# Get the input direction and handle the movement/deceleration.
	# As good practice, you should replace UI actions with custom gameplay actions.
	var direction = Input.get_axis("ui_left", "ui_right")
	if direction > 0:
		direction = 1.0
	elif direction < 0:
		direction = -1.0
	if direction:
		if crouching and Input.is_action_pressed("shift") and fast_run:
			velocity.x = direction * CROUCHING_SPEED * 2
			if shrinked:
				velocity.x = direction * CROUCHING_SPEED * 1.4
			anim.play("Crouch")
		elif crouching:
			velocity.x = direction * CROUCHING_SPEED
			if shrinked:
				velocity.x =direction * CROUCHING_SPEED * 0.7
			anim.play("Crouch")
		else:
			if sky_dash and Input.is_action_pressed("shift") and fast_run:
				velocity.x = direction * SPEED * 4
			elif sky_dash:
				velocity.x = direction * SPEED * 2
			elif not sky_dash :
				if shrinked and Input.is_action_pressed("shift") and fast_run:
					velocity.x = direction * SPEED * 1.4 
				elif shrinked:
					velocity.x = direction * SPEED * 0.7 
				elif Input.is_action_pressed("shift") and fast_run:
					velocity.x = direction * SPEED * 2
				else:
					velocity.x = direction * SPEED
				anim.play("Run")
	else:
		velocity.x = move_toward(velocity.x, 0, SPEED)
		if crouching:
			anim.play('Crouch')
		elif velocity.y == 0:
			anim.play("Idle")
	if velocity.y > 0:
		anim.play("Fall")
		
	$Crouchshape.set_deferred("disabled",not crouching)
	$CollisionShape2D.set_deferred("disabled",crouching)
	
	move_and_slide()
	for i in get_slide_collision_count():
		var collision = get_slide_collision(i)
		var collider = collision.get_collider()
		
		if invul_timer <= 0 and 'spike' in collider.get_groups():
			health -= 1
			velocity = SPEED * collision.get_normal()
			invul_timer = INVUL_TIME
	
	# Player gets transparent when invul_timer > 0
	if invul_timer > 0:
		$AnimatedSprite2D.modulate.a = 0.5
	else:
		$AnimatedSprite2D.modulate.a = 1.0
	
	if velocity.x > 0:
		$AnimatedSprite2D.flip_h = false
	elif velocity.x < 0:
		$AnimatedSprite2D.flip_h = true
	
	if health <= 0:
		alive = false
		anim.play("Death")
		SoundDirector.get_node("DeathSound").play()
		await get_tree().create_timer(1.0).timeout
		$/root/Play.change_scene(preload("res://gameover.tscn"))
		queue_free()
	

