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

        //create animation mixer to control playing of animations
        this.mixer = new THREE.AnimationMixer(this.mesh);
    }

    setPosition(x, y, z) {
        this.mesh.position.set(x, y, z);
    }

    addToScene(scene) {
        scene.add(this.mesh);
    }

    /**
     * Adds animations clips, note must be done after cards are arranged on table 
     */
    addAnimationClips() {
        //add animations clips p1 move to center
        let xAxis = new THREE.Vector3( 1 , 0, 0 );
        let qFinal = new THREE.Quaternion().setFromAxisAngle( xAxis, Math.PI * 2);
        let quaternionKF = new THREE.QuaternionKeyframeTrack( '.quaternion', [ 0, 1, 2 ], 
            [ 
                this.mesh.quaternion.x, this.mesh.quaternion.y, this.mesh.quaternion.z, this.mesh.quaternion.w, 
                qFinal.x, qFinal.y, qFinal.z, qFinal.w,
                -this.mesh.quaternion.x, -this.mesh.quaternion.y, this.mesh.quaternion.z, this.mesh.quaternion.w
            ] );
        let position = new THREE.VectorKeyframeTrack('.position', [0,1,2],
            [ 
                -25, 9.5, 0, 
                -14.5, 15, 0, 
                -7, 9.5, 0 
            ])
        let clip = new THREE.AnimationClip('action', 3, [ position, quaternionKF])

        this.moveToCenterP1 = this.mixer.clipAction( clip )
        this.moveToCenterP1.loop = THREE.LoopOnce
        this.moveToCenterP1.clampWhenFinished = true;
        
        //add animation clip p3 move to center(has same quaternion as p1)
        position = new THREE.VectorKeyframeTrack('.position', [0,1,2],
            [ 
                30, 9.5, 0, 
                15, 15, 0, 
                7, 9.5, 0 
            ])
        let clip3 = new THREE.AnimationClip('action', 3, [ position, quaternionKF])

        this.moveToCenterP3 = this.mixer.clipAction( clip3 )
        this.moveToCenterP3.loop = THREE.LoopOnce
        this.moveToCenterP3.clampWhenFinished = true; 
        

        xAxis = new THREE.Vector3(0, -1, 0)
        qFinal = new THREE.Quaternion().setFromAxisAngle(xAxis, Math.PI * 2)
        quaternionKF = new THREE.QuaternionKeyframeTrack('.quaternion', [0, 1, 2],
            [
                this.mesh.quaternion.x, this.mesh.quaternion.y, this.mesh.quaternion.z, this.mesh.quaternion.w, 
                qFinal.x, qFinal.y, qFinal.z, qFinal.w,
                -this.mesh.quaternion.x, -this.mesh.quaternion.y, -this.mesh.quaternion.z, this.mesh.quaternion.w
            ]
        )
        position = new THREE.VectorKeyframeTrack('.position', [0, 1, 2] , 
            [
                0 , 9.5, 25, 
                0 , 15, 15, 
                0, 9.5, 0 
            ])
        clip = new THREE.AnimationClip('action', 3, [ position, quaternionKF])
        this.moveToCenterP2 = this.mixer.clipAction( clip ) 
        this.moveToCenterP2.loop = THREE.LoopOnce
        this.moveToCenterP2.clampWhenFinished = true
    }

    cardToCenterAnimation(playerNumber) {
        console.log("Attemping to move to center for ", playerNumber)
        switch(playerNumber){
            case 1: 
                this.moveToCenterP1.play();
                break;
            case 2: 
                this.moveToCenterP2.play();
                break;
            case 3: 
                this.moveToCenterP3.play();
                break;
            default: 
                console.warn("No player number exists for, ", playerNumber)
        }
    }
}

// Deck class definition

export { Card }
