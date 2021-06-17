var THREE = window.THREE;
var AFRAME = window.AFRAME;
var NAF = window.NAF;
var CANNON = window.CANNON;

AFRAME.registerComponent("cursor-listener", {
  init: function() {
    var cursorEl = document.getElementById("3dcursor").object3D;
    var sceneEl = document.querySelector("a-scene").object3D;
    //console.error(this.el);
    var el = this.el;
    var el3d = this.el.object3D;
    var elpoint;
    //     this.el.addEventListener("click", function(evt) {
    //       //this.el.object3D.flushToDom();
    //       cursorEl.add(el3d);
    //       el.setAttribute("position", { x: 0, y: 0, z: -1 });

    //       console.log("I was clicked at: ", evt.detail.intersection.point);
    //       elpoint=evt.detail.intersection.point;
    //     });
    document.addEventListener("keydown", evt => {
      if (evt.keyCode === 13) {
        // el.setAttribute("rotation", {x:20,y:20,z:20});
        var position = new THREE.Vector3();
        var quaternion = new THREE.Quaternion();
        el3d.getWorldPosition(position);
        el3d.getWorldQuaternion(quaternion);
        sceneEl.add(el3d);
        el.setAttribute("position", position);
        el.setAttribute("rotation", quaternion);
      }
    });
  },

  tick: function() {
    var cursorEl = document.getElementById("3dcursor").object3D;
    var sceneEl = document.querySelector("a-scene").object3D;
    var body = document.getElementById("playerhead").object3D;
    //console.error(this.el);
    var el = this.el;
    var el3d = this.el.object3D;
    var elpoint;
    el.addEventListener("mouseenter", function(evt) {
      //this.el.object3D.flushToDom();
      cursorEl.add(el3d);
      el.setAttribute("position", cursorEl.position);
      el.setAttribute("rotation", cursorEl.rotation);

      NAF.utils.getNetworkedEntity(this.el).then(el => {
        !NAF.utils.isMine(this.el) ? NAF.utils.takeOwnership(this.el) : null;
      });

      // console.error("I was clicked at: ", evt.detail.intersection.point);
      // elpoint=evt.detail.intersection.point;
    });
  }
});
