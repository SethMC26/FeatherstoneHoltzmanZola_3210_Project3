import * as THREE from 'three';
import TextureManager from './textureManager';

class MaterialManager {
  private textureManager: TextureManager;

  constructor(scene: THREE.Scene) {
    this.textureManager = new TextureManager(scene);
  }

  async createGlowMaterial(texturePaths: {
    map: string;
  }): Promise<THREE.Material> {
    try {
      // Load the base color texture
      const diffuseMap = await this.textureManager.loadTexture(texturePaths.map);

      // Set up material parameters with the loaded texture
      const materialParams: ConstructorParameters<typeof THREE.MeshStandardMaterial>[0] = {
        map: diffuseMap,
        transparent: true,
        opacity: 0.5,
      };

      const material = new THREE.MeshStandardMaterial(materialParams);

      return material;
    } catch (error) {
      console.error('Failed to create glow material:', error);
      return this.createFallbackMaterial();
    }
  }

  private createFallbackMaterial(): THREE.MeshStandardMaterial {
    return new THREE.MeshStandardMaterial({
      color: 0xff0000,
      wireframe: true,
    });
  }
}

export default MaterialManager; 