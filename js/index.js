// Set up scene and renderer
const scene = new THREE.Scene();

// PerspectiveCamera(fov, aspect, near, far)
// todo: Resizing windows: http://jsfiddle.net/Q4Jpu/
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Geometry Helper functions
v3 = (x, y, z) => new THREE.Vector3(x, y, z);
f3 = (a, b, c) => new THREE.Face3(a, b, c);

const birdsAttrs = [
    {
        position: {x: 15, y: 10, z: 10},
        position_offset: {x: 2, y: 1, z: -3},
        look_at: {x: 7, y: 0, z: 0},
        scale: 0.2,
    },
    {
        position: {x: -15, y: 35, z: 0},
        position_offset: {x: 3, y: 2, z: -3},
        look_at: {x: -7, y: 0, z: 0},
        scale: 0.3
    },
    {
        position: {x: 20, y: 10, z: 7},
        position_offset: {x: -5, y: 4, z: -3},
        look_at: {x: 15, y: 0, z: 0},
        scale: 0.27
    },
    {
        position: {x: 10, y: 15, z: 0},
        position_offset: {x: 1, y: 3, z: 2},
        look_at: {x: 5, y: -5, z: 0},
        scale: 0.31
    },
    {
        position: {x: 5, y: 10, z: -2},
        position_offset: {x: 0, y: 3, z: 2},
        look_at: {x: 0, y: -5, z: 0},
        scale: 0.29
    },
];

let t = 0.0;
let timeDamp = 200;

const animate = function () {
    requestAnimationFrame(animate);

    birds.forEach((bird, i) => {
        let bA = birdsAttrs[i];
        bird.position.x = bA.position.x * Math.cos(t) + bA.position_offset.x;
        bird.position.z = bA.position.y * Math.sin(t) + bA.position_offset.y;
        bird.position.y = bA.position.z * Math.sin(t) + bA.position_offset.z;
        bird.lookAt(
            v3(bA.look_at.x, bA.look_at.y, bA.look_at.z)
        );
    })
    // if time exceeds 2pi rads, reset it back to 0
    t = (t > 2 * Math.PI) ? 0 : t + (2 * Math.PI) / timeDamp

    renderer.render(scene, camera);
};


let birdVertices = [
    [5, 0, 0],
    [-5, -2, 1],
    [-5, 0, 0],
    [-5, -2, -1],
    [0, 2, -6],
    [0, 2, 6],
    [2, 0, 0],
    [-3, 0, 0]
];

let birds = [];
const birdColour = '#e2eff1';
const backgroundColour = '#365d7e';

birdsAttrs.forEach(attr => {
    const {scale} = attr;
    const b = new THREE.Geometry();
    
    birdVertices.forEach(vert => b.vertices.push(v3(...vert)));
    b.faces.push(f3(0, 2, 1));
    b.faces.push(f3(4, 7, 6));
    b.faces.push(f3(5, 6, 7));
    b.computeVertexNormals();
    
    const mat = new THREE.MeshBasicMaterial({
        color: birdColour, 
        side: THREE.DoubleSide
    });
    const birdMesh = new THREE.Mesh(b, mat);

    birdMesh.scale.set(scale, scale, scale);
    birds.push(birdMesh);

    scene.add(birdMesh);
    scene.add(new THREE.AxesHelper(100));
})

renderer.setClearColor(backgroundColour);
renderer.setSize(window.innerWidth, window.innerHeight);

camera.lookAt(scene.position);
camera.position.x = 1;
camera.position.y = -2;
camera.position.z = 75;

animate()
