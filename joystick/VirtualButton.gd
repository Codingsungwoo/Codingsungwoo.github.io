extends Control

enum Visibility_mode {
	ALWAYS, ## Always visible
	TOUCHSCREEN_ONLY ## Visible on touch screens only
}

@export var visibility_mode := Visibility_mode.ALWAYS

@export var action_pressed = 'ui_accept'
@export var text = 'Jump'
# Called when the node enters the scene tree for the first time.

func _ready() -> void:
	if not DisplayServer.is_touchscreen_available() and visibility_mode == Visibility_mode.TOUCHSCREEN_ONLY:
		hide()


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	$Label.text = text



func _on_touch_screen_button_pressed():
	$TouchScreenButton.modulate.r = 0.6
	$TouchScreenButton.modulate.g = 0.6
	$TouchScreenButton.modulate.b = 0.6
	Input.action_press(action_pressed,1.0)


func _on_touch_screen_button_released():
	$TouchScreenButton.modulate.r = 1.0
	$TouchScreenButton.modulate.g = 1.0
	$TouchScreenButton.modulate.b = 1.0
	Input.action_release(action_pressed)
