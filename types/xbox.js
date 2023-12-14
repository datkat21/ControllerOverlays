export default function controllerConfig(mapping, axesMapping) {
  // Generic XInput controller
  mapping.set(0, "Button_A");
  mapping.set(1, "Button_B");
  mapping.set(2, "Button_X");
  mapping.set(3, "Button_Y");
  // ZL and ZR (XInput buttons LB and RB) map to Z here on controllers with only one Z button.
  mapping.set(4, ["Button_ZL", "Button_Z"]);
  mapping.set(5, ["Button_ZR", "Button_Z"]); 
  mapping.set(6, "Button_L");
  mapping.set(7, "Button_R");
  mapping.set(8, "Button_Select");
  mapping.set(9, "Button_Start");

  mapping.set(10, "Analog_Stick");
  mapping.set(11, "Analog_C_Stick");

  // D-pad
  mapping.set(12, "Dpad_Up");
  mapping.set(15, "Dpad_Right");
  mapping.set(13, "Dpad_Down");
  mapping.set(14, "Dpad_Left");
  /*
  Axes : Xbox

  0 - A-stick X
  1 - A-stick Y

  2 - C-stick X
  3 - C-stick Y
  */
  // Analog-stick
  axesMapping.set(0, {
    id: "Analog_Stick",
    type: "x",
    sibling: 1,
    deadZone: [-0.03, 0.03],
  });
  axesMapping.set(1, {
    id: "Analog_Stick",
    type: "y",
    sibling: 0,
    deadZone: [-1, 1],
  });
  // C-Stick
  axesMapping.set(2, {
    id: "Analog_C_Stick",
    type: "x",
    sibling: 3,
    deadZone: [-0.13, 0.13],
  });
  axesMapping.set(3, {
    id: "Analog_C_Stick",
    type: "y",
    sibling: 2,
    deadZone: [-0.13, 0.13],
  });
}
