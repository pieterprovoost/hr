!function(){function t(t){const e=t.match(/([0-9]+).h5/)[1],n=e.substring(0,4)+"-"+e.substring(4,6)+"-"+e.substring(6,8)+"T"+e.substring(8,10)+":"+e.substring(10,12)+"Z";return new Date(Date.parse(n))}function e(t){return dayjs(t).format("H:mm")}dayjs.locale("nl-be");const n=L.map("map").setView([50.3,4.5],8);L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',subdomains:"abcd",maxZoom:20}).addTo(n);const o=L.layerGroup();async function a(){const n=await fetch("https://pieterprovoost-hagel.s3.eu-central-1.amazonaws.com/hagel.json"),a=await n.json(),r=Object.keys(a.images).sort(),s=r.slice(-9),c=s.map(t).map(e),i=["#fff7f3","#fde0dd","#fcc5c0","#fa9fb5","#f768a1","#dd3497","#ae017e","#7a0177","#49006a"].slice(-s.length),d=s.map(((t,e)=>{if("string"==typeof a.images[t]){const n=JSON.parse(a.images[t]);return L.geoJSON(n,{color:i[e],weight:0,fillOpacity:.5})}}));o.clearLayers(),d.forEach((t=>{t&&t.addTo(o)}));const l=(m=t(r.slice(-1)[0]),dayjs(m).format("dddd D/M H:mm"));var m;document.getElementById("status").innerHTML=l;const g=document.getElementsByClassName("legend")[0];g.innerHTML="";for(var p=0;p<i.length;p++)g.innerHTML+='<i style="background-color: '+i[p]+'"></i>'+c[p]+"<br/>"}o.addTo(n),L.Control.Legend=L.Control.extend({onAdd:function(){return L.DomUtil.create("div","legend")}}),L.control.legend=function(t){return new L.Control.Legend(t)},L.control.legend({position:"topright"}).addTo(n),L.control.locate({setView:!1,keepCurrentZoomLevel:!0}).addTo(n),a(),setInterval((function(){a()}),6e4)}();