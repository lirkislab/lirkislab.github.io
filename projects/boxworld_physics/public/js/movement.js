var THREE = window.THREE;
var AFRAME = window.AFRAME;
var vehicle;
var vehicleFrontMove = false, vehicleBackMove = false, vehicleLeftMove = false, vehicleRightMove = false;
var acceleration = 0, steering = 0;


AFRAME.registerComponent('vehicle-move-wasd', {
    init: function () {
      vehicle = this.el;     
//tu budu query selectory pre tlacidla zo stranky a nasledne ich implementacia pre touch 
//v pc verzii budu siabled a ifmobile device, tak budu enabled//toto osetri ale v indexe vozidla
      // var buttonGoforvard = document.querySelector('#buttonF');
      // var buttonbackward = document.querySelector('#buttonB');
      // var buttonGoleft= document.querySelector('#buttonL');
      // var buttonGoright= document.querySelector('#buttonR');
      // var controlsTouch = document.querySelector('#controlsTouch');
      // var controlSwitch = document.querySelector('#controlSwitch');
      // var smartphoneControls = document.querySelector('#smartphoneControls');
      // var isMobile = AFRAME.utils.device.isMobile();

//       if (isMobile) {
//         controlsTouch.style.display = "none";
//         smartphoneControls.style.display = "block";
//       } else {
//         controlsTouch.style.display = "none";
//         smartphoneControls.style.display = "none";
//       }
        
      
//       document.getElementById('controlSwitch').onclick = function() {
//                 if ( this.checked ) {
//                    controlsTouch.style.display = "block";
//                 } else {
//                    controlsTouch.style.display = "none";
//                 }
//       };
      
      // buttonGoforvard.addEventListener("touchstart", function(){vehicleFrontMove = true});
      // buttonGoforvard.addEventListener("touchend", function(){vehicleFrontMove = false;});
      // buttonbackward.addEventListener("touchstart", function(){vehicleBackMove = true;});
      // buttonbackward.addEventListener("touchend", function(){vehicleBackMove = false;});
      // buttonGoleft.addEventListener("touchstart", function(){vehicleLeftMove = true;});
      // buttonGoleft.addEventListener("touchend", function(){vehicleLeftMove = false;});
      // buttonGoright.addEventListener("touchstart", function(){vehicleRightMove = true;});
      // buttonGoright.addEventListener("touchend", function(){vehicleRightMove = false;});
      
               document.addEventListener('keydown', evt => {

                  if (evt.keyCode === 87 /*|| evt.keyCode === 38*/)  { 
                    vehicleFrontMove = true;                  
                  } 
                  if (evt.keyCode === 83 /*|| evt.keyCode === 40*/) { 
                    vehicleBackMove = true;
                  } 
                  if (evt.keyCode === 65 /*|| evt.keyCode === 37*/) {                     
                    vehicleLeftMove = true;
                  } 
                  if (evt.keyCode === 68 /*|| evt.keyCode === 39*/) {                    
                    vehicleRightMove = true;
                  } 
              }) 

              document.addEventListener('keyup', evt => {

                  if (evt.keyCode === 87 /*|| evt.keyCode === 38*/) {                     
                    vehicleFrontMove = false;
                  } 
                  if (evt.keyCode === 83 /*|| evt.keyCode === 40*/) {                     
                    vehicleBackMove = false;
                  } 
                  if (evt.keyCode === 65 /*|| evt.keyCode === 37*/) {                    
                    vehicleLeftMove = false;
                  } 
                  if (evt.keyCode === 68 /*|| evt.keyCode === 39*/) {                    
                    vehicleRightMove = false;
                  } 
              })   
            },
  
    tick: function() {
            
      if(vehicleFrontMove == true){
        if(acceleration > -0.6){
          acceleration -= 0.1 / 60;
        }
      };
      if(vehicleBackMove == true){
        if(acceleration < 0.06){
          acceleration += 0.1 / 40;
        }
      };    
    
      if(vehicleFrontMove == false && acceleration >= 0.001){
        
          acceleration -= 0.1 / 200;  
          steeringVehicle(acceleration);
      }    

        if(acceleration <= 0){
          acceleration += 0.1 / 200;    
          steeringVehicle();
        }

      

      vehicle.object3D.translateZ(acceleration);
            
  }
});

function steeringVehicle(){
   if(vehicleLeftMove == true){   
       if(steering < 0.009 ) {
          steering += 0.01 / 10  
       }
   };

    if(vehicleRightMove == true){
        if(steering > -0.009 ) {
          steering -= 0.01 / 10  
       }           
    };
   
   if(steering < 0){
        steering += 0.1 / 200; 
   }
   if(steering > 0){
        steering -= 0.1 / 200; 
   }
  
  vehicle.object3D.rotateY(steering);
}