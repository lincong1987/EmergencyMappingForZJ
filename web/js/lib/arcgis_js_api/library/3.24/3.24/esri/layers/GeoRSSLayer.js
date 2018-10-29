// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.24/esri/copyright.txt for details.
//>>built
require({cache:{"esri/layers/ServiceGeneratedFeatureCollection":function(){define("dojo/_base/declare dojo/_base/connect dojo/_base/lang dojo/_base/array dojo/dom-construct dojo/dom-style dojo/has ../kernel ../SpatialReference ../geometry/Extent ../geometry/webMercatorUtils ../renderers/SimpleRenderer ./layer ./FeatureLayer ../dijit/PopupTemplate".split(" "),function(d,k,e,f,g,h,l,m,n,r,q,p,t,u,v){d=d([t],{declaredClass:"esri.layers._ServiceGeneratedFeatureCollection",constructor:function(a,b){this.pointSymbol=
b&&b.pointSymbol;this.polylineSymbol=b&&b.polylineSymbol;this.polygonSymbol=b&&b.polygonSymbol;this._outSR=b&&(b.outSpatialReference||b.outSR)||new n({wkid:4326});this._options=e.mixin({},b)},parse:function(){console.error("parse function has not been implemented")},getFeatureLayers:function(){var a=[];this._fLayers&&(a=a.concat(this._fLayers));return a},onRefresh:function(){},onOpacityChange:function(){},refresh:function(){this.loaded&&this._map&&!this._io&&this.visible&&this._createLayer()},_createLayer:function(a){var b=
this;this._fireUpdateStart();a=this.parse(a);a.addCallback(function(a){b._io=null;b._initLayer(a)});a.addErrback(function(a){b._io=null;a=e.mixin(Error(),a);a.message="Unable to load resource: "+b.url+" "+(a.message||"");b._fireUpdateEnd(a);b.onError(a)})},_initLayer:function(a){this.loaded&&this._removeInternalLayers();this.name=a.name;this.description=a.description;this.snippet=a.snippet;this.featureInfos=a.featureInfos;this.fullExtent=this.initialExtent=new r(a.lookAtExtent);this.copyright=a.author||
a.copyright;var b;(a=e.getObject("featureCollection.layers",!1,a))&&0<a.length&&(this._fLayers=[],f.forEach(a,function(a,d){var c=e.getObject("featureSet.features",!1,a);c&&0<c.length&&(b=e.mixin({outFields:["*"],infoTemplate:a.popupInfo?new v(a.popupInfo):null,editable:!1},this._options),b.id&&(b.id=b.id+"_"+d),b.webgl=!1,a.layerDefinition.capabilities="Query,Data",c=new u(a,b),c.geometryType&&(this["_"+c.geometryType]=c),this._fLayers.push(c))},this),0===this._fLayers.length&&delete this._fLayers);
this.items=[];this._esriGeometryPoint&&(this.items=this.items.concat(this._esriGeometryPoint.graphics),this.pointSymbol&&(a=new p(this.pointSymbol),this._esriGeometryPoint.setRenderer(a)));this._esriGeometryPolyline&&(this.items=this.items.concat(this._esriGeometryPolyline.graphics),this.polylineSymbol&&(a=new p(this.polylineSymbol),this._esriGeometryPolyline.setRenderer(a)));this._esriGeometryPolygon&&(this.items=this.items.concat(this._esriGeometryPolygon.graphics),this.polygonSymbol&&(a=new p(this.polygonSymbol),
this._esriGeometryPolygon.setRenderer(a)));this._fireUpdateEnd();this.loaded&&(this._addInternalLayers(),this.onRefresh())},_addInternalLayers:function(){var a=this._map;this._fireUpdateStart();var b=a.spatialReference,c=this._outSR,d;if(b.wkid)d=b._isWebMercator()&&c._isWebMercator()||b.wkid===c.wkid;else if(b.wkt)d=b.wkt===c.wkt;else{console.log("_setMap - map has invalid spatial reference");return}if(!d)if(b._isWebMercator()&&4326===c.wkid)this._converter=q.geographicToWebMercator;else if(c._isWebMercator()&&
4326===b.wkid)this._converter=q.webMercatorToGeographic;else{console.log("_setMap - unsupported workflow. Spatial reference of the map and layer do not match, and the conversion cannot be done on the client.");return}(b=this._fLayers)&&0<b.length&&f.forEach(b,function(b){if(this._converter){var c=b.graphics,d,e,f=c?c.length:0;for(d=0;d<f;d++)(e=c[d].geometry)&&c[d].setGeometry(this._converter(e))}a.addLayer(b)},this);this.setVisibility(this.visible);this._fireUpdateEnd()},_removeInternalLayers:function(){var a=
this._map;a&&f.forEach(this.getFeatureLayers(),a.removeLayer,a)},setScaleRange:function(a,b){this.inherited(arguments);f.forEach(this.getFeatureLayers(),function(c){c.setScaleRange(a,b)});this._options.minScale=this.minScale;this._options.maxScale=this.maxScale},setOpacity:function(a){this.opacity!=a&&(f.forEach(this.getFeatureLayers(),function(b){b.setOpacity(a)}),this.opacity=this._options.opacity=a,this.onOpacityChange(a))},onVisibilityChange:function(a){this._fireUpdateStart();f.forEach(this.getFeatureLayers(),
function(b){b.setVisibility(a)});this._fireUpdateEnd()},_setMap:function(a,b){this.inherited(arguments);this._map=a;var c=this._div=g.create("div",null,b);h.set(c,"position","absolute");this._addInternalLayers();this.evaluateSuspension();return c},_unsetMap:function(a,b){this._io&&this._io.cancel();k.disconnect(this._extChgHandle);delete this._extChgHandle;this._removeInternalLayers();var c=this._div;c&&(b.removeChild(c),g.destroy(c));this._div=null;this.inherited(arguments)}});l("extend-esri")&&
e.setObject("layers._ServiceGeneratedFeatureCollection",d,m);return d})},"*noref":1}});
define("esri/layers/GeoRSSLayer","dojo/_base/declare dojo/_base/lang dojo/_base/json dojo/has ../kernel ../config ../request ../urlUtils ./ServiceGeneratedFeatureCollection".split(" "),function(d,k,e,f,g,h,l,m,n){d=d([n],{declaredClass:"esri.layers.GeoRSSLayer",serviceUrl:m.getProtocolForWebResource()+"//utility.arcgis.com/sharing/rss",constructor:function(d,e){h.defaults.geoRSSService&&(this.serviceUrl=h.defaults.geoRSSService);this._createLayer()},parse:function(){return this._io=l({url:this.serviceUrl,
content:{url:this.url,refresh:this.loaded?!0:void 0,outSR:this._outSR?e.toJson(this._outSR.toJson()):void 0},callbackParamName:"callback"})},_initLayer:function(d){this.inherited(arguments);this.loaded||(this.loaded=!0,this.onLoad(this))}});f("extend-esri")&&k.setObject("layers.GeoRSSLayer",d,g);return d});