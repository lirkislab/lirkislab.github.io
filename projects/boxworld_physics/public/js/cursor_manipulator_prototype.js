var THREE = window.THREE;
var AFRAME = window.AFRAME;
var NAF = window.NAF;
var CANNON = window.CANNON;

AFRAME.registerComponent("raycaster-listen", {
  init: function() {
    this.system = this.el.sceneEl.systems.physics;
    this.grabbing = false;
    this.hitEl = /** @type {AFRAME.Element}    */ null;
    this.physics = /** @type {AFRAME.System}     */ this.el.sceneEl.systems.physics;
    this.constraint = /** @type {CANNON.Constraint} */ null;
    this.grabbed = false;
    this.gripButtonpushed = false;
    this.parentobject = document.querySelector("#usercursor");
    
    

    NAF.utils.getNetworkedEntity(this.el).then(el => {
      el.addEventListener("ownership-gained", function(evt) {
        evt.detail.el === el ? el.setAttribute("dynamic-body", { mass: 0.1 }): null;
        console.log(evt);
      });
      el.addEventListener("ownership-lost", function(evt) {
        evt.detail.el === el ? el.removeAttribute("dynamic-body") : null;
      });
      el.addEventListener("ownership-changed", function(evt) {
        if (evt.detail.newOwner == NAF.clientId) {
          evt.detail.el === el ? el.setAttribute("dynamic-body", { mass: 0.1 }) : null;
        } else if (evt.detail.oldOwner == NAF.clientId) {
          evt.detail.el === el ? el.removeAttribute("dynamic-body") : null;
        }
      });
    });
    
    // this.el.addEventListener("raycaster-intersected", event => {  
    //   console.error(event.target.parentEl.id);
    //    });
    
    //this.el.addEventListener("raycaster-intersected", event => {
      this.el.addEventListener("mousedown", evt => {
        this.gripButtonpushed = true;
        
        
        if (this.grabbed == false && this.gripButtonpushed == true) {
          NAF.utils.getNetworkedEntity(this.el).then(el => {
            !NAF.utils.isMine(el) ? NAF.utils.takeOwnership(el) : null;
          });

          //console.log(parentObject);
           this.el.setAttribute("dynamic-body",{});
          this.constraint = new CANNON.LockConstraint(this.el.body,this.parentobject.body,{ maxForce: 5000 });
          this.system.addConstraint(this.constraint);
          this.grabbed = true;
        }
      });
   // });

    this.el.addEventListener("mouseup", evt => {
      this.system.removeConstraint(this.constraint);
     // console.error(evt.target.parentEl.id);
      this.grabbed = false;
      this.gripButtonpushed = false;
    });
  },
});



  AFRAME.registerComponent("laser-listen", {
    init: function() {
      this.system = this.el.sceneEl.systems.physics;
      this.grabbing = false;
      this.hitEl = /** @type {AFRAME.Element}    */ null;
      this.physics = /** @type {AFRAME.System}     */ this.el.sceneEl.systems.physics;
      this.constraint = /** @type {CANNON.Constraint} */ null;
      this.grabbedL = false;
      this.grabbedR = false;
      this.gripButtonpushedL = false;
      this.gripButtonpushedR = false;
      this.leftController = document.querySelector("#leftController");
      this.rightController = document.querySelector("#rightController");
      this.parentobjectL = document.querySelector("#usercursorL");
      this.parentobjectR = document.querySelector("#usercursorR");
      this.parentnodeL = 0;
      this.parentnodeR = 0;

      NAF.utils.getNetworkedEntity(this.el).then(el => {
        el.addEventListener("ownership-gained", function(evt) {
          evt.detail.el === el ? el.setAttribute("dynamic-body", { mass: 0.1 }): null;
          console.log(evt);
        });
        el.addEventListener("ownership-lost", function(evt) {
          evt.detail.el === el ? el.removeAttribute("dynamic-body") : null;
        });
        el.addEventListener("ownership-changed", function(evt) {
          if (evt.detail.newOwner == NAF.clientId) {
            evt.detail.el === el ? el.setAttribute("dynamic-body", { mass: 0.1 }) : null;
          } else if (evt.detail.oldOwner == NAF.clientId) {
            evt.detail.el === el ? el.removeAttribute("dynamic-body") : null;
          }
        });
      });

      this.leftController.addEventListener("buttondown", evt => {
        this.gripButtonpushedL = true;
        });

      this.rightController.addEventListener("buttondown", evt => {
        this.gripButtonpushedR = true;
        });

      this.el.addEventListener("raycaster-intersected", event => {      
      // this.leftController.addEventListener("buttondown", evt => {
      //    this.gripButtonpushed = true;

          if (this.grabbedL == false && this.gripButtonpushedL == true && event.detail.el.id == 'leftController') {
            NAF.utils.getNetworkedEntity(this.el).then(el => {
              !NAF.utils.isMine(el) ? NAF.utils.takeOwnership(el) : null;
            });
            
            //get object ID
            this.parentnodeL = event.target.parentEl.id;
            //console.log(parentObject);
            this.el.setAttribute("dynamic-body",{});
            this.constraint = new CANNON.LockConstraint(this.el.body,this.parentobjectL.body,{ maxForce: 5000 });
            this.system.addConstraint(this.constraint);
            this.grabbedL = true;
          }

          if (this.grabbedR == false && this.gripButtonpushedR == true && event.detail.el.id == 'rightController') {
            NAF.utils.getNetworkedEntity(this.el).then(el => {
              !NAF.utils.isMine(el) ? NAF.utils.takeOwnership(el) : null;
            });

            //get object ID
            this.parentnodeR = event.target.parentEl.id;
            //console.log(parentObject);
            this.el.setAttribute("dynamic-body",{});
            this.constraint = new CANNON.LockConstraint(this.el.body,this.parentobjectR.body,{ maxForce: 5000 });
            this.system.addConstraint(this.constraint);
            this.grabbedR = true;
          }
       // });
      });  

      this.leftController.addEventListener("buttonup", evt => {
        this.system.removeConstraint(this.constraint);
        // console.error(evt.target.parentEl.id);
        this.grabbedL = false;
        this.gripButtonpushedL = false;
      });

      this.rightController.addEventListener("buttonup", evt => {
        this.system.removeConstraint(this.constraint);
        this.grabbedR = false;
        this.gripButtonpushedR = false;
      });
    }
  });


