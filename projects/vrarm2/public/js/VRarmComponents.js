var sceneEl, player, frontmove, backmove, leftmove, rightmove, movetofront, movetoback, movetoleft, movetoright,trigger, fullarm,fullgui;
const SpeedOfVelocity = 0.04;//posunoffset ruky pri ziskani prikazu o posune x;y;z;
const offsetmovement = 0.00001; //posun o offset pri pouzivani gui
const offsetscale = 0.03; //pomer skalovania ruky
const minimumscale = 0.3; //minimalna velkost skalovania ruky
var getArmDataloop = 0;
//javascript ktory spusta animacie a riadi animacie
AFRAME.registerComponent("arm-animated", {
  init: function() {
    var arm = this.el;
    var training;
    var loop = 0;
    var played = false;
    var animation;
    var animations;
    var action;
    //Pozastavenie animacie na zaciatku
    arm.setAttribute("animation-mixer", {
      timeScale: 0
    });
    
    arm.addEventListener("move", function(event) {
      training = event.detail.training;
      console.error("START ANIM EVENT IS RUNNING");
      played = true;
      arm.setAttribute("animation-mixer", { repetitions: 1, timeScale: 2, clampWhenFinished: true});
      arm.play();
      //arm.setAttribute("animation-mixer", { repetitions: 1, timeScale: 2, clampWhenFinished: true});
      //arm.setAttribute("animation-mixer", { timeScale: 2, clampWhenFinished: true});
    });
    
    arm.addEventListener("animation-finished", e => {
      console.log("FINISHED");
      arm.removeAttribute("animation-mixer");
      training.emit("message", "animationDone");
    }, 1);

    arm.addEventListener("reset", function(event) {
      if(played){
        console.log("PLAYED - RESET ");
        arm.removeAttribute("animation-mixer");
        played = false;
        
        arm.setAttribute("animation-mixer", {
          timeScale: 0
        });
        // arm.setAttribute("animation-mixer", { repetitions: 1, timeScale: 2, clampWhenFinished: true});
        // arm.play();
        // setTimeout(() => {
        //   arm.pause(); 
        //   arm.removeAttribute("animation-mixer");
        // }, 1);
      }
    });
    
    arm.addEventListener("stop", function(event) {
      arm.setAttribute("animation-mixer", { timeScale: 4, clampWhenFinished: true});
    });
    
    arm.addEventListener("hide", function(event) {
        arm.setAttribute('visible', false);
    });
    
    arm.addEventListener("show", function(event) {
      arm.setAttribute('visible', true);
    });
  }
});

//komponent pre nastavenie ruky - posun, skalovanie, centrovanie do povodneho stavu
AFRAME.registerComponent("arm-settings", {
  init: function() {
    var arm = this.el;
    var armCenterPosition = arm.getAttribute('position');
    var armCenterRotation = arm.getAttribute('rotation');

    arm.addEventListener("movefront", function(event) {
      arm.object3D.position.z -= SpeedOfVelocity;
      //arm.pause();
    });
    
    arm.addEventListener("moveback", function(event) {
      arm.object3D.position.z += SpeedOfVelocity;
      //arm.pause();
    });
    
    arm.addEventListener("moveleft", function(event) {
      arm.object3D.position.x -= SpeedOfVelocity;
     // arm.pause();
    });
    
    arm.addEventListener("moveright", function(event) {
      arm.object3D.position.x += SpeedOfVelocity;
      //arm.pause();
    });
    
    arm.addEventListener("moveup", function(event) {
      arm.object3D.position.y += SpeedOfVelocity;
     // arm.pause();
    });
    
    arm.addEventListener("movedown", function(event) {
      arm.object3D.position.y -= SpeedOfVelocity;
     // arm.pause();
    });
    
    arm.addEventListener("scaleup", function(event) {
      arm.object3D.scale.x += offsetscale;
      arm.object3D.scale.y += offsetscale;
      arm.object3D.scale.z += offsetscale;
     // arm.pause();
    });
    
    arm.addEventListener("scaledown", function(event) {
      arm.object3D.scale.x -= offsetscale;
      arm.object3D.scale.y -= offsetscale;
      arm.object3D.scale.z -= offsetscale;
     // arm.pause();
    });
    
    //tato metoda zatial nie je umplementovana, nerobi co ma 
   //TODO - DOKONCIT
    arm.addEventListener("centerArm", function(event) {
      arm.setAttribute('position', {x: 0.200, y: -2.889, z: 0.889});
      arm.setAttribute('scale', {x: 2, y: 2, z: 2});
     // arm.pause();
    });
    
  }
});

