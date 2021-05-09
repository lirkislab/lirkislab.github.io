var scene;
var vrToggle = false;
var toggleRotation = false;
var abstractBody;

document.addEventListener("DOMContentLoaded", function() {
  scene = document.querySelector('a-scene');
  abstractBody = document.querySelector("#bodymodel");  
  
  var leftController = document.querySelector("#leftController");
  var rightController = document.querySelector("#rightController");
  var wheelchair = document.querySelector("#rig");
  var playerhead = document.querySelector("#playerheadCorrector");
  if (scene) {
      scene.addEventListener('enter-vr', function () {
       wheelchair.object3D.rotation.set(0, playerhead.object3D.rotation.y, 0);
       abstractBody.object3D.rotation.set(0, playerhead.object3D.rotation.y, 0);
       leftController.object3D.visible = true;
       rightController.object3D.visible = true;
       vrToggle = true;
       playerhead.object3D.position.y = 0.2;
       wheelchair.setAttribute('movement-controls', 'enabled', 'false');
       abstractBody.removeAttribute('set-rotation'); 

    });
      scene.addEventListener('exit-vr', function () {
       leftController.object3D.visible = false;
       rightController.object3D.visible = false;
       leftController.setAttribute('position', {x: 0, y: -70, z: 0});
       rightController.setAttribute('position', {x: 0, y: -70, z: 0});
       playerhead.object3D.position.y = 1.4;
       vrToggle = false;
       wheelchair.setAttribute('movement-controls', 'enabled', 'true');
       abstractBody.setAttribute('set-rotation', '');
        
    });
  }
});


// Must move atleast 33% into any direction with the thumbstick to register change
var deadzone = 0.33;

var leftThumbstickX = 0, leftThumbstickY = 0, rightThumbstickX = 0, rightThumbstickY = 0;

