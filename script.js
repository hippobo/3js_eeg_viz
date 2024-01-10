import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
import {Lut} from 'three/addons/math/Lut.js';
// 1. Scene setup
const scene = new THREE.Scene();
const test_sphere = new THREE.SphereGeometry( 0.2 );


const additive_material = new THREE.MeshBasicMaterial( {
    color : 0xff0000,
    
    blending: THREE.AdditiveBlending,
    transparent: true,
    opacity: 0.5,
    // depthTest: false,
    depthWrite: false
} );


const test_sphere_mesh = new THREE.Mesh( test_sphere, additive_material );
scene.add(test_sphere_mesh);
test_sphere_mesh.position.set( 1.5, 1.5, 0);

// 2. Camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const canvas = document.getElementById('canvas');

// Create a WebGLRenderer and set its width and height
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    // alpha: true,
});

renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio( window.devicePixelRatio );



//Materials
const standardMaterial = new THREE.MeshPhysicalMaterial( {
    clearcoat: 0.3,
    clearcoatRoughness: 0.25,
    color: 0xf2aeb1,
    ior: 1.25,
    iridescence: 0.8,
    metalness: 0,
    roughness: 0.2,
    thickness: 2.0,
    transmission: 0.9,
    opacity : 0.1,
} );

let lut = new Lut(); // Create a LUT for color mapping
lut.setColorMap('rainbow'); // Set the color map to 'rainbow', you can change this as needed
lut.setMax(2000); // Set the max value for your data
lut.setMin(0); // Set the min value for your data

//Postprocessing

const renderPass = new RenderPass(scene, camera);
const composer = new EffectComposer(renderer);
composer.addPass(renderPass);

const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    1.6,
    0.1,
    0.2

);
// composer.addPass(bloomPass);


// composer.addPass(new OutputPass());

// Helpers
const axesHelper = new THREE.AxesHelper( 10);
axesHelper.setColors(0xff0000, 0x00ff00, 0x0000ff); // R, G, B
scene.add(axesHelper);

// OrbitControls
const controls = new OrbitControls(camera, canvas);

// Handle window resize
window.addEventListener('resize', () => {
    // Update the camera
    camera.aspect =  window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    // Update the renderer
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
});

// 5. OBJ Loader
const loader = new OBJLoader();
let brain_model; // Declare the variable outside the load scope

// Load a .obj file
loader.load(
    'freesurff.Obj', // path to .obj file
    function (object) {
        // What to do when the .obj file is loaded
        brain_model = object; 
        
        brain_model.traverse( function ( child ) {

        if ( child instanceof THREE.Mesh ) {

            child.material = standardMaterial;
            
            child.geometry.computeVertexNormals();
            console.log(child.geometry)


        }

    } );    // Assign the loaded object to the variable
    brain_model.position.set( 0, 0, 0);
        scene.add(brain_model);

spotlight_fp1.target = brain_model;
spotlight_fp2.target = brain_model;


    },
    function (xhr) {
        // Called when loading is in progress
        console.log((xhr.loaded / xhr.total * 100) + '% loade   d');
    },
    function (error) {
        // Called when loading has errors
        console.error('An error happened', error);
    }
);

// 4. Lighting
const spotlight_fp1 = new THREE.SpotLight( 0x0000ff, 10, 1, Math.PI / 6, 0.9,5 );
const spotlight_fp2 = new THREE.SpotLight( 0x0000ff, 10, 1, Math.PI / 6, 0.9,5 );

const ambient_light = new THREE.AmbientLight( 0x404040 , 10); // soft white light
// scene.add(spotlight_fp1);
scene.add(spotlight_fp2);


spotlight_fp1.position.set( 2, 2, 0)
spotlight_fp2.position.set( 2, 0, -3)


const spotLightHelper = new THREE.SpotLightHelper( spotlight_fp1 );
const spotLightHelper2 = new THREE.SpotLightHelper( spotlight_fp2 );

scene.add( spotLightHelper );
scene.add( spotLightHelper2 );



scene.add(ambient_light);


function render() {
   

    // if (brain_model) {
    //     brain_model.rotateY(0.0001);
    // }
    composer.render();

}


// 6. Animation loop
function animate() {

    controls.update();

    render();
    requestAnimationFrame(animate);



}

animate(); // Start the animation loop
