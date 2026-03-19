import * as THREE from 'three';
import { GAME, COLORS, GAME_STATE } from './constants';
import { TrackBuilder } from './TrackBuilder';
import { CarBuilder } from './CarBuilder';

export class RaceEngine {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.trackData = null;
    this.trackCurve = null;

    // Player state
    this.player = {
      mesh: null,
      speed: 0,
      trackPosition: 0, // 0-1 along the track
      laneOffset: 0,    // -1 to 1
      lap: 0,
      checkpointIdx: 0,
      finished: false,
    };

    // AI racers
    this.aiRacers = [];

    // Game state
    this.state = GAME_STATE.MENU;
    this.countdown = GAME.COUNTDOWN_SECONDS;
    this.raceTime = 0;
    this.results = [];
    this.positionRank = 1;

    // Input
    this.steerInput = 0; // -1 left, 1 right
    this.accelerateInput = false;
    this.brakeInput = false;

    // Callbacks
    this.onStateChange = null;
    this.onLapChange = null;
    this.onPositionChange = null;
    this.onCountdownTick = null;
    this.onRaceFinished = null;
  }

  init(gl, width, height) {
    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: {
        width: gl.drawingBufferWidth,
        height: gl.drawingBufferHeight,
        style: {},
        addEventListener: () => {},
        removeEventListener: () => {},
        clientHeight: height,
        getContext: () => gl,
      },
      context: gl,
    });
    this.renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setClearColor(COLORS.SKY);

    // Scene
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(COLORS.SKY, 50, 200);

    // Camera
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 300);

    // Lights
    this._setupLights();

    // Build track
    const builder = new TrackBuilder(this.scene);
    this.trackData = builder.build();
    this.trackCurve = new THREE.CatmullRomCurve3(this.trackData.trackPoints, true);

    // Build cars
    this._setupCars();

    return this;
  }

  _setupLights() {
    const ambient = new THREE.AmbientLight(0x666666);
    this.scene.add(ambient);

    const sun = new THREE.DirectionalLight(0xffffff, 1.0);
    sun.position.set(50, 80, 30);
    sun.castShadow = true;
    sun.shadow.mapSize.width = 1024;
    sun.shadow.mapSize.height = 1024;
    sun.shadow.camera.near = 0.5;
    sun.shadow.camera.far = 200;
    sun.shadow.camera.left = -100;
    sun.shadow.camera.right = 100;
    sun.shadow.camera.top = 100;
    sun.shadow.camera.bottom = -100;
    this.scene.add(sun);

    const hemi = new THREE.HemisphereLight(0x87ceeb, 0x228b22, 0.4);
    this.scene.add(hemi);
  }

  _setupCars() {
    // Player car
    this.player.mesh = CarBuilder.buildCar(COLORS.PLAYER_CAR, true);
    this.scene.add(this.player.mesh);

    // AI cars
    for (let i = 0; i < GAME.AI_COUNT; i++) {
      const ai = {
        mesh: CarBuilder.buildCar(COLORS.AI_CARS[i]),
        speed: 0,
        trackPosition: 0,
        laneOffset: (i - 1) * 0.3,
        lap: 0,
        checkpointIdx: 0,
        finished: false,
        targetSpeed: GAME.MAX_SPEED * (0.75 + Math.random() * 0.2),
        wobble: Math.random() * 0.02,
        wobblePhase: Math.random() * Math.PI * 2,
      };
      this.scene.add(ai.mesh);
      this.aiRacers.push(ai);
    }

    // Position cars at start
    this._positionAtStart();
  }

  _positionAtStart() {
    const startT = 0;
    const offsets = [-0.3, 0.3, -0.3, 0.3];
    const spacings = [0, -0.005, -0.01, -0.015];

    // Player
    this.player.trackPosition = startT + spacings[0];
    this.player.laneOffset = offsets[0];

    // AI
    this.aiRacers.forEach((ai, i) => {
      ai.trackPosition = startT + spacings[i + 1];
      ai.laneOffset = offsets[i + 1];
    });
  }

  startRace() {
    this.state = GAME_STATE.COUNTDOWN;
    this.countdown = GAME.COUNTDOWN_SECONDS;
    this.raceTime = 0;
    this.results = [];
    this.player.lap = 0;
    this.player.speed = 0;
    this.player.checkpointIdx = 0;
    this.player.finished = false;
    this.aiRacers.forEach((ai) => {
      ai.lap = 0;
      ai.speed = 0;
      ai.checkpointIdx = 0;
      ai.finished = false;
    });
    this._positionAtStart();

    if (this.onStateChange) this.onStateChange(this.state);
  }

  update(dt) {
    if (!dt || dt > 0.1) dt = 0.016;

    switch (this.state) {
      case GAME_STATE.COUNTDOWN:
        this._updateCountdown(dt);
        break;
      case GAME_STATE.RACING:
        this._updateRacing(dt);
        break;
    }

    this._updateCarPositions();
    this._updateCamera();
  }

  _updateCountdown(dt) {
    this.countdown -= dt;
    if (this.onCountdownTick) {
      this.onCountdownTick(Math.ceil(this.countdown));
    }
    if (this.countdown <= 0) {
      this.state = GAME_STATE.RACING;
      if (this.onStateChange) this.onStateChange(this.state);
    }
  }

  _updateRacing(dt) {
    this.raceTime += dt;

    // Update player
    this._updatePlayer(dt);

    // Update AI
    this._updateAI(dt);

    // Update positions/rankings
    this._updateRankings();
  }

  _updatePlayer(dt) {
    if (this.player.finished) return;

    // Acceleration
    if (this.accelerateInput) {
      this.player.speed = Math.min(this.player.speed + GAME.ACCELERATION, GAME.MAX_SPEED);
    } else if (this.brakeInput) {
      this.player.speed = Math.max(this.player.speed - GAME.BRAKING, 0);
    } else {
      this.player.speed = Math.max(this.player.speed - GAME.FRICTION, 0);
    }

    // Steering
    const steerAmount = this.steerInput * GAME.TURN_SPEED * dt;
    this.player.laneOffset = Math.max(-1, Math.min(1, this.player.laneOffset + steerAmount));

    // Move along track
    const prevPos = this.player.trackPosition;
    this.player.trackPosition += (this.player.speed * dt) / this.trackCurve.getLength();

    // Lap detection
    if (this.player.trackPosition >= 1) {
      this.player.trackPosition -= 1;
      this.player.lap++;
      if (this.onLapChange) this.onLapChange(this.player.lap);

      if (this.player.lap >= GAME.LAPS) {
        this.player.finished = true;
        this.results.push({ name: 'Player', time: this.raceTime });
        this._checkRaceEnd();
      }
    }
  }

  _updateAI(dt) {
    this.aiRacers.forEach((ai, idx) => {
      if (ai.finished) return;

      // AI speed control
      const speedDiff = ai.targetSpeed - ai.speed;
      ai.speed += speedDiff * 0.05;

      // AI lane wobble
      ai.wobblePhase += dt * 2;
      ai.laneOffset = Math.sin(ai.wobblePhase) * 0.4;

      // Move along track
      ai.trackPosition += (ai.speed * dt) / this.trackCurve.getLength();

      // Lap detection
      if (ai.trackPosition >= 1) {
        ai.trackPosition -= 1;
        ai.lap++;

        if (ai.lap >= GAME.LAPS) {
          ai.finished = true;
          this.results.push({ name: `CPU ${idx + 1}`, time: this.raceTime });
          this._checkRaceEnd();
        }
      }
    });
  }

  _updateRankings() {
    const all = [
      { id: 'player', progress: this.player.lap + this.player.trackPosition },
      ...this.aiRacers.map((ai, i) => ({
        id: `ai${i}`,
        progress: ai.lap + ai.trackPosition,
      })),
    ];

    all.sort((a, b) => b.progress - a.progress);
    const rank = all.findIndex((r) => r.id === 'player') + 1;

    if (rank !== this.positionRank) {
      this.positionRank = rank;
      if (this.onPositionChange) this.onPositionChange(rank);
    }
  }

  _checkRaceEnd() {
    const allFinished =
      this.player.finished && this.aiRacers.every((ai) => ai.finished);
    const playerFinished = this.player.finished;

    if (playerFinished) {
      // End race once player finishes
      this.state = GAME_STATE.FINISHED;
      if (this.onStateChange) this.onStateChange(this.state);
      if (this.onRaceFinished) {
        this.onRaceFinished(this.results, this.positionRank);
      }
    }
  }

  _updateCarPositions() {
    // Position player car on track
    this._placeCarOnTrack(this.player);

    // Position AI cars
    this.aiRacers.forEach((ai) => {
      this._placeCarOnTrack(ai);
    });
  }

  _placeCarOnTrack(racer) {
    const t = ((racer.trackPosition % 1) + 1) % 1;
    const point = this.trackCurve.getPointAt(t);
    const tangent = this.trackCurve.getTangentAt(t);

    // Calculate perpendicular for lane offset
    const up = new THREE.Vector3(0, 1, 0);
    const right = new THREE.Vector3().crossVectors(tangent, up).normalize();

    const offset = right.multiplyScalar(racer.laneOffset * (GAME.TRACK_WIDTH / 2 - 1.5));

    racer.mesh.position.copy(point).add(offset);
    racer.mesh.position.y = point.y + 0.2;

    // Face direction of travel
    const lookTarget = point.clone().add(tangent.multiplyScalar(5));
    lookTarget.y = racer.mesh.position.y;
    racer.mesh.lookAt(lookTarget);
  }

  _updateCamera() {
    if (!this.player.mesh) return;

    const t = ((this.player.trackPosition % 1) + 1) % 1;
    const tangent = this.trackCurve.getTangentAt(t);

    // Third-person chase camera
    const cameraOffset = tangent.clone().multiplyScalar(-12);
    cameraOffset.y = 6;

    const targetPos = this.player.mesh.position.clone().add(cameraOffset);

    // Smooth camera movement
    this.camera.position.lerp(targetPos, 0.08);

    const lookAt = this.player.mesh.position.clone();
    lookAt.y += 1;
    lookAt.add(tangent.clone().multiplyScalar(8));
    this.camera.lookAt(lookAt);
  }

  render() {
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  // Input methods
  setSteer(value) {
    this.steerInput = value;
  }

  setAccelerate(value) {
    this.accelerateInput = value;
  }

  setBrake(value) {
    this.brakeInput = value;
  }

  getSpeed() {
    return this.player.speed;
  }

  getLap() {
    return this.player.lap;
  }

  getRank() {
    return this.positionRank;
  }

  getTime() {
    return this.raceTime;
  }

  dispose() {
    if (this.scene) {
      this.scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
    }
  }
}
