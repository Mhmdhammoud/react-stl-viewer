'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Three = require('./Three');

var _Three2 = _interopRequireDefault(_Three);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var OrbitControls = require('three-orbit-controls')(_Three2.default);

var DIRECTIONAL_LIGHT = 'directionalLight';

var Paint = function () {
  function Paint() {
    _classCallCheck(this, Paint);

    this.loader = new _Three2.default.STLLoader();
    this.scene = new _Three2.default.Scene();
    this.renderer = new _Three2.default.WebGLRenderer({
      antialias: true
    });
    this.reqNumber = 0;
    this.loaded = false;
    this.light = undefined;
  }

  _createClass(Paint, [{
    key: 'init',
    value: function init(context, sliders, models) {
      var _this = this;

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
      var meshMaterial = this.scene.children.filter(function (item) {
        return item.type === 'Mesh';
      });
      if (meshMaterial.length === sliders.length) {
        sliders.map(function (item, index) {
          meshMaterial[index].material.opacity = item.value;
          // meshMaterial[index].material.visible = visibleSliders[index].value;
          meshMaterial[index].updateMatrix();
          _this.render();
        });
      }
      this.loaded = true;
    }
  }, {
    key: 'addLight',
    value: function addLight(lights) {
      var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

      var directionalLight = new _Three2.default.DirectionalLight(0xffffff, 0.5);
      directionalLight.name = DIRECTIONAL_LIGHT + index;
      directionalLight.position.normalize();
      this.light = directionalLight;
      this.scene.add(directionalLight);
    }
  }, {
    key: 'loadSTLFromUrl',
    value: function loadSTLFromUrl(url, reqId) {
      var _this2 = this;

      return new Promise(function (resolve) {
        _this2.loader.crossOrigin = '';
        _this2.loader.loadFromUrl(url, function (geometry) {
          // if (this.reqNumber !== reqId) {
          //   return;
          // }
          resolve(geometry);
        });
      });
    }
  }, {
    key: 'loadFromFile',
    value: function loadFromFile(file) {
      var _this3 = this;

      return new Promise(function (resolve) {
        _this3.loader.loadFromFile(file, function (geometry) {
          resolve(geometry);
        });
      });
    }
  }, {
    key: 'addSTLToScene',
    value: function addSTLToScene(reqId) {
      var _this4 = this;

      this.models.map(function (item, index) {
        if (index === 0) {
          // while (this.scene.children.length > 0) {
          //   this.scene.remove(this.scene.children[0]);
          // }

          // lights processing
          var hasMultipleLights = _this4.lights.reduce(function (acc, item) {
            return acc && Array.isArray(item);
          }, true);
          if (hasMultipleLights) {
            _this4.lights.forEach(_this4.addLight.bind(_this4));
          } else {
            _this4.addLight(_this4.lights);
          }
        }

        _this4.loadSTLFromUrl(item, reqId).then(function (geometry) {
          // Calculate mesh noramls for MeshLambertMaterial.
          geometry.computeFaceNormals();
          geometry.computeVertexNormals();
          // Center the object
          // geometry.center();
          var material = new _Three2.default.MeshLambertMaterial({
            color: _this4.modelColor,
            transparent: true,
            opacity: 1,
            side: _Three2.default.DoubleSide,
            visible: true
          });

          if (geometry.hasColors) {
            material = new _Three2.default.MeshPhongMaterial({
              opacity: geometry.alpha,
              vertexColors: _Three2.default.VertexColors
            });
          }

          _this4.mesh = new _Three2.default.Mesh(geometry, material);
          // Set the object's dimensions
          geometry.computeBoundingBox();
          geometry.computeBoundingSphere();

          if (_this4.xDims === undefined) {
            _this4.xDims = geometry.boundingBox.max.x;
            _this4.yDims = geometry.boundingBox.max.y;
            _this4.zDims = geometry.boundingBox.max.z;
            // this.xDims = geometry.boundingSphere.center.x;
            // this.yDims = geometry.boundingSphere.center.y;
            // this.zDims = geometry.boundingSphere.center.z;
          }

          if (_this4.rotate) {
            _this4.mesh.rotation.x = _this4.rotationSpeeds[0];
            _this4.mesh.rotation.y = _this4.rotationSpeeds[1];
            _this4.mesh.rotation.z = _this4.rotationSpeeds[2];
          }

          _this4.mesh.updateMatrix();

          _this4.scene.add(_this4.mesh);

          _this4.addCamera();
          _this4.light.position.copy(_this4.camera.position);

          _this4.addInteractionControls();
          _this4.addToReactComponent();

          // Start the animation
          _this4.animate();
        });
      });
    }
  }, {
    key: 'addCamera',
    value: function addCamera() {
      if (!this.scene.children.find(function (item) {
        return item.type === 'PerspectiveCamera';
      })) {
        // Add the camera
        this.camera = new _Three2.default.PerspectiveCamera(30, this.width / this.height, 1, this.distance);

        if (this.cameraZ === null) {
          this.cameraZ = Math.max(this.xDims * 3, this.yDims * 3, this.zDims * 3);
        }

        this.camera.position.set(this.cameraX, this.cameraY, this.cameraZ);
        var directionalLight = new _Three2.default.DirectionalLight(0xffffff, 0.5);
        this.camera.add(directionalLight);
        this.camera.lookAt(this.mesh);
        this.scene.add(this.camera);

        this.renderer.physicallyCorrectLights = true;
        this.renderer.setSize(this.width, this.height);
        this.renderer.setClearColor(this.backgroundColor, 1);
      }
    }
  }, {
    key: 'addInteractionControls',
    value: function addInteractionControls() {
      // Add controls for mouse interaction
      if (this.orbitControls) {
        if (this.controls) {
          this.controls.dispose();
        }
        this.controls = new OrbitControls(this.camera, _reactDom2.default.findDOMNode(this.component));
        this.controls.enableKeys = false;
        this.controls.addEventListener('change', this.orbitRender.bind(this));
      }
    }
  }, {
    key: 'addToReactComponent',
    value: function addToReactComponent() {
      // Add to the React Component
      // ReactDOM.render(this.component, document.getElementById('loader'));
      _reactDom2.default.findDOMNode(this.component).replaceChild(this.renderer.domElement, _reactDom2.default.findDOMNode(this.component).firstChild);
    }

    /**
     * Animate the scene
     * @returns {void}
     */

  }, {
    key: 'animate',
    value: function animate() {
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

  }, {
    key: 'orbitRender',
    value: function orbitRender() {
      if (this.rotate) {
        this.rotate = false;
      }
      var directionalLight = this.scene.getObjectByName('directionalLight0');
      directionalLight.position.copy(this.camera.position);

      this.render();
    }

    /**
     * Deallocate Mesh, renderer context.
     * @returns {void}
     */

  }, {
    key: 'clean',
    value: function clean() {
      if (this.mesh !== undefined) {
        this.mesh.geometry.dispose();
        this.mesh.material.dispose();
        this.scene.remove(this.mesh);
        delete this.mesh;
      }
      var directionalLightObj = this.scene.getObjectByName(DIRECTIONAL_LIGHT);
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

  }, {
    key: 'render',
    value: function render() {
      if (this.mesh && this.rotate) {
        this.mesh.rotation.x += this.rotationSpeeds[0];
        this.mesh.rotation.y += this.rotationSpeeds[1];
        this.mesh.rotation.z += this.rotationSpeeds[2];
      }

      this.renderer.render(this.scene, this.camera);
    }
  }]);

  return Paint;
}();

exports.default = Paint;
module.exports = exports['default'];