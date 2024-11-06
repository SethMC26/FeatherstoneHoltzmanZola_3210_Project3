import * as THREE from 'three';

// Card class definition
class Card {
    constructor(suit, rank, width = 3.5, height = 5.5) {
        //might delete ID as unneeded
        //this.id = id;
        this.suit = suit;
        this.rank = rank;

        // Create front and back materials

        var loader = new THREE.TextureLoader();

        const frontMaterial = this.loadCorrectTexture(suit, rank, loader)
        const backMaterial = new THREE.MeshPhongMaterial({ color: 0x8f542c });

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

        backFace.castShadow = true;
        frontFace.castShadow = true;
        
        // Add both faces to the group
        this.mesh.add(frontFace);
        this.mesh.add(backFace);

        this.mesh.castShadow = true;

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
        //Create Axis for Quaternion angle 
        let xAxis = new THREE.Vector3(1, 0, 0);
        //create final rotation quaternion 
        let qFinal = new THREE.Quaternion().setFromAxisAngle(xAxis, Math.PI * 2);
        //add animations clips p1 move to center
        let clip = this._createAnimationClip(
            [
                this.mesh.position.x, this.mesh.position.y, this.mesh.position.z,
                -14.5, 15, 0,
                -7, 9.5, 0
            ],
            [
                this.mesh.quaternion.x, this.mesh.quaternion.y, this.mesh.quaternion.z, this.mesh.quaternion.w,
                qFinal.x, qFinal.y, qFinal.z, qFinal.w,
                this.mesh.quaternion.x, this.mesh.quaternion.y, this.mesh.quaternion.z, this.mesh.quaternion.w
            ]
        )
        //add clip to create clip
        this.faceDownP1 = this.mixer.clipAction(clip)
        //only loop once 
        this.faceDownP1.loop = THREE.LoopOnce
        this.faceDownP1.clampWhenFinished = true;

        //add animation clip p2 move to center
        clip = this._createAnimationClip(
            [
                0, 9.5, 25,
                0, 15, 15,
                0, 9.5, 0
            ],
            [
                this.mesh.quaternion.x, this.mesh.quaternion.y, this.mesh.quaternion.z, this.mesh.quaternion.w,
                qFinal.x, qFinal.y, qFinal.z, qFinal.w,
                this.mesh.quaternion.x, this.mesh.quaternion.y, this.mesh.quaternion.z, this.mesh.quaternion.w
            ]
        )

        this.faceDownP2 = this.mixer.clipAction(clip)
        this.faceDownP2.loop = THREE.LoopOnce
        this.faceDownP2.clampWhenFinished = true

        clip = this._createAnimationClip(
            [
                25, 9.5, 0,
                15, 15, 0,
                7, 9.5, 0
            ],
            [
                this.mesh.quaternion.x, this.mesh.quaternion.y, this.mesh.quaternion.z, this.mesh.quaternion.w,
                qFinal.x, qFinal.y, qFinal.z, qFinal.w,
                this.mesh.quaternion.x, this.mesh.quaternion.y, this.mesh.quaternion.z, this.mesh.quaternion.w
            ]
        )

        this.faceDownP3 = this.mixer.clipAction(clip)
        this.faceDownP3.loop = THREE.LoopOnce
        this.faceDownP3.clampWhenFinished = true;

        //wars card move to center
        clip = this._createAnimationClip(
            [
                -25, this.mesh.position.y, 0,
                -14.5, 15, 0,
                -7, 12.5, 0
            ],
            [
                this.mesh.quaternion.x, this.mesh.quaternion.y, this.mesh.quaternion.z, this.mesh.quaternion.w,
                this.mesh.quaternion.x, -this.mesh.quaternion.y, -this.mesh.quaternion.z, this.mesh.quaternion.w,
                qFinal.x, qFinal.y, qFinal.z, qFinal.w,
            ]
        )
        this.playCardP1 = this.mixer.clipAction(clip)
        this.playCardP1.loop = THREE.LoopOnce
        this.playCardP1.clampWhenFinished = true;

        //war card move to center p2
        clip = this._createAnimationClip(
            [
                0, this.mesh.position.y, 25,
                0, 15, 15,
                0, 12.5, 0
            ],
            [
                this.mesh.quaternion.x, this.mesh.quaternion.y, this.mesh.quaternion.z, this.mesh.quaternion.w,
                -this.mesh.quaternion.x, this.mesh.quaternion.y, this.mesh.quaternion.z, this.mesh.quaternion.w,
                qFinal.x, qFinal.y, qFinal.z, qFinal.w,
            ]
        )
        this.playCardP2 = this.mixer.clipAction(clip)
        this.playCardP2.loop = THREE.LoopOnce
        this.playCardP2.clampWhenFinished = true;

        //wars card move to center
        clip = this._createAnimationClip(
            [
                25, this.mesh.position.y, 0,
                15, 15, 0,
                7, 12.5, 0
            ],
            [
                this.mesh.quaternion.x, this.mesh.quaternion.y, this.mesh.quaternion.z, this.mesh.quaternion.w,
                this.mesh.quaternion.x, -this.mesh.quaternion.y, -this.mesh.quaternion.z, this.mesh.quaternion.w,
                qFinal.x, qFinal.y, qFinal.z, qFinal.w,
            ]
        )
        this.playCardP3 = this.mixer.clipAction(clip)
        this.playCardP3.loop = THREE.LoopOnce
        this.playCardP3.clampWhenFinished = true;

        //wars card move to center
        clip = this._createAnimationClip(
            [
                -25, 9.5, 0,
                -14.5, 15, 0,
                -7, 12.5, 3
            ],
            [
                this.mesh.quaternion.x, this.mesh.quaternion.y, this.mesh.quaternion.z, this.mesh.quaternion.w,
                this.mesh.quaternion.x, -this.mesh.quaternion.y, -this.mesh.quaternion.z, this.mesh.quaternion.w,
                qFinal.x, qFinal.y, qFinal.z, qFinal.w,
            ]
        )
        this.playWarP1 = this.mixer.clipAction(clip)
        this.playWarP1.loop = THREE.LoopOnce
        this.playWarP1.clampWhenFinished = true;

        //war card move to center p2
        clip = this._createAnimationClip(
            [
                0, 9.5, 25,
                0, 15, 15,
                0, 12.5, 3
            ],
            [
                this.mesh.quaternion.x, this.mesh.quaternion.y, this.mesh.quaternion.z, this.mesh.quaternion.w,
                -this.mesh.quaternion.x, this.mesh.quaternion.y, this.mesh.quaternion.z, this.mesh.quaternion.w,
                qFinal.x, qFinal.y, qFinal.z, qFinal.w,
            ]
        )
        this.playWarP2 = this.mixer.clipAction(clip)
        this.playWarP2.loop = THREE.LoopOnce
        this.playWarP2.clampWhenFinished = true;

        //wars card move to center
        clip = this._createAnimationClip(
            [
                25, 9.5, 0,
                15, 15, 0,
                7, 12.5, 3
            ],
            [
                this.mesh.quaternion.x, this.mesh.quaternion.y, this.mesh.quaternion.z, this.mesh.quaternion.w,
                this.mesh.quaternion.x, -this.mesh.quaternion.y, -this.mesh.quaternion.z, this.mesh.quaternion.w,
                qFinal.x, qFinal.y, qFinal.z, qFinal.w,
            ]
        )
        this.playWarP3 = this.mixer.clipAction(clip)
        this.playWarP3.loop = THREE.LoopOnce
        this.playWarP3.clampWhenFinished = true;
    }

