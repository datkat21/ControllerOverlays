export default function controllerConfig(mapping, axesMapping) {
  // Button mappings (GCN)
  mapping.set(1, "Button_A");
  mapping.set(2, "Button_B");
  mapping.set(0, "Button_X");
  mapping.set(3, "Button_Y");
  mapping.set(7, ["Button_Z", "Button_ZR"]); // for "xbox"-like compatibility
  mapping.set(9, "Button_Start");

  // D-pad
  mapping.set(12, "Dpad_Up");
  mapping.set(13, "Dpad_Right");
  mapping.set(14, "Dpad_Down");
  mapping.set(15, "Dpad_Left");

  /*
  Axes : GCN

  0 - A-stick X
  1 - A-stick Y

  5 - C-stick X
  2 - C-stick Y

  3 - Trigger L
  4 - Trigger R

  in Controller.js, the axes are presumably +1'd
  and under "MISCAXIS_N" in button hold events.
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
    multipliers: [1.38, 1.15],
  });
  // C-Stick
  axesMapping.set(5, {
    id: "Analog_C_Stick",
    type: "x",
    sibling: 2,
    deadZone: [-0.13, 0.13],
    multipliers: [1.44, 1.15],
  });
  axesMapping.set(2, {
    id: "Analog_C_Stick",
    type: "y",
    sibling: 5,
    deadZone: [-0.13, 0.13],
    multipliers: [1.54, 1.14],
  });

  function triggerAxeHandlerMaker(id) {
    return function handler(axe) {
      window.svg.querySelector(`#${id}`).style.transform = `translateY(${
        axe.value * 2
      }%)`;
      const brightness = 1 - ((axe.value + 1) / 2) * 0.5;
      const contrast = 1 + ((axe.value + 1) / 2) * 0.23;
      window.svg.querySelector(
        `#${id}`
      ).style.filter = `brightness(${brightness}) contrast(${contrast})`;
    };
  }

  // Triggers
  axesMapping.set(3, {
    id: "Button_L",
    type: "trigger",
    handler: triggerAxeHandlerMaker("Button_L"),
  });
  axesMapping.set(4, {
    id: "Button_R",
    type: "trigger",
    handler: triggerAxeHandlerMaker("Button_R"),
  });
}
