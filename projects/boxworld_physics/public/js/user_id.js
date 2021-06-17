
 var username = prompt('Choose a username', username);
 //var chairNum = prompt('Choose a position (write num from 1 to 4)', chairNum);
    AFRAME.registerComponent('head-text', {
      
       tick: function () {
        var el = this.el;   
       // el.setAttribute("text", {value: 'User' + userID});  
         el.setAttribute("text", {value: username});
      }
    });
