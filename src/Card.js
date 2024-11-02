import * as THREE from 'three';

// Card class definition
class Card {
    constructor(id, suit, rank, width = 2.5, height = 3.5) {
        //might delete ID as unneeded
        //this.id = id;
        this.suit = suit;
        this.rank = rank;

        //texture should be loaded in not sure how this would work 
        //const texture = new THREE.CanvasTexture(canvas);

        // Create front and back materials
        const frontMaterial = new THREE.MeshBasicMaterial();
        const backMaterial = new THREE.MeshBasicMaterial({ color: 0x8f542c, side: THREE.DoubleSide});
        
        //code below doesnt seem to work?
        //const materials = [backMaterial, frontMaterial];

        // Geometry and mesh
        const geometry = new THREE.PlaneGeometry(width, height);
        this.mesh = new THREE.Mesh( geometry, backMaterial);
        //this.mesh.userData = { id: id, suit: suit, rank: rank };
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