AFRAME.registerComponent('wheelchair', {
  tick: function(t, dt) { 
    if (vrToggle) {
      if (!toggleRotation) {
          toggleRotation = true;
      }
      if (Math.abs(leftThumbstickX) > Math.abs(leftThumbstickY)) {
        var final_value = 0;
        if (leftThumbstickX > 0) {
          //HOW MUCH TO TURN (0 - 0.5)
          final_value = normalize(leftThumbstickX, 1, deadzone, 0.5, 0);
        } else {
          //HOW MUCH TO TURN (-0.5 - 0)
          final_value = normalize(leftThumbstickX, -deadzone, -1, 0, -0.5);
        }      
          this.el.object3D.rotation.y += final_value*(dt/1000)*-1; 
          abstractBody.object3D.rotation.y += final_value*(dt/1000)*-1;

          leftThumbstickY = 0;
        } 
      
      else if (Math.abs(leftThumbstickX) < Math.abs(leftThumbstickY)) {
        
        //NORMALIZE MOVE VECTOR TO MOVE FORWARD BASED ON WHEELCHAIR AND NOT ON WORLD COORDINATES        
        var final_value = 0;      
        var direction = 1;
        var vector;
        //CHANGE SPEED IF IT IS THE SECOND SCENE
        if (scene.getAttribute('networked-scene').room == "scene2") {
          //SLOPE 1 part 1 -  X  5 - 8,      Z -2 - 6.15
          if (this.el.getAttribute('position').x >= 5 && 
              this.el.getAttribute('position').x <= 8 && 
              this.el.getAttribute('position').z >= -2 &&
              this.el.getAttribute('position').z <= 6.15) {
                vector = new THREE.Vector3(0,0,0);
                this.el.object3D.getWorldDirection(vector);
                if (vector.z > 0) {
                  //GOING DOWN
                  direction = -1;
                } else {
                  //GOING UP
                  direction = 1;
                }
                if (leftThumbstickY > 0) {
                    //HOW MUCH TO MOVE (0 - 0.75)
                    final_value = normalize((leftThumbstickY), 1, deadzone, 0.75, 0);
                  } else {
                    //HOW MUCH TO MOVE (-0.75 - 0)
                    final_value = normalize((leftThumbstickY), -deadzone, -1, 0, -0.75);
                }
              }
          //SLOPE 1 part 2 -  X  5 - -0.8,   Z  6.15 - 9.15
          else if(this.el.getAttribute('position').x <= 5 && 
              this.el.getAttribute('position').x >= -0.8 && 
              this.el.getAttribute('position').z >= 6.15 &&
              this.el.getAttribute('position').z <= 9.15)  {
                  vector = new THREE.Vector3(0,0,0);
                  this.el.object3D.getWorldDirection(vector);
                  if (vector.x > 0) {
                    //GOING UP
                    direction = 1;
                  } else {
                    //GOING DOWN
                    direction = -1;
                  }
                  if (leftThumbstickY > 0) {
                    //HOW MUCH TO MOVE (0 - 0.75)
                    final_value = normalize((leftThumbstickY), 1, deadzone, 0.75, 0);
                  } else {
                    //HOW MUCH TO MOVE (-0.75 - 0)
                    final_value = normalize((leftThumbstickY), -deadzone, -1, 0, -0.75);
                  }
          }   
          //SLOPE 2 -         X -5 - -8,      Z -2 - 6.15
          else if (this.el.getAttribute('position').x <= -5 && 
              this.el.getAttribute('position').x >= -8 && 
              this.el.getAttribute('position').z >= -2 &&
              this.el.getAttribute('position').z <= 6.15) {
              vector = new THREE.Vector3(0,0,0);
              this.el.object3D.getWorldDirection(vector);
              if (vector.z > 0) {
                  //GOING DOWN
                  direction = -1;
                } else {
                  //GOING UP
                  direction = 1;
                }
                if (leftThumbstickY > 0) {
                //HOW MUCH TO MOVE (0 - 0.5)
                final_value = normalize((leftThumbstickY), 1, deadzone, 0.5, 0);
              } else {
                 //HOW MUCH TO MOVE (-0.5 - 0)
                final_value = normalize((leftThumbstickY), -deadzone, -1, 0, -0.5);
              }
          } else {
              if (leftThumbstickY > 0) {
              //HOW MUCH TO MOVE (0 - 1)  
              final_value = normalize(leftThumbstickY, 1, deadzone, 1, 0);
            } else {
              //HOW MUCH TO MOVE (-1 - 0) 
              final_value = normalize(leftThumbstickY, -deadzone, -1, 0, -1);
            }
          }
        }
        else {
          if (leftThumbstickY > 0) {
            //HOW MUCH TO MOVE (0 - 1)
            final_value = normalize(leftThumbstickY, 1, deadzone, 1, 0);
          } else {
            //HOW MUCH TO MOVE (-1 - 0) 
            final_value = normalize(leftThumbstickY, -deadzone, -1, 0, -1);
          }
        }
        var cos = Math.cos(this.el.object3D.rotation.y);
        var sin = Math.sin(this.el.object3D.rotation.y);
        
        this.moveVector  = new THREE.Vector3(0,0,0);
        this.movePercent = new THREE.Vector3(0,0,final_value*-1);

        this.moveVector.set( 
                    -sin * this.movePercent.z + cos * this.movePercent.x,
                    direction * this.movePercent.y,
                    -cos * this.movePercent.z - sin * this.movePercent.x
        ).multiplyScalar(dt/1000);

        this.el.object3D.position.add( this.moveVector );
        leftThumbstickX = 0;
      }
    } else {
        if (toggleRotation) {
          var player_head = document.querySelector("#playerhead");
          var rotY = player_head.getAttribute('rotation');
          //el.setAttribute('rotation', rotY);
          this.el.object3D.rotation.set(abstractBody.object3D.rotation.x, rotY.y, abstractBody.object3D.rotation.z);
          abstractBody.object3D.rotation.set(abstractBody.object3D.rotation.x, rotY.y, abstractBody.object3D.rotation.z);
          toggleRotation = false;
        }
    }
  }
});


function normalize(value, old_max, old_min, new_max, new_min) {
  return (((value - old_min) / (old_max - old_min)) * (new_max - new_min) + new_min);
};

    
//ADD LISTENERS FOR THUMBSTICKS AND BIND THIS INSTANCE (TO DIFFERENTIATE BETWEEN LEFT AND RIGHT THUMBSTICK)
AFRAME.registerComponent('thumbstick-logging',{
  init: function () {    
    this.el.addEventListener('thumbstickmoved', this.logThumbstick.bind(this));
  },
  logThumbstick: function (evt) {
    if (this.el.id === "leftController") {
      //DOWN
      if (evt.detail.y > deadzone) { 
        leftThumbstickY = evt.detail.y;
      }
      //UP
      if (evt.detail.y < -deadzone) { 
        leftThumbstickY = evt.detail.y;
      }
      //LEFT
      if (evt.detail.x < -deadzone) { 
        leftThumbstickX = evt.detail.x;
      }
      //RIGHT
      if (evt.detail.x > deadzone) { 
        leftThumbstickX = evt.detail.x; 
      }
      if (evt.detail.x < deadzone && evt.detail.x > -deadzone) {
        leftThumbstickX = 0;
      }
      if (evt.detail.y < deadzone && evt.detail.y > -deadzone) {
        leftThumbstickY = 0;
      }
    }
  },
});

AFRAME.registerComponent('exit-vr-scene',{
  init: function () {  
    this.el.addEventListener('raycaster-intersected', evt => {
      if (vrToggle) {
        scene.exitVR();
        location.href ="https://wheelchair-sim.glitch.me/index.html";
      }
    });
  },
  
  
});