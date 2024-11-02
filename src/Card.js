import * as THREE from 'three';

// Card class definition
class Card {
    constructor(suit, rank, width = 2.5, height = 3.5) {
        //might delete ID as unneeded
        //this.id = id;
        this.suit = suit;
        this.rank = rank;

        //texture should be loaded in not sure how this would work 
        //const texture = new THREE.CanvasTexture(canvas);

        // Create front and back materials
        
        const frontMaterial = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
        const backMaterial = new THREE.MeshBasicMaterial({ color: 0x8f542c });
        
        //code below doesnt seem to work?
        //const materials = [backMaterial, frontMaterial];

        // Geometry and mesh
        const geometry = new THREE.PlaneGeometry(width, height);
        //this.mesh = new THREE.Mesh( geometry, backMaterial);
        
        // Create a group to hold the front and back of the card
        this.mesh = new THREE.Group();

        // Create the front face and set its position slightly forward
        const frontFace = new THREE.Mesh(geometry, frontMaterial);
        frontFace.position.z = 0.01; // Offset slightly to avoid z-fighting

        // Create the back face, rotate it, and set its position slightly backward
        const backFace = new THREE.Mesh(geometry, backMaterial);
        backFace.rotation.y = Math.PI; // Rotate to face opposite direction
        backFace.position.z = -0.01; // Offset slightly to avoid z-fighting

        // Add both faces to the group
        this.mesh.add(frontFace);
        this.mesh.add(backFace);
    }

    setPosition(x, y, z) {
        this.mesh.position.set(x, y, z);
    }

    addToScene(scene) {
        scene.add(this.mesh);
    }
}

// Deck class definition

export { Card }
