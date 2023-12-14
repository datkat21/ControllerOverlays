export default function controllerConfig(mapping, axesMapping) {
  // WCC (JC-W01U)
  mapping.set(0, "Button_X");
  mapping.set(1, "Button_Y");
  mapping.set(2, "Button_A");
  mapping.set(3, "Button_B");
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
  Axes : WCC

  0 - A-stick X
  1 - A-stick Y

  2 - C-stick X
  5 - C-stick Y

  9 - D-Pad (odd...)
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
    sibling: 5,
    deadZone: [-0.13, 0.13],
  });
  axesMapping.set(5, {
    id: "Analog_C_Stick",
    type: "y",
    sibling: 2,
    deadZone: [-0.13, 0.13],
  });

  function reset() {
    window.svg
      .querySelectorAll("#Dpad_Down,#Dpad_Up,#Dpad_Left,#Dpad_Right")
      .forEach((e) => {
        e.classList.remove("pressed");
      });
  }
  function press(id) {
    window.svg.querySelector(`#${id}`).classList.add("pressed");
  }

  // Example D-pad with odd behavior using switch statements.
  axesMapping.set(9, {
    handler: function (axe) {
      reset();
      switch (axe.value) {
        case -1:
          // Up
          press("Dpad_Up");
          break;
        case 0.143:
          // Down
          press("Dpad_Down");
          break;
        case 0.714:
          // Left
          press("Dpad_Left");
          break;
        case -0.429:
          // Right
          press("Dpad_Right");
          break;
        case 1:
          // Up + Left
          press("Dpad_Up");
          press("Dpad_Left");
          break;
        case -0.714:
          // Up + Right
          press("Dpad_Up");
          press("Dpad_Right");
          break;
        case -0.143:
          // Right + Down
          press("Dpad_Down");
          press("Dpad_Right");
          break;
        case 0.429:
          // Left + Down
          press("Dpad_Down");
          press("Dpad_Left");
          break;
        case 3.286:
          // Resting position
          break;
      }
    },
    // id: "Analog_C_Stick",
    // type: "y",
    // sibling: 2,
    // deadZone: [-0.13, 0.13],
  });
}
