(()=>{var t={954:t=>{function e(t,e,r,n,o,i,a){try{var u=t[i](a),c=u.value}catch(t){return void r(t)}u.done?e(c):Promise.resolve(c).then(n,o)}t.exports=function(t){return function(){var r=this,n=arguments;return new Promise((function(o,i){var a=t.apply(r,n);function u(t){e(a,o,i,u,c,"next",t)}function c(t){e(a,o,i,u,c,"throw",t)}u(void 0)}))}},t.exports.default=t.exports,t.exports.__esModule=!0},162:(t,e,r)=>{t.exports=r(47)},47:t=>{var e=function(t){"use strict";var e,r=Object.prototype,n=r.hasOwnProperty,o="function"==typeof Symbol?Symbol:{},i=o.iterator||"@@iterator",a=o.asyncIterator||"@@asyncIterator",u=o.toStringTag||"@@toStringTag";function c(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{c({},"")}catch(t){c=function(t,e,r){return t[e]=r}}function s(t,e,r,n){var o=e&&e.prototype instanceof v?e:v,i=Object.create(o.prototype),a=new N(n||[]);return i._invoke=function(t,e,r){var n=f;return function(o,i){if(n===p)throw new Error("Generator is already running");if(n===d){if("throw"===o)throw i;return k()}for(r.method=o,r.arg=i;;){var a=r.delegate;if(a){var u=j(a,r);if(u){if(u===y)continue;return u}}if("next"===r.method)r.sent=r._sent=r.arg;else if("throw"===r.method){if(n===f)throw n=d,r.arg;r.dispatchException(r.arg)}else"return"===r.method&&r.abrupt("return",r.arg);n=p;var c=l(t,e,r);if("normal"===c.type){if(n=r.done?d:h,c.arg===y)continue;return{value:c.arg,done:r.done}}"throw"===c.type&&(n=d,r.method="throw",r.arg=c.arg)}}}(t,r,a),i}function l(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(t){return{type:"throw",arg:t}}}t.wrap=s;var f="suspendedStart",h="suspendedYield",p="executing",d="completed",y={};function v(){}function g(){}function m(){}var w={};c(w,i,(function(){return this}));var b=Object.getPrototypeOf,x=b&&b(b(P([])));x&&x!==r&&n.call(x,i)&&(w=x);var L=m.prototype=v.prototype=Object.create(w);function _(t){["next","throw","return"].forEach((function(e){c(t,e,(function(t){return this._invoke(e,t)}))}))}function O(t,e){function r(o,i,a,u){var c=l(t[o],t,i);if("throw"!==c.type){var s=c.arg,f=s.value;return f&&"object"==typeof f&&n.call(f,"__await")?e.resolve(f.__await).then((function(t){r("next",t,a,u)}),(function(t){r("throw",t,a,u)})):e.resolve(f).then((function(t){s.value=t,a(s)}),(function(t){return r("throw",t,a,u)}))}u(c.arg)}var o;this._invoke=function(t,n){function i(){return new e((function(e,o){r(t,n,e,o)}))}return o=o?o.then(i,i):i()}}function j(t,r){var n=t.iterator[r.method];if(n===e){if(r.delegate=null,"throw"===r.method){if(t.iterator.return&&(r.method="return",r.arg=e,j(t,r),"throw"===r.method))return y;r.method="throw",r.arg=new TypeError("The iterator does not provide a 'throw' method")}return y}var o=l(n,t.iterator,r.arg);if("throw"===o.type)return r.method="throw",r.arg=o.arg,r.delegate=null,y;var i=o.arg;return i?i.done?(r[t.resultName]=i.value,r.next=t.nextLoc,"return"!==r.method&&(r.method="next",r.arg=e),r.delegate=null,y):i:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,y)}function E(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function S(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function N(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(E,this),this.reset(!0)}function P(t){if(t){var r=t[i];if(r)return r.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var o=-1,a=function r(){for(;++o<t.length;)if(n.call(t,o))return r.value=t[o],r.done=!1,r;return r.value=e,r.done=!0,r};return a.next=a}}return{next:k}}function k(){return{value:e,done:!0}}return g.prototype=m,c(L,"constructor",m),c(m,"constructor",g),g.displayName=c(m,u,"GeneratorFunction"),t.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===g||"GeneratorFunction"===(e.displayName||e.name))},t.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,m):(t.__proto__=m,c(t,u,"GeneratorFunction")),t.prototype=Object.create(L),t},t.awrap=function(t){return{__await:t}},_(O.prototype),c(O.prototype,a,(function(){return this})),t.AsyncIterator=O,t.async=function(e,r,n,o,i){void 0===i&&(i=Promise);var a=new O(s(e,r,n,o),i);return t.isGeneratorFunction(r)?a:a.next().then((function(t){return t.done?t.value:a.next()}))},_(L),c(L,u,"Generator"),c(L,i,(function(){return this})),c(L,"toString",(function(){return"[object Generator]"})),t.keys=function(t){var e=[];for(var r in t)e.push(r);return e.reverse(),function r(){for(;e.length;){var n=e.pop();if(n in t)return r.value=n,r.done=!1,r}return r.done=!0,r}},t.values=P,N.prototype={constructor:N,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=e,this.done=!1,this.delegate=null,this.method="next",this.arg=e,this.tryEntries.forEach(S),!t)for(var r in this)"t"===r.charAt(0)&&n.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=e)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var r=this;function o(n,o){return u.type="throw",u.arg=t,r.next=n,o&&(r.method="next",r.arg=e),!!o}for(var i=this.tryEntries.length-1;i>=0;--i){var a=this.tryEntries[i],u=a.completion;if("root"===a.tryLoc)return o("end");if(a.tryLoc<=this.prev){var c=n.call(a,"catchLoc"),s=n.call(a,"finallyLoc");if(c&&s){if(this.prev<a.catchLoc)return o(a.catchLoc,!0);if(this.prev<a.finallyLoc)return o(a.finallyLoc)}else if(c){if(this.prev<a.catchLoc)return o(a.catchLoc,!0)}else{if(!s)throw new Error("try statement without catch or finally");if(this.prev<a.finallyLoc)return o(a.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var o=this.tryEntries[r];if(o.tryLoc<=this.prev&&n.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var i=o;break}}i&&("break"===t||"continue"===t)&&i.tryLoc<=e&&e<=i.finallyLoc&&(i=null);var a=i?i.completion:{};return a.type=t,a.arg=e,i?(this.method="next",this.next=i.finallyLoc,y):this.complete(a)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),y},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),S(r),y}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var o=n.arg;S(r)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(t,r,n){return this.delegate={iterator:P(t),resultName:r,nextLoc:n},"next"===this.method&&(this.arg=e),y}},t}(t.exports);try{regeneratorRuntime=e}catch(t){"object"==typeof globalThis?globalThis.regeneratorRuntime=e:Function("r","regeneratorRuntime = r")(e)}}},e={};function r(n){var o=e[n];if(void 0!==o)return o.exports;var i=e[n]={exports:{}};return t[n](i,i.exports,r),i.exports}r.n=t=>{var e=t&&t.__esModule?()=>t.default:()=>t;return r.d(e,{a:e}),e},r.d=(t,e)=>{for(var n in e)r.o(e,n)&&!r.o(t,n)&&Object.defineProperty(t,n,{enumerable:!0,get:e[n]})},r.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),r.r=t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})};var n={};(()=>{"use strict";r.r(n),r.d(n,{handler:()=>I});var t=r(954),e=r.n(t),o=r(162),i=r.n(o);const a=t=>(...e)=>0===e.length?t():e.reduce(((t,e)=>t(e)),t),u=a((t=>e=>t===e)),c=a((t=>e=>t!==e)),s=(a((t=>e=>u(_(t))(_(e)))),a((t=>e=>c(_(t))(_(e)))),u(!0),u(!1),a((t=>e=>e>t)),a((t=>e=>e<t)),a((t=>e=>e>=t)),a((t=>e=>e<=t)),a((t=>e=>r=>t>e?t>r&&e<r:t<r&&e>r)),a((t=>e=>r=>t>e?t>=r&&e<=r:t<=r&&e>=r)),a((t=>e=>u(w(e))(t)))),l=a((t=>e=>c(w(e))(t))),f=s("string"),h=(l("string"),s("boolean"),l("boolean"),u(null)),p=(c(null),s("undefined")),d=(l("undefined"),s("number"),l("number"),s("object")),y=(l("object"),Array.isArray),v=s("function"),g=(l("function"),a((t=>e=>u(b(e))(t)))),m=(a((t=>e=>!g(t)(e))),u(0),c(0),a((t=>e=>r=>t(r)?e(r):r)),a((t=>e=>r=>t(r)?r:e(r))),a((t=>e=>r=>n=>t(n)?e(n):r(n))),a((t=>e=>e&&e.map?e.map(t):t(e)))),w=(a((t=>e=>e.flatMap(t))),a((t=>e=>r=>e.map(t).ap(r))),a((t=>e=>r=>n=>e.map(t).ap(r).ap(n))),a((t=>e=>f(e)||y(e)?e.concat(t):d(e)?{...e,...t}:void 0)),a((t=>e=>e.includes(t))),a((t=>e=>L(e.indexOf(t)))),a((t=>e=>L(e.lastIndexOf(t)))),a((t=>e=>r=>r in t?t[r]:x((e=>t[r]=e))(e(r)))),t=>typeof t),b=t=>t.length,x=a((t=>e=>(t(e),e))),L=(x(console.log),x((t=>console.log(_(t)))),t=>u(-1)(t)?void 0:t),_=t=>{return p(t)?"undefined":h(t)?"null":v(t)?(e=t).name?e.name:String(e):y(t)?(t=>`[${P(", ")(m(_)(t))}]`)(t):d(t)?(t=>v(t.inspect)?t.inspect():`{${P(", ")(m(P(": "))(m((e=>[e,_(t[e])]))(k(t))))}}`)(t):f(t)?(t=>`'${t}'`)(t):String(t);var e},O=(a((t=>e=>t.test(e))),a((t=>e=>r=>r.substr(e,t))),a((t=>e=>e.startsWith(t)))),j=(a((t=>e=>e.endsWith(t))),a((t=>e=>e.repeat(t))),a((t=>e=>r=>r.replace(e,t)))),E=(a((t=>e=>L(e.search(t)))),a((t=>e=>e.split(t)))),S=t=>t.toUpperCase(),N=a((t=>e=>r=>r.reduce(e,t))),P=(a((t=>e=>r=>r.reduceRight(e,t))),a((t=>e=>e.filter(t))),a((t=>e=>r=>N([])(((r,n)=>t(n)?r.push(e(n))&&r:r))(r))),a((t=>e=>e.find(t))),a((t=>e=>L(e.findIndex(t)))),a((t=>e=>e.join(t)))),k=Object.keys,F=(Object.entries,a((t=>e=>e.every(t))),a((t=>e=>r=>r.slice(e,t))),a((t=>e=>e.some(t))),a((t=>e=>[...e].sort(t)))),T=(F(((t,e)=>(t=>e=>t<e?-1:t>e?1:0)(S(t))(S(e)))),F(((t,e)=>(t=>e=>t<e?1:t>e?-1:0)(S(t))(S(e)))),F(((t,e)=>t-e)),F(((t,e)=>e-t)),t=>t[b(t)-1]);a((t=>e=>N({})(((e,r)=>(e[t(r)]=e[t(r)]||[]).push(r)&&e))(e))),a((t=>e=>r=>r.isFailure()?t(r.value):e(r.value))),a((t=>e=>r=>r.isNothing()?t():e(r.value)));var G=function(t){return console.log("hello world",t)||{statusCode:404,body:"Not Found"}},M=function(t){return function(e){return O("/did/authentication")(t)&&G(T(E("/")(t)))||O("/did/push-authentication")(t)&&G(e&&JSON.parse(e))||O("/did/callback")(t)&&G(e&&JSON.parse(e))||O("/did/status")(t)&&G(T(E("/")(t)))||{statusCode:404,body:"Not Found"}}},I=function(){var t=e()(i().mark((function t(e,r){return i().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.abrupt("return",M(j("")("/.netlify/functions")(e.path))(e.body));case 1:case"end":return t.stop()}}),t)})));return function(e,r){return t.apply(this,arguments)}}()})();var o=exports;for(var i in n)o[i]=n[i];n.__esModule&&Object.defineProperty(o,"__esModule",{value:!0})})();