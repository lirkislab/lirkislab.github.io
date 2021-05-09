//este len v priprave na ziskavanie IP automaticky 

var mjson_data = null;
var dataIP = null;
$(document).ready(function() {
        $.getJSON('http://gd.geobytes.com/GetCityDetails?callback=?', function(data) {
          console.log(JSON.stringify(data, null, 2));
          mjson_data = data;
          console.error(mjson_data);
          dataIP = mjson_data.geobytesforwarderfor;
          console.error(dataIP);
        })
})
