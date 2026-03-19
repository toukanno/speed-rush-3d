import * as THREE from 'three';
import { COLORS } from './constants';

export class CarBuilder {
  static buildCar(color, isPlayer = false) {
    const group = new THREE.Group();

    // Body
    const bodyGeom = new THREE.BoxGeometry(1.8, 0.5, 3.5);
    const bodyMat = new THREE.MeshStandardMaterial({
      color,
      metalness: 0.6,
      roughness: 0.3,
    });
    const body = new THREE.Mesh(bodyGeom, bodyMat);
    body.position.y = 0.5;
    body.castShadow = true;
    group.add(body);

    // Cabin
    const cabinGeom = new THREE.BoxGeometry(1.4, 0.45, 1.8);
    const cabinMat = new THREE.MeshStandardMaterial({
      color: 0x222222,
      metalness: 0.3,
      roughness: 0.5,
      transparent: true,
      opacity: 0.7,
    });
    const cabin = new THREE.Mesh(cabinGeom, cabinMat);
    cabin.position.set(0, 0.95, -0.2);
    cabin.castShadow = true;
    group.add(cabin);

    // Wheels
    const wheelGeom = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 12);
    const wheelMat = new THREE.MeshStandardMaterial({
      color: 0x111111,
      roughness: 0.9,
    });

    const wheelPositions = [
      [-0.9, 0.3, 1.1],
      [0.9, 0.3, 1.1],
      [-0.9, 0.3, -1.1],
      [0.9, 0.3, -1.1],
    ];

    wheelPositions.forEach(([x, y, z]) => {
      const wheel = new THREE.Mesh(wheelGeom, wheelMat);
      wheel.position.set(x, y, z);
      wheel.rotation.z = Math.PI / 2;
      wheel.castShadow = true;
      group.add(wheel);
    });

    // Headlights
    const lightGeom = new THREE.SphereGeometry(0.12, 8, 8);
    const lightMat = new THREE.MeshStandardMaterial({
      color: 0xffffcc,
      emissive: 0xffffcc,
      emissiveIntensity: 0.5,
    });
    const leftLight = new THREE.Mesh(lightGeom, lightMat);
    leftLight.position.set(-0.6, 0.5, 1.75);
    group.add(leftLight);

    const rightLight = new THREE.Mesh(lightGeom, lightMat);
    rightLight.position.set(0.6, 0.5, 1.75);
    group.add(rightLight);

    // Tail lights
    const tailMat = new THREE.MeshStandardMaterial({
      color: 0xff0000,
      emissive: 0xff0000,
      emissiveIntensity: 0.3,
    });
    const leftTail = new THREE.Mesh(lightGeom, tailMat);
    leftTail.position.set(-0.7, 0.5, -1.75);
    group.add(leftTail);

    const rightTail = new THREE.Mesh(lightGeom, tailMat);
    rightTail.position.set(0.7, 0.5, -1.75);
    group.add(rightTail);

    // Spoiler (player car only)
    if (isPlayer) {
      const spoilerGeom = new THREE.BoxGeometry(1.8, 0.08, 0.5);
      const spoilerMat = new THREE.MeshStandardMaterial({ color });
      const spoiler = new THREE.Mesh(spoilerGeom, spoilerMat);
      spoiler.position.set(0, 1.1, -1.5);
      group.add(spoiler);

      const poleGeom = new THREE.CylinderGeometry(0.04, 0.04, 0.4, 6);
      const leftPole = new THREE.Mesh(poleGeom, spoilerMat);
      leftPole.position.set(-0.7, 0.9, -1.5);
      group.add(leftPole);

      const rightPole = new THREE.Mesh(poleGeom, spoilerMat);
      rightPole.position.set(0.7, 0.9, -1.5);
      group.add(rightPole);
    }

    group.scale.set(0.8, 0.8, 0.8);
    return group;
  }
}
