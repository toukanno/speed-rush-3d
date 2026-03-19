import * as THREE from 'three';
import { GAME, COLORS } from './constants';

export class TrackBuilder {
  constructor(scene) {
    this.scene = scene;
    this.trackPoints = [];
    this.checkpoints = [];
  }

  build() {
    this._generateTrackPoints();
    this._buildTrackMesh();
    this._buildGrass();
    this._buildBarriers();
    this._buildScenery();
    this._buildStartLine();
    return {
      trackPoints: this.trackPoints,
      checkpoints: this.checkpoints,
    };
  }

  _generateTrackPoints() {
    const segments = GAME.TRACK_SEGMENTS;
    const radius = 80;
    const points = [];

    for (let i = 0; i <= segments; i++) {
      const t = (i / segments) * Math.PI * 2;
      // Oval track with some variation
      const x = Math.cos(t) * radius + Math.sin(t * 2) * 15;
      const z = Math.sin(t) * radius * 1.5 + Math.cos(t * 3) * 10;
      const y = Math.sin(t * 2) * 3; // mild elevation changes
      points.push(new THREE.Vector3(x, y, z));
    }

    this.trackPoints = points;

    // Create checkpoints at intervals
    const cpInterval = Math.floor(segments / 8);
    for (let i = 0; i < 8; i++) {
      this.checkpoints.push(points[i * cpInterval].clone());
    }
  }

