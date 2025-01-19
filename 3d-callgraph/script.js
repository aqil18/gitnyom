import * as THREE from 'three';

// Load data
fetch('data.json')
  .then(response => response.json())
  .then(data => {
    const { nodes, links } = data;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Add nodes
    const nodeObjects = {};
    const geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const materials = {
      file: new THREE.MeshBasicMaterial({ color: 0x0000ff }),
      function: new THREE.MeshBasicMaterial({ color: 0xff0000 }),
    };

    nodes.forEach(node => {
      const material = materials[node.group] || new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.set(Math.random() * 10 - 5, Math.random() * 10 - 5, Math.random() * 10 - 5);
      sphere.userData = { id: node.id }; // Store node ID
      nodeObjects[node.id] = sphere;
      scene.add(sphere);
    });

    // Add links
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });
    links.forEach(link => {
      const source = nodeObjects[link.source];
      const target = nodeObjects[link.target];

      if (source && target) {
        const points = [source.position, target.position];
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(lineGeometry, lineMaterial);
        scene.add(line);
      }
    });

    // Camera and animation
    camera.position.z = 20;

    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }

    animate();
  })
  .catch(error => console.error('Error loading data:', error));
