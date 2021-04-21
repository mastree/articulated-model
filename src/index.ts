import Application from "@/classes/Application";
import { ChainCube } from "@/classes/Models/ChainCube";
import { Model } from "@/classes/Models/Model";
import { hexToRGB, rgbToHex } from "@/utils/color-utils";

import { degToRad, radToDeg } from "@/utils/rotate-utils";
import { TestModel } from "./classes/Models/TestModel";
import { HumanoidAngel } from "./classes/Models/HumanoidAngel";
import { Spider } from "./classes/Models/Spider";
import { Elephant } from "./classes/Models/Elephant";

const app = new Application();
app.models.push(new HumanoidAngel("Angel"));
app.models.push(new Spider("Spider"));
app.models.push(new Elephant("Elephant"));
// app.models.push(new ChainCube("Chain Cube"));
app.setSelectedModel(0);
app.setSelectedShader(1);
// app.loadEnvironment(app.shapes[0].program);

let prev = Date.now();
const render = (time: number) => {
  const delta = time - prev;
  app.articulateRender(delta);
  prev = time;
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
const populateObjectSelector = () => {
  while (objectSelector.length) {
    objectSelector.remove(0);
  }
  const { options: optionList } = objectSelector;
  const options = app.shapes.map((e, i) => {
    return {
      value: i,
      text: e.name,
    };
  });
  options.forEach((option) =>
    optionList.add(new Option(option.text, option.value.toString()))
  );
};
populateObjectSelector();

const shaderSelector = document.getElementById(
  "selectedShader"
) as HTMLSelectElement;
if (!shaderSelector) {
  throw new Error("Model selector not found");
}
shaderSelector.onchange = () => {
  app.setSelectedShader(parseInt(shaderSelector.value));
};

const modelSelector = document.getElementById(
  "selectedModel"
) as HTMLSelectElement;
if (!modelSelector) {
  throw new Error("Model selector not found");
}
const populateModelSelector = () => {
  while (modelSelector.length) {
    modelSelector.remove(0);
  }
  const { options: optionList } = modelSelector;
  const options = app.models.map((e, i) => {
    return {
      value: i,
      text: e.name,
    };
  });
  options.forEach((option) =>
    optionList.add(new Option(option.text, option.value.toString()))
  );
};
populateModelSelector();

const changeShape = (shapeIndex: number) => {
  app.setSelectedShape(shapeIndex);
  if (!app.selectedShape) return;
  for (let i = 0; i < 3; i++) {
    const { programInfo } = app.selectedShape;
    const { uTranslation, uRotation, uScale } = programInfo;

    translationSliders[i].nextElementSibling!.innerHTML = translationSliders[
      i
    ].value = uTranslation[i].toString() ?? "";
    rotationSliders[i]!.nextElementSibling!.innerHTML = rotationSliders[
      i
    ].value = radToDeg(uRotation[i]).toString() ?? "";
    scaleSliders[i]!.nextElementSibling!.innerHTML = scaleSliders[i].value =
      uScale[i].toString() ?? "";
  }
};
changeShape(0); // 0 is cube

objectSelector.onchange = () => {
  changeShape(parseInt(objectSelector.value));
};

const changeModel = (modelIndex: number) => {
  app.setSelectedModel(modelIndex);
};

modelSelector.onchange = () => {
  changeModel(parseInt(modelSelector.value));
  populateObjectSelector();
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
app.setProjection(projectionSelector.value as Projection);

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

const toggleAnimationBtn = document.getElementById(
  "toggleAnimation"
) as HTMLInputElement;
let onAnimation = false;
toggleAnimationBtn.onclick = () => {
  onAnimation = !onAnimation;
  const onStr = onAnimation ? "ON" : "OFF";
  document.getElementById("animationStatus")!.innerHTML = onStr;
  app.toggleAnimation(onAnimation);
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
