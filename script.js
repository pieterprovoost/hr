!function(){"serviceWorker"in navigator&&window.addEventListener("load",(function(){navigator.serviceWorker.register("service-worker.js").then((function(t){}),(function(t){})).catch((function(t){}))})),dayjs.locale("nl-be");const t=L.map("map").setView([50.3,4.5],8);L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',subdomains:"abcd",maxZoom:20}).addTo(t);const e=L.layerGroup();async function o(){const t=await fetch("https://hagelradar.s3.eu-central-1.amazonaws.com/output.json"),o=await t.json(),n=["#fff7f3","#fde0dd","#fcc5c0","#fa9fb5","#f768a1","#dd3497","#ae017e","#7a0177","#49006a"].slice(-o.maps.length);let a=[],r=null;e.clearLayers(),o.maps.map(((t,o)=>{const s=function(t){const e=t.match(/([0-9]+)/)[1],o=e.substring(0,4)+"-"+e.substring(4,6)+"-"+e.substring(6,8)+"T"+e.substring(8,10)+":"+e.substring(10,12)+"Z";return new Date(Date.parse(o))}(t.timestamp);r=dayjs(s).format("dddd D/M H:mm"),a.push(dayjs(s).format("H:mm")),L.geoJSON(t.geo,{color:n[o],weight:0,fillOpacity:.5,onEachFeature:function(t,e){if(t.properties&&t.properties.p_min){const o=Math.round(t.properties.p_min/255*100),n=Math.round(t.properties.p_max/255*100);let a;a=o===n?"<p>"+o+"% kans</p>":"<p>"+o+" - "+n+"% kans</p>",e.bindPopup(a)}}}).addTo(e)})),a.slice(-1),document.getElementById("status").innerHTML=r;const s=document.getElementsByClassName("legend")[0];s.innerHTML="";for(var i=0;i<n.length;i++)s.innerHTML+='<i style="background-color: '+n[i]+'"></i>'+a[i]+"<br/>"}e.addTo(t),L.Control.Legend=L.Control.extend({onAdd:function(){return L.DomUtil.create("div","legend")}}),L.control.legend=function(t){return new L.Control.Legend(t)},L.control.legend({position:"topright"}).addTo(t),L.control.locate({setView:!1,keepCurrentZoomLevel:!0}).addTo(t),L.easyButton('<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-exclamation-triangle-fill" viewBox="0 0 27 20"><path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/></svg>',(function(t,e){console.log($("#alertsModal")),$("#alertsModal").modal("show")})).addTo(t),o(),setInterval((function(){o()}),6e4)}();