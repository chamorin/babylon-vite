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
    var canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.id = "gameCanvas";
    document.body.appendChild(canvas);

    // Initialize babylon scene and engine
    var engine = new Engine(canvas, true);
    var scene = new Scene(engine);

    // Shaders
    Effect.ShadersStore["sampleVertexShader"] = vertex;
    Effect.ShadersStore["sampleFragmentShader"] = fragment;

    // Cameras
    var camera: ArcRotateCamera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, Vector3.Zero(), scene);
    camera.attachControl(canvas, true);

    // Lights
    var light1: HemisphericLight = new HemisphericLight("light1", new Vector3(1, 1, 0), scene);

    // Meshes
    var box: Mesh = MeshBuilder.CreateBox("box", { size: 0.8 }, scene);

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
        uniforms: ["world", "worldView", "worldViewProjection", "view", "projection"]
      }
    );

    // Apply Materials
    var texture = new Texture("textures/amiga.jpg", scene);
    shaderMaterial.setTexture("textureSampler", texture);
    shaderMaterial.backFaceCulling = false;
    box.material = shaderMaterial;

    // Transformations

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

    // Run the main render loop
    engine.runRenderLoop(() => {
      scene.render();
    });
  }
}

new App();