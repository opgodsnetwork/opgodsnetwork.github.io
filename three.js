import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Sky } from 'three/examples/jsm/objects/Sky';
import { Water } from 'three/examples/jsm/objects/Water';

class BattleRoyaleGame {
    constructor() {
        // Scene setup
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 20000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        document.body.appendChild(this.renderer.domElement);

        // Game states
        this.gameState = {
            LOBBY: 'lobby',
            COUNTDOWN: 'countdown',
            FLYING: 'flying',
            PARACHUTING: 'parachuting',
            PLAYING: 'playing'
        };
        this.currentState = this.gameState.LOBBY;
        this.countdown = 30;
        
        // Game objects
        this.players = new Map();
        this.weapons = new Map();
        this.zone = null;
        this.aircraft = null;
        this.parachutes = new Map();
        
        this.init();
    }

    init() {
        // Setup basic scene
        this.setupEnvironment();
        this.setupLighting();
        this.createTerrain();
        this.createZone();
        this.setupWeapons();
        this.createAircraft();
        this.setupEventListeners();
        
        // Start game loop
        this.animate();
    }

    setupEnvironment() {
        // Sky
        this.sky = new Sky();
        this.sky.scale.setScalar(450000);
        this.scene.add(this.sky);

        // Water
        const waterGeometry = new THREE.PlaneGeometry(10000, 10000);
        this.water = new Water(waterGeometry, {
            textureWidth: 512,
            textureHeight: 512,
            waterNormals: new THREE.TextureLoader().load('waternormals.jpg', function(texture) {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            }),
            sunDirection: new THREE.Vector3(),
            sunColor: 0xffffff,
            waterColor: 0x001e0f,
            distortionScale: 3.7,
            fog: this.scene.fog !== undefined
        });
        this.water.rotation.x = -Math.PI / 2;
        this.water.position.y = -10;
        this.scene.add(this.water);
    }

