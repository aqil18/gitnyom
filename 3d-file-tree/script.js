import * as d3 from "d3";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// Function to traverse file structure and create nodes and links
function traverseFileStructure(fileStructure, nodes = [], links = [], parent = null) {
  const node = { id: fileStructure.path, group: fileStructure.type };
  nodes.push(node);

  if (parent) {
    links.push({ source: parent.path, target: fileStructure.path });
  }

  if (fileStructure.type === "tree" && fileStructure.contents) {
    fileStructure.contents.forEach((child) => {
      traverseFileStructure(child, nodes, links, fileStructure);
    });
  }

  return { nodes, links };
}

// Fetch file structure from the server
async function fetchFileStructure(url) {
  const data = {
    "name": "project-root",
    "path": "/",
    "url": "http://localhost:8000/api/project-root",
    "type": "tree",
    "contents": [
      {
        "name": "index.html",
        "path": "/index.html",
        "url": "http://localhost:8000/api/files/index.html",
        "type": "blob"
      },
      {
        "name": "scripts",
        "path": "/scripts",
        "url": "http://localhost:8000/api/files/scripts",
        "type": "tree",
        "contents": [
          {
            "name": "app.js",
            "path": "/scripts/app.js",
            "url": "http://localhost:8000/api/files/scripts/app.js",
            "type": "blob"
          },
          {
            "name": "utils.js",
            "path": "/scripts/utils.js",
            "url": "http://localhost:8000/api/files/scripts/utils.js",
            "type": "blob"
          }
        ]
      },
      {
        "name": "styles",
        "path": "/styles",
        "url": "http://localhost:8000/api/files/styles",
        "type": "tree",
        "contents": [
          {
            "name": "main.css",
            "path": "/styles/main.css",
            "url": "http://localhost:8000/api/files/styles/main.css",
            "type": "blob"
          }
        ]
      }
    ]
  }

  // Having issues with cors!!
  // const response = await fetch(url)
  
  // data = response.json();
  
  // if (!response.ok) {
  //   throw new Error(`Failed to fetch data: ${response.status}`);
  //}

  return data;
}

// Initialize the graph
async function initGraph() {
  const fileStructure = await fetchFileStructure("http://localhost:8000");
  console.log(fileStructure)
  const { nodes, links } = traverseFileStructure(fileStructure);

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
  scene.background = new THREE.Color(0xffffff);

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
    blob: new THREE.MeshBasicMaterial({ color: 0x00f0ff }),
    tree: new THREE.MeshBasicMaterial({ color: 0xff0000 }),
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
    console.log(link)
    const source = link.source;
    const target = link.target

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
  function showPopup(name, content, x, y) {
    const popup = document.createElement("div");
    popup.style.position = "absolute";
    popup.style.left = `${x}px`;
    popup.style.top = `${y}px`;
    popup.style.padding = "10px";
    popup.style.backgroundColor = "white";
    popup.style.border = "1px solid black";
    popup.style.zIndex = 1000;
    popup.style.maxWidth = "200px";
    popup.style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.1)";

    const titleElement = document.createElement("div");
    titleElement.style.fontWeight = "bold";
    titleElement.style.marginBottom = "5px";
    titleElement.innerText = name;

    const contentElement = document.createElement("div");
    contentElement.innerText = content;

    popup.appendChild(titleElement);
    popup.appendChild(contentElement);

    document.body.appendChild(popup);


    /// !!!! Issues trying to close popup
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
      
      showPopup(nodeId, nodeId + "'s popup", event.clientX, event.clientY);
      
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
}

// Initialize the graph
initGraph();