    /**
     * Plays animation of cards going to winner pile
     * 
     * @param {THRE.Vector3} winnerPos Winner deck vector
     * @param {THREE.Quaternion} winnerQuaternion Winner deck Quaternion
     */
    playWinnerClip(winnerPos, winnerQuaternion) {
        let clip = this._createAnimationClip(
        [
            0, 12.5 , 0,
            winnerPos.x/2 +  THREE.MathUtils.randFloatSpread(10), winnerPos.y + THREE.MathUtils.randFloat(7,15), winnerPos.z/2 +  THREE.MathUtils.randFloatSpread(10),
            winnerPos.x, winnerPos.y, winnerPos.z,
        ],
        [
            this.mesh.quaternion.x, this.mesh.quaternion.y, this.mesh.quaternion.z, this.mesh.quaternion.w,
            -winnerQuaternion.x, winnerQuaternion.y, winnerQuaternion.z, winnerQuaternion.w,
            winnerQuaternion.x, winnerQuaternion.y, winnerQuaternion.z, winnerQuaternion.w
        ]
        )

        this.moveToWinner = this.mixer.clipAction(clip);
        this.moveToWinner.loop = THREE.LoopOnce
        this.moveToWinner.clampWhenFinished = true;

        this.moveToWinner.play();
    }

