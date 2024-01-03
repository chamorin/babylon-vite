import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import {
  ShaderMaterial,
  Engine,
  Texture,
  Effect,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  Mesh,
  MeshBuilder,
  ShadowGenerator
} from "@babylonjs/core";

import fragment from "./assets/shaders/sample.fragment.glsl?raw";
import vertex from "./assets/shaders/sample.vertex.glsl?raw";

import "./style.css";

class App {
  constructor() {
    // Create the canvas html element and attach it to the webpage
    let canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.id = "gameCanvas";
    document.body.appendChild(canvas);

    // Initialize babylon scene and engine
    let engine = new Engine(canvas, true);
    let scene = new Scene(engine);

    // Shaders
    Effect.ShadersStore["sampleVertexShader"] = vertex;
    Effect.ShadersStore["sampleFragmentShader"] = fragment;

    // Cameras
    let camera: ArcRotateCamera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, Vector3.Zero(), scene);
    camera.attachControl(canvas, true);

    // Lights
    let light: HemisphericLight = new HemisphericLight("light1", new Vector3(1, 1, 0), scene);

    // Meshes
    let torusKnot: Mesh = MeshBuilder.CreateTorusKnot("torus_knot", { radialSegments: 100 }, scene);

    // Materials
    const shaderMaterial = new ShaderMaterial(
      "shader",
      scene,
      {
        vertex: "sample",
        fragment: "sample",
      },
      {
        attributes: ["position", "normal", "uv"],
        uniforms: ["world", "worldView", "worldViewProjection", "view", "projection", "time", "direction"],
        samplers: ["textureSampler"],
      }
    );

    // Apply Materials
    let texture = new Texture("textures/amiga.jpg", scene);
    shaderMaterial.setTexture("textureSampler", texture);
    shaderMaterial.backFaceCulling = false;
    torusKnot.material = shaderMaterial;

    // Transformations
    camera.setPosition(new Vector3(0, 0, 10));

    // Shadows

    // Hide/show the Inspector
    window.addEventListener("keydown", (ev) => {
      // Shift+Ctrl+Alt+I
      if (ev.key === '`') {
        if (scene.debugLayer.isVisible()) {
          scene.debugLayer.hide();
        } else {
          scene.debugLayer.show();
        }
      }
    });

    let time = 0;

    // Run the main render loop
    engine.runRenderLoop(() => {

      // Set shader uniforms
      shaderMaterial.setFloat("time", time);
      time += 0.02;

      scene.render();
    });
  }
}

new App();