import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import landDots from "@/data/landDots.json";
import { deck, type Pose } from "@/lib/deck";

const D2R = Math.PI / 180;

function ll(lat: number, lon: number, r = 1) {
  const phi = (90 - lat) * D2R;
  const th = (lon + 180) * D2R;
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(th),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(th),
  );
}

const CITIES: Record<string, [number, number]> = {
  ub: [47.92, 106.92],
  beijing: [39.9, 116.4],
  shanghai: [31.23, 121.47],
  seoul: [37.57, 126.98],
  tokyo: [35.68, 139.69],
  hanoi: [21.03, 105.85],
  singapore: [1.35, 103.82],
  bengaluru: [12.97, 77.59],
  dubai: [25.2, 55.27],
  nairobi: [-1.29, 36.82],
  lagos: [6.52, 3.38],
  cairo: [30.04, 31.24],
  istanbul: [41.0, 28.98],
  berlin: [52.52, 13.4],
  paris: [48.86, 2.35],
  london: [51.5, -0.13],
  moscow: [55.75, 37.62],
  newyork: [40.71, -74.0],
  sf: [37.77, -122.42],
  mexico: [19.43, -99.13],
  saopaulo: [-23.55, -46.63],
  sydney: [-33.87, 151.21],
  joburg: [-26.2, 28.05],
  toronto: [43.65, -79.38],
};

const ROUTES: [string, string][] = [
  ["ub", "beijing"], ["ub", "seoul"], ["ub", "berlin"], ["ub", "tokyo"], ["ub", "moscow"],
  ["london", "newyork"], ["newyork", "saopaulo"], ["london", "lagos"], ["lagos", "saopaulo"],
  ["paris", "cairo"], ["cairo", "nairobi"], ["nairobi", "dubai"], ["dubai", "bengaluru"],
  ["bengaluru", "singapore"], ["berlin", "istanbul"], ["istanbul", "dubai"], ["moscow", "berlin"],
  ["sf", "tokyo"], ["sf", "newyork"], ["toronto", "london"], ["mexico", "sf"],
  ["joburg", "nairobi"], ["sydney", "singapore"], ["shanghai", "sf"], ["hanoi", "singapore"],
  ["seoul", "hanoi"], ["beijing", "dubai"], ["bengaluru", "london"], ["shanghai", "sydney"],
  ["joburg", "london"],
];

const shortAngle = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));
const damp = (cur: number, target: number, k: number, dt: number) =>
  cur + (target - cur) * (1 - Math.exp(-k * dt));

export class GlobeScene {
  private renderer: THREE.WebGLRenderer;
  private composer: EffectComposer;
  private bloom: UnrealBloomPass;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private clock = new THREE.Clock();
  private raf = 0;

  private root = new THREE.Group();
  private spin = new THREE.Group();

  private uTime = { value: 0 };
  private uColor = { value: new THREE.Color("#38e1ff") };
  private uColor2 = { value: new THREE.Color("#7c5cff") };
  private uDim = { value: 1 };
  private uArcs = { value: 1 };
  private uTravel = { value: 0 };
  private uPixelRatio = { value: 1 };

  private rings: { mesh: THREE.Mesh; phase: number }[] = [];
  private focusGroup = new THREE.Group();
  private focusMat: THREE.MeshBasicMaterial;
  private beamMat: THREE.MeshBasicMaterial;
  private satellites: { mesh: THREE.Mesh; ring: THREE.Object3D; speed: number; r: number; a: number }[] = [];
  private gridMat: THREE.LineBasicMaterial;
  private orbitMats: THREE.MeshBasicMaterial[] = [];

  // Одоогийн (зөөлрүүлсэн) байрлал
  private cur = { x: 0, y: -1, s: 2.4, dim: 1, arcs: 1, tilt: 0.35, spin: 0 };
  private freeSpin = 0;
  private tmpColor = new THREE.Color();
  private tmpColorB = new THREE.Color();
  private white = new THREE.Color(1, 1, 1);
  private zAxis = new THREE.Vector3(0, 0, 1);

