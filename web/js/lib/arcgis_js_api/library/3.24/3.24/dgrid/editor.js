//>>built
define("dgrid/editor","dojo/_base/kernel dojo/_base/lang dojo/_base/array dojo/_base/Deferred dojo/on dojo/aspect dojo/has dojo/query dojo/when ./Grid put-selector/put dojo/_base/sniff".split(" "),function(C,r,D,v,l,m,q,E,F,w,p){function t(a,b){a.value=b;if("radio"==a.type||"checkbox"==a.type)a.checked=a.defaultChecked=!!b}function x(a,b){if("number"==typeof b)a=isNaN(a)?a:parseFloat(a);else if("boolean"==typeof b)a="true"==a?!0:"false"==a?!1:a;else if(b instanceof Date){var d=new Date(a);a=isNaN(d.getTime())?
a:d}return a}function G(a,b){return"function"==typeof b.get?x(b.get("value")):x(b["checkbox"==b.type||"radio"==b.type?"checked":"value"])}function H(a,b,d,c,e){var g,f,k;if((d&&d.valueOf())!=(c&&c.valueOf())&&(g=b.element,f=b.row,k=b.column,k.field&&f))if(b={grid:a,cell:b,rowId:f.id,oldValue:d,value:c,bubbles:!0,cancelable:!0},e&&e.type&&(b.parentType=e.type),l.emit(g,"dgrid-datachange",b))a.updateDirty?(a.updateDirty(f.id,k.field,c),k.autoSave&&setTimeout(function(){a._trackError("save")},0)):f.data[k.field]=
c;else{var h;(h=g.widget)?(h._dgridIgnoreChange=!0,h.set("value",d),setTimeout(function(){h._dgridIgnoreChange=!1},0)):(h=g.input)&&t(h,d);return d}return c}function u(a,b,d){var c=a.cell(b.domNode||b),e=c.column,g,f;f=a._activeCell;if(!b.isValid||b.isValid())if(d=H(a,c,f?a._activeValue:b._dgridLastValue,G(e,b),d),f?a._activeValue=d:b._dgridLastValue=d,"radio"===b.type&&b.name&&!e.editOn&&e.field)for(g in f=a.row(b),E("input[type\x3dradio][name\x3d"+b.name+"]",a.contentNode).forEach(function(c){var h=
a.row(c);c!==b&&c._dgridLastValue&&(c._dgridLastValue=!1,a.updateDirty?a.updateDirty(h.id,e.field,!1):h.data[e.field]=!1)}),a.dirty)f.id!==g&&a.dirty[g][e.field]&&a.updateDirty(g,e.field,!1)}function y(a){var b=a.editor,d=a.editOn,c=a.grid,e="string"!=typeof b,g,f,k;g=a.editorArgs||{};"function"==typeof g&&(g=g.call(c,a));if(e)f=new b(g),a=f.focusNode||f.domNode,a.className+=" dgrid-input",f.connect(f,d?"onBlur":"onChange",function(){f._dgridIgnoreChange||u(c,this,{type:"widget"})});else if(k=function(a){var h=
a.target;"_dgridLastValue"in h&&-1<h.className.indexOf("dgrid-input")&&u(c,h,a)},a.grid._hasInputListener||(c._hasInputListener=!0,c.on("change",function(a){k(a)})),f=a=p(("textarea"==b?"textarea":"input[type\x3d"+b+"]")+".dgrid-input",r.mixin({name:a.field,tabIndex:isNaN(a.tabIndex)?-1:a.tabIndex},g)),9>q("ie")||q("ie")&&q("quirks"))"radio"==b||"checkbox"==b?l(f,"click",function(a){k(a)}):l(f,"change",function(a){k(a)});return f}function I(a,b){function d(){var a=e._activeCell;k.blur();"function"===
typeof e.focus&&setTimeout(function(){e.focus(a)},g&&9>q("ie")?15:0)}var c=y(a),e=a.grid,g=c.domNode,f=c.domNode||c,k=c.focusNode||f,h=g?function(){c.set("value",c._dgridLastValue)}:function(){t(c,c._dgridLastValue);u(a.grid,c)};l(k,"keydown",function(b){b=b.keyCode||b.which;27==b?(h(),e._activeValue=c._dgridLastValue,d()):13==b&&!1!==a.dismissOnEnter&&d()});(a._editorBlurHandle=l.pausable(c,"blur",function(){var b=f.parentNode,h=b.children.length-1,d={alreadyHooked:!0},k=e.cell(f);l.emit(k.element,
"dgrid-editor-hide",{grid:e,cell:k,column:a,editor:c,bubbles:!0,cancelable:!1});a._editorBlurHandle.pause();b.removeChild(f);if(k.row){for(p(k.element,"!dgrid-cell-editing");h--;)p(b.firstChild,"!");w.appendIfNode(b,a.renderCell(a.grid.row(b).data,e._activeValue,b,e._activeOptions?r.delegate(d,e._activeOptions):d))}e._focusedEditorCell=e._activeCell=e._activeValue=e._activeOptions=null})).pause();return c}function z(a,b,d,c){var e=a.domNode;e||t(a,c);d.innerHTML="";p(d,".dgrid-cell-editing");p(d,
a.domNode||a);e&&!b.editOn?b.grid._editorsPendingStartup.push([a,b,d,c]):A(a,b,d,c)}function A(a,b,d,c){var e=b.grid;a.domNode&&(a._started||a.startup(),a._dgridIgnoreChange=!0,a.set("value",c),setTimeout(function(){a._dgridIgnoreChange=!1},0));a._dgridLastValue=c;e._activeCell&&(e._activeValue=c,l.emit(d,"dgrid-editor-show",{grid:e,cell:e.cell(d),column:b,editor:a,bubbles:!0,cancelable:!1}))}function B(a){for(var b=a._editorsPendingStartup,d=b.length;d--;)A.apply(null,b[d]);a._editorsPendingStartup=
[]}function J(a){function b(a){c.grid._activeCell=e;z(c.editorInstance,c,e,k);c._editTimer=setTimeout(function(){h.focus&&h.focus();c._editorBlurHandle&&c._editorBlurHandle.resume();c._editTimer=null;a.resolve(h)},0)}var d,c,e,g,f,k,h,n;a.column||(a=this.cell(a));if(!a||!a.element)return null;c=a.column;f=c.field;e=a.element.contents||a.element;if(h=c.editorInstance){if(c.grid._activeCell!=e&&(d=a.row,k=(g=this.dirty&&this.dirty[d.id])&&f in g?g[f]:c.get?c.get(d.data):d.data[f],!c.canEdit||c.canEdit(a.row.data,
k)))return n=new v,a=h.domNode||h,a.offsetWidth?(a.blur(),setTimeout(function(){b(n)},0)):b(n),n.promise}else if(c.editor&&(h=e.widget||e.input))return n=new v,h.focus&&h.focus(),n.resolve(h),n.promise;return null}r.getObject("dgrid.editor",!0);return dgrid.editor=function(a,b,d){function c(a){var b=a.grid,c,d;b.edit||(b.edit=J,b._editorsPendingStartup=[],g.push(l(b.domNode,".dgrid-input:focusin",function(){b._focusedEditorCell=b.cell(this)})),c=b._editorFocusoutHandle=l.pausable(b.domNode,".dgrid-input:focusout",
function(){b._focusedEditorCell=null}),g.push(c),g.push(m.before(b,"removeRow",function(a){var e=b._focusedEditorCell;a=b.row(a);e&&e.row.id===a.id&&(d=e,c.pause(),setTimeout(function(){c.resume();d=null},0))})),g.push(m.after(b,"insertRow",function(a){var c=b.row(a);d&&d.row.id===c.id&&b.edit(b.cell(c,d.column.id));return a})),g.push(m.after(b,"renderArray",function(a){F(a,function(a){a.length?B(b):b._editorsPendingStartup=[]});return a})),g.push(m.after(b,"_onNotification",function(){B(b)})))}var e=
a.renderCell||w.defaultRenderCell,g=[],f;a||(a={});a.editor=b=b||a.editor||"text";a.editOn=d=d||a.editOn;f="string"!=typeof b;a.widgetArgs&&(C.deprecated("column.widgetArgs","use column.editorArgs instead","dgrid 0.4"),a.editorArgs=a.widgetArgs);m.after(a,"init",d?function(){c(a);a.editorInstance=I(a,e)}:function(){var b=a.grid;c(a);f&&g.push(m.before(b,"removeRow",function(c){if(c=(c=b.cell(c,a.id).element)&&(c.contents||c).widget)b._editorFocusoutHandle.pause(),c.destroyRecursive()}))});m.after(a,
"destroy",function(){D.forEach(g,function(a){a.remove()});a._editorBlurHandle&&a._editorBlurHandle.remove();a._editTimer&&clearTimeout(a._editTimer);d&&f&&a.editorInstance.destroyRecursive();a.grid.edit=null;a.grid._editorsPendingStartup=null});a.renderCell=d?function(b,c,f,g){var h=a.grid;g&&g.alreadyHooked||l("TD"==f.tagName?f:f.parentNode,d,function(){h._activeOptions=g;h.edit(this)});return e.call(a,b,c,f,g)}:function(b,c,d,g){if(!a.canEdit||a.canEdit(b,c))b=y(a),z(b,a,d,c),d[f?"widget":"input"]=
b;else return e.call(a,b,c,d,g)};return a}});