# Runga

Runga is a zero dependency library for rendering dynamic 2d scenes on html canvas. The library makes it possible to code layers of scene separately from each other.

## Install

```bash
npm i runga
```

## Usage

### 1. Create layers for your app

Lets suppose you want to draw the sun and clouds on blue sky. You can create three new layers with passing rendrer functions to constructors.

```ts
import { Layer } from 'runga';

const sky = new Layer({ render: skyRenderFunction });
const sun = new Layer({ render: sunRenderFunction });
const clouds = new Layer({ render: cloudsRenderFunction });
```

Render function is a function which will receive an object. The field `canvas` is an HTMLCanvasElement where you have to draw the content of clouds layer.

```ts
function cloudsRenderFunction({ canvas }) {
  /* draw clouds here */
}
```

### 2. Gather layers to a scene

Now you need to draw all your layers to one canvas. Create an instance of Layer and pass your layers to it.

```ts
import { Layer } from 'runga';

const scene = new Layer({ children: [sky, sun, clouds] });
```

Class `Scene` extends standard `HTMLCanvasElement` so you will just append it to DOM.

```ts
document.body.append(scene);
```

When you create an instance of scene, it asks to each inside layer to render. Your render functions will be called with `canvas` elements which have the same size of scene.

### 3. Add dynamic to the scene

Now you want, say, to change the `x`-position of the sun programmatically. You can define the sun layer with type of data used in this layer and you can set new data.

```ts
const sun = new Layer<{ x: number }>({ render: sunRenderFunction });

sun.setData({ x: 60 });
```

And you will receive data to the render function argument:

```ts
function sunRenderFunction({ data, canvas }) {
  console.log(data); // {x: 60}
  /* draw the sun here */
}
```