// Tento komponent obsahuje event pre zaslanie konfiguracie na server a prijatie konfiguracie
//komponent je vlozeny ako atribut v HTML v entite modelu ruky
// ked sa nastavi setup subjektu, podla jeho predstav, potom sa tato konfiguracia posle
// ked sa otvori experimentator a potrebuje sa pouzit predosla konfiguracia, tak komponent 
// ziska data zo servera a prekresli ruku na predoslu poziciu
//TATO KONFIGURACIA SA POUZIVA PRE ULOZENIE STAVU RUKY NA SERVER  - a potom sa tieto data daju zo serveru nacitat, aby sa zbytocne nekonfigurovala ruka pri n-tom experimente
AFRAME.registerComponent("arm-configuration", {
  init: function() {
    var arm = this.el; //selfreferencia na objekt ruky
    var armCenterPosition = arm.getAttribute('position'); //ziskanie pozicie
    var armCenterScale= arm.getAttribute('scale'); //ziskanie skalovania ruky

    arm.addEventListener("PostConfigToServer", function(event) {
      var dateStamp = new Date(); //vytvorenie zaznamu pre casovu znacku
      //vytvorenie XHR requestu pre POST dat o pozicii a scalovani ruky na server
      var xhr = new XMLHttpRequest();
      var url = "https://vrarm2.glitch.me/subjectData";//url na ktoru sa post posiela
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");//obsah je JSON object
        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4 && xhr.status === 200) {
              //var json = JSON.parse(xhr.responseText);
              console.log(xhr.responseText);
              }
          };
      //vytvorenie JSON objektu vratane casovej znacky, pozicie a skalovania 3D ruky
        var myObj = { "DATESTAMP": dateStamp, 
                      "armPosX": armCenterPosition.x, 
                      "armPosY": armCenterPosition.y, 
                      "armPosZ": armCenterPosition.z,
                      "armScaleX": armCenterScale.x, 
                      "armScaleY": armCenterScale.y, 
                      "armScaleZ": armCenterScale.z,
                    };
        
        var myJSON = JSON.stringify(myObj);
        xhr.send(myJSON);
    });
    
    //Tato metoda ziska udaje o pozicii a skalovani ruky zo servera, 
    //potom ruku nastavi parametricky podla konfiguracie, ktoru zo servera ziska
    arm.addEventListener("GetConfigFromServer", function(event) {
       var req = new XMLHttpRequest(); // vytvori sa request
        req.open('GET', 'https://vrarm2.glitch.me/subjectData', false); //metoda get referujuca na url s JSON datami o ruke {pozicia, rotacia}
        req.send(null);
        console.log(req.responseText);
      //spracovanie struktury JSOn zo servera a priradenie konfiguracie modelu ruky
      var armData = JSON.parse(req.responseText);
      console.error(armData);
      arm.object3D.position.x = armData.armPosX;
      arm.object3D.position.y = armData.armPosY;
      arm.object3D.position.z = armData.armPosZ;
      arm.object3D.scale.x = armData.armScaleX;
      arm.object3D.scale.y = armData.armScaleY;
      arm.object3D.scale.z = armData.armScaleZ;
    });
  }
});
