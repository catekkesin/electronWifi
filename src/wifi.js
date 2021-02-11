var wifi = require('node-wifi');
// Initialize wifi module
// Absolutely necessary even to set interface to null
var jQuery = function (selector, context) {

  // The jQuery object is actually just the init constructor 'enhanced'
  // Need init if jQuery is called (just allow error to be thrown if not included)
  return new jQuery.fn.init(selector, context);
};

let allNetworks = [];
let selectedSsid = '';
let selectedPassword = '';



// Scan networks
wifi.init({
  iface: null // network interface, choose a random wifi interface if set to null
});

setInterval(() => {
  wifi.scan((error, networks) => {

    if (error) {
      console.log(error);
    } else {
      allNetworks = networks;
      let rows = [];

      $('#tbody').empty();
      $('#tbody').off('click');

      allNetworks.map(network => {
        let row = `<tr><td>${network.mac}</td><td>${network.ssid}</td><td>${network.quality}</td><td>${network.signal_level}</td><td><button name="rowSelect"  class="btn btn-primary" data-toggle="modal" data-target="#exampleModal" class='btn btn-primary'>Action</button></td></tr>`;
        $("#tbody").append(row);
        rows.push(row);
      })

      $("button[name=rowSelect]").on("click", function () {
        selectedRow = $(this).closest('tr').children();

        console.log(selectedRow.eq(1).html());

        $("input[name=ssid]").val(selectedRow.eq(1).html());

        selectedSsid = selectedRow.eq(1).html();

      });
    }
  });



}, 5000);

$('#submit-button').on('click', function () {
  selectedPassword = $('input[name=password]').val();
  console.log(selectedPassword);

  wifi.connect({
    ssid: selectedSsid,
    password: selectedPassword
  }, error => {
    if (error) {
      console.log(error);
    }
    console.log('Connected');
  });
});


$('button[name=disconnectButton]').on('click', function () {
  wifi.disconnect(error => {
    if (error) {
      console.log(error);
    } else {
      console.log('Disconnected');
    }
  });
})




/*
    networks = [
        {
          ssid: '...',
          bssid: '...',
          mac: '...', // equals to bssid (for retrocompatibility)
          channel: <number>,
          frequency: <number>, // in MHz
          signal_level: <number>, // in dB
          quality: <number>, // same as signal level but in %
          security:
           'WPA WPA2' // format depending on locale for open networks in Windows
          security_flags: '...' // encryption protocols (format currently depending of the OS)
          mode: '...' // network mode like Infra (format currently depending of the OS)
        },
        ...
    ];
    */