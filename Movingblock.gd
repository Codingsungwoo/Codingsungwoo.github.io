extends AnimatableBody2D

@export var speed = 250.0
@export var distance = 500.0
var travelled = 0
var direction = 1
@export var updown = false
@export var reverse = false
@export var stop = false
@export var travel_time = false
@export var travel_times = 1
# Called when the node enters the scene tree for the first time.
func _ready():
	$AnimatedSprite2D.play("default")


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	pass
	
func _physics_process(delta):
	if not updown and not stop:
		if not reverse:
			position += Vector2(minf(speed*delta,distance-travelled)*direction,0.0)
		else:
			position += Vector2(-minf(speed*delta,distance-travelled)*direction,0.0)
		travelled += speed * delta
	elif updown and not stop:
		if not reverse:
			position += Vector2(0.0,-minf(speed*delta,distance-travelled)*direction)
		else:
			position += Vector2(0.0,minf(speed*delta,distance-travelled)*direction)
		travelled += speed * delta
	
	if travelled >= distance:
		travelled = 0.0
		direction = -direction
	
func _on_area_2d_body_entered(body):
	if body.name == "Player":
		stop = false


