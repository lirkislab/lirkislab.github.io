// toto nic, to len tak 

AFRAME.registerComponent('get-the-position', {
  schema: {
    postrue: {type: 'number', default: 1}
  },

  init: function() {
    
    var el = this.el;
    var center = el.getAttribute('position');
    el.setAttribute('position', {center});

  },

});