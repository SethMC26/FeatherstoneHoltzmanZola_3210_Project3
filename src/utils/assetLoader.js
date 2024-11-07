import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const CDN_URL = 'https://pub-ac644f6f5793418faf18ad94b92fa763.r2.dev';

export const getAssetUrl = (path) => {
  return `${CDN_URL}/${path}`;
};

export const loadModel = async (path) => {
  const url = getAssetUrl(path);
  const loader = new GLTFLoader();

  // Set cross-origin
  loader.setCrossOrigin('anonymous');

  const model = await loader.loadAsync(url);

  return model;
}; 