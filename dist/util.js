exports.tryParseInt=function(r,t,e){if(void 0===t&&(t=0),void 0===e&&(e=10),"number"==typeof r)return isNaN(r)?t:r;var n;try{n=parseInt(r,e),isNaN(n)&&(n=t)}catch(r){n=t}return n};
//# sourceMappingURL=util.js.map
