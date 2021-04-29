AFRAME.registerComponent('alpha-test', {
  dependencies: ['material'],

  init: function () {
    var material = this.el.getObject3D('mesh').material;
    material.alphaTest = 0.5;
    material.needsUpdate = true;
  }
});