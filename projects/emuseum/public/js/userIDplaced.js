 var userID=Math.floor((Math.random() * 100) + 1);
 var username = prompt('Write your original username', username);
 //var chairNum = prompt('Choose a position (write num from 1 to 4)', chairNum);
    AFRAME.registerComponent('head-text', {
      
       tick: function () {
        var el = this.el;   
       // el.setAttribute("text", {value: 'User' + userID});  
         el.setAttribute("text", {value: username});
      }
    });


/*
AFRAME.registerComponent('set-ui-position', {
       init: function () {
        var el = this.el;   
        console.error(chairNum);
         switch (chairNum) {
                    case "1":
                    el.setAttribute('position', {x: 1, y: 0, z: 4});
                   break;
                    case "2":
                    el.setAttribute('position', {x: 5, y: 0, z: 6});
                    break;
                    case "3":
                    el.setAttribute('position', {x: 7, y: 0, z: 1});
                    el.setAttribute('rotation', {x: 0, y: 180, z: 0});
                    break;
                    case "4":
                    el.setAttribute('position', {x: 8, y: 0, z: 2});
                    el.setAttribute('rotation', {x: 0, y: 180, z: 0});
                    
         }  
       }
      
    });

*/