  constructor(private canvas: HTMLCanvasElement, private poses: Pose[]) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
    this.renderer.setClearColor(0x02040a, 1);
    this.camera = new THREE.PerspectiveCamera(40, 1, 0.1, 200);
    this.camera.position.set(0, 0, 6);

    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    this.bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.6, 0.5, 0.2);
    this.composer.addPass(this.bloom);
    this.composer.addPass(new OutputPass());

    this.scene.add(this.root);
    this.root.add(this.spin);

    this.buildNebula();
    this.buildStars();
    this.buildGlobe();
    this.buildArcs();
    this.buildCities();
    this.buildFocus();
    this.buildOrbits();

    this.gridMat = this.spin.userData.gridMat;
    this.focusMat = this.focusGroup.userData.ringMat;
    this.beamMat = this.focusGroup.userData.beamMat;

    this.resize();
    window.addEventListener("resize", this.resize);
    this.loop();
  }

  // ---------- Бүтээх ----------

  private buildNebula() {
    const geo = new THREE.PlaneGeometry(2, 2);
    const mat = new THREE.ShaderMaterial({
      depthWrite: false,
      depthTest: false,
      uniforms: { uTime: this.uTime, uColor: this.uColor, uColor2: this.uColor2 },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.999, 1.0); }
      `,
      fragmentShader: /* glsl */ `
        varying vec2 vUv;
        uniform float uTime; uniform vec3 uColor; uniform vec3 uColor2;
        float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
        float noise(vec2 p){
          vec2 i = floor(p), f = fract(p);
          vec2 u = f*f*(3.0-2.0*f);
          return mix(mix(hash(i), hash(i+vec2(1,0)), u.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), u.x), u.y);
        }
        float fbm(vec2 p){ float v=0.0, a=0.5; for(int i=0;i<5;i++){ v+=a*noise(p); p*=2.03; a*=0.5; } return v; }
        void main(){
          vec2 p = vUv*2.0-1.0;
          float t = uTime*0.03;
          float n = fbm(p*1.6 + vec2(t, -t*0.7) + fbm(p*2.2 - t));
          float n2 = fbm(p*2.4 - vec2(t*1.3, t*0.4));
          vec3 col = vec3(0.008, 0.012, 0.03);
          col += uColor * pow(n, 3.0) * 0.32 * smoothstep(1.6, 0.2, length(p - vec2(0.55, 0.3)));
          col += uColor2 * pow(n2, 3.0) * 0.28 * smoothstep(1.7, 0.1, length(p + vec2(0.6, 0.45)));
          float vig = smoothstep(1.7, 0.35, length(p));
          gl_FragColor = vec4(col * vig, 1.0);
        }
      `,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.frustumCulled = false;
    mesh.renderOrder = -10;
    this.scene.add(mesh);
  }

  private buildStars() {
    const count = 3200;
    const pos = new Float32Array(count * 3);
    const rnd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 70;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 44;
      pos[i * 3 + 2] = Math.random() * 70;
      rnd[i] = Math.random();
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("aRand", new THREE.BufferAttribute(rnd, 1));
    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uTime: this.uTime, uTravel: this.uTravel, uPixelRatio: this.uPixelRatio, uColor: this.uColor },
      vertexShader: /* glsl */ `
        attribute float aRand;
        uniform float uTime; uniform float uTravel; uniform float uPixelRatio;
        varying float vA; varying float vR;
        void main(){
          vec3 p = position;
          p.z = mod(p.z + uTravel * (0.6 + aRand), 70.0) - 64.0;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_Position = projectionMatrix * mv;
          float tw = 0.65 + 0.35 * sin(uTime * (1.0 + aRand * 3.0) + aRand * 50.0);
          gl_PointSize = (1.2 + aRand * 2.2) * uPixelRatio * tw * (14.0 / -mv.z);
          vA = smoothstep(-64.0, -40.0, p.z) * smoothstep(6.0, 0.0, p.z) * tw;
          vR = aRand;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uColor;
        varying float vA; varying float vR;
        void main(){
          float d = length(gl_PointCoord - 0.5);
          if (d > 0.5) discard;
          float a = smoothstep(0.5, 0.0, d);
          vec3 col = mix(vec3(0.75, 0.85, 1.0), uColor, step(0.82, vR) * 0.8);
          gl_FragColor = vec4(col, a * vA * 0.9);
        }
      `,
    });
    const pts = new THREE.Points(geo, mat);
    pts.frustumCulled = false;
    this.scene.add(pts);
  }

  private buildGlobe() {
    // Дотор бөмбөлөг — арын цэгүүдийг далдлах, ирмэгийн гэрэл
    const core = new THREE.Mesh(
      new THREE.SphereGeometry(1, 96, 96),
      new THREE.ShaderMaterial({
        uniforms: { uColor: this.uColor, uDim: this.uDim },
        vertexShader: /* glsl */ `
          varying vec3 vN; varying vec3 vV;
          void main(){
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            vN = normalize(normalMatrix * normal);
            vV = normalize(-mv.xyz);
            gl_Position = projectionMatrix * mv;
          }
        `,
        fragmentShader: /* glsl */ `
          uniform vec3 uColor; uniform float uDim;
          varying vec3 vN; varying vec3 vV;
          void main(){
            float f = pow(1.0 - max(dot(vN, vV), 0.0), 2.6);
            vec3 base = vec3(0.012, 0.02, 0.045);
            gl_FragColor = vec4(base + uColor * f * 0.4 * uDim, 1.0);
          }
        `,
      }),
    );
    this.spin.add(core);

    // Тивүүдийн цэгүүд
    const dots = landDots as number[];
    const n = dots.length / 2;
    const pos = new Float32Array(n * 3);
    const rnd = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const v = ll(dots[i * 2], dots[i * 2 + 1], 1.004);
      pos[i * 3] = v.x;
      pos[i * 3 + 1] = v.y;
      pos[i * 3 + 2] = v.z;
      rnd[i] = Math.random();
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("aRand", new THREE.BufferAttribute(rnd, 1));
    const land = new THREE.Points(
      geo,
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: this.uTime,
          uColor: this.uColor,
          uColor2: this.uColor2,
          uDim: this.uDim,
          uPixelRatio: this.uPixelRatio,
        },
        vertexShader: /* glsl */ `
          attribute float aRand;
          uniform float uTime; uniform float uPixelRatio;
          varying float vFacing; varying float vR; varying float vWave;
          void main(){
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            vec3 n = normalize(normalMatrix * position);
            vFacing = dot(n, normalize(-mv.xyz));
            vR = aRand;
            // Гадаргуугаар гүйх долгион
            vWave = smoothstep(0.92, 1.0, sin(position.y * 6.0 - uTime * 1.4 + position.x * 2.0) * 0.5 + 0.5);
            float pulse = 1.0 + 0.3 * sin(uTime * 2.0 + aRand * 40.0);
            gl_PointSize = (2.3 + vWave * 1.6) * pulse * uPixelRatio * (6.0 / -mv.z) * 1.15;
            gl_Position = projectionMatrix * mv;
          }
        `,
        fragmentShader: /* glsl */ `
          uniform vec3 uColor; uniform vec3 uColor2; uniform float uDim;
          varying float vFacing; varying float vR; varying float vWave;
          void main(){
            float d = length(gl_PointCoord - 0.5);
            if (d > 0.5) discard;
            float a = smoothstep(0.5, 0.05, d);
            float rim = smoothstep(-0.05, 0.7, vFacing);
            vec3 col = mix(uColor2, uColor, 0.35 + vR * 0.65);
            col = mix(col, vec3(1.0), vWave * 0.55);
            gl_FragColor = vec4(col * (0.55 + 0.9 * rim), a * uDim * (0.2 + 0.8 * rim));
          }
        `,
      }),
    );
    this.spin.add(land);

    // Өргөрөг, уртрагийн шугамууд
    const gridPts: THREE.Vector3[] = [];
    for (let lat = -60; lat <= 60; lat += 30) {
      for (let lon = -180; lon < 180; lon += 3) {
        gridPts.push(ll(lat, lon, 1.002), ll(lat, lon + 3, 1.002));
      }
    }
    for (let lon = -180; lon < 180; lon += 30) {
      for (let lat = -84; lat < 84; lat += 3) {
        gridPts.push(ll(lat, lon, 1.002), ll(lat + 3, lon, 1.002));
      }
    }
    const gridMat = new THREE.LineBasicMaterial({
      color: this.uColor.value,
      transparent: true,
      opacity: 0.08,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.spin.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(gridPts), gridMat));
    this.spin.userData.gridMat = gridMat;

    // Агаар мандлын туяа
    const atmo = new THREE.Mesh(
      new THREE.SphereGeometry(1.16, 64, 64),
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: { uColor: this.uColor, uDim: this.uDim },
        vertexShader: /* glsl */ `
          varying vec3 vN;
          void main(){ vN = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
        `,
        fragmentShader: /* glsl */ `
          uniform vec3 uColor; uniform float uDim;
          varying vec3 vN;
          void main(){
            float k = clamp(-vN.z, 0.0, 1.0);
            float i = pow(k, 1.4) * 0.75;
            gl_FragColor = vec4(uColor * 1.15, i * uDim);
          }
        `,
      }),
    );
    this.root.add(atmo);
  }

  private buildArcs() {
    const tubeShader = {
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
      `,
      fragmentShader: /* glsl */ `
        uniform float uTime; uniform float uOffset; uniform float uSpeed; uniform float uArcs; uniform float uDim;
        uniform vec3 uColor;
        varying vec2 vUv;
        void main(){
          float head = fract(uTime * uSpeed + uOffset) * 1.5 - 0.25;
          float x = vUv.x;
          float trail = smoothstep(head - 0.32, head, x) * step(x, head);
          float tip = smoothstep(0.03, 0.0, abs(x - head));
          float base = 0.09;
          vec3 col = mix(uColor, vec3(1.0), tip * 0.8);
          gl_FragColor = vec4(col * 1.4, (base + trail * 0.9 + tip) * uArcs * uDim);
        }
      `,
    };
    ROUTES.forEach(([a, b], i) => {
      const va = ll(...CITIES[a], 1);
      const vb = ll(...CITIES[b], 1);
      const angle = va.angleTo(vb);
      const lift = 0.08 + angle * 0.22;
      const pts: THREE.Vector3[] = [];
      // Том дугуйн дагуу slerp
      const q = new THREE.Quaternion().setFromUnitVectors(va, vb);
      for (let k = 0; k <= 48; k++) {
        const t = k / 48;
        const qt = new THREE.Quaternion().slerp(q, t);
        const v = va.clone().applyQuaternion(qt);
        v.multiplyScalar(1 + Math.sin(Math.PI * t) * lift);
        pts.push(v);
      }
      const curve = new THREE.CatmullRomCurve3(pts);
      const mat = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: this.uTime,
          uColor: this.uColor,
          uArcs: this.uArcs,
          uDim: this.uDim,
          uOffset: { value: (i * 0.137) % 1 },
          uSpeed: { value: 0.14 + ((i * 7) % 5) * 0.025 },
        },
        ...tubeShader,
      });
      this.spin.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 64, 0.0042, 6, false), mat));
    });
  }

  private buildCities() {
    const ringGeo = new THREE.RingGeometry(0.018, 0.024, 32);
    const dotGeo = new THREE.SphereGeometry(0.011, 12, 12);
    Object.values(CITIES).forEach(([lat, lon], i) => {
      const p = ll(lat, lon, 1.006);
      const dot = new THREE.Mesh(dotGeo, new THREE.MeshBasicMaterial({ color: 0xffffff }));
      dot.position.copy(p);
      this.spin.add(dot);
      const ring = new THREE.Mesh(
        ringGeo,
        new THREE.MeshBasicMaterial({
          color: this.uColor.value,
          transparent: true,
          side: THREE.DoubleSide,
          depthWrite: false,
