extends Area2D

signal score

# Called when the node enters the scene tree for the first time.
@export var cherry = true
@export var banana = false
@export var apple = false
@export var grape = false
@export var orange = false
@export var watermelon = false
@export var goldenapple = false
@export var kiwi = false
@export var shinemusket = false
@export var coconut = false
@export var peach = false
@export var blueberry = false
@export var greenapple = false
@export var greenabanana = false
@export var brownbanana = false
@export var chill = false
@export var badfruit = false
@export var bad = false

# Called when the node enters the scene tree for the first time.
func _ready():
	if cherry:
		$AnimatedSprite2D.play('cherry')
	elif banana:
		$AnimatedSprite2D.play('banana')
	elif apple:
		$AnimatedSprite2D.play('apple')
	elif grape:
		$AnimatedSprite2D.play('grape')
	elif orange:
		$AnimatedSprite2D.play('orange')
	elif watermelon:
		$AnimatedSprite2D.play('watermelon')
	elif goldenapple:
		$AnimatedSprite2D.play('goldenapple')
	elif kiwi:
		$AnimatedSprite2D.play('kiwi')
	elif shinemusket:
		$AnimatedSprite2D.play('shinemusket')
	elif coconut:
		$AnimatedSprite2D.play('coconut')
	elif peach:
		$AnimatedSprite2D.play('peach')
	elif blueberry:
		$AnimatedSprite2D.play('blueberry')
	elif greenapple:
		$AnimatedSprite2D.play('greenapple')
	elif greenabanana:
		$AnimatedSprite2D.play('greenbanana')
	elif brownbanana:
		$AnimatedSprite2D.play('brownbanana')
	elif chill:
		$AnimatedSprite2D.play('chill')
	else:
		$AnimatedSprite2D.play('cherry')


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	pass


func _on_body_entered(body):
	if body.name != 'Player':
		return
		
	if not badfruit and not bad:
		score.emit()
		SoundDirector.get_node('ItemSound').play()
	elif bad == true:
		body.health -= 5
	else:
		body.health -= 2
	$AnimatedSprite2D.play("consumed")
	$CollisionShape2D.set_deferred('disabled', true)
	await $AnimatedSprite2D.animation_finished
	queue_free()
