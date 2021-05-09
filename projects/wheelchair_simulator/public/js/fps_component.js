AFRAME.registerComponent('fpscount', {
  init: function() {
    this.timer = 0;
    this.counter = 0;
  },  
  tick: function(t, dt) {
    if (this.counter < 60 && this.timer >= 1000) {
      console.error(this.counter + " second and FPS :" + Math.round((1000/dt)));
      this.counter++;
      this.timer = 0;
    }
    this.timer += dt;
  },
    
  
  });
