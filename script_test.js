import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Create a scene
const scene = new THREE.Scene();
const sphere = new THREE.SphereGeometry( 5, 32, 32 );
const taurus = new THREE.TorusKnotGeometry( 10, 3, 16, 100 );
const cube = new THREE.BoxGeometry( 10, 10, 10 );

const textureLoader = new THREE.TextureLoader();

// Adding a background
let textureEquirec = textureLoader.load( 'background.jpg' );
textureEquirec.mapping = THREE.EquirectangularReflectionMapping;
textureEquirec.colorSpace = THREE.SRGBColorSpace;

scene.background = textureEquirec;


const material = new THREE.MeshPhysicalMaterial( {
    clearcoat: 0.3,
    clearcoatRoughness: 0.25,
    color: 0xffffff,
    envMap: textureEquirec,
    envMapIntensity: 1.0,
    ior: 1.25,
    iridescence: 0.8,
    metalness: 0,
    roughness: 0.2,
    thickness: 5.0,
    transmission: 0.2,
    opacity : 1.0,
} );
const material2 = new THREE.MeshPhysicalMaterial( {
    clearcoat: 0.3,
    clearcoatRoughness: 0.25,
    color: 0xffffff,
    envMap: textureEquirec,
    envMapIntensity: 1.0,
    ior: 1.25,
    iridescence: 0.8,
    metalness: 0,
    roughness: 0.2,
    thickness: 5.0,
    transmission: 0.2,
    opacity : 1.0,
} );
const material3 = new THREE.MeshPhysicalMaterial( {
    clearcoat: 0.3,
    clearcoatRoughness: 0.25,
    color: 0xffffff,
    envMap: textureEquirec,
    envMapIntensity: 1.0,
    ior: 1.25,
    iridescence: 0.8,
    metalness: 0,
    roughness: 0.2,
    thickness: 5.0,
    transmission: 0.2,
    opacity : 1.0,
} );


const mesh = new THREE.Mesh(sphere, material);
const mesh2 = new THREE.Mesh(taurus, material2);
const mesh3 = new THREE.Mesh(cube, material3);


const light = new THREE.PointLight( 0xffffff, 10, 0, Math.PI / 4, 0.01 );

const light2 = new THREE.SpotLight( 0xffffff, 15, -1, Math.PI / 4, 0 );
const light3 = new THREE.PointLight( 0xffffff, 20, 0, Math.PI / 4, 0 );




const group = new THREE.Group();
group.add(mesh);
// group.add(mesh2);
// group.add(mesh3);
scene.add(group); 
scene.add(mesh2);
scene.add(mesh3);



// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 15);

// Import the canvas element
const canvas = document.getElementById('canvas');

// Create a WebGLRenderer and set its width and height
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    // Antialiasing is used to smooth the edges of what is rendered
    antialias: true,
    // Activate the support of transparency
    // alpha: true
});

renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio( window.devicePixelRatio );

// Create the controls
const controls = new OrbitControls(camera, canvas);

// Handle the window resize event
window.addEventListener('resize', () => {
    // Update the camera
    camera.aspect =  window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    // Update the renderer
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
});


mesh.position.set(0,0,-50)
mesh2.position.set(0,0,-30)
mesh3.position.set(0,0,30)
// Set the position of the light
light.position.set( 0, -15, 0 );
// // Make the light point toward an object (here, a sphere that we defined before)
light.target = mesh;
light2.position.set( 0, 15, 0 );
light2.target = mesh2;
light3.position.set( 0, 50, -10 );
light3.target = mesh3;
scene.add( light );
scene.add( light2 );

scene.add( light3 );





const axesHelper = new THREE.AxesHelper( 10);
axesHelper.setColors(0xff0000, 0x00ff00, 0x0000ff); // R, G, B
scene.add( axesHelper );


const animate = () => {
    // Call animate recursively
    requestAnimationFrame(animate);

    // Update the mesh rotation
    mesh2.rotateY(0.1);
    mesh2.rotateZ(0.1 * Math.sin( 0.1 ) );

    mesh3.rotateY(0.01);
    mesh3.rotateZ( 0.1 *  Math.sin(- 0.3 )  );

    group.rotateY( 0.01);
    group.rotateX(Math.sin(0.01));
    group.rotateZ( 0.01);

  
    controls.update();

    // Render the scene
    renderer.render(scene, camera);
}

// Call animate for the first time
animate();