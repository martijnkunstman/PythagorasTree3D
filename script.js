let scene, renderer, camera, controls, material;

let pointGlobal;
let directionGlobal;
let lengthGlobal = 10;
let shrinkGlobal = 0.6;
let branchesGlobal =3;
let angleGlobal;

function init() {
  lengthGlobal = 10;
  //renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth - 50, window.innerHeight - 50);
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
  const color = 0x000000; // white
  scene.fog = new THREE.Fog(color, 0, 32);
  //controls
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.autoRotate = true;
  //sphere
  const geometry = new THREE.IcosahedronGeometry(10, 8);
  const material = new THREE.MeshBasicMaterial({ color: 0x777777 });
  material.wireframe = true;
  material.fog = true;
  material.depthWire = true;
  const sphere = new THREE.Mesh(geometry, material);
  scene.add(sphere);
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

function drawLineAndPoint(point, direction, length) {
  if (length > 0.15) {
    const materialLine = new THREE.LineBasicMaterial({ color: 0xffffff });
    const points = [];
    points.push(point.clone());
    points.push(point.clone().add(direction.clone().multiplyScalar(length)));
    const geometryLine = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometryLine, materialLine);
    scene.add(line);
    for (let a = 0; a < branchesGlobal; a++) {
      const angle = Math.PI*2/branchesGlobal*a;
      let direction2 = direction.clone().normalize();
      direction2.cross(
        new THREE.Vector3(
          direction.clone().x+1000,
          direction.clone().y+1000 ,
          direction.clone().z+1000
        )
      );
      //direction2.normalize();
      direction2.applyAxisAngle(direction, angle);
      direction2.normalize();
      direction2.multiplyScalar(1);
      //direction2 = new THREE.Vector3(1, 1, 1);
      drawLineAndPoint(point.clone().add(direction.clone().multiplyScalar(length)), direction2, length* shrinkGlobal)       
    }
 
    /*
    const materialLine = new THREE.LineBasicMaterial({ color: 0xffffff });
    const points = [];
    points.push(point.clone());
    points.push(point.clone().add(direction).multiplyScalar(length));
    const geometryLine = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometryLine, materialLine);
    scene.add(line);
    //
    const dotGeometry = new THREE.BufferGeometry();
    dotGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(
        new Float32Array([
          point.clone().add(direction).multiplyScalar(length).x,
          point.clone().add(direction).multiplyScalar(length).y,
          point.clone().add(direction).multiplyScalar(length).z
        ]),
        3
      )
    );

    const amount = 3;
    for (a = 0; a < amount; a++) {
      const angle = (Math.PI / (amount / 2)) * a;
      //line 2 - start
      const materialLine2 = new THREE.LineBasicMaterial({ color: 0x00ff00 });
      const points2 = [];
      points2.push(point.clone().add(direction).multiplyScalar(length));
      const pointNew = point.clone().add(direction).multiplyScalar(length);

      const direction2 = direction.clone();
      //direction2.applyAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI/2);
      //0 = x1*x2 + y1*y2 + z1*z2;
      direction2.cross(
        new THREE.Vector3(
          direction.x - 0.5,
          direction.y - 0.5,
          direction.z - 0.5
        )
      );
      direction2.normalize();
      direction2.multiplyScalar(Math.sqrt(1 - Math.pow(length / lengthGlobal, 2)) * lengthGlobal);

      direction2.applyAxisAngle(direction, angle);

      pointNew.add(direction2);
      points2.push(pointNew);
      const geometryLine2 = new THREE.BufferGeometry().setFromPoints(points2);
      const line2 = new THREE.Line(geometryLine2, materialLine2);
      scene.add(line2);
      //line 2 - end
      drawLineAndPoint(direction2, pointNew, length);
    }
    */
  } else {
    //lengthGlobal = 10;
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