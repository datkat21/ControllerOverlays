import Html from "https://unpkg.com/@datkat21/html";

const version_info = `v1.0.4`;

window.addEventListener("load", async () => {
  function ready(svg) {
    window.svg = svg;
    const { GamepadListener } = window.gamepad;

    const listener = new GamepadListener({
      deadZone: 0.05,
      precision: 3,
    });

    listener.on("gamepad:connected", (event) => {
      console.log("Connected a new gamepad.");

      setup();
    });

    listener.on("gamepad:button", (event) => {
      const {
        index, // Gamepad index: Number [0-3].
        button, // Button index: Number [0-N].
        value, // Current value: Number between 0 and 1. Float in analog mode, integer otherwise.
        pressed, // Native GamepadButton pressed value: Boolean.
        gamepad, // Native Gamepad object
      } = event.detail;

      handleInput(pressed === true ? buttonTypes.Press : buttonTypes.Rel, {
        type: "btn",
        button,
        value,
      });
    });

    listener.on("gamepad:axis", (event) => {
      const {
        index, // Gamepad index: Number [0-3].
        axis, // Axis index: Number [0-N].
        value, // Current value: Number between -1 and 1. Float in analog mode, integer otherwise.
        gamepad, // Native Gamepad object
      } = event.detail;

      handleInput(buttonTypes.Hold, {
        type: "axe",
        axis,
        value,
      });
    });

    listener.start();
  }

  let setUp = false;

  const buttonTypes = {
    Press: 0,
    0: "Press",
    Hold: 1,
    1: "Hold",
    Rel: 2,
    2: "Rel",
  };

  let axeValues = new Map();

  function calcPercent(value, axeId) {
    // value from 0 to 1 as a 5%

    /*
          0   -> 0
          0.25-> 1.25
          0.5 -> 2.5
          1   -> 5
          */
    const val = value * 5;
    // Also to support axe multipliers like Dolphin
    const axe = axesMapping.get(axeId);
    const mul = axe.multipliers !== undefined ? axe.multipliers : [1, 1],
      dzn = axe.deadZone !== undefined ? axe.deadZone : 0;
    if (mul == undefined) return val;

    let calc = val < 0 ? val * mul[0] : val * mul[1];
    let res = 0;

    if (calc > dzn[1]) res = calc;
    if (calc < dzn[0]) res = calc;

    return calc;
  }

  function handleInput(
    type,
    button = { value: null, type: null, button: null }
  ) {
    if (button.type === "btn") {
      const btn = mapping.get(button.button);
      const s = svg.querySelector(`#${btn}`);

      if (btn === undefined) return;
      if (Array.isArray(btn)) {
        for (let i = 0; i < btn.length; i++) {
          const m = svg.querySelector(`#${btn[i]}`);
          if (m === null) continue;

          if (button.value === 1) {
            m.classList.add("pressed");
          } else {
            m.classList.remove("pressed");
          }
        }
        return;
      }
      if (s === null) return;

      if (button.value === 1) {
        svg.querySelector(`#${btn}`).classList.add("pressed");
      } else {
        svg.querySelector(`#${btn}`).classList.remove("pressed");
      }
    } else if (button.type === "axe") {
      // axis
      const axeLookup = button.axis;

      const axe = axesMapping.get(axeLookup);
      if (axe == undefined) return;

      // Some axes may have their own handler functions.
      if (axe.handler) {
        return axe.handler(button);
      }

      const s = svg.querySelector(`#${axe.id}`);
      if (s === null) return;

      switch (axe.type) {
        case "x":
          axeValues.set(axeLookup, button.value);

          const valueY = axeValues.get(axe.sibling) || 0;

          if (type === buttonTypes.Hold) {
            svg.querySelector(
              `#${axe.id}`
            ).style.transform = `translate(${calcPercent(
              button.value,
              axeLookup
            )}%, ${calcPercent(valueY, axe.sibling)}%)`;
          }
          break;
        case "y":
          axeValues.set(axeLookup, button.value);

          const valueX = axeValues.get(axe.sibling) || 0;

          if (type === buttonTypes.Hold) {
            svg.querySelector(
              `#${axe.id}`
            ).style.transform = `translate(${calcPercent(
              valueX,
              axe.sibling
            )}%, ${calcPercent(button.value, axeLookup)}%)`;
          }
          break;
        case "trigger":
          if (button.value > 0.35) {
            svg.querySelector(`#${axe.id}`).classList.add("pressed");
          } else if (button.value < 0.35) {
            svg.querySelector(`#${axe.id}`).classList.remove("pressed");
          }
          break;
      }
    }
  }

  function setup() {
    if (setUp === true) return;
    setUp = true;

    document.querySelectorAll(".svg").forEach((s) => {
      s.classList.remove("visible");
    });

    const svg = document.querySelector(`svg`);
    svg.classList.add("visible");
    window.svg = svg;
  }

  const settings = {
    // Host controller type. (This only supports one controller type so mixing won't work)
    type: null,
    // The style of controller to use. Only "gcn" for the moment
    style: null,
    // The skin to use. Default is null (uses main one)
    skin: null,
    // Host controller index (0-3 for 4 controllers)
    index: null,
  };

  const search = new URLSearchParams(location.search);

  if (search.get("type") != null) {
    settings.type = search.get("type");
  }
  if (search.get("style") != null) {
    settings.style = search.get("style");
  }
  if (search.get("skin") != null) {
    settings.skin = search.get("skin");
  }

  function showSetupModal(
    queryParameter,
    optionsToChoose,
    backOption = null,
    description = `Include the query parameter "${queryParameter}" with one of the following:`
  ) {
    const s = new URLSearchParams(search.toString());
    s.set(queryParameter, optionsToChoose[0]);

    let backOptionHtml = "";

    if (backOption !== null) {
      const sr = new URLSearchParams(search.toString());
      sr.delete(backOption);
      backOptionHtml = `<a href="?${sr.toString()}">&larr; Back to ${backOption}</a>`;
    }

    popupModal(
      `${description}\n\n${optionsToChoose
        .map((l) => {
          const s = new URLSearchParams(search.toString());
          s.set(queryParameter, l);
          return `<a href="?${s.toString()}">${l}</a>`;
        })
        .join(
          ", "
        )}\n\nExample: <a href="?${s.toString()}">${s.toString()}</a>\n\n${backOptionHtml}`,
      "Setup"
    );
  }

  if (settings.type === null) {
    const typeList = await import("./types/type_list.js");

    return showSetupModal(
      "type",
      typeList.default,
      null,
      "Select the controller variation:"
    );
  }
  if (settings.style === null) {
    const styleList = await import("./styles/style_list.js");

    return showSetupModal(
      "style",
      styleList.default,
      "type",
      `Choose an overlay style:`
    );
  }
  if (settings.skin === null) {
    const styleData = await import(`./styles/${settings.style}/info.js`);

    showSetupModal(
      "skin",
      Object.keys(styleData.default.skins),
      "style",
      `Select a skin:`
    );
  }

  const mapping = new Map();
  const axesMapping = new Map();

  function popupModal(info, title = null) {
    const div = new Html("div")
      .styleJs({
        position: "fixed",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#0009",
        backgroundImage: "url(./assets/background.png)",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      })
      .appendTo("body");

    if (title !== null) {
      div.append(new Html("h1").html(title.replace(/\n/g, "<br>")));
    }

    div.appendMany(
      new Html("p").html(info.replace(/\n/g, "<br>")),
      new Html("a")
        .styleJs({
          position: "absolute",
          bottom: "0.8rem",
          right: "0.8rem",
        })
        .attr({
          href: "https://github.com/datkat21/ControllerOverlays",
          target: "_blank",
        })
        .text(`ControllerOverlays ${version_info}`)
    );
  }

  // Load the Type
  const type = await import(`./types/${settings.type}.js`).catch(
    (j) => undefined
  );

  if (type !== undefined) {
    // Set up the controller inputs
    if (typeof type.default === "function") {
      type.default(mapping, axesMapping);
    }

    // Load the Style
    const style = await import(`./styles/${settings.style}/info.js`).catch(
      (j) => undefined
    );

    if (style !== undefined) {
      // Set up the controller style
      let svgToLoad = style.default.main;

      if (settings.skin !== null) {
        if (settings.skin in style.default.skins) {
          svgToLoad = style.default.skins[settings.skin];
        } else {
          return popupModal(
            `Skin does not exist!\n\nSkin list for ${
              style.default.name
            }:\n\n${Object.keys(style.default.skins).join(", ")}`
          );
        }
      }

      const svg = await fetch(`./styles/${settings.style}/${svgToLoad}`)
        .then((t) => t.text())
        .catch((u) => undefined);

      if (svg === undefined) {
        return popupModal("Failed to load controller SVG.");
      }

      Html.qs(".svg-placeholder").append(new Html('div').class('svg-wrapper').html(svg));

      const svgHtml = document.querySelector("svg");

      ready(svgHtml);
    } else {
      return popupModal("Unable to load controller style!");
    }
  } else {
    return popupModal("Unable to load input type!");
  }
});
