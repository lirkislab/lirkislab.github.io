var THREE = window.THREE;
var AFRAME = window.AFRAME;
var NAF = window.NAF;
var CANNON = window.CANNON;

AFRAME.registerComponent("spawner", {
  schema: {
    template: { default: "" },
    keyCode: { default: 32 }
  },

  init: function() {
    this.onKeyUp = this.onKeyUp.bind(this);
    document.addEventListener("keyup", this.onKeyUp);
  },

  onKeyUp: function(e) {
    this.randID = Math.floor(Math.random() * 10000000);
    if (this.data.keyCode === e.keyCode) {
      var el = document.createElement("a-entity");
      el.setAttribute("networked", "template:" + this.data.template);
      el.setAttribute("position", this.el.getAttribute("position"));
      el.setAttribute("rotation", this.el.getAttribute("rotation"));
      el.setAttribute("raycaster-listen", {});
      el.setAttribute("laser-listen", {});
      el.setAttribute("dynamic-body", {mass: 0.1});
      el.setAttribute("id", this.randID);
      var scene = this.el.sceneEl;
      scene.appendChild(el);
    }
  }
});


AFRAME.registerComponent("spawner-controller", {
  schema: {
    template: { default: "" },
    keyCode: { default: 32 }
  },

  init: function () {
    this.el.addEventListener('xbuttondown', function (evt) {
      var el = document.createElement("a-entity");
      el.setAttribute("networked", "template:" + this.data.template);
      el.setAttribute("position", this.el.getAttribute("position"));
      el.setAttribute("rotation", this.el.getAttribute("rotation"));
      el.setAttribute("raycaster-listen", {});
      el.setAttribute("laser-listen", {});
      el.setAttribute("dynamic-body", {mass: 0.1});
      var scene = this.el.sceneEl;
      scene.appendChild(el);    
    });
  }
});

AFRAME.registerComponent('x-button-listener', {
  init: function () {
    var el = this.el;
    el.addEventListener('xbuttondown', function (evt) {
      el.setAttribute('material', 'color', 'red');
    });
  }
});

