// Load required modules
var http    = require("http");              // http server core module
var express = require("express");           // web framework external module
var serveStatic = require('serve-static');  // serve static files
var socketIo = require("socket.io")(http);        // web socket external module
var easyrtc = require("easyrtc");               // EasyRTC external module
var bodyParser = require('body-parser');       //Body Parser to deserialize JSOn object data
var os = require("os");                        //modul pre riadenie vkladania zaznamoj son do noveho riadku pola historie

// Set process name
process.title = "node-easyrtc";

// Get port or default to 8080
var port = process.env.PORT || 8080;
//var port = 8080;

// Setup and configure Express http server. Expect a subfolder called "static" to be the web root.
var app = express();
app.use(express.static('public'));

// Start Express http server
var webServer = http.createServer(app).listen(port);

// Start Socket.io so it attaches itself to Express server
var ServerSocket = socketIo.listen(webServer, {"log level":1});

ServerSocket.on('connection', function(socket) {
  socket.join('vrarmroom1');
  console.log('user connected');
  socket.emit('message', 'Connected to Server - LIRKIS G-CVE ver.VRarm0.2 Message succesful!');
  
  socket.on('disconnect', function() {
    console.log('user disconnected');
  });
  
  socket.on('countDown', function(msg) {
    socketIo.emit('countDown', msg);
  });
  
  socket.on('message', function(msg){
    socketIo.emit('message', msg);
    console.error(msg);
    // if(msg == "arm2020ba"){
    //   socketIo.emit('message', "https://vrarm.glitch.me/remoteit20201.html");
    // }
  });
});

var myIceServers = [
  {"url":"stun:stun.l.google.com:19302"},
  {"url":"stun:stun1.l.google.com:19302"},
  {"url":"stun:stun2.l.google.com:19302"},
  {"url":"stun:stun3.l.google.com:19302"}
];
easyrtc.setOption("appIceServers", myIceServers);
easyrtc.setOption("logLevel", "debug");
easyrtc.setOption("demosEnable", false);

// Overriding the default easyrtcAuth listener, only so we can directly access its callback
easyrtc.events.on("easyrtcAuth", function(socket, easyrtcid, msg, socketCallback, callback) {
    easyrtc.events.defaultListeners.easyrtcAuth(socket, easyrtcid, msg, socketCallback, function(err, connectionObj){
        if (err || !msg.msgData || !msg.msgData.credential || !connectionObj) {
            callback(err, connectionObj);
            return;
        }

        connectionObj.setField("credential", msg.msgData.credential, {"isShared":false});

        console.log("["+easyrtcid+"] Credential saved!", connectionObj.getFieldValueSync("credential"));

        callback(err, connectionObj);
    });
});

// To test, lets print the credential to the console for every room join!
easyrtc.events.on("roomJoin", function(connectionObj, roomName, roomParameter, callback) {
    console.log("["+connectionObj.getEasyrtcid()+"] Credential retrieved!", connectionObj.getFieldValueSync("credential"));
    easyrtc.events.defaultListeners.roomJoin(connectionObj, roomName, roomParameter, callback);
});

// Start EasyRTC server
var rtc = easyrtc.listen(app, ServerSocket, null, function(err, rtcRef) {
    console.log("Initiated");

    rtcRef.events.on("roomCreate", function(appObj, creatorConnectionObj, roomName, roomOptions, callback) {
        console.log("roomCreate fired! Trying to create: " + roomName);

        appObj.events.defaultListeners.roomCreate(appObj, creatorConnectionObj, roomName, roomOptions, callback);
    });
});

//listen on port
// webServer.listen(port, function () {
//     console.log('listening on http://localhost:' + port);
// });


// SERVER API IMPLEMENTATION --------------------------------------------------------------------------------------------------
//GETIP GET METHOD - experimentalna metoda pre ziskavanie dat zo suboru holoip.json - aktualne nepouzivana
var getpath = '/getholoip';
var getFile = 'holoip.json';
app.get(getpath, function (req, res) {
  const fs = require('fs');
  let rawdata = fs.readFileSync(getFile);
  let parsedJSON = JSON.parse(rawdata);
  console.log(parsedJSON); 
   res.json(parsedJSON);
});

//################################################################################################################################################
//POSTIP POST METHOD ## TUTO METODU NEMAZAT ## pracuje s ROBO ARM
//Metoda post pre roboram-zariadenie v Bratislave, ktore spusta animaciu pri experimente
//################################################################################################################################################
app.post('/triggerStart', function (req, res) {
  res.send('POST request to homepage');
  socketIo.emit('message', "move");
    console.error("startAnimation");
})

