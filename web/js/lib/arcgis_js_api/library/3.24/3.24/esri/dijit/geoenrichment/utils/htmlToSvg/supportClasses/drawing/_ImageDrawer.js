// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.24/esri/copyright.txt for details.
//>>built
define("esri/dijit/geoenrichment/utils/htmlToSvg/supportClasses/drawing/_ImageDrawer",["../ElementBuilder"],function(m){var c={drawBackgroundImage:function(b,a){if(b.style.background.image&&-1!==b.style.background.image.indexOf("url")){var e=b.style.background.image.replace("url(","").replace(")","").replace(/"/g,"");return c._drawImage(e,b,a)}},drawImage:function(b,a,e){return c._drawImage(b.src,a,e)},_drawImage:function(b,a,e){var d=a.style.background.sizePx,f=a.style.background.positionXPx,g=a.style.background.positionYPx,
c=-1!==a.style.background.positionX.indexOf("%"),h=-1!==a.style.background.positionY.indexOf("%"),k=0,l=0;d&&(k=c?(a.style.cw-d)*f/100:f,l=h?(a.style.ch-d)*g/100:g);return m.buildElement("image",{"xlink:href":b,x:a.box.x+a.style.border.l.width+k,y:a.box.y+a.style.border.t.width+l,width:d||a.style.cw,height:d||a.style.ch,opacity:a.style.opacity,clipParams:e,preserveAspectRatio:d||"contain"===a.style.background.size?void 0:(c?0===f?"xMin":100===f?"xMax":"xMid":"xMid")+(h?0===g?"YMin":100===g?"YMax":
"YMid":"YMid")+" slice",transform:a.style.transform})}};return c});