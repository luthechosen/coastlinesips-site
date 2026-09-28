// Coastline Sips — 3D coupe mocktail with a hibiscus flower and citrus wheel. Drag to rotate.
(function () {
  var stage = document.getElementById('stage');
  if (!stage || !window.THREE) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.set(0, 3.1, 8.6);
  camera.lookAt(0, 1.55, 0);

  var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  stage.appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(0xfff4ea, 0.75));
  var key = new THREE.DirectionalLight(0xfff0dc, 0.95); key.position.set(4, 7, 6); scene.add(key);
  var rim = new THREE.DirectionalLight(0xbfe3da, 0.6); rim.position.set(-5, 3, -4); scene.add(rim);
  var glow = new THREE.PointLight(0xf4b064, 0.6, 20); glow.position.set(0, 3, -3); scene.add(glow);

  var drink = new THREE.Group();
  scene.add(drink);

  // Coupe glass profile (lathe)
  function bowlR(t) { return 0.1 + 1.28 * Math.sqrt(t); }
  var gp = [
    new THREE.Vector2(0.001, 0), new THREE.Vector2(0.9, 0), new THREE.Vector2(0.9, 0.05),
    new THREE.Vector2(0.18, 0.12), new THREE.Vector2(0.08, 0.3), new THREE.Vector2(0.07, 1.45),
    new THREE.Vector2(0.09, 1.62)
  ];
  for (var i = 0; i <= 24; i++) {
    var t = i / 24;
    gp.push(new THREE.Vector2(bowlR(t), 1.62 + 0.9 * t));
  }
  var glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff, transparent: true, opacity: 0.22, roughness: 0.04, metalness: 0,
    clearcoat: 1, clearcoatRoughness: 0.05, side: THREE.DoubleSide, depthWrite: false
  });
  var glass = new THREE.Mesh(new THREE.LatheGeometry(gp, 64), glassMat);
  glass.renderOrder = 3;
  drink.add(glass);

  // Rim highlight
  var rimRing = new THREE.Mesh(new THREE.TorusGeometry(bowlR(1), 0.018, 8, 80),
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1, metalness: 0.3, transparent: true, opacity: 0.8 }));
  rimRing.rotation.x = Math.PI / 2; rimRing.position.y = 2.52; drink.add(rimRing);

  // Liquid (hibiscus pink) fills the bowl to ~80%
  var fill = 0.8;
  var lp = [new THREE.Vector2(0.001, 1.66)];
  for (var j = 0; j <= 20; j++) {
    var tt = (j / 20) * fill;
    lp.push(new THREE.Vector2(bowlR(tt) * 0.95, 1.66 + 0.9 * tt));
  }
  var fillY = 1.66 + 0.9 * fill;
  lp.push(new THREE.Vector2(0.001, fillY));
  var liquidMat = new THREE.MeshStandardMaterial({ color: 0xe8687f, roughness: 0.25, metalness: 0, transparent: true, opacity: 0.9, emissive: 0x5a1422, emissiveIntensity: 0.25 });
  var liquid = new THREE.Mesh(new THREE.LatheGeometry(lp, 64), liquidMat);
  liquid.renderOrder = 1;
  drink.add(liquid);
  var surface = new THREE.Mesh(new THREE.CircleGeometry(bowlR(fill) * 0.95, 64),
    new THREE.MeshStandardMaterial({ color: 0xe0667c, roughness: 0.55, transparent: true, opacity: 0.97, emissive: 0x4a0f1c, emissiveIntensity: 0.2 }));
  surface.rotation.x = -Math.PI / 2; surface.position.y = fillY + 0.002; surface.renderOrder = 2;
  drink.add(surface);

  // Hibiscus flower floating on the drink
  var flower = new THREE.Group();
  var petalMat = new THREE.MeshStandardMaterial({ color: 0xd9546e, roughness: 0.55, side: THREE.DoubleSide });
  var petalInner = new THREE.MeshStandardMaterial({ color: 0xa8324a, roughness: 0.6 });
  for (var p = 0; p < 5; p++) {
    var petal = new THREE.Mesh(new THREE.SphereGeometry(0.34, 20, 14), petalMat);
    petal.scale.set(1, 0.13, 0.72);
    var a = (p / 5) * Math.PI * 2;
    petal.position.set(Math.cos(a) * 0.3, 0.05, Math.sin(a) * 0.3);
    petal.rotation.y = -a;
    petal.rotation.z = 0.28;
    flower.add(petal);
  }
  var eye = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 12), petalInner);
  eye.scale.set(1, 0.4, 1); eye.position.y = 0.08; flower.add(eye);
  var stamen = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.022, 0.42, 8), new THREE.MeshStandardMaterial({ color: 0xf2e7c9, roughness: 0.5 }));
  stamen.position.y = 0.28; stamen.rotation.z = 0.25; flower.add(stamen);
  for (var s = 0; s < 6; s++) {
    var pollen = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 6), new THREE.MeshStandardMaterial({ color: 0xf2b544, roughness: 0.6 }));
    var sa = (s / 6) * Math.PI * 2;
    pollen.position.set(0.05 + Math.cos(sa) * 0.05, 0.48 + Math.sin(sa) * 0.03, Math.sin(sa) * 0.05);
    flower.add(pollen);
  }
  flower.position.set(-0.35, fillY + 0.04, 0.2);
  flower.rotation.set(0.12, 0.6, -0.05);
  drink.add(flower);

  // Citrus wheel slotted on the rim
  var wheel = new THREE.Group();
  var peel = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.46, 0.07, 40), new THREE.MeshStandardMaterial({ color: 0xe39a26, roughness: 0.55 }));
  wheel.add(peel);
  var flesh = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.075, 40), new THREE.MeshStandardMaterial({ color: 0xf3c04e, roughness: 0.7 }));
  wheel.add(flesh);
  for (var k = 0; k < 8; k++) {
    var seg = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.08, 0.4), new THREE.MeshStandardMaterial({ color: 0xfbe7b0 }));
    seg.rotation.y = (k / 8) * Math.PI; wheel.add(seg);
  }
  wheel.rotation.x = Math.PI / 2;
  wheel.position.set(bowlR(1) - 0.05, 2.62, 0);
  wheel.rotation.z = 0.15;
  drink.add(wheel);

  // Paper straw
  var straw = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 1.9, 12), new THREE.MeshStandardMaterial({ color: 0x1f6e63, roughness: 0.6 }));
  straw.position.set(0.45, 2.6, -0.35); straw.rotation.set(0.25, 0, -0.35);
  drink.add(straw);

  // Rising bubbles
  var bubbles = [];
  var bubMat = new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.55, roughness: 0.1 });
  for (var b = 0; b < 16; b++) {
    var bub = new THREE.Mesh(new THREE.SphereGeometry(0.03 + Math.random() * 0.02, 8, 6), bubMat);
    var ba = Math.random() * Math.PI * 2, br = Math.random() * 0.7;
    bub.userData = { x: Math.cos(ba) * br, z: Math.sin(ba) * br, speed: 0.004 + Math.random() * 0.006 };
    bub.position.set(bub.userData.x, 1.75 + Math.random() * (fillY - 1.8), bub.userData.z);
    drink.add(bub); bubbles.push(bub);
  }

  drink.position.y = -0.2;
  drink.rotation.x = 0.05;

  // Drag to rotate
  var dragging = false, lx = 0, ly = 0, vy = 0, vx = 0, idle = reduce ? 0 : 0.003;
  function pt(e) { return e.touches ? e.touches[0] : e; }
  function down(e) { dragging = true; stage.classList.add('dragging', 'touched'); var p = pt(e); lx = p.clientX; ly = p.clientY; }
  function move(e) {
    if (!dragging) return;
    var p = pt(e), dx = p.clientX - lx, dy = p.clientY - ly; lx = p.clientX; ly = p.clientY;
    drink.rotation.y += dx * 0.009; drink.rotation.x = Math.max(-0.45, Math.min(0.6, drink.rotation.x + dy * 0.005));
    vy = dx * 0.009; vx = dy * 0.005;
    if (e.cancelable) e.preventDefault();
  }
  function up() { dragging = false; stage.classList.remove('dragging'); }
  stage.addEventListener('pointerdown', down);
  window.addEventListener('pointermove', move, { passive: false });
  window.addEventListener('pointerup', up);
  stage.addEventListener('touchstart', down, { passive: true });
  window.addEventListener('touchmove', move, { passive: false });
  window.addEventListener('touchend', up);

  function resize() {
    var w = stage.clientWidth, h = stage.clientHeight;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize); resize();

  var clock = new THREE.Clock();
  (function animate() {
    requestAnimationFrame(animate);
    var t = clock.getElapsedTime();
    if (!dragging) {
      drink.rotation.y += vy + idle;
      drink.rotation.x = Math.max(-0.45, Math.min(0.6, drink.rotation.x + vx));
      vy *= 0.94; vx *= 0.9;
    }
    if (!reduce) {
      flower.position.y = fillY + 0.04 + Math.sin(t * 1.4) * 0.012;
      flower.rotation.y = 0.6 + Math.sin(t * 0.5) * 0.08;
      for (var i = 0; i < bubbles.length; i++) {
        var bb = bubbles[i]; bb.position.y += bb.userData.speed;
        if (bb.position.y > fillY - 0.02) bb.position.y = 1.72;
      }
    }
    renderer.render(scene, camera);
  })();
})();
