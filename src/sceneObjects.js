import * as THREE from 'three';

class Table {
    /**
     * Creates Table object use tableName.tableGroup to manipulate table as needed
     * 
     * @param {Number} scale  Scale of table(height of legs and table top)
     * @param {THREE.Texture} texture Texture to apply to table object 
     * @example const table = new Table(16, textureObj) 
     * //add Table to scene
     * scene.add(table.tableGroup)
     * //move table to new location 
     * table.tableGroup.position.set(x,y,z)
     * //translate entire table to new place
     * table.tableGroup.translateX(x);
     */
    constructor(scale, debug=false) {
        //TO:DO add texture support 
        
        //create table group hold all table objects 
        this.tableGroup = new THREE.Group();
        
        //get texture 
        const texture = new THREE.TextureLoader().load( "textures/darkWood/Wood067_2K-JPG_Color.jpg" );
        const normalTexutre = new THREE.TextureLoader().load("textures/darkWood/Wood067_2K-JPG_NormalDX.jpg")
        //create legs of table 
        let mat = new THREE.MeshPhongMaterial({
            wireframe: debug, 
            color: 0x693d2c, 
            map: texture,
            normalMap: normalTexutre
        });
        let legGeom = new THREE.CylinderGeometry( scale/4, scale/8, scale, 5 ); 
        
        //leg meshes 
        let legMesh1 = new THREE.Mesh(legGeom, mat) 
        let legMesh2 = new THREE.Mesh(legGeom, mat) 
        let legMesh3 = new THREE.Mesh(legGeom, mat)
        let legMesh4 = new THREE.Mesh(legGeom, mat)

        //move legs into position 
        legMesh1.translateX(-scale)
        legMesh1.translateZ(-scale)

        legMesh2.translateX(scale)
        legMesh2.translateZ(-scale)

        legMesh3.translateZ(scale)
        legMesh3.translateX(scale)

        legMesh4.translateZ(scale)
        legMesh4.translateX(-scale)

        //add legs to group
        this.tableGroup.add(legMesh1)
        this.tableGroup.add(legMesh2)
        this.tableGroup.add(legMesh3)
        this.tableGroup.add(legMesh4)

        //create table top
        const topGeom = new THREE.CylinderGeometry( scale * 2, scale * 1.65 , scale/6, scale ); 
        const topMat = new THREE.MeshPhongMaterial({
            wireframe: debug, 
            color: 0x824a34,
            map: texture, 
            normalMap: normalTexutre
        });
        const top = new THREE.Mesh( topGeom, topMat);
        top.translateY( 0.5 * scale);

        this.tableGroup.add(top);
    }
}

class Floor {
    /**
     * Creates Floor object use Floor.mesh to manipulate
     * 
     * @param {Number} scale Scale of floor should be same as scale of table
     * @param {Number} width width of floor default 200
     * @param {Number} height height of floor default 200
     * @param {Boolean} debug turns on debug info like wireframes
     * 
     * @example
     * //create floor
     * const floor = new Floor(16);
     * //add to scene
     * scene.add(floor.mesh)
     */
    constructor(scale, width=200, height=200, debug = false) {
        const texture = new THREE.TextureLoader().load( "textures/tile/Tiles133D_2K-JPG_Color.jpg" );
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set( 2, 2 );

        const floorGeom = new THREE.PlaneGeometry(width,height)
        const floorMat = new THREE.MeshPhongMaterial({
            wireframe: debug, 
            color: 0x876f5d,
            map: texture, 
        });

        this.mesh = new THREE.Mesh(floorGeom, floorMat)

        this.mesh.rotateX(Math.PI/2)
        this.mesh.rotateY(Math.PI)
        this.mesh.translateZ(-(scale/2))
    }
}

export  { Table, Floor}