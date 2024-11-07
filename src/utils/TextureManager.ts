import * as THREE from 'three';

class TextureManager {
  private static instance: TextureManager;
  private loadingManager: THREE.LoadingManager;
  private textureCache: Map<string, THREE.Texture>;
  private scene: THREE.Scene;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.textureCache = new Map();
    this.loadingManager = new THREE.LoadingManager();
    
    this.loadingManager.onError = (url) => {
      console.error(`Failed to load texture: ${url}`);
    };
    
    this.loadingManager.onLoad = () => {
      this.updateMaterials();
    };
  }

  private updateMaterials() {
    this.scene.traverse((node) => {
      if (node.isMesh) {
        const material = node.material as THREE.Material;
        material.needsUpdate = true;
      }
    });
  }

  async loadTexture(url: string): Promise<THREE.Texture> {
    if (this.textureCache.has(url)) {
      return this.textureCache.get(url)!;
    }

    return new Promise((resolve, reject) => {
      const loader = new THREE.TextureLoader(this.loadingManager);
      loader.load(
        url,
        (texture) => {
          this.textureCache.set(url, texture);
          resolve(texture);
        },
        undefined,
        reject
      );
    });
  }
}

export default TextureManager; 