    setupLighting() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(100, 100, 50);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);
    }

    createTerrain() {
        // Create heightmap-based terrain
        const geometry = new THREE.PlaneGeometry(10000, 10000, 100, 100);
        const material = new THREE.MeshStandardMaterial({ 
            color: 0x3c8f3c,
            roughness: 0.8,
            metalness: 0.2
        });

        this.terrain = new THREE.Mesh(geometry, material);
        this.terrain.rotation.x = -Math.PI / 2;
        this.terrain.receiveShadow = true;

        // Add terrain features (buildings, trees, etc)
        this.addTerrainFeatures();
        
        this.scene.add(this.terrain);
    }

    addTerrainFeatures() {
        // Add buildings
        for (let i = 0; i < 50; i++) {
            const building = this.createBuilding();
            const x = (Math.random() - 0.5) * 8000;
            const z = (Math.random() - 0.5) * 8000;
            building.position.set(x, 0, z);
            this.scene.add(building);
        }

        // Add trees
        for (let i = 0; i < 1000; i++) {
            const tree = this.createTree();
            const x = (Math.random() - 0.5) * 9000;
            const z = (Math.random() - 0.5) * 9000;
            tree.position.set(x, 0, z);
            this.scene.add(tree);
        }
    }

    createBuilding() {
        const height = Math.random() * 100 + 50;
        const geometry = new THREE.BoxGeometry(50, height, 50);
        const material = new THREE.MeshStandardMaterial({ color: 0x808080 });
        const building = new THREE.Mesh(geometry, material);
        building.position.y = height / 2;
        building.castShadow = true;
        return building;
    }

    createTree() {
        const trunkGeometry = new THREE.CylinderGeometry(2, 3, 15, 8);
        const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x4d2926 });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);

        const leavesGeometry = new THREE.ConeGeometry(10, 20, 8);
        const leavesMaterial = new THREE.MeshStandardMaterial({ color: 0x2d5a27 });
        const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
        leaves.position.y = 15;

        const tree = new THREE.Group();
        tree.add(trunk);
        tree.add(leaves);
        return tree;
    }

    createZone() {
        // Create shrinking play zone
        const geometry = new THREE.CylinderGeometry(4000, 4000, 1000, 32, 1, true);
        const material = new THREE.MeshBasicMaterial({
            color: 0x0099ff,
            transparent: true,
            opacity: 0.2,
            side: THREE.DoubleSide
        });

        this.zone = new THREE.Mesh(geometry, material);
        this.zone.position.y = 500;
        this.scene.add(this.zone);
    }

    setupWeapons() {
        const weapons = [
            { name: 'Assault Rifle', damage: 30, range: 500 },
            { name: 'Shotgun', damage: 80, range: 50 },
            { name: 'Sniper Rifle', damage: 100, range: 1000 },
            { name: 'Pistol', damage: 20, range: 100 }
        ];

        // Randomly place weapons on the map
        weapons.forEach((weapon, index) => {
            const weaponMesh = this.createWeaponMesh();
            const x = (Math.random() - 0.5) * 8000;
            const z = (Math.random() - 0.5) * 8000;
            weaponMesh.position.set(x, 5, z);
            this.weapons.set(index, {
                mesh: weaponMesh,
                ...weapon
            });
            this.scene.add(weaponMesh);
        });
    }

    createWeaponMesh() {
        // Simple weapon representation
        const geometry = new THREE.BoxGeometry(5, 2, 20);
        const material = new THREE.MeshStandardMaterial({ color: 0x666666 });
        return new THREE.Mesh(geometry, material);
    }

    createAircraft() {
        const geometry = new THREE.CylinderGeometry(10, 10, 100, 8);
        const material = new THREE.MeshStandardMaterial({ color: 0x444444 });
        this.aircraft = new THREE.Mesh(geometry, material);
        this.aircraft.rotation.z = Math.PI / 2;
        this.aircraft.position.set(-5000, 1000, 0);
        this.scene.add(this.aircraft);
    }

    createParachute(playerId) {
        const canopyGeometry = new THREE.ConeGeometry(10, 15, 8, 1, true);
        const canopyMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const canopy = new THREE.Mesh(canopyGeometry, canopyMaterial);

        const stringGeometry = new THREE.CylinderGeometry(0.1, 0.1, 20);
        const stringMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
        const strings = new THREE.Mesh(stringGeometry, stringMaterial);
        strings.position.y = -10;

        const parachute = new THREE.Group();
        parachute.add(canopy);
        parachute.add(strings);

        this.parachutes.set(playerId, parachute);
        this.scene.add(parachute);
    }

    updateGameState() {
        switch (this.currentState) {
            case this.gameState.LOBBY:
                if (this.players.size >= 2) { // Minimum players requirement
                    this.currentState = this.gameState.COUNTDOWN;
                }
                break;

            case this.gameState.COUNTDOWN:
                this.countdown--;
                if (this.countdown <= 0) {
                    this.currentState = this.gameState.FLYING;
                    this.startFlight();
                }
                break;

            case this.gameState.FLYING:
                this.updateAircraftPosition();
                break;

            case this.gameState.PARACHUTING:
                this.updateParachutes();
                break;

            case this.gameState.PLAYING:
                this.updateZone();
                this.checkPlayerCollisions();
                break;
        }
    }

    startFlight() {
        // Reset aircraft position and start flight path
        this.aircraft.position.set(-5000, 1000, 0);
        this.camera.position.copy(this.aircraft.position);
        this.camera.position.y += 50;
    }

    updateAircraftPosition() {
        // Move aircraft across the map
        this.aircraft.position.x += 10;
        if (this.aircraft.position.x > 5000) {
            this.currentState = this.gameState.PARACHUTING;
        }
    }

    updateParachutes() {
        this.parachutes.forEach((parachute, playerId) => {
            // Update parachute physics
            parachute.position.y -= 2;
            if (parachute.position.y <= 0) {
                this.scene.remove(parachute);
                this.parachutes.delete(playerId);
                if (this.parachutes.size === 0) {
                    this.currentState = this.gameState.PLAYING;
                }
            }
        });
    }

    updateZone() {
        // Shrink the play zone over time
        const scale = this.zone.scale.x;
        if (scale > 0.2) {
            this.zone.scale.x -= 0.0001;
            this.zone.scale.z -= 0.0001;
        }
    }

    checkPlayerCollisions() {
        // Check for player collisions with weapons and zone
        this.players.forEach((player, playerId) => {
            // Check weapon pickups
            this.weapons.forEach((weapon, weaponId) => {
                if (player.position.distanceTo(weapon.mesh.position) < 5) {
                    this.pickupWeapon(playerId, weaponId);
                }
            });

            // Check if player is outside zone
            const distance = new THREE.Vector2(player.position.x, player.position.z).length();
            if (distance > this.zone.scale.x * 4000) {
                this.damagePlayer(playerId, 1);
            }
        });
    }

    pickupWeapon(playerId, weaponId) {
        const weapon = this.weapons.get(weaponId);
        this.scene.remove(weapon.mesh);
        this.weapons.delete(weaponId);
        // Add weapon to player inventory
        const player = this.players.get(playerId);
        player.weapons.push(weapon);
    }

    damagePlayer(playerId, amount) {
        const player = this.players.get(playerId);
        player.health -= amount;
        if (player.health <= 0) {
            this.eliminatePlayer(playerId);
        }
    }

    eliminatePlayer(playerId) {
        const player = this.players.get(playerId);
        this.scene.remove(player);
        this.players.delete(playerId);
        if (this.players.size === 1) {
            this.endGame();
        }
    }

    endGame() {
        // Handle game end
        console.log('Game Over');
        // Show winner screen
        this.currentState = this.gameState.LOBBY;
        this.reset();
    }

    reset() {
        this.countdown = 30;
        this.setupWeapons();
        this.zone.scale.set(1, 1, 1);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        this.updateGameState();
        this.renderer.render(this.scene, this.camera);
    }

    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }
}

// Initialize game
const game = new BattleRoyaleGame();

export default BattleRoyaleGame;
