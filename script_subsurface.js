import * as THREE from 'three';

		import Stats from 'three/addons/libs/stats.module.js';

		import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
		import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
		import { SubsurfaceScatteringShader } from 'three/addons/shaders/SubsurfaceScatteringShader.js';
        import {OBJLoader } from 'three/addons/loaders/OBJLoader.js';


		let container, stats;
		let camera, scene, renderer;
		let model;
        let model2;
		const lights = {};
		let lowerBound;
		let upperBound;
		let fp1;
		let fp2;
		let f7;
		let f3;
		let fz;
		let f4;
		let f8;
		let a1;
		let t3;
		let c3;
		let cz;
		let c4;
		let t4;
		let a2;
		let t5;
		let p3;
		let pz;
		let p4;
		let t6;
		let o1;
		let o2;

		const lightNames = ['fp1', 'fp2', 'fz', 'f3', 'f4', 'f7', 'f8', 'fc1', 'fc2', 'fc5', 'fc6' , 'cz', 'c3', 'c4', 't3', 't4', 'a1' ,'a2', 'cp1', 'cp2', 'cp5', 'cp6', 'pz', 'p3','p4', 't5', 't6', 'po3', 'po4', 'oz', 'o1', 'o2'];

		// Function to create a light
		function createLight(name) {
			const lightMesh = new THREE.Mesh(new THREE.SphereGeometry(0.01, 8, 8), new THREE.MeshBasicMaterial({ color: 0xc1c100 }));
			const pointLight = new THREE.PointLight(0xc1c100, 0, 50, 0);
			lightMesh.add(pointLight); 
			scene.add(lightMesh);
			return lightMesh;
}

	
				// Global variable to store EEG data
				let globalEEGData = null;
		let currentDataPoint = 0; // To keep track of the current data point in EEG data

		
		
		init();
		animate();



		
	

		function init() {

			container = document.createElement( 'div' );
			document.body.appendChild( container );

			camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 5000 );
			camera.position.set( 0.0, 1000, 0 );
			

			scene = new THREE.Scene();

			// Lights
			const ambient_light = new THREE.AmbientLight( 0xc1c1c1 , 3)
			scene.add( ambient_light );
		
			
		lightNames.forEach(name => {
			lights[name] = createLight(name);
		});

		// Fetch the EEG data
		fetch('./eeg_data.json')
			.then((response) => response.json())
			.then((eegData) => {
				globalEEGData = eegData; // Store the data in the global variable
					// Flatten the EEG data to find percentiles
				const flatEEGData = flattenEEGData(globalEEGData);
				const percentiles  = findPercentiles(flatEEGData, 5, 95); // Using 5th and 95th percentiles
				lowerBound = percentiles.lowerBound;
				upperBound = percentiles.upperBound;
				

			})
			.catch((error) => {
				console.error("Error fetching EEG data:", error);
			});

		


			
		
		lights['fp1'].position.set(-29, -16, -102);
		lights['fp2'].position.set(33, -16, -102);
		lights['f7'].position.set(-60, -16, -60);
		lights['f3'].position.set(-40, 30, -60);
		lights['fz'].position.set(0, 50, -60);
		lights['f4'].position.set(30, 50, -60);
		lights['f8'].position.set(50, 20, -80);
		lights['a1'].position.set(-90, -16, 0);
		lights['t3'].position.set(-66, -16, 0);
		lights['c3'].position.set(-60, 50, 0);
		lights['cz'].position.set(0, 80, 0);
		lights['c4'].position.set(50, 40, 0);
		lights['t4'].position.set(66, 0, 0);
		lights['a2'].position.set(90, -16, 0);
		lights['t5'].position.set(-80,-10, 30);
		lights['p3'].position.set(-60, 50, 70);
		lights['pz'].position.set(0, 60, 70);
		lights['p4'].position.set(60, 50, 70);
		lights['t6'].position.set(80,-10, 30);
		lights['o1'].position.set(-40, -10, 90);
		lights['o2'].position.set(40, -10, 90);



			renderer = new THREE.WebGLRenderer( { antialias: true} );
			renderer.setPixelRatio( window.devicePixelRatio );
			renderer.setSize( window.innerWidth, window.innerHeight );
			container.appendChild( renderer.domElement );

			//


            // Helpers
        const axesHelper = new THREE.AxesHelper( 1000);
        axesHelper.setColors(0xff0000, 0x00ff00, 0x0000ff); // R, G, B
        scene.add(axesHelper);

			stats = new Stats();
			container.appendChild( stats.dom );

			const controls = new OrbitControls( camera, container );
			controls.minDistance = 500;
			controls.maxDistance = 3000;

			window.addEventListener( 'resize', onWindowResize );

			initMaterial();

		}

		function initMaterial() {

			const loader = new THREE.TextureLoader();
			const imgTexture = loader.load( 'models/fbx/white.jpg' );
			imgTexture.colorSpace = THREE.SRGBColorSpace;

			const thicknessTexture = loader.load( 'models/fbx/white.jpg' );
			imgTexture.wrapS = imgTexture.wrapT = THREE.RepeatWrapping;

			const shader = SubsurfaceScatteringShader;
			const uniforms = THREE.UniformsUtils.clone( shader.uniforms );

			uniforms[ 'map' ].value = imgTexture;

            //default values
			uniforms[ 'diffuse' ].value = new THREE.Vector3( 1.0, 0.2, 0.2 );
			uniforms[ 'shininess' ].value = 500;
            
            // default color values
			uniforms[ 'thicknessMap' ].value = thicknessTexture;
			uniforms[ 'thicknessColor' ].value = new THREE.Vector3( 0.5, 0.3, 0.0 );


			uniforms[ 'thicknessDistortion' ].value = 0.25;
			uniforms[ 'thicknessAmbient' ].value = 0.0;
			uniforms[ 'thicknessAttenuation' ].value = 0.1;
			uniforms[ 'thicknessPower' ].value = 2.0;
			uniforms[ 'thicknessScale' ].value = 25.0;

			const material = new THREE.ShaderMaterial( {
				uniforms: uniforms,
				vertexShader: shader.vertexShader,
				fragmentShader: shader.fragmentShader,
				lights: true
			} );
			material.extensions.derivatives = true;

			// LOADER

            const loaderOBJ = new OBJLoader();
            loaderOBJ.load('freesurff.Obj', function ( object ) {
                model = object.children[ 0 ];
                model.position.set( 0, 0, 0 );
                model.scale.setScalar( 50);
                model.material = material;

               model2 = model.clone();
                model2.scale.x *= -1;


                scene.add( model );
                scene.add( model2);
               

            } );
			initGUI( uniforms );

		}


		function flattenEEGData(eegData) {
			return eegData.flat(2); // Flatten the 3D array into a 1D array
		}
		
		function findPercentiles(data, lowerPercentile, upperPercentile) {
			const sortedData = [...data].sort((a, b) => a - b);
			const lowerIndex = Math.floor(lowerPercentile / 100.0 * (sortedData.length - 1));
			const upperIndex = Math.floor(upperPercentile / 100.0 * (sortedData.length - 1));
			
			return {'lowerBound' : sortedData[lowerIndex],
			'upperBound' : sortedData[upperIndex] };
		}
		
		function normalizeValue(value, lowerBound, upperBound) {	
		
			return 1 + ((value - lowerBound) * 9) / (upperBound - lowerBound);
		}
		
	
		
		
		function updateLightIntensities() {
			if (!globalEEGData || !globalEEGData.length) return;
		
			const videoClipIndex = 0;
			const numberOfElectrodes = 32;
		
			
			
		
			if (currentDataPoint < globalEEGData[videoClipIndex][0].length) {
				for (let i = 0; i < numberOfElectrodes; i++) {
					if (lights[lightNames[i]] && lights[lightNames[i]].children[0]) {
						const electrodeData = globalEEGData[videoClipIndex][i];
						const rawIntensity = electrodeData[currentDataPoint];
						

						const normalizedIntensity = normalizeValue(rawIntensity, lowerBound, upperBound);
						lights[lightNames[i]].children[0].intensity = normalizedIntensity;
					}
				}
		
				currentDataPoint++;
			}
		}


		function getElectrodeData(eegData, videoClipIndex, electrodeIndex) {
			if (videoClipIndex < 0 || videoClipIndex >= eegData.length) {
				throw new Error("Invalid video clip index");
			}
			if (electrodeIndex < 0 || electrodeIndex >= eegData[0].length) {
				throw new Error("Invalid electrode index");
			}
		
			return eegData[videoClipIndex][electrodeIndex];
		}

		function initGUI( uniforms ) {

			const gui = new GUI( { title: 'Thickness Control' } );

                        // Point Light 1 Controls
			// const gui2 = new GUI({ title: 'Light Controls' });

			// // Iterate over each light to create a folder and add controls
			// Object.keys(lights).forEach(lightName => {
			// 	const lightFolder = gui.addFolder(lightName);
			// 	const pointLight = lights[lightName].children[0];
		
			// 	// Add controls for intensity and distance
			// 	lightFolder.add(pointLight, 'intensity', 0, 10).name('Intensity');
			// 	lightFolder.add(pointLight, 'distance', 0, 1000).name('Distance');
			// 			});
        


			const ThicknessControls = function () {

				this.distortion = uniforms[ 'thicknessDistortion' ].value;
				this.ambient = uniforms[ 'thicknessAmbient' ].value;
				this.attenuation = uniforms[ 'thicknessAttenuation' ].value;
				this.power = uniforms[ 'thicknessPower' ].value;
				this.scale = uniforms[ 'thicknessScale' ].value;

			};

			const thicknessControls = new ThicknessControls();

			gui.add( thicknessControls, 'distortion' ).min( 0.01 ).max( 1 ).step( 0.01 ).onChange( function () {

				uniforms[ 'thicknessDistortion' ].value = thicknessControls.distortion;

			} );

			gui.add( thicknessControls, 'ambient' ).min( 0.01 ).max( 5.0 ).step( 0.05 ).onChange( function () {

				uniforms[ 'thicknessAmbient' ].value = thicknessControls.ambient;

			} );

			gui.add( thicknessControls, 'attenuation' ).min( 0.01 ).max( 5.0 ).step( 0.05 ).onChange( function () {

				uniforms[ 'thicknessAttenuation' ].value = thicknessControls.attenuation;

			} );

			gui.add( thicknessControls, 'power' ).min( 0.01 ).max( 16.0 ).step( 0.1 ).onChange( function () {

				uniforms[ 'thicknessPower' ].value = thicknessControls.power;

			} );

			gui.add( thicknessControls, 'scale' ).min( 0.01 ).max( 50.0 ).step( 0.1 ).onChange( function () {

				uniforms[ 'thicknessScale' ].value = thicknessControls.scale;

			} );

		}

		function onWindowResize() {

			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();

			renderer.setSize( window.innerWidth, window.innerHeight );

		}

		//

		function animate() {

			requestAnimationFrame( animate );

			render();

			stats.update();

		}

		function render() {

			// if ( model ) model.rotation.y = performance.now() / 5000;
			// if ( model2 ) model2.rotation.y = performance.now() / 5000;
			
			updateLightIntensities();


			renderer.render( scene, camera );

		}