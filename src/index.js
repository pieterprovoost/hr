(function() {

  dayjs.locale("nl-be");

  function parseTimeFromFilename(filename) {
    const datePart = filename.match(/([0-9]+).h5/)[1];
    const iso = datePart.substring(0, 4) + "-" + datePart.substring(4, 6) + "-" + datePart.substring(6, 8) + "T" + datePart.substring(8, 10) + ":" + datePart.substring(10, 12) + "Z";
    const date = new Date(Date.parse(iso));
    return date;
  }

  function formatDate(date) {
    return dayjs(date).format("dddd D/M H:mm");
  }

  function formatTime(date) {
    return dayjs(date).format("H:mm");
  }

  const map = L.map("map").setView([50.3, 4.5], 8);
  L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: "abcd",
    maxZoom: 20
  }).addTo(map);

  const group = L.layerGroup();
  group.addTo(map);

  L.Control.Legend = L.Control.extend({
    onAdd: function() {
      return L.DomUtil.create("div", "legend");
    }
  });
  L.control.legend = function(opts) {
    return new L.Control.Legend(opts);
  }
  L.control.legend({ position: "topright" }).addTo(map);

  L.control.locate().addTo(map);
  
  async function updateMap() {
    const maxImages = 9;
    const allColors = ["#fff7f3", "#fde0dd", "#fcc5c0", "#fa9fb5", "#f768a1", "#dd3497", "#ae017e", "#7a0177", "#49006a"];

    const res = await fetch("https://pieterprovoost-hagel.s3.eu-central-1.amazonaws.com/hagel.json");
    const data = await res.json();
    const names = Object.keys(data.images).sort();
    const selectedNames = names.slice(-maxImages);
    const labels = selectedNames.map(parseTimeFromFilename).map(formatTime);
    const usedColors = allColors.slice(-selectedNames.length);
  
    const layers = selectedNames.map((name, i) => {
      if (typeof data.images[name] === "string") {
        const parsed = JSON.parse(data.images[name]);
        return L.geoJSON(parsed, {
          "color": usedColors[i],
          "weight": 0,
          "fillOpacity": 0.5
        });
      }
    });

    group.clearLayers();
    layers.forEach((layer) => {
      if (layer) {
        layer.addTo(group);
      }
    });
  
    const lastName = names.slice(-1)[0];
    const updated = formatDate(parseTimeFromFilename(lastName));
    document.getElementById("status").innerHTML = updated;

    const div = document.getElementsByClassName("legend")[0];
    div.innerHTML = "";
    for (var i = 0; i < usedColors.length; i++) {
      const label = "-" + i + " min"
      div.innerHTML += '<i style="background-color: ' + usedColors[i] + '"></i>' + labels[i] + '<br/>';
    }
  }

  updateMap();
  setInterval(function() {
    updateMap();
  }, 60000);

})();
