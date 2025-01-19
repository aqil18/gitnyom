import * as d3 from "d3";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// Graph data (replace with actual data or fetch dynamically)
const nodes = [
  { id: "file1", group: "file" },
  { id: "file2", group: "file" },
  { id: "folder1", group: "folder" },
  { id: "folder2", group: "folder" },
];

const links = [
  { source: "file1", target: "folder1" },
  { source: "folder1", target: "folder2" },
  { source: "file2", target: "folder1" },
];

const summaries = {
  file1: "File 1 Summary",
  file2: "File 2 Summary"
}

// D3 Force Layout
const simulation = d3.forceSimulation(nodes)
  .force("link", d3.forceLink(links).id((d) => d.id).distance(100))
  .force("charge", d3.forceManyBody().strength(-200))
  .force("center", d3.forceCenter(0, 0))
  .stop();

// Run simulation to stabilize
for (let i = 0; i < 300; ++i) simulation.tick();

// Add random Z-coordinates for 3D visualization
nodes.forEach((node) => {
  node.z = Math.random() * 200 - 100;
});

// Three.js Setup
const scene = new THREE.Scene();
scene.background = new THREE.Color( 0xffffff);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Node Materials
const geometry = new THREE.SphereGeometry(5, 32, 32);
const materials = {
  file: new THREE.MeshBasicMaterial({ color: 0x00f0ff }),
  folder: new THREE.MeshBasicMaterial({ color: 0xff0000 }),
};

// Add Nodes to Scene
const nodeObjects = {};
nodes.forEach((node) => {
  const material = materials[node.group] || new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const sphere = new THREE.Mesh(geometry, material);
  sphere.position.set(node.x, node.y, node.z);
  nodeObjects[node.id] = sphere;
  scene.add(sphere);
});

// Add Links to Scene
const lineMaterial = new THREE.LineBasicMaterial({
  color: 0x00ff00, // Green
  opacity: 1.0,
  transparent: true
});


links.forEach((link) => {
  const source = link.source;
  const target = link.target;

  if (source && target) {
    const points = [
      new THREE.Vector3(source.x, source.y, source.z),
      new THREE.Vector3(target.x, target.y, target.z),
    ];
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(lineGeometry, lineMaterial);
    scene.add(line);
  }
});

// Camera Position
camera.position.z = 500;

// Handle Window Resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Initialize OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Smooth controls
controls.dampingFactor = 0.1;
controls.screenSpacePanning = false; // Disables panning out of the screen

// Function to create and show popup
function showPopup(content, x, y) {

  console.log("HEKO")
  const popup = document.createElement("div");
  popup.style.position = "absolute";
  popup.style.left = `${x}px`;
  popup.style.top = `${y}px`;
  popup.style.padding = "10px";
  popup.style.backgroundColor = "white";
  popup.style.border = "1px solid black";
  popup.style.zIndex = 1000;
  popup.innerHTML = content;

  document.body.appendChild(popup);

  // // Remove popup on click outside
  // document.addEventListener("click", function removePopup(event) {
  //   if (!popup.contains(event.target)) {
  //     document.body.removeChild(popup);
  //     document.removeEventListener("click", removePopup);
  //   }
  // });
}

// Add event listener for node clicks
renderer.domElement.addEventListener("click", (event) => {
  // Calculate mouse position in normalized device coordinates (-1 to +1)
  const mouse = new THREE.Vector2(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1
  );

  // Raycaster to find intersected objects
  const raycaster = new THREE.Raycaster();
  
  // Casts a ray
  raycaster.setFromCamera(mouse, camera);



  // Finds all objects intersecting with ray of mouse click
  const intersects = raycaster.intersectObjects(Object.values(nodeObjects));

  


  if (intersects.length > 0) {
    // Gives intersected object
    const intersectedNode = intersects[0].object;

    // Finds the matching node object in nodeObjects to get the nodeId
    const nodeId = Object.keys(nodeObjects).find(key =>
      nodeObjects[key] === intersectedNode);

    // If node has a summary, show popup
    if (summaries[nodeId]) {
      console.log(event.clientX)
      console.log(event.clientY)

      showPopup(summaries[nodeId], event.clientX, event.clientY);
    }
  }
});

// Animation Loop
function animate() {
  requestAnimationFrame(animate);

  // Update the controls
  controls.update();

  renderer.render(scene, camera);
}

animate();
