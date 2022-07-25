exports.tryParseInt=function(r,t){if(void 0===t&&(t=0),"number"==typeof r)return isNaN(r)?t:r;var e;try{e=parseInt(r),isNaN(e)&&(e=t)}catch(r){e=t}return e};
//# sourceMappingURL=util.js.map
