import Application from "./classes/Application";
import Cube from "./classes/Cube";
import Torus from "./classes/Torus";
import Prism from "./classes/Prism";
import { hexToRGB, rgbToHex } from "./utils/color-utils";

import { degToRad, radToDeg } from "./utils/rotate-utils";

const canvas = document.getElementById("gl-display") as HTMLCanvasElement;
const gl = canvas.getContext("webgl2") as WebGL2RenderingContext;

if (!gl) {
  alert("Your browser does not support WebGL");
}

const app = new Application(canvas, gl);
const cube = new Cube(canvas, gl);
const torus = new Torus(canvas, gl);
const prism = new Prism(canvas, gl);

app.shapes.push(cube);
app.shapes.push(torus);
app.shapes.push(prism);

const render = () => {
  app.render();
  window.requestAnimationFrame(render);
};
window.requestAnimationFrame(render);

// rotation
const rotationSliders = ["rotation-x", "rotation-y", "rotation-z"].map(
  (e) => document.getElementById(e) as HTMLInputElement
);
rotationSliders.forEach((slider) => {
  if (!slider) {
    throw new Error("Slider not found");
  }
  slider.oninput = (e) => {
    if (slider.nextElementSibling) {
      slider.nextElementSibling.innerHTML = slider.value;
    }
    const degrees = rotationSliders.map((e) => e.valueAsNumber);
    app.selectedShape?.setRotate([
      degToRad(degrees[0]),
      degToRad(degrees[1]),
      degToRad(degrees[2]),
    ]);
  };
});

// translation
const translationSliders = [
  "translation-x",
  "translation-y",
  "translation-z",
].map((e) => document.getElementById(e) as HTMLInputElement);
translationSliders.forEach((slider) => {
  if (!slider) {
    throw new Error("Slider not found");
  }
  slider.oninput = (e) => {
    if (slider.nextElementSibling) {
      slider.nextElementSibling.innerHTML = slider.value;
    }
    const translations = translationSliders.map((e) => e.valueAsNumber);
    app.selectedShape?.setTranslation([
      translations[0],
      translations[1],
      translations[2],
    ]);
  };
});

// scaling
const scaleSliders = ["scale-x", "scale-y", "scale-z"].map(
  (e) => document.getElementById(e) as HTMLInputElement
);
scaleSliders.forEach((slider) => {
  if (!slider) {
    throw new Error("Slider not found");
  }
  slider.oninput = (e) => {
    if (slider.nextElementSibling) {
      slider.nextElementSibling.innerHTML = slider.value;
    }
    const scales = scaleSliders.map((e) => e.valueAsNumber);
    app.selectedShape?.setScale([scales[0], scales[1], scales[2]]);
  };
});

const objectSelector = document.getElementById(
  "selectedObject"
) as HTMLSelectElement;
if (!objectSelector) {
  throw new Error("Object selector not found");
}

const changeShape = (shapeIndex: number) => {
  app.setSelectedShape(shapeIndex);
  if (!app.selectedShape) return;
  for (let i = 0; i < 3; i++) {
    const { programInfo } = app.selectedShape;
    const { uTranslation, uRotation, uScale } = programInfo;
    if (
      uTranslation.type == "bool" ||
      uRotation.type == "bool" ||
      uScale.type == "bool"
    ) {
      continue;
    }
    translationSliders[i].nextElementSibling!.innerHTML = translationSliders[
      i
    ].value = uTranslation.value[i].toString() ?? "";
    rotationSliders[i]!.nextElementSibling!.innerHTML = rotationSliders[
      i
    ].value = radToDeg(uRotation.value[i]).toString() ?? "";
    scaleSliders[i]!.nextElementSibling!.innerHTML = scaleSliders[i].value =
      uScale.value[i].toString() ?? "";
  }
};
changeShape(0); // 0 is cube

objectSelector.onchange = () => {
  changeShape(parseInt(objectSelector.value));
};

const projectionSelector = document.getElementById(
  "selectedProjection"
) as HTMLInputElement;
projectionSelector.onchange = () => {
  app.setProjection(projectionSelector.value as Projection);

  const projSliders = [
    "orthographicSlider",
    "obliqueSlider",
    "perspectiveSlider",
  ];
  projSliders.forEach((divId) => {
    document.getElementById(divId)!.hidden = true;
  });
  document.getElementById(`${projectionSelector.value}Slider`)!.hidden = false;
};

const cameraRadiusSlider = document.getElementById(
  "camera-radius"
) as HTMLInputElement;
cameraRadiusSlider.oninput = () => {
  if (cameraRadiusSlider.nextElementSibling) {
    cameraRadiusSlider.nextElementSibling.innerHTML = cameraRadiusSlider.value;
  }
  app.setCameraRadius(parseFloat(cameraRadiusSlider.value));
};

