extends Node2D

@export var speed = 250.0
@export var distance = 500.0
@export var updown = false
@export var reverse = false
var travelled = 0
var direction = 1
var alive = true
# Called when the node enters the scene tree for the first time.
func _ready():
	$AnimatedSprite2D.play("Move")


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	pass
func death():
	alive = false
	$PlayerDeathDetection/CollisionShape2D.set_deferred("disabled",true)
	$MobDeathDetection/CollisionShape2D.set_deferred("disabled",true)
	Game.Gold += 3
	Utils.saveGame()
	$AnimatedSprite2D.play("Death")
	await $AnimatedSprite2D.animation_finished
	queue_free()
	
func _physics_process(delta):
	if not alive:
		return
	if not updown :	
		if not reverse:
			$AnimatedSprite2D.flip_h = direction > 0
			position += Vector2(minf(speed*delta,distance-travelled)*direction,0.0)
		else:
			$AnimatedSprite2D.flip_h = direction < 0
			position += Vector2(-minf(speed*delta,distance-travelled)*direction,0.0)
		travelled += speed * delta
	elif updown:
		if not reverse:	
			position += Vector2(0.0,-minf(speed*delta,distance-travelled)*direction)
		else:
			position += Vector2(0.0,minf(speed*delta,distance-travelled)*direction)
		travelled += speed * delta
	if travelled >= distance:
		travelled = 0.0
		direction = -direction
		
	


func _on_player_death_detection_body_entered(body):
		if body.name == "Player" and alive:
			body.health -= 3
			death()


func _on_mob_death_detection_body_entered(body):
	if body.name == "Player" and alive:
		if body.low_gravity_mode:
			body.velocity.y = body.JUMP_VELOCITY * 0.75 * 0.2
		else:
			body.velocity.y = body.JUMP_VELOCITY * 0.75
		SoundDirector.get_node('BounceSound').play()
		death()
