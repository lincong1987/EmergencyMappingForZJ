// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.24/esri/copyright.txt for details.
//>>built
define("esri/tasks/PrintTask", "dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/_base/json dojo/_base/Deferred dojo/has ../kernel ../lang ../layerUtils ../deferredUtils ../Color ../request ../urlUtils ../geometry/Polygon ../renderers/SimpleRenderer ../symbols/FillSymbol ./Geoprocessor ./PrintTemplate ./Task dojo/dom-attr dojo/dom-construct dojox/gfx/_base dojox/gfx/canvas dojox/json/query dojo/has!extend-esri?./PrintParameters dojo/has!extend-esri?./LegendLayer".split(" "), function (y, k, r, C, D, E, x, z, F, G, I, J, K, L, M, N, O, P, Q, R, S, n, A, T) {
    y = y(Q, {
        declaredClass: "esri.tasks.PrintTask",
        constructor: function (b, e) {
            this.url = b;
            this.printGp = new O(this.url);
            this._handler = k.hitch(this, this._handler);
            e && e.async && (this.async = !0);
            this._colorEvaluator = T("$..color")
        },
        async: !1,
        _vtlExtent: null,
        _cimVersion: null,
        _is11xService: !1,
        _loadGpServerMetadata: !0,
        execute: function (b, e, g) {
            if (!this._loadGpServerMetadata) return this._execute(b, e, g);
            var a = new D(G._dfdCanceller),
                d = this._url.path,
                c = d.lastIndexOf("/GPServer/");
            0 < c && (d = d.slice(0, c + 9));
            a._pendingDfd = J({
                url: d,
                callbackParamName: "callback",
                content: k.mixin({}, this._url.query, {
                    f: "json"
                })
            }).then(k.hitch(this, function (c) {
                debugger
                this._loadGpServerMetadata = !1;
                this.async = "esriExecutionTypeAsynchronous" === c.executionType;
                this._cimVersion = c.cimVersion;
                this._is11xService = !! this._cimVersion;
                a._pendingDfd = this._execute(b);
                return a._pendingDfd
            })).then(k.hitch(this, function (b) {
                this._successHandler([b], "onComplete", e, a)
            })).otherwise(k.hitch(this, function (b) {
                this._errorHandler(b, g, a)
            }));
            return a
        },
        _handler: function (b, e, g, a, d) {
            try {
                var c;
                this.async ? "esriJobSucceeded" === b.jobStatus && this.printGp.getResultData(b.jobId, "Output_File", k.hitch(this, function (a) {
                    c = a.value;
                    this._successHandler([c], "onComplete", g, d)
                })) : (c = b[0].value, this._successHandler([c], "onComplete", g, d))
            } catch (h) {
                this._errorHandler(h, a, d)
            }
        },
        _execute: function (b, e, g) {
            var a = this._handler,
                d = this._errorHandler,
                c = b.template || new P;
            c.hasOwnProperty("showLabels") || (c.showLabels = !0);
            var h = c.exportOptions,
                q;
            h && (q = {
                outputSize: [h.width, h.height],
                dpi: h.dpi
            });
            var h = c.layoutOptions,
                m, H = [];
            if (h) {
                this.legendAll = !1;
                h.legendLayers ? r.forEach(h.legendLayers, function (a) {
                    var b = {};
                    b.id = a.layerId;
                    a.subLayerIds && (b.subLayerIds = a.subLayerIds);
                    H.push(b)
                }) : this.legendAll = !0;
                var f, p;
                if ("Miles" === h.scalebarUnit || "Kilometers" === h.scalebarUnit) f = "esriKilometers",
                    p = "esriMiles";
                else if ("Meters" === h.scalebarUnit || "Feet" === h.scalebarUnit) f = "esriMeters",
                    p = "esriFeet";
                m = {
                    esriMiles: "mi",
                    esriKilometers: "km",
                    esriFeet: "ft",
                    esriMeters: "m"
                };
                m = {
                    titleText: h.titleText,
                    authorText: h.authorText,
                    copyrightText: h.copyrightText,
                    customTextElements: h.customTextElements,
                    scaleBarOptions: {
                        metricUnit: f,
                        metricLabel: m[f],
                        nonMetricUnit: p,
                        nonMetricLabel: m[p]
                    },
                    legendOptions: {
                        operationalLayers: H
                    }
                }
            }
            f = this._getPrintDefinition(b.map, c);
            b.outSpatialReference && (f.mapOptions.spatialReference = b.outSpatialReference.toJson());
            b.template && z.isDefined(b.template.showAttribution) && (f.mapOptions.showAttribution = b.template.showAttribution);
            k.mixin(f, {
                exportOptions: q,
                layoutOptions: m
            });
            this.allLayerslegend && k.mixin(f.layoutOptions, {
                legendOptions: {
                    operationalLayers: this.allLayerslegend
                }
            });
            if (f.operationalLayers) {
                q = f.operationalLayers;
                var l, t = function (a) {
                        return z.fixJson(k.mixin(a, {
                            type: "esriSLS",
                            cap: void 0,
                            join: void 0,
                            meterLimit: void 0
                        }))
                    },
                    u = RegExp("[\\u4E00-\\u9FFF\\u0E00-\\u0E7F\\u0900-\\u097F\\u3040-\\u309F\\u30A0-\\u30FF\\u31F0-\\u31FF]"),
                    w = /[\u0600-\u06FF]/,
                    B = function (a) {
                        var b = a.text,
                            c = (a = a.font) && a.family && a.family.toLowerCase();
                        b && a && ("arial" === c || "arial unicode ms" === c) && (a.family = u.test(b) ? "Arial Unicode MS" : "Arial", "normal" !== a.style && w.test(b) && (a.family = "Arial Unicode MS"))
                    };
                for (m = 0; m < q.length; m++) if (q[m].featureCollection && q[m].featureCollection.layers) for (p = 0; p < q[m].featureCollection.layers.length; p++) {
                    var v = q[m].featureCollection.layers[p];
                    v.layerDefinition && v.layerDefinition.drawingInfo && v.layerDefinition.drawingInfo.renderer && v.layerDefinition.drawingInfo.renderer.symbol && (l = v.layerDefinition.drawingInfo.renderer, "esriCLS" === l.symbol.type ? l.symbol = t(l.symbol) : "esriTS" === l.symbol.type ? B(l.symbol) : l.symbol.outline && "esriCLS" === l.symbol.outline.type && (l.symbol.outline = t(l.symbol.outline)));
                    if (v.featureSet && v.featureSet.features) for (h = 0; h < v.featureSet.features.length; h++) l = v.featureSet.features[h],
                    l.symbol && ("esriCLS" === l.symbol.type ? l.symbol = t(l.symbol) : "esriTS" === l.symbol.type ? B(l.symbol) : l.symbol.outline && "esriCLS" === l.symbol.outline.type && (l.symbol.outline = t(l.symbol.outline)))
                }
            }
            c = {
                Web_Map_as_JSON: C.toJson(z.fixJson(f)),
                Format: c.format,
                Layout_Template: c.layout
            };
            b.extraParameters && (c = k.mixin(c, b.extraParameters));
            var n = new D(G._dfdCanceller);
            b = function (b, c) {
                a(b, c, e, g, n)
            };
            f = function (a) {
                d(a, g, n)
            };
            n._pendingDfd = this.async ? this.printGp.submitJob(c, b, null, f) : this.printGp.execute(c, b, f);
            return n
        },
        onComplete: function () {},
        _createMultipointLayer: function () {
            return {
                layerDefinition: {
                    name: "multipointLayer",
                    geometryType: "esriGeometryMultipoint",
                    drawingInfo: {
                        renderer: null
                    }
                },
                featureSet: {
                    geometryType: "esriGeometryMultipoint",
                    features: []
                }
            }
        },
        _createPolygonLayer: function () {
            return {
                layerDefinition: {
                    name: "polygonLayer",
                    geometryType: "esriGeometryPolygon",
                    drawingInfo: {
                        renderer: null
                    }
                },
                featureSet: {
                    geometryType: "esriGeometryPolygon",
                    features: []
                }
            }
        },
        _createPointLayer: function () {
            return {
                layerDefinition: {
                    name: "pointLayer",
                    geometryType: "esriGeometryPoint",
                    drawingInfo: {
                        renderer: null
                    }
                },
                featureSet: {
                    geometryType: "esriGeometryPoint",
                    features: []
                }
            }
        },
        _createPolylineLayer: function () {
            return {
                layerDefinition: {
                    name: "polylineLayer",
                    geometryType: "esriGeometryPolyline",
                    drawingInfo: {
                        renderer: null
                    }
                },
                featureSet: {
                    geometryType: "esriGeometryPolyline",
                    features: []
                }
            }
        },
        _convertSvgSymbol: function (b) {
            if (!(8 >= E("ie") || !b.path && "image/svg+xml" !== b.contentType)) {
                var e, g = A.createSurface(S.create("div"), 1024, 1024);
                e = "image/svg+xml" === b.contentType ? g.createObject(A.Image, {
                    src: "data:image/svg+xml;base64," + b.imageData,
                    width: n.pt2px(b.width),
                    height: n.pt2px(b.height),
                    x: 0,
                    y: 0
                }) : g.createObject(A.Path, b.path).setFill(b.color).setStroke(b.outline);
                "pendingRender" in g && g._render(!0);
                var a = g.rawNode.getContext("2d"),
                    d = Math.ceil(e.getBoundingBox().width),
                    c = Math.ceil(e.getBoundingBox().height);
                e = a.getImageData(e.getBoundingBox().x, e.getBoundingBox().y, d, c);
                a.canvas.width = d;
                a.canvas.height = c;
                a.putImageData(e, 0, 0);
                a = a.canvas.toDataURL("image/png");
                b = {
                    type: "esriPMS",
                    imageData: a.substr(22, a.length),
                    angle: b.angle,
                    contentType: "image/png",
                    height: b.size ? b.size : n.px2pt(c),
                    width: b.size ? d / c * b.size : n.px2pt(d),
                    xoffset: b.xoffset,
                    yoffset: b.yoffset
                };
                g.destroy();
                return b
            }
        },
        _convertSvgRenderer: function (b) {
            "simple" === b.type && b.symbol && (b.symbol.path || "image/svg+xml" === b.symbol.contentType) ? b.symbol = this._convertSvgSymbol(b.symbol) : "uniqueValue" === b.type ? (b.defaultSymbol && (b.defaultSymbol.path || "image/svg+xml" === b.defaultSymbol.contentType) && (b.defaultSymbol = this._convertSvgSymbol(b.defaultSymbol)), b.uniqueValueInfos && r.forEach(b.uniqueValueInfos, function (b) {
                if (b.symbol.path || "image/svg+xml" === b.symbol.contentType) b.symbol = this._convertSvgSymbol(b.symbol)
            }, this)) : "classBreaks" === b.type && (b.defaultSymbol && (b.defaultSymbol.path || "image/svg+xml" === b.defaultSymbol.contentType) && (b.defaultSymbol = this._convertSvgSymbol(b.defaultSymbol)), b.classBreakInfos && r.forEach(b.classBreakInfos, function (b) {
                if (b.symbol.path || "image/svg+xml" === b.symbol.contentType) b.symbol = this._convertSvgSymbol(b.symbol)
            }, this))
        },
        _createFeatureCollection: function (b, e, g, a) {
            var d = this._createPolygonLayer(),
                c = this._createPolylineLayer(),
                h = this._createPointLayer(),
                q = this._createMultipointLayer(),
                m = this._createPointLayer();
            m.layerDefinition.name = "textLayer";
            delete m.layerDefinition.drawingInfo;
            if ("esri.layers.FeatureLayer" === b.declaredClass || "esri.layers.StreamLayer" === b.declaredClass) d.layerDefinition.name = c.layerDefinition.name = h.layerDefinition.name = q.layerDefinition.name = k.getObject("arcgisProps.title", !1, b) || b.name || b.id;
            var n = b.renderer && "esri.renderer.SimpleRenderer" === b.renderer.declaredClass;
            if (!b.renderer || b.renderer.valueExpression || k.isFunction(b.renderer.attributeField)) delete d.layerDefinition.drawingInfo,
                delete c.layerDefinition.drawingInfo,
                delete h.layerDefinition.drawingInfo,
                delete q.layerDefinition.drawingInfo;
            else {
                var f = b.renderer.toJson({
                    useLegacyRotationProperties: !0
                });
                if ("temporal" === f.type) {
                    var f = {
                            latestObservationRenderer: f.latestObservationRenderer,
                            trackLinesRenderer: f.trackRenderer,
                            observationAger: f.observationAger,
                            renderer: f.observationRenderer
                        },
                        p = {};
                    b._trackIdField && (p.trackIdField = b._trackIdField);
                    b._startTimeField && (p.startTimeField = b._startTimeField);
                    b._endTimeField && (p.endTimeField = b._endTimeField);
                    d.layerDefinition.drawingInfo = f;
                    d.layerDefinition.timeInfo = p;
                    c.layerDefinition.drawingInfo = f;
                    c.layerDefinition.timeInfo = p;
                    h.layerDefinition.drawingInfo = f;
                    h.layerDefinition.timeInfo = p;
                    q.layerDefinition.drawingInfo = f;
                    q.layerDefinition.timeInfo = p
                } else d.layerDefinition.drawingInfo.renderer = f,
                    c.layerDefinition.drawingInfo.renderer = f,
                    h.layerDefinition.drawingInfo.renderer = f,
                    q.layerDefinition.drawingInfo.renderer = f
            }
            f = b.fields;
            f || !b.renderer || b.renderer.valueExpression || k.isFunction(b.renderer.attributeField) || ("esri.renderer.ClassBreaksRenderer" === b.renderer.declaredClass ? (f = [{
                name: b.renderer.attributeField,
                type: "esriFieldTypeDouble"
            }], b.renderer.normalizationField && f.push({
                name: b.renderer.normalizationField,
                type: "esriFieldTypeDouble"
            })) : "esri.renderer.UniqueValueRenderer" === b.renderer.declaredClass && (f = [{
                name: b.renderer.attributeField,
                type: "esriFieldTypeString"
            }], b.renderer.attributeField2 && f.push({
                name: b.renderer.attributeField2,
                type: "esriFieldTypeString"
            }), b.renderer.attributeField3 && f.push({
                name: b.renderer.attributeField3,
                type: "esriFieldTypeString"
            })));
            f && (d.layerDefinition.fields = f, c.layerDefinition.fields = f, h.layerDefinition.fields = f, q.layerDefinition.fields =
                f);
            f = b.graphics;
            b.isFeatureReductionActive && b.isFeatureReductionActive() && (f = b.getSingleGraphics());
            var p = f.length,
                l, t;
            for (t = 0; t < p; t++) {
                var u = f[t];
                if (!1 !== u.visible && u.geometry) {
                    l = u.toJson();
                    l.symbol && l.symbol.outline && l.symbol.outline.color && l.symbol.outline.color[3] && !this._is11xService && (l.symbol.outline.color[3] = 255);
                    if (b.renderer && !l.symbol && (k.isFunction(b.renderer.attributeField) || b.renderer.valueExpression || this._isFeatureCollectionRequired(b.renderer, b) || "esri.renderer.DotDensityRenderer" === b.renderer.declaredClass || g)) {
                        g = g || b.renderer;
                        var w = null;
                        try {
                            w = g.getSymbol(u)
                        } catch (B) {}
                        if (!w) continue;
                        l.symbol = w.toJson();
                        this._isFeatureCollectionRequired(g, b) && this._applyVisualVariables(l.symbol, {
                            renderer: g,
                            graphic: u,
                            symbol: w,
                            mapResolution: e && e.getResolutionInMeters(),
                            mapScale: e && e.getScale()
                        })
                    }
                    l.symbol && (l.symbol.path || "image/svg+xml" === l.symbol.contentType ? l.symbol = this._convertSvgSymbol(l.symbol) : l.symbol.text && delete l.attributes);
                    switch (u.geometry.type) {
                        case "polygon":
                            d.featureSet.features.push(l);
                            break;
                        case "polyline":
                            c.featureSet.features.push(l);
                            break;
                        case "point":
                            l.symbol && l.symbol.text ? m.featureSet.features.push(l) : h.featureSet.features.push(l);
                            break;
                        case "multipoint":
                            q.featureSet.features.push(l);
                            break;
                        case "extent":
                            l.geometry = L.fromExtent(u.geometry).toJson(),
                                d.featureSet.features.push(l)
                    }
                }
            }
            e = [];
            0 < d.featureSet.features.length && e.push(d);
            0 < c.featureSet.features.length && e.push(c);
            0 < q.featureSet.features.length && e.push(q);
            0 < h.featureSet.features.length && e.push(h);
            0 < m.featureSet.features.length && e.push(m);
            if (!e.length) return null;
            r.forEach(e, function (b) {
                var c = r.every(b.featureSet.features, function (a) {
                    return a.symbol
                });
                if (n || c) a && a.forceFeatureAttributes || r.forEach(b.featureSet.features, function (a) {
                    delete a.attributes
                }),
                    delete b.layerDefinition.fields;
                c && delete b.layerDefinition.drawingInfo
            });
            r.forEach(e, function (a) {
                a.layerDefinition.drawingInfo && a.layerDefinition.drawingInfo.renderer && this._convertSvgRenderer(a.layerDefinition.drawingInfo.renderer)
            }, this);
            return {
                id: b.id,
                opacity: b.opacity,
                minScale: b.minScale || 0,
                maxScale: b.maxScale || 0,
                featureCollection: {
                    layers: e
                }
            }
        },
        _getPrintDefinition: function (b, e) {
            var g = {
                    operationalLayers: this._createOperationalLayers(b, e)
                },
                a = this._vtlExtent || b.extent,
                d = b.spatialReference;
            this._vtlExtent = null;
            b.spatialReference._isWrappable() && (a = a._normalize(!0), d = a.spatialReference);
            a = {
                mapOptions: {
                    showAttribution: b.showAttribution,
                    extent: a.toJson(),
                    spatialReference: d.toJson()
                }
            };
            e.preserveScale && k.mixin(a.mapOptions, {
                scale: e.outScale || b.getScale()
            });
            b.timeExtent && k.mixin(a.mapOptions, {
                time: [b.timeExtent.startTime.getTime(), b.timeExtent.endTime.getTime()]
            });
            d = {};
            k.mixin(d, a, g);
            return d
        },
        _createOperationalLayers: function (b, e) {
            debugger
            var g, a, d, c, h = [],
                q = 0;
            e.preserveScale && (q = e.outScale || b.getScale());
            this.allLayerslegend = this.legendAll ? [] : null;
            this._vtlExtent = null;
            var m = r.map(b.layerIds, b.getLayer, b);
            b._mapImageLyr && m.push(b._mapImageLyr);
            for (g = 0; g < m.length; g++) if (a = m[g], a.loaded && a.visible && (!q || a.isVisibleAtScale(q))) switch (d = a.declaredClass, c = {
                id: a.id,
                title: k.getObject("arcgisProps.title", !1, a) || a.id,
                opacity: a.opacity,
                minScale: a.minScale || 0,
                maxScale: a.maxScale || 0
            }, c = k.mixin(c, this._getUrlAndToken(a)), a.getNode() && R.get(a.getNode(), "data-reference") && (c._isRefLayer = !0), d) {
                case "esri.layers.ArcGISDynamicMapServiceLayer":
                    var n = [];
                    d = !! a._params.layers;
                    if (a._params.dynamicLayers) d = C.fromJson(a._params.dynamicLayers),
                        r.forEach(d, function (a) {
                            n.push({
                                id: a.id,
                                name: a.name,
                                layerDefinition: a
                            });
                            delete a.id;
                            delete a.name;
                            delete a.maxScale;
                            delete a.minScale
                        }),
                    0 === n.length && (c.visibleLayers = [-1]);
                    else if (a.supportsDynamicLayers) {
                        if (d || a.layerDefinitions || a.layerTimeOptions) {
                            var f = a.createDynamicLayerInfosFromLayerInfos(),
                                p = null;
                            d && (p = a.visibleLayers);
                            var p = F._getVisibleLayers(f, p),
                                l = F._getLayersForScale(e.outScale || b.getScale(), f);
                            r.forEach(f, function (b) {
                                if (!b.subLayerIds) {
                                    var c = b.id; - 1 < r.indexOf(p, c) && -1 < r.indexOf(l, c) && (b = {
                                        source: b.source.toJson()
                                    }, a.layerDefinitions && a.layerDefinitions[c] && (b.definitionExpression = a.layerDefinitions[c]), a.layerTimeOptions && a.layerTimeOptions[c] && (b.layerTimeOptions =
                                        a.layerTimeOptions[c].toJson()), n.push({
                                        id: c,
                                        layerDefinition: b
                                    }))
                                }
                            });
                            0 === n.length && (c.visibleLayers = [-1])
                        }
                    } else r.forEach(a.layerInfos, function (b) {
                        var c = {
                            id: b.id,
                            layerDefinition: {}
                        };
                        a.layerDefinitions && a.layerDefinitions[b.id] && (c.layerDefinition.definitionExpression = a.layerDefinitions[b.id]);
                        a.layerTimeOptions && a.layerTimeOptions[b.id] && (c.layerDefinition.layerTimeOptions = a.layerTimeOptions[b.id].toJson());
                        (c.layerDefinition.definitionExpression || c.layerDefinition.layerTimeOptions) && n.push(c)
                    }),
                    d && (c.visibleLayers = a.visibleLayers.length ? a.visibleLayers : [-1]);
                    n.length && (c.layers = n);
                    h.push(c);
                    this.allLayerslegend && this.allLayerslegend.push({
                        id: a.id,
                        subLayerIds: a.visibleLayers
                    });
                    break;
                case "esri.layers.ArcGISImageServiceLayer":
                    c = k.mixin(c, {
                        url: a.url,
                        bandIds: a.bandIds,
                        compressionQuality: a.compressionQuality,
                        format: a.format,
                        interpolation: a.interpolation
                    });
                    a.mosaicRule && k.mixin(c, {
                        mosaicRule: a.mosaicRule.toJson()
                    });
                    (a.renderingRule || a.renderer) && (d = a.getExportImageRenderingRule()) && k.mixin(c, {
                        renderingRule: d.toJson()
                    });
                    h.push(c);
                    this.allLayerslegend && this.allLayerslegend.push({
                        id: a.id
                    });
                    break;
                case "esri.layers.WMSLayer":
                    c = k.mixin(c, {
                        url: a.url,
                        title: a.title,
                        type: "wms",
                        version: a.version,
                        transparentBackground: a.imageTransparency,
                        visibleLayers: a.visibleLayers
                    });
                    h.push(c);
                    this.allLayerslegend && this.allLayerslegend.push({
                        id: a.id,
                        subLayerIds: a.visibleLayers
                    });
                    break;
                case "esri.virtualearth.VETiledLayer":
                    d = a.mapStyle;
                    "roadOnDemand" === d ? d = "Road" : "aerialWithLabelsOnDemand" === d && (d = "Hybrid");
                    c = k.mixin(c, {
                        visibility: a.visible,
                        type: "BingMaps" + d,
                        culture: a.culture,
                        key: a.bingMapsKey
                    });
                    h.push(c);
                    break;
                case "esri.layers.OpenStreetMapLayer":
                    c = k.mixin(c, {
                        credits: a.copyright,
                        type: "OpenStreetMap",
                        url: K.getAbsoluteUrl(a.tileServers[0])
                    });
                    h.push(c);
                    break;
                case "esri.layers.WMTSLayer":
                    debugger
                    c = k.mixin(c, {
                        url: a.url,
                        type: "wmts",
                        layer: a._identifier,
                        style: a._style,
                        format: a.format,
                        tileMatrixSet: a._tileMatrixSetId
                    });
                    h.push(c);
                    break;
                case "esri.layers.MapImageLayer":
                    d = a.getImages();
                    r.forEach(d, function (b, d) {
                        b.visible && b.href && (c = {
                            id: a.id + "_image" + d,
                            type: "image",
                            title: a.id,
                            minScale: a.minScale || 0,
                            maxScale: a.maxScale || 0,
                            opacity: a.opacity * b.opacity,
                            extent: b.extent.toJson()
                        }, "data:image/png;base64," === b.href.substr(0, 22) ? c.imageData = b.href.substr(22) : c.url = b.href, h.push(c))
                    });
                    break;
                case "esri.layers.VectorTileLayer":
                    delete c.url;
                    if (this._is11xService && a.currentStyleInfo.serviceUrl && a.currentStyleInfo.styleUrl && (d = x.id && x.id.findCredential(a.currentStyleInfo.styleUrl), f = x.id && x.id.findCredential(a.currentStyleInfo.serviceUrl), !d && !f)) {
                        c.type = "VectorTileLayer";
                        c.styleUrl = a.currentStyleInfo.styleUrl;
                        h.push(c);
                        break
                    }
                    c.type = "image";
                    d = this._vtlExtent || b.extent.offset(0, 0);
                    var t = e.exportOptions && e.exportOptions.dpi || 96,
                        f = {
                            format: "png",
                            pixelRatio: t / 96
                        };
                    "MAP_ONLY" !== e.layout || !e.preserveScale || e.outScale && e.outScale !== b.getScale() || 96 !== t || !e.exportOptions || e.exportOptions.width % 2 === b.width % 2 && e.exportOptions.height % 2 === b.height % 2 || (f.area = {
                        x: 0,
                        y: 0,
                        width: b.width,
                        height: b.height
                    }, e.exportOptions.width % 2 !== b.width % 2 && --f.area.width, e.exportOptions.height % 2 !== b.height % 2 && --f.area.height, this._vtlExtent || (t = b.toMap({
                        x: f.area.width,
                        y: f.area.height
                    }), d.update(d.xmin, t.y, t.x, d.ymax, d.spatialReference), this._vtlExtent = d));
                    c.extent = d._normalize(!0).toJson();
                    d = a.takeScreenshot(f);
                    d.isResolved() ? d.then(function (a) {
                        "data:image/png;base64," === a.dataURL.substr(0, 22) && (c.imageData = a.dataURL.substr(22))
                    }) : console.error("PrintTask: VectorTileLayer.takeScreenshot() returned an unresolved Promise");
                    c.imageData && h.push(c);
                    break;
                case "esri.layers.WebTiledLayer":
                    debugger
                    d =
                        a.url.replace(/\$\{/g, "{");
                    c = k.mixin(c, {
                        type: "WebTiledLayer",
                        urlTemplate: d,
                        credits: a.copyright
                    });
                    a.subDomains && 0 < a.subDomains.length && (c.subDomains = a.subDomains);
                    a._wmtsInfo && (c.wmtsInfo = a._wmtsInfo);
                    delete c.url;
                    h.push(c);
                    break;
                default:
                    if (a.getTileUrl || a.getImageUrl) c = k.mixin(c, {
                        url: a.url
                    }),
                        h.push(c)
            }
            m = r.map(b.graphicsLayerIds, b.getLayer, b);
            for (g = 0; g < m.length; g++) a = m[g],
            a.isFeatureReductionActive && a.isFeatureReductionActive() && (a.getSingleGraphics().length ? m.splice(++g, 0, a.getFeatureReductionLayer()) : m[g] = a.getFeatureReductionLayer());
            for (g = 0; g < m.length; g++) if (a = m[g], a.loaded && a.visible && (!q || a.isVisibleAtScale(q))) switch (d = a.declaredClass, d) {
                case "esri.layers.CSVLayer":
                    if (this._is11xService) {
                        c = {
                            id: a.id,
                            url: a.url,
                            title: a.title,
                            opacity: a.opacity,
                            minScale: a.minScale || 0,
                            maxScale: a.maxScale || 0,
                            type: "CSV",
                            locationInfo: {
                                latitudeFieldName: a.latitudeFieldName,
                                longitudeFieldName: a.longitudeFieldName
                            },
                            layerDefinition: {
                                drawingInfo: {
                                    renderer: a.renderer && a.renderer.toJson({
                                        useLegacyRotationProperties: !0
                                    })
                                }
                            }
                        };
                        h.push(c);
                        break
                    }
                case "esri.layers.FeatureLayer":
                case "esri.layers.LabelLayer":
                case "esri.layers.StreamLayer":
                    if ("esri.layers.LabelLayer" === d && !e.showLabels || a.renderer && "esri.renderer.HeatmapRenderer" === a.renderer.declaredClass) continue;
                    d = null;
                    a.url && a.renderer && ("esri.renderer.ScaleDependentRenderer" === a.renderer.declaredClass ? "scale" === a.renderer.rangeType ? d = a.renderer.getRendererInfoByScale(b.getScale()) && a.renderer.getRendererInfoByScale(b.getScale()).renderer : "zoom" === a.renderer.rangeType && (d =
                        a.renderer.getRendererInfoByZoom(b.getZoom()) && a.renderer.getRendererInfoByZoom(b.getZoom()).renderer) : d = a.renderer);
                    f = d && "esri.layers.CSVLayer" !== a.declaredClass && !this._isFeatureCollectionRequired(d, a) && !d.valueExpression && "esri.renderer.DotDensityRenderer" !== d.declaredClass;
                    t = a.isFeatureReductionActive && a.isFeatureReductionActive();
                    if (d && !t && "esri.layers.StreamLayer" !== a.declaredClass && (this._is11xService || f) && ("esri.renderer.SimpleRenderer" === d.declaredClass || "esri.renderer.TemporalRenderer" === d.declaredClass || null == d.attributeField || k.isString(d.attributeField) && a._getField(d.attributeField, !0))) if (c = {
                            id: a.id,
                            title: k.getObject("arcgisProps.title", !1, a) || a.id,
                            opacity: a.opacity,
                            minScale: a.minScale || 0,
                            maxScale: a.maxScale || 0,
                            layerDefinition: {
                                drawingInfo: {
                                    renderer: d.toJson({
                                        useLegacyRotationProperties: !0
                                    })
                                }
                            }
                        }, c = k.mixin(c, this._getUrlAndToken(a)), "esri.renderer.TemporalRenderer" === d.declaredClass && (f = c.layerDefinition.drawingInfo, f.latestObservationRenderer = f.renderer.latestObservationRenderer, f.trackLinesRenderer = f.renderer.trackRenderer, f.observationAger = f.renderer.observationAger, f.renderer = f.renderer.observationRenderer, a._trackIdField && (c.layerDefinition.timeInfo = {
                            trackIdField: a._trackIdField
                        })), this._convertSvgRenderer(c.layerDefinition.drawingInfo.renderer), this._is11xService || 1 > a.opacity || "esri.renderer.TemporalRenderer" === d.declaredClass || this._updateLayerOpacity(c)) if (a._params.source && (d = a._params.source.toJson(), k.mixin(c.layerDefinition, {
                            source: d
                        })), a.getDefinitionExpression() && k.mixin(c.layerDefinition, {
                            definitionExpression: a.getDefinitionExpression()
                        }), 2 !== a.mode) 0 < a.getSelectedFeatures().length && (d = r.map(a.getSelectedFeatures(), function (b) {
                        return b.attributes[a.objectIdField]
                    }), 0 < d.length && a.getSelectionSymbol() && k.mixin(c, {
                        selectionObjectIds: d,
                        selectionSymbol: a.getSelectionSymbol().toJson()
                    }));
                    else {
                        d = r.map(a.getSelectedFeatures(), function (b) {
                            return b.attributes[a.objectIdField]
                        });
                        if (0 === d.length || !a._params.drawMode) break;
                        k.mixin(c.layerDefinition, {
                            objectIds: d
                        });
                        d = null;
                        a.getSelectionSymbol() && (d = new M(a.getSelectionSymbol()));
                        k.mixin(c.layerDefinition.drawingInfo, {
                            renderer: d && d.toJson()
                        })
                    } else c = this._createFeatureCollection(a, b, null, e);
                    else c = d && (d.valueExpression || this._isFeatureCollectionRequired(d, a) || "esri.renderer.DotDensityRenderer" === d.declaredClass) ? this._createFeatureCollection(a, b, d, e) : this._createFeatureCollection(a, b, null, e);
                    if (!c) continue;
                    h.push(c);
                    this.allLayerslegend && this.allLayerslegend.push({
                        id: a.id
                    });
                    break;
                case "esri.layers._GraphicsLayer":
                case "esri.layers.GraphicsLayer":
                case "esri.layers.WFSLayer":
                    c =
                        this._createFeatureCollection(a, b, null, e);
                    if (!c) continue;
                    h.push(c);
                    this.allLayerslegend && this.allLayerslegend.push({
                        id: a.id
                    });
                    break;
                case "esri.layers.ArcGISImageServiceVectorLayer":
                    c = {
                        id: a.id,
                        title: k.getObject("arcgisProps.title", !1, a) || a.id,
                        opacity: a.opacity,
                        minScale: a.minScale || 0,
                        maxScale: a.maxScale || 0,
                        visibility: a.visible,
                        symbolTileSize: a.symbolTileSize,
                        layerDefinition: {
                            drawingInfo: {
                                renderer: a.renderer.toJson({
                                    useLegacyRotationProperties: !0
                                })
                            }
                        }
                    },
                        c = k.mixin(c, this._getUrlAndToken(a)),
                    a.mosaicRule && k.mixin(c, {
                        mosaicRule: a.mosaicRule.toJson()
                    }),
                        h.push(c),
                    this.allLayerslegend && this.allLayerslegend.push({
                        id: a.id
                    })
            }
            q && r.forEach(h, function (a) {
                a.minScale = 0;
                a.maxScale = 0
            });
            b.graphics && 0 < b.graphics.graphics.length && (c = this._createFeatureCollection(b.graphics, b, null, e)) && h.push(c);
            b._labels && e.showLabels && (c = this._createFeatureCollection(b._labels, b, null, e)) && h.push(c);
            r.forEach(h, function (a, b, c) {
                a._isRefLayer && (delete a._isRefLayer, c.splice(b, 1), c.push(a))
            });
            return h
        },
        _getUrlAndToken: function (b) {
            return {
                token: b._getToken(),
                url: b._url ? b._url.path : null
            }
        },
        _updateLayerOpacity: function (b) {
            var e = this._colorEvaluator(b),
                e = r.filter(e, function (a) {
                    return k.isArray(a) && 4 === a.length
                }),
                g = !0;
            if (e.length) {
                var a = e[0][3],
                    d;
                for (d = 1; d < e.length; d++) if (a !== e[d][3]) {
                    g = !1;
                    break
                }
                if (g) for (b.opacity = a / 255, d = 0; d < e.length; d++) e[d][3] = 255
            }
            return g
        },
        _isFeatureCollectionRequired: function (b, e) {
            if (e && e.isFeatureReductionActive && e.isFeatureReductionActive()) return !0;
            var g = !1,
                a = this._getVariable(b, "rotationInfo", !1);
            a && (g = (g = a.field) && k.isFunction(g) || a.valueExpression);
            return b.hasVisualVariables("sizeInfo") || b.hasVisualVariables("colorInfo") || b.hasVisualVariables("opacityInfo") || g
        },
        _getVariable: function (b, e, g) {
            var a;
            b && (a = (b = b.getVisualVariablesForType(e, g)) && b[0]);
            return a
        },
        _applyVisualVariables: function (b, e) {
            var g = e.renderer,
                a = e.graphic,
                d = e.symbol,
                c = e.mapResolution,
                h = e.mapScale,
                k = d.type;
            if ("textsymbol" !== k && "shieldlabelsymbol" !== k) {
                var m = this._getVariable(g, "sizeInfo", !1),
                    r = this._getVariable(g, "colorInfo", !1),
                    f = this._getVariable(g, "opacityInfo", !1),
                    p = this._getVariable(g, "rotationInfo", !1);
                d instanceof N && (m = this._getVariable(g, "sizeInfo", "outline") || m);
                c = m ? g.getSize(a, {
                    sizeInfo: m,
                    shape: "simplemarkersymbol" === k ? d.style : null,
                    resolution: c,
                    scale: h
                }) : a.size;
                null != c && ("simplemarkersymbol" === k ? b.size = n.px2pt(c) : "picturemarkersymbol" === k ? (h = d.width / d.height * c, b.width = n.px2pt(h), b.height = n.px2pt(c), 0 !== d.xoffset && (b.xoffset = n.px2pt(d.xoffset / d.width * h)), 0 !== d.yoffset && (b.yoffset = n.px2pt(d.yoffset / d.height * c))) : "simplelinesymbol" === k ? b.width = n.px2pt(c) : b.outline && (b.outline.width = n.px2pt(c)));
                r && (!(d = g.getColor(a, {
                    colorInfo: r
                })) || "simplemarkersymbol" !== k && "simplelinesymbol" !== k && "simplefillsymbol" !== k || (b.color = I.toJsonColor(d)));
                f && (k = g.getOpacity(a, {
                    opacityInfo: f
                }), null != k && b.color && (b.color[3] = Math.round(255 * k)));
                p && (g = g.getRotationAngle(a, {
                    rotationInfo: p
                })) && (b.angle = -g)
            }
        }
    });
    E("extend-esri") && k.setObject("tasks.PrintTask", y, x);
    return y
});