const cameraAngleSlider = document.getElementById(
  "camera-angle"
) as HTMLInputElement;
cameraAngleSlider.oninput = (e) => {
  if (cameraAngleSlider.nextElementSibling) {
    cameraAngleSlider.nextElementSibling.innerHTML = cameraAngleSlider.value;
  }
  app.setCameraAngle(parseFloat(cameraAngleSlider.value));
};

// Lighting color changer
const ambientLightPicker = document.getElementById(
  "ambientLightColor"
) as HTMLInputElement;
ambientLightPicker.oninput = () => {
  app.setAmbientLightColor(hexToRGB(ambientLightPicker.value));
};

const directionalLightPicker = document.getElementById(
  "directionalLightColor"
) as HTMLInputElement;
directionalLightPicker.oninput = () => {
  app.setDirectionalLightColor(hexToRGB(directionalLightPicker.value));
};

// Lighting directional vector
const directionalSlider = [
  "directional-x",
  "directional-y",
  "directional-z",
].map((e) => document.getElementById(e) as HTMLInputElement);
directionalSlider.forEach((slider) => {
  if (!slider) {
    throw new Error("Slider not found");
  }
  slider.oninput = () => {
    if (slider.nextElementSibling) {
      slider.nextElementSibling.innerHTML = slider.value;
    }
    app.setDirectionalVector([
      directionalSlider[0].valueAsNumber,
      directionalSlider[1].valueAsNumber,
      directionalSlider[2].valueAsNumber,
    ]);
  };
});

const setSliderVal = (el: HTMLInputElement, value: string) => {
  el.value = value;
  if (el.nextElementSibling) {
    el.nextElementSibling.innerHTML = value;
  }
};

const toggleLightingBtn = document.getElementById(
  "toggleLighting"
) as HTMLInputElement;
let on = true;
toggleLightingBtn.onclick = () => {
  on = !on;
  // console.log(on);
  const onStr = on ? "ON" : "OFF";
  document.getElementById("lightingStatus")!.innerHTML = onStr;
  app.toggleLighting(on);
};

const resetBtn = document.getElementById("resetBtn") as HTMLInputElement;
const loadDefaults = () => {
  app.loadDefaults();
  ambientLightPicker.value = rgbToHex(app.lighting.ambientLightColor);
  directionalLightPicker.value = rgbToHex(app.lighting.directionalLightColor);
  setSliderVal(cameraRadiusSlider, app.camera.radius.toString());
  for (let i = 0; i < 3; i++) {
    setSliderVal(
      directionalSlider[i],
      app.lighting.directionalVector[i].toString()
    );
  }
  // TODO: Add cameraAngleSlider

  changeShape(0); // default is cube
};
resetBtn.onclick = loadDefaults;
loadDefaults();

const saveBtn = document.getElementById("saveBtn") as HTMLInputElement;
saveBtn.onclick = (e) => {
  const dataStr =
    "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(app));
  const downloadWidget = document.getElementById("downloadLink") as HTMLElement;
  downloadWidget.setAttribute("href", dataStr);
  downloadWidget.setAttribute("download", "data.json");
  downloadWidget.click();
};

const uploadBtn = document.getElementById("uploadBtn") as HTMLInputElement;
const loadBtn = document.getElementById("loadBtn") as HTMLInputElement;
loadBtn.onclick = (e) => {
  var files = uploadBtn.files as FileList;
  if (!files) return;
  var fr = new FileReader();
  if (!files.item(0)) return;
  fr.readAsText(files.item(0));
  fr.onload = (e) => {
    var res = JSON.parse(e.target.result);
    console.log(res);
    app.loadDataFromJSON(res);
    changeShape(0);
    // app.render();
  };
  // if (window.FileList && window.File && window.FileReader) {
  //   uploadBtn.click();
  // } else {
  //   alert("file upload not supported by your browser!");
  // }
};

// uploadBtn.onclick = (e) => {
//   var files = uploadBtn.files as FileList;
//   if (!files) return;
//   var fr = new FileReader();
//   if (!files.item(0)) return;
//   fr.readAsText(files.item(0));
//   fr.onload = (e) => {
//     var res = JSON.parse(e.target.result);
//     console.log(res);
//   };

//   // if (window.FileList && window.File && window.FileReader) {
//   //   uploadBtn.click();
//   // } else {
//   //   alert("file upload not supported by your browser!");
//   // }
// };

// uploadBtn.onclick = async (e: any) => {
//   const reader = new FileReader();
//   const file = e.target.files[0];

//   console.log(file);

//   reader.addEventListener("load", (e: any) => {
//     try {
//       var data = JSON.parse(e.target.result);
//     } catch (err) {
//       alert(`invalid json file data!\n${err}`);
//     }

//     app.loadDataFromJSON(data);
//   });

//   await reader.readAsText(file);
//   app.render();
//   // render(master);
// };