    /**
     * Starts war face down card animation
     * @param {Number} playerNumber number of player doing animation(1, 2, 3)
     */
    warFaceDownAnimation(playerNumber) {
        switch (playerNumber) {
            case 1:
                this.faceDownP1.play();
                break;
            case 2:
                this.faceDownP2.play();
                break;
            case 3:
                this.faceDownP3.play();
                break;
            default:
                console.warn("No player number exists for, ", playerNumber)
        }
    }

    /**
     * Starts playing cards going to center in front of cards on table 
     * @param {Number} playerNumber number of player doing animation(1, 2, 3)
     */
    playWarCard(playerNumber) {
        switch (playerNumber) {
            case 1:
                this.playWarP1.play()
                break;
            case 2:
                this.playWarP2.play()
                break;
            case 3:
                this.playWarP3.play()
                break;
            default:
                console.warn("No player number exists for, ", playerNumber)
        }
    }

    /**
     * Starts playing card animation of moving card to center
     * @param {Number} playerNumber number of player doing animation(1, 2, 3)
     */
    playCardAnimation(playerNumber) {
        switch (playerNumber) {
            case 1:
                this.playCardP1.play()
                break;
            case 2:
                this.playCardP2.play()
                break;
            case 3:
                this.playCardP3.play()
                break;
            default:
                console.warn("No player number exists for, ", playerNumber)
        }
    }

    /**
     * Stops all possible current animations that are playing
     * @note Necessary to do this before moving mesh or otherwise transforming it otherwise undefined behavoir could result
     */
    stopAnimations() {
        this.faceDownP1.stop()
        this.faceDownP2.stop()
        this.faceDownP3.stop()

        this.playCardP1.stop()
        this.playCardP2.stop()
        this.playCardP3.stop()

        this.playWarP1.stop()
        this.playWarP2.stop()
        this.playWarP3.stop()
    }

    /**
     * Creates new animation clip 
     * 
     * @param {Array} positionArray Array of lenght 9 with positions for animation
     * @param {Array} quaternionArray Array of legnth 9 with rotations as Quaternions
     * @returns {THREE.AnimationClip} a new animation clip
     */
    _createAnimationClip(positionArray, quaternionArray) {
        let quaternionKF = new THREE.QuaternionKeyframeTrack('.quaternion', [0, 1, 2], quaternionArray);
        let position = new THREE.VectorKeyframeTrack('.position', [0, 1, 2], positionArray)

        return new THREE.AnimationClip('action', 3, [position, quaternionKF])
    }

