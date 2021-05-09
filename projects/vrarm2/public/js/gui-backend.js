//tento backend bezi na hololense a spracovava prikazy od terapeuta
//tieto prikazy nastavuje na ruke
var sceneEl, player, frontmove, backmove, leftmove, rightmove, movetofront, movetoback, movetoleft, movetoright,trigger, fullarm,fullgui;
const SpeedOfVelocity = 0.004;
const offsetmovement = 0.00001; //posun o offset pri pouzivani gui
const offsetscale = 0.00001; //pomer skalovania ruky
const minimumscale = 0.3; //minimalna velkost skalovania ruky

AFRAME.registerComponent("gui-component-move", {
  
  init: function(){
    sceneEl = document.querySelector("a-scene");
    player = sceneEl.querySelector("#rig");
    frontmove = sceneEl.querySelector("#frontmove");
    backmove = sceneEl.querySelector("#backmove");
    leftmove = sceneEl.querySelector("#leftmove");
    rightmove = sceneEl.querySelector("#rightmove");
    fullarm = sceneEl.querySelector("#fullarm");
    trigger = sceneEl.querySelector("#triggeranim");
    fullgui = sceneEl.querySelector("#fullgui");
    
    //console.error(fullarm);
  },
  tick: function() {
    
    //event listenery na zistovanie 3D GUI pohladu
    frontmove.addEventListener("mouseenter", function() {
      console.log("I was clicked at: FRONTMOVEMENT");
      movetofront = true;
    });
    
      frontmove.addEventListener("mouseleave", function(evt) {
      console.log("I was left at: FRONTMOVEMENT");
      movetofront = false;
    });

    backmove.addEventListener("mouseenter", function(evt) {
      console.log("I was clicked at: BACKMOVEMENT");
      movetoback = true;
    });
    
    backmove.addEventListener("mouseleave", function(evt) {
      console.log("I was left at: BACKMOVEMENT");
      movetoback = false;
    });

    leftmove.addEventListener("mouseenter", function(evt) {
      console.log("I was clicked at: LEFTMOVEMENT");
      movetoleft = true;
    });
    
    leftmove.addEventListener("mouseleave", function(evt) {
      console.log("I was left at: LEFTMOVEMENT");
      movetoleft = false;
    });

    rightmove.addEventListener("mouseenter", function(evt) {
      console.log("I was clicked at: RIGHTMOVEMENT");
      movetoright = true;
    });
    
    rightmove.addEventListener("mouseleave", function(evt) {
      console.log("I was left at: RIGHTMOVEMENT");
      movetoright = false;
    });
    
    //3d GUI HoloLens
    if(movetofront == true){
      player.object3D.position.z += SpeedOfVelocity;
    };
    
    if(movetoback == true){
      player.object3D.position.z -= SpeedOfVelocity;
    };
    
    if(movetoleft == true){
      player.object3D.position.x -= SpeedOfVelocity;
    };
    
    if(movetoright == true){
      player.object3D.position.x += SpeedOfVelocity;
    };
    
    
document.addEventListener('keydown', evt => {
       //KEY - O Otvori GUI
//         if (evt.keyCode === 79) { 
//           fullgui.object3D.position.z = -0.250;
//         }
          
//        //KEY - P Zatvori GUI
//         if (evt.keyCode === 80) { 
//           fullgui.object3D.position.z -= 1000;
//         }
  
      //KEY - E  umiestni ruku na cetralizovanu poziciu CENTER
        if (evt.keyCode === 69) { 
          fullarm.object3D.position({x: 1, y: 1, z: 1});
        }
  
      //KEY - R  umiestni ruku o +offsetmovement vpred
        if (evt.keyCode === 82) { 
          fullarm.object3D.position.z -= offsetmovement;
        }
  
      //KEY - T  umiestni ruku o -offsetmovement vzad
        if (evt.keyCode === 84) { 
          fullarm.object3D.position.z += offsetmovement;
        }
  
      //KEY - Y  umiestni ruku o -offsetmovement dolava
        if (evt.keyCode === 89) { 
          fullarm.object3D.position.x -= offsetmovement;
        }
  
      //KEY - T  umiestni ruku o -offsetmovement doprava
        if (evt.keyCode === 85) { 
          fullarm.object3D.position.x += offsetmovement;
        }
  
      //KEY - B  naskaluje ruku na vacsi rozmer SCALE +
        if (evt.keyCode === 66) { 
          fullarm.object3D.scale.x += offsetscale;
          fullarm.object3D.scale.y += offsetscale;
          fullarm.object3D.scale.z += offsetscale;
          }
  
      //KEY - V  naskaluje ruku na vacsi rozmer SCALE +
        if (evt.keyCode === 86) { 
          var scaleFullarm = fullarm.getAttribute('scale')
          var xScaleFullarm = scaleFullarm.x;
          var yScaleFullarm = scaleFullarm.y;
          var zScaleFullarm = scaleFullarm.z;
          
          if (xScaleFullarm > 0.3 && yScaleFullarm > 0.1  && zScaleFullarm > 0.1 ){
              fullarm.object3D.scale.x -= offsetscale;
              fullarm.object3D.scale.y -= offsetscale;
              fullarm.object3D.scale.z -= offsetscale;
              }
          }
  
      //KEY - N  umiestni ruku o -offsetmovement nahir
        if (evt.keyCode === 78) { 
          fullarm.object3D.position.y += offsetmovement;
        }
  
      //KEY - M  umiestni ruku o -offsetmovement nadol
        if (evt.keyCode === 77) { 
          fullarm.object3D.position.y -= offsetmovement;
        }
  
      //KEY + centruje ruku do povodnej polohy
        if (evt.keyCode === 73) { 
          var scaleValueFullarm = 0.7;
          fullarm.object3D.scale.x = scaleValueFullarm;
          fullarm.object3D.scale.y = scaleValueFullarm;
          fullarm.object3D.scale.z = scaleValueFullarm;
          
          var armPositionx = -0.458;
          var armPositiony = 0.915;
          var armPositionz = 0.377;
          fullarm.object3D.position.x = armPositionx;
          fullarm.object3D.position.y = armPositiony;
          fullarm.object3D.position.z = armPositionz;
        }
      
});    
    
  }
});


//zmena farby ruky
AFRAME.registerComponent('color-gui-set',{

  init: function () {
    var el = this.el;  // Reference to the entity 
    this.el.setAttribute('material', 'color', '#680f0f');
    document.addEventListener('keydown', evt => {
       //KEY - Num1 Zmenu Farbu ruky na cervenu
        if (evt.keyCode === 97) { 
          this.el.setAttribute('material', 'color', '#680f0f');
        }
      //KEY - Num2 Zmenu Farbu ruky na zelenu
        if (evt.keyCode === 99) { 
          this.el.setAttribute('material', 'color', '#186116');
        }
      //KEY - Num1 Zmenu Farbu ruky na modru
        if (evt.keyCode === 98) { 
          this.el.setAttribute('material', 'color', '#29629a');
        }
    });
  }
});