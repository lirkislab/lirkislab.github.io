 var userID=Math.floor((Math.random() * 100) + 1);
//var username = prompt('Choose a username', username);
 //var chairNum = prompt('Choose a chair (write num from 1 to 4)', chairNum);
    AFRAME.registerComponent('head-text', {
      
       tick: function () {
        var el = this.el;   
        el.setAttribute("text", {value: 'User'});  
        // el.setAttribute("text", {value: username});
      }
    });


    AFRAME.registerComponent('set-ui-position', {
       init: function () {
        var el = this.el;      
         switch (chairNum) {
                    case "1":
                    el.setAttribute('position', {x: -0.587, y: 0, z: 1.232});
                    break;
                    case "2":
                    el.setAttribute('position', {x: 0.778, y: 0, z: 1.232});
                    break;
                    case "3":
                    el.setAttribute('position', {x: 0.778, y: 0, z: -1.05});
                    el.setAttribute('rotation', {x: 0, y: 180, z: 0});
                    break;
                    case "4":
                    el.setAttribute('position', {x: -0.587, y: 0, z: -1.05});
                    el.setAttribute('rotation', {x: 0, y: 180, z: 0});
                    
         }
       }
      
    });

