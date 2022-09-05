import THREE from './Three';
import ReactDOM from 'react-dom';
let OrbitControls = require('three-orbit-controls')(THREE);

const DIRECTIONAL_LIGHT = 'directionalLight';

class Paint {
  constructor() {
    this.loader = new THREE.STLLoader();
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
    });
    this.reqNumber = 0;
    this.loaded = false;
    this.light = undefined;
  }

  init(context, sliders, models) {
    this.models = models;
    this.sliders = sliders;
    this.component = context;
    this.width = context.props.width;
    this.height = context.props.height;
    this.modelColor = context.props.modelColor;
    this.backgroundColor = context.props.backgroundColor;
    this.orbitControls = context.props.orbitControls;
    this.rotate = context.props.rotate;
    this.cameraX = context.props.cameraX;
    this.cameraY = context.props.cameraY;
    this.cameraZ = context.props.cameraZ;
    this.rotationSpeeds = context.props.rotationSpeeds;
    this.lights = context.props.lights;
    this.lightColor = context.props.lightColor;
    this.model = context.props.model;

    // if (this.mesh !== undefined) {
    //   this.scene.remove(this.mesh);
    //   this.mesh.geometry.dispose();
    //   this.mesh.material.dispose();
    //   this.scene.remove(this.grid);
    // }

    if (this.animationRequestId) {
      cancelAnimationFrame(this.animationRequestId);
    }

    this.distance = 10000;

    this.reqNumber += 1;
    if (!this.loaded) this.addSTLToScene(this.reqNumber);
    const meshMaterial = this.scene.children.filter(
      (item) => item.type === 'Mesh'
    );
    if (meshMaterial.length === sliders.length) {
      sliders.map((item, index) => {
        meshMaterial[index].material.opacity = item.value;
        // meshMaterial[index].material.visible = visibleSliders[index].value;
        meshMaterial[index].updateMatrix();
        this.render();
      });
    }
    this.loaded = true;
  }

  addLight(lights, index = 0) {
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.name = DIRECTIONAL_LIGHT + index;
    directionalLight.position.normalize();
    this.light = directionalLight;
    this.scene.add(directionalLight);
  }

  loadSTLFromUrl(url, reqId) {
    return new Promise((resolve) => {
      this.loader.crossOrigin = '';
      this.loader.loadFromUrl(url, (geometry) => {
        if (this.reqNumber !== reqId) {
          return;
        }
        resolve(geometry);
      });
    });
  }

  loadFromFile(file) {
    return new Promise((resolve) => {
      this.loader.loadFromFile(file, (geometry) => {
        resolve(geometry);
      });
    });
  }

  addSTLToScene(reqId) {
    this.models.map((item, index) => {
      if (index === 0) {
        // while (this.scene.children.length > 0) {
        //   this.scene.remove(this.scene.children[0]);
        // }

        // lights processing
        const hasMultipleLights = this.lights.reduce(
          (acc, item) => acc && Array.isArray(item),
          true
        );
        if (hasMultipleLights) {
          this.lights.forEach(this.addLight.bind(this));
        } else {
          this.addLight(this.lights);
        }
      }
      this.loadSTLFromUrl(item, reqId).then((geometry) => {
        // Calculate mesh noramls for MeshLambertMaterial.
        geometry.computeFaceNormals();
        geometry.computeVertexNormals();
        // Center the object
        // geometry.center();
        let material = new THREE.MeshLambertMaterial({
          color: this.modelColor,
          transparent: true,
          opacity: 1,
          side: THREE.DoubleSide,
          visible: true,
        });

        if (geometry.hasColors) {
          material = new THREE.MeshPhongMaterial({
            opacity: geometry.alpha,
            vertexColors: THREE.VertexColors,
          });
        }

        this.mesh = new THREE.Mesh(geometry, material);
        // Set the object's dimensions
        geometry.computeBoundingBox();
        geometry.computeBoundingSphere();

        if (this.xDims === undefined) {
          this.xDims = geometry.boundingBox.max.x - geometry.boundingBox.min.x;
          this.yDims = geometry.boundingBox.max.y - geometry.boundingBox.min.y;
          this.zDims = geometry.boundingBox.max.z - geometry.boundingBox.min.z;
          // this.xDims = geometry.boundingSphere.center.x;
          // this.yDims = geometry.boundingSphere.center.y;
          // this.zDims = geometry.boundingSphere.center.z;
        }

        if (this.rotate) {
          this.mesh.rotation.x = this.rotationSpeeds[0];
          this.mesh.rotation.y = this.rotationSpeeds[1];
          this.mesh.rotation.z = this.rotationSpeeds[2];
        }

        this.mesh.updateMatrix();

        this.scene.add(this.mesh);

        this.addCamera();
        this.light.position.copy(this.camera.position);

        this.addInteractionControls();
        this.addToReactComponent();

        // Start the animation
        this.animate();
      });
    });
  }

  addCamera() {
    if (
      !this.scene.children.find((item) => item.type === 'PerspectiveCamera')
    ) {
      // Add the camera
      this.camera = new THREE.PerspectiveCamera(
        30,
        this.width / this.height,
        1,
        this.distance
      );

      if (this.cameraZ === null) {
        this.cameraZ = Math.max(this.xDims * 3, this.yDims * 3, this.zDims * 3);
      }

      this.camera.position.set(this.cameraX, this.cameraY, this.cameraZ);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
      this.camera.add(directionalLight);
      this.camera.lookAt(this.mesh);
      this.scene.add(this.camera);

      this.renderer.physicallyCorrectLights = true;
      this.renderer.setSize(this.width, this.height);
      this.renderer.setClearColor(this.backgroundColor, 1);
    }
  }

  addInteractionControls() {
    // Add controls for mouse interaction
    if (this.orbitControls) {
      if (this.controls) {
        this.controls.dispose();
      }
      this.controls = new OrbitControls(
        this.camera,
        ReactDOM.findDOMNode(this.component)
      );
      this.controls.enableKeys = false;
      this.controls.addEventListener('change', this.orbitRender.bind(this));
    }
  }

  addToReactComponent() {
    // Add to the React Component
    ReactDOM.render(this.component, document.getElementById('loader'));
    // ReactDOM.findDOMNode(this.component).replaceChild(
    //   this.renderer.domElement,
    //   ReactDOM.findDOMNode(this.component).firstChild
    // );
  }

  /**
   * Animate the scene
   * @returns {void}
   */
  animate() {
    // note: three.js includes requestAnimationFrame shim
    if (this.rotate) {
      this.animationRequestId = requestAnimationFrame(this.animate.bind(this));
    }

    if (this.orbitControls) {
      this.controls.update();
    }
    this.render();
  }

  /**
   * Render the scene after turning off the rotation
   * @returns {void}
   */
  orbitRender() {
    if (this.rotate) {
      this.rotate = false;
    }
    const directionalLight = this.scene.getObjectByName('directionalLight0');
    directionalLight.position.copy(this.camera.position);

    this.render();
  }

  /**
   * Deallocate Mesh, renderer context.
   * @returns {void}
   */
  clean() {
    if (this.mesh !== undefined) {
      this.mesh.geometry.dispose();
      this.mesh.material.dispose();
      this.scene.remove(this.mesh);
      delete this.mesh;
    }
    const directionalLightObj = this.scene.getObjectByName(DIRECTIONAL_LIGHT);
    if (directionalLightObj) {
      this.scene.remove(directionalLightObj);
    }

    if (this.animationRequestId) {
      cancelAnimationFrame(this.animationRequestId);
    }
    this.renderer.dispose();
    this.renderer.forceContextLoss();
  }

  /**
   * Render the scene
   * @returns {void}
   */
  render() {
    if (this.mesh && this.rotate) {
      this.mesh.rotation.x += this.rotationSpeeds[0];
      this.mesh.rotation.y += this.rotationSpeeds[1];
      this.mesh.rotation.z += this.rotationSpeeds[2];
    }

    this.renderer.render(this.scene, this.camera);
  }
}

export default Paint;