//################################################################################################################################################
//################################################################################################################################################
//Implementacia HTTP RESTov 
//NAJPRV MUSI EXITOVAT jsonParser, na zaciatku kodu definovana dependencia na var bodyParser = require('body-parser');
//Body parser, pre citanie dat z JSON v HTTP Rest API--------------------------------------------------------------------------------------------
var jsonParser = bodyParser.json(); //objekt pre parsovanie Body kazdeho JSON objektu
var urlencodedParser = bodyParser.urlencoded({ extended: false }) //middleware pre body requestov
app.use(bodyParser.json()); //pouzitie parser metody a objektu 

//################################################################################################################################################
//PRACA S KONFIGURACNYMI UDAJMI O POSLEDNOM STAVE RUKY {pozicia, sklaovanie} v JSON formate - subjectConfig.json---------------------------------
//################################################################################################################################################
//server prijme post o datach subjektu pozicia ruky a skalovanie ako JSON Object + zapise ich do json suboru subjectConfig.json
app.post('/subjectData', urlencodedParser, function (req, res) {
  const fs = require('fs');
  //zapis posledneho zaznamu do suboru zvlast
      console.log(req.body); 
      let data = JSON.stringify(req.body);
      fs.writeFileSync('./private/subjectConfig.json', data);
    
  //potom server zapise log s konfiguraciou do historie dat v subore subjectConfigLogs.json, kde sa ukladaju
    fs.appendFile('./private/subjectConfigLogs.json', JSON.stringify(req.body) + '\r\n', 'utf-8', function(err) {
		if (err) throw err
		console.log('the subjectConfigLogs.js wass sucesfully extended')
	  })
  //odpoved klientovi, ze data boli prijate
  res.send("Post was succesful");
})

//server po prijati requestu GET precita data zo suboru subjectConfig.json a posle klientovi ktory on poziadal
app.get('/subjectData', function (req, res) {
  const fs = require('fs');
  let rawdata = fs.readFileSync('./private/subjectConfig.json');
  let parsedJSON = JSON.parse(rawdata);
  console.log(parsedJSON); 
   res.json(parsedJSON);
})

//################################################################################################################################################
//AUTORIZACIA KLIENTOV PRE PRIPOJENIE DO ROZHRANIA EXPERIMENTATORA
//################################################################################################################################################
//Server autorizacia prihlasenia klienta do rozhrania experimentatora s presmerovanim na adresu rozhrania 
//+ zapis zaznamu historie do suboru ClientLogs.json
app.post('/requireaccess', urlencodedParser, function (req, res) {
  const fs = require('fs');
  //do premennych sa zapisu udaje z prijateho JSON objektu
  var JSONdateestamp = req.body.DATESTAMP;
  var username = req.body.user;
  var password = req.body.psw;
  
  //otvori sa subor s accessData.json kde su ulozene pristupove udaje - aby sa overilo, ci prichadzajuce prihlasovacie udaje su spravne
  fs.readFile('./private/accessData.json', 'utf-8', function(err, data) {
	if (err) throw err
  //
    //ziskaju sa data o pristupoch subor accessData.json sa naparsuje do objektu JSON pod premennou userdata
    var userdata = JSON.parse(data)
    //console.log(userdata)
    //userdata.users.push(req.body) toto by sluzilo pri registracii novych pouzivatelov
    //prejde sa vsetkymi zaznamami v objektoch JSON ktore sa nachadzaju v accessData.json
    for (var i = 0; i < userdata.users.length; i++){
      //zisti sa ci meno usera existuje v accessData.json
      //console.log(userdata.users[i]["user"])
      if (userdata.users[i]["user"] == username){
         //ak meno usera sa v accessData.json nachadza, potom sa skontroluje ci zadal spravne heslo
           if(userdata.users[i]["psw"] == password){
             //ak zadal spravne heslo, najprv sa log zapise do suboru ClientLogs.json
              var userLogObject = { "DATESTAMP": JSONdateestamp, "user": username };
              writeClientLog(userLogObject);
             //potom klienta presmeruje cez socket
              socketIo.emit('message', "https://vrarm2.glitch.me/remoteit20201.html");
             //res.send("autorization succesful")
           }
      }
    }
  })
})

//medota ktora zaspisuje historiu logov v do suboru ClientLogs.json
//vstupny parameter je JSON object z metody app.post('/requireaccess') - volanie tejto funkcie je na konci metody
function writeClientLog(userdata){
        const fs = require('fs');
        //JSON objekt musi byt pri zapise zmeneny na retazec aby bol korektne zapisany v logu t.j.JSON.stringify(userdata)
        fs.appendFile('./private/ClientLogs.json', JSON.stringify(userdata) + '\r\n', 'utf-8', function(err) {
          if (err) throw err
          console.log('users log was written into ClientLogs.json')
          })
        //res.send("Post was succesful");
     
}
  
