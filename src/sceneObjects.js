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
    constructor(scale, texture) {
        //TO:DO add texture support 
        
        //create table group hold all table objects 
        this.tableGroup = new THREE.Group();

        //create legs of table 
        let mat = new THREE.MeshPhongMaterial({wireframe: true, color: 0xf5b042});
        let legGeom = new THREE.CylinderGeometry( 2, 2, scale, 16 ); 
        
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
        const geometry = new THREE.CylinderGeometry( scale * 2, scale * 1.65 , 2, scale ); 
        const top = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial({wireframe: true, color: 0x543a10}));
        top.translateY( 0.5 * scale);

        this.tableGroup.add(top);
    }
}

export  { Table }