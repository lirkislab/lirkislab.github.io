var isGreen = false;
var isYellow = false;
var isRed = true;

AFRAME.registerComponent('move', {
  init: function() {
    this.speed = 0.12;
  },
  tick: function() {
    if (isRed) {
      if (this.speed < 0.12) {
        this.speed += 0.002;
      }
      this.el.object3D.position.x += this.speed;  
    } else if (isYellow) {
        if (this.el.getAttribute('position').x < -3.5 && 
            this.el.getAttribute('position').x > -8.5) {
          if (this.speed > 0) {
            this.speed -= 0.002;    
          }
      } else {
        if (this.speed < 0.12) {
          this.speed += 0.002;
        }
      }
      this.el.object3D.position.x += this.speed;
      } else if (isGreen) {
        if (this.el.getAttribute('position').x < -3.5 && 
            this.el.getAttribute('position').x > -8.5) {
          if (this.speed > 0) {
            this.speed -= 0.002;    
          }
      }
        if (this.el.getAttribute('position').x < 2 || this.el.getAttribute('position').x > -2) {
          this.el.object3D.position.x += this.speed;
        }
      }      
      if(this.el.getAttribute('position').x > 24) {
        this.el.setAttribute('position', {x: -24, y: 0.72, z: 2});
      } 
      }
  });

AFRAME.registerComponent('move_second', {
  init: function() {
    this.speed = 0.12;
  },
  tick: function(t, dt) {
    if (isRed) {
      if (this.speed < 0.12) {
        this.speed += 0.002;
      }
        this.el.object3D.position.x -= this.speed;
    } else if (isYellow) {
        if (this.el.getAttribute('position').x < 8.5 && this.el.getAttribute('position').x > 3.5) {
          if (this.speed > 0) {
            this.speed -= 0.002;    
          }
      }
      this.el.object3D.position.x -= this.speed;
      } else if (isGreen) {
        if (this.el.getAttribute('position').x < 8.5 && this.el.getAttribute('position').x > 3.5) {
          if (this.speed > 0) {
            this.speed -= 0.002;    
          }
      }
        if (this.el.getAttribute('position').x < 2 || this.el.getAttribute('position').x > -2) {
          this.el.object3D.position.x -= this.speed;
        }
      }     
    if(this.el.getAttribute('position').x < -24) {
        this.el.setAttribute('position', {x: 24, y: 0.7, z: -2});
      }
    }
  });

AFRAME.registerComponent('traffic_light', {
  init: function() {
    this.timer = 0;
  },
  tick: function(t, dt) {
    if (this.timer < 15000) {
        this.el.setAttribute('material', 'color', 'red');
        this.el.setAttribute('material', 'emissive', 'red');
        isRed = true;
        isGreen = false;
        isYellow = false;
    } else if (this.timer < 18000) {
        this.el.setAttribute('material', 'color', 'yellow');
        this.el.setAttribute('material', 'emissive', 'yellow');
        isRed = false;
        isGreen = false;
        isYellow = true;
    } else if (this.timer < 33000) {
        this.el.setAttribute('material', 'color', 'green');
        this.el.setAttribute('material', 'emissive', 'green');
        isRed = false;
        isGreen = true;
        isYellow = false;
    } else {
      this.timer = 0;
    }
    this.timer += dt; 
  }
  });

AFRAME.registerComponent('blink', {
  schema: {
    typeOfDay: {type: 'string'}
  },
  init: function() {
    this.toggle = false;
    this.throttledFunction = AFRAME.utils.throttle(this.everySecond, 1000, this);
  },  
  everySecond: function () {
      if (this.data.typeOfDay === 'night') {
        if (this.toggle) {
          this.el.object3D.visible = true;
          this.toggle = false;
        } else {
          this.el.object3D.visible = false;
          this.toggle = true;
        }
      }
    },
  tick: function(t, dt) {
    this.throttledFunction();
  },
    
  
  });

