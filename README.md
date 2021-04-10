# Runga
Runga is a zero dependency library for rendering dynamic 2d scenes on html canvas. The library makes it possible to code layers of scene separatly from each other.


## Install
```bash
npm i runga
```

## Usage
### 1. Create layers for your scene

Lets suppose you want to draw the sun and clouds on blue sky. You can create three new layers with passing rendrer functions into constructors.
```ts
import { Layer } from 'runga';

const sky = new Layer(skyRenderFunction);
const sun = new Layer(sunRenderFunction);
const clouds = new Layer(cloudsRenderFunction);
```

Render function is a function which will receive an object. The field `selfCanvas` is an HTMLCanvasElement where you must draw the content of clouds layer.
```ts
function cloudsRenderFunction({selfCanvas}) {
	/* draw clouds here */
}
```

### 2. Gather layers to a scene

Now you need to draw all your layers to one canvas. Create an instanse of scene and pass layers to it.
```ts
import { Scene } from 'runga';

const scene = new Scene([sky, sun, clouds]);
```

Class `Scene` extends standard `HTMLCanvasElement` so you will just append it to DOM.

```ts
document.body.append(scene);
```
When you create an instance of scene, it asks to each inside layer to render. Your render functions will be called with `selfCanvas` elements which have the same size of scene. If you want to change the size of scene you must use `setSize` method instead `width` and `height` fields. It needs to restart render cycle. Your render functions of layers will be called with new size.
```ts
scene.setSize({width: 150, height: 600});
```

### 3. Add dynamic to the scene
Now you want, say, to change the `x`-position of the sun programmatically. You can define the sun layer with type of data used in this layer and you can set new data.
```ts
const sun = new Layer<{x: number}>(sunRenderFunction);

sun.setData({x: 60});
```
And you will receive data to the render fucntion argument:
```ts
function cloudsRenderFunction({data, selfCanvas}) {
	data // {x: 60}
	/* draw clouds here */
}
```
You may want to call `setData` with some events and it can happen more often then the browser renders. Runga takes care about it. Runga uses [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) so each rander function will be called as much as it needs.
