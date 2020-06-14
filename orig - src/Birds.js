import React, {Component} from 'react';
import {
  Scene,
  WebGLRenderer,
  MeshBasicMaterial,
  PerspectiveCamera,
  Mesh,
  Vector3,
  Face3,
  Geometry,
  DoubleSide,
} from 'three';
import './Birds.css';

export default class Birds extends Component {

  constructor(props) {
    super(props);
    this.state = {
      t: 0,
      width: '100%',
      height: '100vh'
    }
  }

  updateDimensions = () => {
    let w = window,
      d = document,
      documentElement = d.documentElement,
      body = d.getElementsByTagName('body')[0],
      width = w.innerWidth || documentElement.clientWidth || body.clientWidth,
      height = w.innerHeight || documentElement.clientHeight || body.clientHeight;
    this.setState({width: width, height: height});
  };

  componentWillReceiveProps(nextProps, nextContext) {
    console.log('new props');
  }

  componentWillMount() {
    this.updateDimensions();
    console.log('will mount');
    window.addEventListener('resize', this.onWindowResize, false);
  }

  v = (x, y, z) => {
    return new Vector3(x, y, z);
  };

  f3 = (a, b, c) => {
    return new Face3(a, b, c);
  };

  componentDidMount() {
    document.title = "Birds | Sanjay's website";
    // set up scene and renderer
    const scene = new Scene();
    const renderer = new WebGLRenderer({antialias: true});

    // set up camera
    const {clientWidth, clientHeight} = this.mount;
    // function signature: PerspectiveCamera(fov, aspect, near, far)
    const camera = new PerspectiveCamera(60, clientWidth / clientHeight, 0.1, 1000);

    let birdsAttrs = [
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
    for (let i = 0; i < birdsAttrs.length; i++) {
      let b = new Geometry();
      for (let j = 0; j < birdVertices.length; j++) {
        b.vertices.push(this.v(...birdVertices[j]));
      }
      //b.faces.push(this.f3( 0, 2, 1 ));
      b.faces.push(this.f3(4, 7, 6));
      b.faces.push(this.f3(5, 6, 7));
      b.computeVertexNormals();

      let bird = new Mesh(b, new MeshBasicMaterial({color: birdColour, side: DoubleSide}));
      let scale = birdsAttrs[i].scale;
      bird.scale.set(scale, scale, scale);
      birds[i] = bird;
      scene.add(bird);
    }

    camera.lookAt(scene.position);

    renderer.setClearColor(backgroundColour);
    renderer.setSize(clientWidth, clientHeight);
    camera.position.y = 10;
    camera.position.z = 100;

    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.birds = birds;
    this.birds_attr = birdsAttrs;

    //this.window = window;
    // remember these initial values
    //this.tanFOV = Math.tan(((Math.PI/180)*camera.fov/2));
    //this.windowHeight = window.innerHeight;
    this.mount.appendChild(this.renderer.domElement);
    this.start();
  }

  componentWillUnmount() {
    this.stop();
    this.mount.removeChild(this.renderer.domElement);
    //window.removeEventListener("resize", this.updateDimensions);
  }

  start = () => {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate);
    }
  };

  stop = () => {
    cancelAnimationFrame(this.frameId);
  };

  animate = () => {
    let t = this.state.t;
    for (let i = 0; i < this.birds.length; i++) {
      let b = this.birds_attr[i];
      this.birds[i].position.x = b.position.x * Math.cos(t) + b.position_offset.x;
      this.birds[i].position.z = b.position.y * Math.sin(t) + b.position_offset.y;
      this.birds[i].position.y = b.position.z * Math.sin(t) + b.position_offset.z;
      this.birds[i].lookAt(
        new Vector3(
          this.birds_attr[i].look_at.x,
          this.birds_attr[i].look_at.y,
          this.birds_attr[i].look_at.z)
      );
    }

    if (this.state.t > 2 * Math.PI) {
      this.setState({t: 0});
    } else {
      this.setState({t: this.state.t + (2 * Math.PI) / 750});
    }
    this.renderScene();
    this.frameId = window.requestAnimationFrame(this.animate);
  };

  renderScene() {
    this.renderer.render(this.scene, this.camera)
  }

  onWindowResize = (event) => {
    console.log('window size changed');
    console.log(event);
    this.camera.aspect = window.innerWidth / window.innerHeight;

    // adjust the FOV
    // this.camera.fov = ( 360 / Math.PI ) * Math.atan( this.tanFOV * ( window.innerHeight / this.windowHeight ) );
    //
    // this.camera.updateProjectionMatrix();
    // this.camera.lookAt( this.scene.position );

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.render(this.scene, this.camera);
  };

  render() {
    const {width, height} = this.state;
    return (
      <div>
        {/*<h4 style={{color: 'white'}}> birds </h4>*/}
        <div
          style={{
            width,
            height
          }}
          ref={mount => {
            this.mount = mount
          }}/>
      </div>
    )
  }
}
