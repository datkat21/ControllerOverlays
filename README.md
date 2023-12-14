# Controller Overlays

This is a basic HTML app to display a controller overlay SVG image and control it with your controller. Intended to be used with OBS and other software.

## Setup

I'm going to admit that this thing is a bit of a mess, but here's what you should know:

- Open index.html with Live Server
- Configure options by changing `type` and `style` URL parameters (e.g. `http://localhost:5500/?type=gameCube&style=gcn`)

## Improving

There's probably a much better way of importing SVGs than placing them inside of divs like that, but I was trying to take the easy route to make this quickly. It's pretty modular so you can add your own buttons and overlays if you know some web development skills.

## Library

This now uses [gamepad.js](https://github.com/Tom32i/gamepad.js) instead of [Controller.js](https://github.com/samiare/Controller.js) and [gamecontrol.js](https://github.com/alvaromontoro/gamecontroller.js) as I needed exact gamepad inputs which I couldn't figure out with the other libraries.

## Examples & Lookup

There are a couple built-in types and styles to configure, here are some examples:

`?type=xbox&style=nsp` - Uses Xbox controller as input source, and shows a nintendo switch pro controller.   
`?type=gameCube&style=gcn` - Uses GameCube controller as input source (only Mayflash adapter GameCube inputs are set up at the moment), and shows a GameCube controller.

### Type list (host controller types)

- `gameCube`: GameCube controllers using Mayflash GC Controller Adapter set to "PC" mode
- `xbox`: Generic XInput controller support
- `wcc`: Wii Classic Controller USB adaptor support (specifically the JC-W01U)

### Style list (controller styles)

Styles should follow a three-character identifier for consistency.

- `n64`: Nintendo 64 (Works best with `xbox` controller type)
- `gcn`: GameCube (made for `gameCube` controller type)
- `wcc`: Wii Classic Controller (made for `wcc` controller type)
- `nsp`: Nintendo Switch Pro Controller (Works best with most controller types)

Most controller styles should be interchangeable, albeit with a few minor differences between each different type.

### Skin list (style dependent)

This allows extra configuration (e.g. color), and is dependent on the style that is used. This uses query parameter `skin`. This can also be done with the new configuration menu.

- `gcn`:
  - `black`   
  - `indigo`   
  - `silver`   
  - `orange`   
  - `aqua`   
- `n64`:
  - `gray`   
  - `black`   
- `nsp`:
  - `gray`   
  - `dark`
- `wcc`:
  - `white`   
  - `gray`   
  - `black`   
- `ps4`
  - `gray`

You can find skin preview images in [the changelog](CHANGELOG.md#new-skins-in-v102).