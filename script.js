let scene, renderer, camera, controls, material;

let pointGlobal;
let directionGlobal;
let lengthGlobal = 10;
let shrinkGlobal = 0.65;
let branchesGlobal = 3;
let angleGlobal;

function init() {
  
  lengthGlobal = 10;
  //renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth - 50, window.innerHeight - 50);
  renderer.shadowMap.enabled = true;
  renderer.shadowMapSoft = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

  document.body.innerHTML = "";
  document.body.appendChild(renderer.domElement);
  //camera
  const fov = 75;
  const aspect = window.innerWidth / window.innerHeight; // the canvas default
  const near = 1;
  const far = 100;
  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 10;
  camera.position.x = 10;
  camera.position.y = 10;
  camera.lookAt(0, 0, 0);
  //scene
  scene = new THREE.Scene();
  const color = 0xaabbcc; // white
  scene.background = new THREE.Color( 0x24488C );
  scene.fog = new THREE.Fog(color, 0, 32);
  //controls
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.autoRotate = true;
  //light
  const ambientLight = new THREE.AmbientLight(0x8c4524); // soft white light
  scene.add(ambientLight);
  //DirectionalLight
  //Create a DirectionalLight and turn on shadows for the light
  const light = new THREE.PointLight(0xddcc11, 0.8);
  light.position.set(20, 40, 10); //default; light shining from top
  light.castShadow = true; // default false
  light.shadow.radius = 4;
  scene.add(light);

  //Set up shadow properties for the light
  light.shadow.mapSize.width = 2048; // default
  light.shadow.mapSize.height = 2048; // default
  light.shadow.camera.near = 0.5; // default
  light.shadow.camera.far = 50; // default
  //sphere
  const geometry = new THREE.IcosahedronGeometry(10, 8);
  const material = new THREE.MeshBasicMaterial({ color: 0x112233 });
  material.wireframe = true;
  material.fog = true;
  material.depthWire = true;
  const sphere = new THREE.Mesh(geometry, material);
  //scene.add(sphere);
  //
  directionGlobal = new THREE.Vector3(0, -1, 0);
  directionGlobal.randomDirection();
  drawLineAndPoint(
    directionGlobal.clone().multiplyScalar(lengthGlobal),
    directionGlobal.clone().negate(),
    lengthGlobal
  );
  //setTimeout(init, 10000);
}

function cylinderMesh(pointX, pointY, width) {
  // edge from X to Y
  var direction = new THREE.Vector3().subVectors(pointY, pointX);
  const material = new THREE.MeshStandardMaterial({ color: 0xffeedd });
  // Make the geometry (of "direction" length)
  var geometry = new THREE.CylinderGeometry(width * shrinkGlobal, width, direction.length(), 16, 1, false);
  // shift it so one end rests on the origin
  geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, direction.length() / 2, 0));
  // rotate it the right way for lookAt to work
  geometry.applyMatrix4(new THREE.Matrix4().makeRotationX(THREE.MathUtils.degToRad(90)));
  // Make a mesh with the geometry
  var mesh = new THREE.Mesh(geometry, material);
  // Position it where we want
  mesh.position.copy(pointX);
  // And make it point to where we want
  mesh.lookAt(pointY);
  mesh.castShadow = true; 
  mesh.receiveShadow = true;
  return mesh;
}

function drawLineAndPoint(point, direction, length) {
  if (length > 0.4) {
    const materialLine = new THREE.LineBasicMaterial({ color: 0xaaccbb});
    const points = [];
    points.push(point.clone());
    points.push(point.clone().add(direction.clone().multiplyScalar(length)));

    /*
    //line
    const geometryLine = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometryLine, materialLine);
    scene.add(line);
    
    //cylinder
    const geometryCylinder = new THREE.CylinderGeometry( length*0.1, length*shrinkGlobal*0.1, length, 32 );
    const material = new THREE.MeshBasicMaterial( {color: 0xaaaaaa} );
    const cylinder = new THREE.Mesh( geometryCylinder, material );
    //scene.add( cylinder );
    */

    const mesh = cylinderMesh(points[0], points[1], length / 4);
    mesh.castShadow = true; //default is false
    scene.add(mesh);

    for (let a = 0; a < branchesGlobal; a++) {
      const angle = Math.PI * 2 / branchesGlobal * a;
      let direction2 = direction.clone().normalize();
      direction2.cross(
        new THREE.Vector3(
          direction.clone().x + 1000,
          direction.clone().y + 1000,
          direction.clone().z + 1000
        )
      );
      direction2.applyAxisAngle(direction, angle);
      direction2.normalize();
      direction2.multiplyScalar(1);
      drawLineAndPoint(point.clone().add(direction.clone().multiplyScalar(length)), direction2, length * shrinkGlobal)
    }
  }
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

init();
animate();

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}