// AFRAME.registerComponent("laser-listen", {
//   init: function() {
//     this.system = this.el.sceneEl.systems.physics;
//     this.grabbing = false;
//     this.hitEl = /** @type {AFRAME.Element}    */ null;
//     this.physics = /** @type {AFRAME.System}     */ this.el.sceneEl.systems.physics;
//     this.constraint = /** @type {CANNON.Constraint} */ null;
//     this.grabbed = false;
//     this.gripButtonpushedL = false;
//     this.gripButtonpushedR = false;
//     this.leftController = document.querySelector("#leftController");
//     this.rightController = document.querySelector("#rightController");
//     this.parentobjectL = document.querySelector("#usercursorL");
//     this.parentobjectR = document.querySelector("#usercursorR");
    
//     NAF.utils.getNetworkedEntity(this.el).then(el => {
//       el.addEventListener("ownership-gained", function(evt) {
//         evt.detail.el === el ? el.setAttribute("dynamic-body", { mass: 0.1 }): null;
//         console.log(evt);
//       });
//       el.addEventListener("ownership-lost", function(evt) {
//         evt.detail.el === el ? el.removeAttribute("dynamic-body") : null;
//       });
//       el.addEventListener("ownership-changed", function(evt) {
//         if (evt.detail.newOwner == NAF.clientId) {
//           evt.detail.el === el ? el.setAttribute("dynamic-body", { mass: 0.1 }) : null;
//         } else if (evt.detail.oldOwner == NAF.clientId) {
//           evt.detail.el === el ? el.removeAttribute("dynamic-body") : null;
//         }
//       });
//     });

//     this.leftController.addEventListener("buttondown", evt => {
//       this.gripButtonpushedL = true;
//       });
    
//     this.rightController.addEventListener("buttondown", evt => {
//       this.gripButtonpushedR = true;
//       });
          
//     this.el.addEventListener("raycaster-intersected", event => {      
//     // this.leftController.addEventListener("buttondown", evt => {
//     //    this.gripButtonpushed = true;

//         if (this.grabbed == false && this.gripButtonpushedL == true) {
//           NAF.utils.getNetworkedEntity(this.el).then(el => {
//             !NAF.utils.isMine(el) ? NAF.utils.takeOwnership(el) : null;
//           });

//           //console.log(parentObject);
//           this.el.setAttribute("dynamic-body",{});
//           this.constraint = new CANNON.LockConstraint(this.el.body,this.parentobjectL.body,{ maxForce: 5000 });
//           this.system.addConstraint(this.constraint);
//           this.grabbed = true;
//         }
      
//         else if (this.grabbed == false && this.gripButtonpushedR == true) {
//           NAF.utils.getNetworkedEntity(this.el).then(el => {
//             !NAF.utils.isMine(el) ? NAF.utils.takeOwnership(el) : null;
//           });

//           //console.log(parentObject);
//           this.el.setAttribute("dynamic-body",{});
//           this.constraint = new CANNON.LockConstraint(this.el.body,this.parentobjectR.body,{ maxForce: 5000 });
//           this.system.addConstraint(this.constraint);
//           this.grabbed = true;
//         }
//      // });
//     });  

//     this.leftController.addEventListener("buttonup", evt => {
//       this.system.removeConstraint(this.constraint);
//       this.grabbed = false;
//       this.gripButtonpushedL = false;
//     });
    
//     this.rightController.addEventListener("buttonup", evt => {
//       this.system.removeConstraint(this.constraint);
//       this.grabbed = false;
//       this.gripButtonpushedR = false;
//     });
//   }
// });



