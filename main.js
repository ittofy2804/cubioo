import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { VRButton } from 'three/addons/webxr/VRButton.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
///////////////////////////////////////////
renderer.xr.enabled = true;
renderer.xr.setReferenceSpaceType( 'local' );
////////////////////////////
document.body.appendChild( renderer.domElement );
document.body.appendChild( VRButton.createButton( renderer ) );//

const controls = new OrbitControls( camera, renderer.domElement );

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;
let px = 0;
let py = 0;
function onPointerMove( event ) {
  console.log("x"+event.clientX+"y"+event.clientY)
  px=event.clientX;
  py=event.clientY;
}

function animate() {
  if(px>window.innerWidth/2)
  {
    cube.rotation.y += 0.01;
  }else
  {
    cube.rotation.y -= 0.01;
  }
  renderer.render( scene, camera );

}
window.addEventListener( 'pointermove', onPointerMove );