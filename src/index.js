(function() {

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function() {
      navigator.serviceWorker.register("service-worker.js")
      .then(function(registration) {}, function(e) {})
      .catch(function(e) {});
    });
  }

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

  L.control.locate({
    setView: false,
    keepCurrentZoomLevel: true
  }).addTo(map);

  L.easyButton('<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-exclamation-triangle-fill" viewBox="0 0 27 20"><path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/></svg>', function(btn, map){
  console.log($("#alertsModal"))  
  $("#alertsModal").modal("show");
  }).addTo(map);

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
          "fillOpacity": 0.5,
          "onEachFeature": function(feature, layer) {
            if (feature.properties && feature.properties.p_min) {
              const p_min = Math.round(feature.properties.p_min / 255 * 100);
              const p_max = Math.round(feature.properties.p_max / 255 * 100);
              let content;
              if (p_min === p_max) {
                content = "<p>" + p_min + "% kans</p>";
              } else {
                content = "<p>" + p_min + " - " + p_max + "% kans</p>";
              }
              layer.bindPopup(content);
            }
          }
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
      const label = "-" + i + " min";
      div.innerHTML += '<i style="background-color: ' + usedColors[i] + '"></i>' + labels[i] + '<br/>';
    }

    if (data.alerts && data.alerts.length) {
      let content = data.alerts.map(alert => {
        return "<h5>" + alert.headline + "</h5><p>" + alert.description + "</p>";
      }).join("");
      document.getElementById("alertsBody").innerHTML = content;
      document.querySelectorAll(".easy-button-container").forEach(function(el) {
        el.style.visibility = "visible";
      });
    } else {
      document.querySelectorAll(".easy-button-container").forEach(function(el) {
        el.style.visibility = "hidden";
      });
      document.getElementById("alertsBody").innerHTML = "";
    }

  }

  updateMap();
  setInterval(function() {
    updateMap();
  }, 60000);

})();