    loadCorrectTexture(suit, value, loader) {

        if (value == 14 && suit == 0) {
            var material = new THREE.MeshPhongMaterial({
                map: loader.load('textures/Cards/ace_of_hearts.png')
            });
        }

            if (value == 14 && suit == 1) {
                var material = new THREE.MeshPhongMaterial({
                    map: loader.load('textures/Cards/ace_of_diamonds.png')
                });
            }

        if (value == 14 && suit == 2) {
            var material = new THREE.MeshPhongMaterial({
                map: loader.load('textures/Cards/ace_of_clubs.png')
            });
        }
       
        if (value == 14 && suit ==3) {
            var material = new THREE.MeshPhongMaterial({
                map: loader.load('textures/Cards/ace_of_spades.png')
            });
        }

        

        if (value == 13 && suit == 0) {
            var material = new THREE.MeshPhongMaterial({
                map: loader.load('textures/Cards/king_of_hearts.png')
            });
        }

        if (value == 13 && suit == 1) {
            var material = new THREE.MeshPhongMaterial({
                map: loader.load('textures/Cards/king_of_diamonds.png')
            });
        }

        if (value == 13 && suit ==2) {
            var material = new THREE.MeshPhongMaterial({
                map: loader.load('textures/Cards/king_of_clubs.png')
            });
        }

        if (value == 13 && suit ==3) {
            var material = new THREE.MeshPhongMaterial({
                map: loader.load('textures/Cards/king_of_spades.png')
            });
        }

        if (value == 12 && suit ==0) {
            var material = new THREE.MeshPhongMaterial({
                map: loader.load('textures/Cards/queen_of_hearts.png')
            });
        }

        if (value == 12 && suit ==1) {
            var material = new THREE.MeshPhongMaterial({
                map: loader.load('textures/Cards/queen_of_diamonds.png')
            });
        }

        if (value == 12 && suit ==2) {
            var material = new THREE.MeshPhongMaterial({
                map: loader.load('textures/Cards/queen_of_clubs.png')
            });
        }

        if (value == 12 && suit ==3) {
            var material = new THREE.MeshPhongMaterial({
                map: loader.load('textures/Cards/queen_of_spades.png')
            });
        }

        if (value == 11 && suit ==0) {
            var material = new THREE.MeshPhongMaterial({
                map: loader.load('textures/Ace-Jack/jack_of_hearts.png')
            });
        }

        if (value == 11 && suit ==1) {
            var material = new THREE.MeshPhongMaterial({
                map: loader.load('textures/Ace-Jack/jack_of_diamonds.png')
            });
        }

        if (value == 11 && suit ==2) {
            var material = new THREE.MeshPhongMaterial({
                map: loader.load('textures/Ace-Jack/jack_of_clubs.png')
            });
        }

        if (value == 11 && suit ==3) {
            var material = new THREE.MeshPhongMaterial({
                map: loader.load('textures/Ace-Jack/jack_of_spades.png')
            });
        }

        if (value == 10 && suit ==0) {
            var material = new THREE.MeshPhongMaterial({
                map: loader.load('textures/10-5/10_of_hearts.png')
            });
        }

        if (value == 10 && suit ==1) {
            var material = new THREE.MeshPhongMaterial({
                map: loader.load('textures/10-5/10_of_diamonds.png')
            });
        }

        if (value == 10 && suit ==2) {
            var material = new THREE.MeshPhongMaterial({
                map: loader.load('textures/10-5/10_of_clubs.png')
            });
        }

        if (value == 10 && suit ==3) {
            var material = new THREE.MeshPhongMaterial({
                map: loader.load('textures/10-5/10_of_spades.png')
            });
        }

        if (value == 9 && suit ==0) {
            var material = new THREE.MeshPhongMaterial({
                map: loader.load('textures/10-5/9_of_hearts.png')
            });
        }

        if (value == 9 && suit ==1) {
            var material = new THREE.MeshPhongMaterial({
                map: loader.load('textures/10-5/9_of_diamonds.png')
            });
        }

        if (value == 9 && suit ==2) {
            var material = new THREE.MeshPhongMaterial({
                map: loader.load('textures/10-5/9_of_clubs.png')
            });
        }

        if (value == 9 && suit ==3) {
            var material = new THREE.MeshPhongMaterial({
                map: loader.load('textures/10-5/9_of_spades.png')
            });
        }

        if (value == 8 && suit ==0) {
            var material = new THREE.MeshPhongMaterial({
                map: loader.load('textures/10-5/8_of_hearts.png')
            });
        }

        if (value == 8 && suit ==1) {
            var material = new THREE.MeshPhongMaterial({
                map: loader.load('textures/10-5/8_of_diamonds.png')
            });
        }

        if (value == 8 && suit ==2) {
            var material = new THREE.MeshPhongMaterial({
                map: loader.load('textures/10-5/8_of_clubs.png')
            });
        }

        if (value == 8 && suit ==3) {
            var material = new THREE.MeshPhongMaterial({
                map: loader.load('textures/10-5/8_of_spades.png')
            });
        }

        if (value == 7 && suit ==0) {
            var material = new THREE.MeshPhongMaterial({
                map: loader.load('textures/10-5/7_of_hearts.png')
            });
        }

        if (value == 7 && suit ==1) {
            var material = new THREE.MeshPhongMaterial({
                map: loader.load('textures/10-5/7_of_diamonds.png')
            });
        }

        if (value == 7 && suit ==2) {
            var material = new THREE.MeshPhongMaterial({
                map: loader.load('textures/10-5/7_of_clubs.png')
            });
        }

        if (value == 7 && suit ==3) {
            var material = new THREE.MeshPhongMaterial({
                map: loader.load('textures/10-5/7_of_spades.png')
            });
        }

        if (value == 6 && suit ==0) {
            var material = new THREE.MeshPhongMaterial({
                map: loader.load('textures/10-5/6_of_hearts.png')
            });
        }

        if (value == 6 && suit ==1) {
            var material = new THREE.MeshPhongMaterial({
                map: loader.load('textures/10-5/6_of_diamonds.png')
            });
        }

        if (value == 6 && suit ==2) {
            var material = new THREE.MeshPhongMaterial({
                map: loader.load('textures/10-5/6_of_clubs.png')
            });
        }

        if (value == 6 && suit ==3) {
            var material = new THREE.MeshPhongMaterial({
                map: loader.load('textures/10-5/6_of_spades.png')
            });
        }

        if (value == 5 && suit ==0) {
            var material = new THREE.MeshPhongMaterial({
                map: loader.load('textures/5-2/5_of_hearts.png')
            });
        }

        if (value == 5 && suit ==1) {
            var material = new THREE.MeshPhongMaterial({
                map: loader.load('textures/5-2/5_of_diamonds.png')
            });
        }

        if (value == 5 && suit ==2) {
            var material = new THREE.MeshPhongMaterial({
                map: loader.load('textures/5-2/5_of_clubs.png')
            });
        }

        if (value == 5 && suit ==3) {
            var material = new THREE.MeshPhongMaterial({
                map: loader.load('textures/5-2/5_of_spades.png')
            });
        }

        if (value == 4 && suit ==0) {
            var material = new THREE.MeshPhongMaterial({
                map: loader.load('textures/5-2/4_of_hearts.png')
            });
        }

        if (value == 4 && suit ==1) {
            var material = new THREE.MeshPhongMaterial({
                map: loader.load('textures/5-2/4_of_diamonds.png')
            });
        }

        if (value == 4 && suit ==2) {
            var material = new THREE.MeshPhongMaterial({
                map: loader.load('textures/5-2/4_of_clubs.png')
            });
        }

        if (value == 4 && suit ==3) {
            var material = new THREE.MeshPhongMaterial({
                map: loader.load('textures/5-2/4_of_spades.png')
            });
        }

        if (value == 3 && suit ==0) {
            var material = new THREE.MeshPhongMaterial({
                map: loader.load('textures/5-2/3_of_hearts.png')
            });
        }

        if (value == 3 && suit ==1) {
            var material = new THREE.MeshPhongMaterial({
                map: loader.load('textures/5-2/3_of_diamonds.png')
            });
        }

        if (value == 3 && suit ==2) {
            var material = new THREE.MeshPhongMaterial({
                map: loader.load('textures/5-2/3_of_clubs.png')
            });
        }

        if (value == 3 && suit ==3) {
            var material = new THREE.MeshPhongMaterial({
                map: loader.load('textures/5-2/3_of_spades.png')
            });
        }

        if (value == 2 && suit ==0) {
            var material = new THREE.MeshPhongMaterial({
                map: loader.load('textures/5-2/2_of_hearts.png')
            });
        }

        if (value == 2 && suit ==1) {
            var material = new THREE.MeshPhongMaterial({
                map: loader.load('textures/5-2/2_of_diamonds.png')
            });
        }

        if (value == 2 && suit ==2) {
            var material = new THREE.MeshPhongMaterial({
                map: loader.load('textures/5-2/2_of_clubs.png')
            });
        }

        if (value == 2 && suit ==3) {
            var material = new THREE.MeshPhongMaterial({
                map: loader.load('textures/5-2/2_of_spades.png')
            });
        }



        return material;
    }
}
// Deck class definition

export { Card }
