/**
 * Shared 3D Conversion nav menu data + renderer (same as homepage).
 */
(function (global) {
  const CONVERSION_3D_CATALOG = {
    mesh: [
      { input: "OBJ", outputs: ["STL", "FBX", "GLB/GLTF", "DAE", "3MF", "PLY"] },
      { input: "STL", outputs: ["OBJ", "FBX", "GLB/GLTF", "DAE", "3MF", "PLY"] },
      { input: "FBX", outputs: ["OBJ", "STL", "GLB/GLTF", "DAE", "3MF", "PLY"] },
      { input: "GLB/GLTF", outputs: ["OBJ", "STL", "FBX", "DAE", "3MF", "PLY"] },
      { input: "DAE", outputs: ["OBJ", "STL", "FBX", "GLB/GLTF", "3MF", "PLY"] },
      { input: "3DS", outputs: ["OBJ", "STL", "FBX", "GLB/GLTF", "DAE", "3MF", "PLY"] },
      { input: "X", outputs: ["OBJ", "STL", "FBX", "GLB/GLTF", "DAE", "3MF", "PLY"] },
      { input: "3MF", outputs: ["OBJ", "STL", "FBX", "GLB/GLTF", "DAE", "PLY"] },
      { input: "OFF", outputs: ["OBJ", "STL", "FBX", "GLB/GLTF", "DAE", "3MF", "PLY"] },
      { input: "AC3D", outputs: ["OBJ", "STL", "FBX", "GLB/GLTF", "DAE", "3MF", "PLY"] },
      { input: "PLY", outputs: ["OBJ", "STL", "FBX", "GLB/GLTF", "DAE", "3MF"] }
    ],
    cad: [
      { input: "STEP", outputs: ["GLB/GLTF", "FBX", "OBJ", "STL"] },
      { input: "IGES", outputs: ["STEP", "GLB/GLTF", "FBX", "OBJ", "STL"] },
      { input: "CATIA V5", outputs: ["STEP", "GLB/GLTF", "FBX", "OBJ", "STL"] },
      { input: "NX", outputs: ["STEP", "GLB/GLTF", "FBX", "OBJ", "STL"] },
      { input: "Creo", outputs: ["STEP", "GLB/GLTF", "FBX", "OBJ", "STL"] },
      { input: "SolidWorks", outputs: ["STEP", "GLB/GLTF", "FBX", "OBJ", "STL"] },
      { input: "Parasolid", outputs: ["STEP", "GLB/GLTF", "FBX", "OBJ", "STL"] },
      { input: "Inventor", outputs: ["STEP", "GLB/GLTF", "FBX", "OBJ", "STL"] },
      { input: "JT", outputs: ["STEP", "GLB/GLTF", "FBX", "OBJ", "STL"] },
      { input: "PRC", outputs: ["STEP", "GLB/GLTF", "FBX", "OBJ", "STL"] },
      { input: "ACIS", outputs: ["STEP", "GLB/GLTF", "FBX", "OBJ", "STL"] },
      { input: "Solid Edge", outputs: ["STEP", "GLB/GLTF", "FBX", "OBJ", "STL"] }
    ],
    bim: [
      { input: "IFC", outputs: ["GLB/GLTF", "FBX", "OBJ", "STL"] },
      { input: "Revit", outputs: ["GLB/GLTF", "FBX", "OBJ", "STL"] },
      { input: "Navisworks", outputs: ["GLB/GLTF", "FBX", "OBJ", "STL"] },
      { input: "DWF", outputs: ["GLB/GLTF", "FBX", "OBJ", "STL"] },
      { input: "AutoCAD", outputs: ["GLB/GLTF", "FBX", "OBJ", "STL"] },
      { input: "SKP", outputs: ["GLB/GLTF", "FBX", "OBJ", "STL"] }
    ]
  };

  const SCENE_LABELS = {
    mesh: "Mesh Formats",
    cad: "CAD Industrial",
    bim: "BIM & Architecture"
  };

  function build3DGroupedTitle(input, outputs) {
    return `${input} to ${outputs.join("/")}`;
  }

  function getGrouped3DConversions() {
    const items = [];
    Object.entries(CONVERSION_3D_CATALOG).forEach(([scene, groups]) => {
      groups.forEach((group) => {
        items.push({ scene, input: group.input, outputs: group.outputs, title: build3DGroupedTitle(group.input, group.outputs) });
      });
    });
    return items;
  }

  function render3DNavMenu(root) {
    const menu = (root || document).querySelector("[data-3d-nav-menu]");
    if (!menu) return;
    menu.innerHTML = `
      <div class="nav-dropdown-grid">
        ${Object.entries(CONVERSION_3D_CATALOG).map(([scene, groups]) => `
          <div class="nav-group">
            <p class="nav-group-title">${SCENE_LABELS[scene]}</p>
            <div class="nav-menu-list">
              ${groups.map((group) => {
                const title = build3DGroupedTitle(group.input, group.outputs);
                const short = group.input.length > 6 ? group.input.slice(0, 4) : group.input.slice(0, 3);
                return `<a class="nav-menu-link nav-menu-link--grouped" href="#" aria-label="${title}"><span class="nav-format-icon">${short}</span><span class="nav-menu-link-text"><strong>${group.input}</strong><span class="nav-menu-link-targets">to ${group.outputs.join(" / ")}</span></span></a>`;
              }).join("")}
            </div>
          </div>
        `).join("")}
      </div>
      <div class="nav-dropdown-footer">
        <a class="nav-all-tools-link" href="https://szdmt.com/en-US/all-products/" target="_blank" rel="noopener noreferrer">All Tools →</a>
      </div>
    `;
  }

  global.WPSSiteNav3D = {
    CONVERSION_3D_CATALOG,
    SCENE_LABELS,
    getGrouped3DConversions,
    render3DNavMenu
  };
})(typeof window !== "undefined" ? window : globalThis);
