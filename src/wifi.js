var wifi = require("node-wifi");
// Initialize wifi module
// Absolutely necessary even to set interface to null
var jQuery = function (selector, context) {
  // The jQuery object is actually just the init constructor 'enhanced'
  // Need init if jQuery is called (just allow error to be thrown if not included)
  return new jQuery.fn.init(selector, context);
};

let allNetworks = [];
let selectedSsid = "";
let selectedPassword = "";

//duplicateleri goster

// Scan networks
wifi.init({
  iface: null, // network interface, choose a random wifi interface if set to null
});

const calcSignal = (signal) => {
  let str = [
    `<li class="very-weak">
        <div></div>
      </li>`,
    `      <li class="very-weak">
        <div></div>
      </li>
      <li class="weak">
        <div></div>
      </li>`,
    `     <li class="very-weak">
        <div></div>
      </li>
      <li class="weak">
        <div></div>
      </li>
      <li class="strong">
        <div></div>
      </li>`,
    ` <li class="very-weak">
        <div></div>
      </li>
      <li class="weak">
        <div></div>
      </li>
      <li class="strong">
        <div></div>
      </li>
      <li class="pretty-strong">
        <div></div>
      </li>`,
  ];
  console.log();
  return (
    "<ul id='signal-strength'>" + str[Math.round(signal / 25 - 1)] + "</ul>"
  );
};

let currentWifi;

setInterval(() => {
  wifi.getCurrentConnections((error, currentConnections) => {
    if (error) {
      //console.log(error);
    } else {
      currentWifi = currentConnections;
    }
  });

  wifi.scan((error, networks) => {
    if (error) {
      console.log(error);
    } else {
      allNetworks = networks;
      let rows = [];

      $("#tbody").empty();
      $("#tbody").off("click");

      allNetworks.map((network) => {
        let rowStyle = "";

        if (network.ssid == currentWifi[0].ssid) {
          rowStyle = "border-style: solid; border-color: green";
        }

        let row = `<tr style='${rowStyle}'><td>${
          network.ssid
        }</td><td>${calcSignal(network.quality)}</td>
        <td><button name="rowSelect"  class="btn btn-primary" data-toggle="modal" data-target="#exampleModal" class='btn btn-primary'>Baglan</button></td>
        </tr>`;
        $("#tbody").append(row);
        rows.push(row);
      });

      $("button[name=rowSelect]").on("click", function () {
        selectedRow = $(this).closest("tr").children();

        //console.log(selectedRow.eq(0).html());

        $("input[name=ssid]").val(selectedRow.eq(0).html());

        selectedSsid = selectedRow.eq(0).html();
        $("#modalTitle").text(selectedSsid);
      });
    }
  });
}, 5000);

$("#submit-button").on("click", function () {
  selectedPassword = $("input[name=password]").val();
  console.log(selectedPassword);
  $("#modalTitle").text("Baglaniyor...");

  wifi.connect(
    {
      ssid: selectedSsid,
      password: selectedPassword,
    },
    (error) => {
      if (error) {
        $("#modalTitle").text("HATA...");

        console.log(error);
      }
      $("#modalTitle").text("Baglandi...");
      console.log("Connected");
    }
  );
});

$("button[name=disconnectButton]").on("click", function () {
  wifi.disconnect((error) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Disconnected");
    }
  });
});

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
