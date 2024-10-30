
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Floor, Table } from './sceneObjects';


var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, .1, 3000 );
camera.position.set(0, 0, 100)  // Try moving this around!
camera.lookAt( new THREE.Vector3(0.0,0.0,0.0));
scene.add( camera );

var renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0x000000);
// If you want this to span the window, instead of using the myCanvas object, use the window object
//renderer.setPixelRatio(document.getElementById('myCanvas').devicePixelRatio);
// If you want the render to span the window, uncomment this
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//basic controls for testing 
const controls = new OrbitControls( camera, renderer.domElement );
controls.update();

//basic light to see materials
let light = new THREE.AmbientLight(0xFFFFFF, 1)
scene.add(light)

//create a new table with size 16 (size scaling is still WIP)
let table = new Table(20);
//add tableGroup(all objects of table)
scene.add(table.tableGroup);

//create floor
let floor = new Floor(20);
scene.add(floor.mesh)

// Card class
class Card {
    constructor(id, width = 5, height = 7.5) { // Increased card dimensions
        this.id = id;
        const geometry = new THREE.PlaneGeometry(width, height);
        const material = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff, side: THREE.DoubleSide });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.userData = { id: id };
    }

    setPosition(x, y, z) {
        this.mesh.position.set(x, y, z);
    }

    addToScene(scene) {
        scene.add(this.mesh);
    }
}

/// Deck class
class Deck {
    constructor(scene, numCards = 50) {
        this.scene = scene;
        this.cards = [];
        
        for (let i = 0; i < numCards; i++) {
            const card = new Card(i);
            card.setPosition((i % 10) * 6, Math.floor(i / 10) * 9, 2); // Spread out the cards
            card.addToScene(scene);
            this.cards.push(card);
        }
    }

    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    removeCard(card) {
        const index = this.cards.indexOf(card);
        if (index > -1) {
            this.scene.remove(this.cards[index].mesh);
            this.cards.splice(index, 1);
        }
    }
}

// Create a deck of 50 cards and add to the scene
const deck = new Deck(scene, 50);

// Animation loop
function animate() {
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
animate();