  _buildTrackMesh() {
    const shape = new THREE.Shape();
    const hw = GAME.TRACK_WIDTH / 2;
    shape.moveTo(-hw, 0);
    shape.lineTo(hw, 0);

    const path = new THREE.CatmullRomCurve3(this.trackPoints, true);
    const extrudeSettings = {
      steps: GAME.TRACK_SEGMENTS * 2,
      bevelEnabled: false,
      extrudePath: path,
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    const material = new THREE.MeshStandardMaterial({
      color: COLORS.TRACK,
      roughness: 0.8,
      metalness: 0.1,
    });

    const track = new THREE.Mesh(geometry, material);
    track.receiveShadow = true;
    this.scene.add(track);

    // Track center line (dashed)
    const linePoints = path.getPoints(GAME.TRACK_SEGMENTS * 4);
    const lineGeom = new THREE.BufferGeometry().setFromPoints(linePoints);
    const lineMat = new THREE.LineDashedMaterial({
      color: 0xffffff,
      dashSize: 2,
      gapSize: 2,
    });
    const centerLine = new THREE.Line(lineGeom, lineMat);
    centerLine.computeLineDistances();
    centerLine.position.y = 0.05;
    this.scene.add(centerLine);
  }

  _buildGrass() {
    const groundGeom = new THREE.PlaneGeometry(500, 500);
    const groundMat = new THREE.MeshStandardMaterial({
      color: COLORS.GRASS,
      roughness: 1.0,
    });
    const ground = new THREE.Mesh(groundGeom, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.5;
    ground.receiveShadow = true;
    this.scene.add(ground);
  }

  _buildBarriers() {
    const path = new THREE.CatmullRomCurve3(this.trackPoints, true);
    const points = path.getPoints(GAME.TRACK_SEGMENTS * 2);
    const hw = GAME.TRACK_WIDTH / 2 + 0.5;

    const barrierGeom = new THREE.BoxGeometry(0.3, 0.8, 1.5);

    for (let i = 0; i < points.length; i += 4) {
      const p = points[i];
      const pNext = points[(i + 1) % points.length];
      const dir = new THREE.Vector3().subVectors(pNext, p).normalize();
      const perpendicular = new THREE.Vector3(-dir.z, 0, dir.x);

      // Left barrier
      const leftMat = new THREE.MeshStandardMaterial({
        color: i % 8 < 4 ? 0xff0000 : 0xffffff,
      });
      const leftBarrier = new THREE.Mesh(barrierGeom, leftMat);
      leftBarrier.position.copy(p).add(perpendicular.clone().multiplyScalar(hw));
      leftBarrier.position.y += 0.4;
      leftBarrier.lookAt(pNext.clone().add(perpendicular.clone().multiplyScalar(hw)));
      leftBarrier.castShadow = true;
      this.scene.add(leftBarrier);

      // Right barrier
      const rightMat = new THREE.MeshStandardMaterial({
        color: i % 8 < 4 ? 0xffffff : 0xff0000,
      });
      const rightBarrier = new THREE.Mesh(barrierGeom, rightMat);
      rightBarrier.position.copy(p).add(perpendicular.clone().multiplyScalar(-hw));
      rightBarrier.position.y += 0.4;
      rightBarrier.lookAt(pNext.clone().add(perpendicular.clone().multiplyScalar(-hw)));
      rightBarrier.castShadow = true;
      this.scene.add(rightBarrier);
    }
  }

  _buildScenery() {
    // Trees
    const trunkGeom = new THREE.CylinderGeometry(0.3, 0.4, 3, 6);
    const trunkMat = new THREE.MeshStandardMaterial({ color: COLORS.TREE_TRUNK });
    const foliageGeom = new THREE.SphereGeometry(2, 6, 6);
    const foliageMat = new THREE.MeshStandardMaterial({ color: COLORS.TREE });

    for (let i = 0; i < 60; i++) {
      const angle = (i / 60) * Math.PI * 2;
      const dist = 90 + Math.random() * 50;
      const x = Math.cos(angle) * dist;
      const z = Math.sin(angle) * dist * 1.5;

      const trunk = new THREE.Mesh(trunkGeom, trunkMat);
      trunk.position.set(x, 1, z);
      trunk.castShadow = true;
      this.scene.add(trunk);

      const foliage = new THREE.Mesh(foliageGeom, foliageMat);
      foliage.position.set(x, 4, z);
      foliage.castShadow = true;
      this.scene.add(foliage);
    }

    // Buildings in the distance
    for (let i = 0; i < 20; i++) {
      const angle = (i / 20) * Math.PI * 2;
      const dist = 150 + Math.random() * 30;
      const x = Math.cos(angle) * dist;
      const z = Math.sin(angle) * dist * 1.5;
      const h = 5 + Math.random() * 15;
      const w = 3 + Math.random() * 5;

      const buildGeom = new THREE.BoxGeometry(w, h, w);
      const colorIdx = Math.floor(Math.random() * COLORS.BUILDING.length);
      const buildMat = new THREE.MeshStandardMaterial({
        color: COLORS.BUILDING[colorIdx],
      });
      const building = new THREE.Mesh(buildGeom, buildMat);
      building.position.set(x, h / 2, z);
      building.castShadow = true;
      this.scene.add(building);
    }
  }

  _buildStartLine() {
    const startGeom = new THREE.PlaneGeometry(GAME.TRACK_WIDTH, 2);
    const startMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
    });
    const startLine = new THREE.Mesh(startGeom, startMat);

    const p = this.trackPoints[0];
    startLine.position.set(p.x, 0.05, p.z);
    startLine.rotation.x = -Math.PI / 2;
    this.scene.add(startLine);

    // Checkered pattern overlay using DataTexture
    const size = 64;
    const data = new Uint8Array(size * size * 4);
    const cellSize = 8;
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const idx = (y * size + x) * 4;
        const isBlack = (Math.floor(x / cellSize) + Math.floor(y / cellSize)) % 2 === 0;
        data[idx] = isBlack ? 0 : 255;
        data[idx + 1] = isBlack ? 0 : 255;
        data[idx + 2] = isBlack ? 0 : 255;
        data[idx + 3] = 255;
      }
    }
    const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
    texture.needsUpdate = true;

    const checkerMat = new THREE.MeshStandardMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });
    const checker = new THREE.Mesh(startGeom.clone(), checkerMat);
    checker.position.set(p.x, 0.06, p.z);
    checker.rotation.x = -Math.PI / 2;
    this.scene.add(checker);
  }
}
