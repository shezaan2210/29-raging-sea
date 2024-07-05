import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import waterVertexShader from './shaders/water/vertex.glsl'
import waterFragmentShader from './shaders/water/fragment.glsl'

console.log(waterVertexShader)
console.log(waterFragmentShader)
/**
 * Base
 */
// Debug
const gui = new GUI({ width: 340 })
const debugObject = {}
debugObject.depthColor = '#1d86bf'
debugObject.surfaceColor = '#bfbfbf'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Water
 */
// Geometry
const waterGeometry = new THREE.PlaneGeometry(2, 2, 512, 512)

// Material
const waterMaterial = new THREE.ShaderMaterial({
    vertexShader: waterVertexShader,
    fragmentShader: waterFragmentShader,
    uniforms: {
        uWaveElevation: {value: 0.2},
        uWaveFrequency: {value: new THREE.Vector2(4, 2)},
        uTime: {value: 0},
        uWaveSpeed: {value: .75},
        uDepthColor: {value: new THREE.Color(debugObject.depthColor)},
        uSurfaceColor: {value: new THREE.Color(debugObject.surfaceColor)},
        uColorOffset: {value: 0.08},
        uColorMultiplier: {value: 2},
    }
})
gui.add(waterMaterial.uniforms.uWaveElevation, 'value').min(0).max(1).step(.001).name('Elevation Y')
gui.add(waterMaterial.uniforms.uWaveFrequency.value, 'x').min(0).max(10).step(.001).name('Frequency X')
gui.add(waterMaterial.uniforms.uWaveFrequency.value, 'y').min(0).max(10).step(.001).name('Frequency Y')
gui.add(waterMaterial.uniforms.uWaveSpeed, 'value').min(0).max(10).step(.001).name('Wave Speed')
gui.add(waterMaterial.uniforms.uColorOffset, 'value').min(0).max(1).step(.001).name('Color Offset')
gui.add(waterMaterial.uniforms.uColorMultiplier, 'value').min(0).max(1).step(.001).name('Color Multiplier')

gui.addColor(debugObject, 'depthColor').name('Depth Color').onChange(()=> {
    waterMaterial.uniforms.uDepthColor.value.set(debugObject.depthColor)
})
gui.addColor(debugObject, 'surfaceColor').name('Surface Color').onChange(()=> {
    waterMaterial.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor)
})

// Mesh
const water = new THREE.Mesh(waterGeometry, waterMaterial)
water.rotation.x = - Math.PI * 0.5
scene.add(water)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(1, 1, 1)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update water time
    waterMaterial.uniforms.uTime.value = elapsedTime
    // waterMaterial.uniforms.uWaveSpeed.value = elapsedTime - waterMaterial.uniforms.uTime.value
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()