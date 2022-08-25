import e from"dayjs";import{cloneDeep as t}from"lodash";import{v4 as i}from"uuid";import n from"fs";import a from"path";import s from"dayjs/plugin/customParseFormat";function r(){return r=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var i=arguments[t];for(var n in i)Object.prototype.hasOwnProperty.call(i,n)&&(e[n]=i[n])}return e},r.apply(this,arguments)}function o(e,t){e.prototype=Object.create(t.prototype),e.prototype.constructor=e,l(e,t)}function l(e,t){return l=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(e,t){return e.__proto__=t,e},l(e,t)}function m(e,t){(null==t||t>e.length)&&(t=e.length);for(var i=0,n=new Array(t);i<t;i++)n[i]=e[i];return n}function u(e,t){var i="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(i)return(i=i.call(e)).next.bind(i);if(Array.isArray(e)||(i=function(e,t){if(e){if("string"==typeof e)return m(e,t);var i=Object.prototype.toString.call(e).slice(8,-1);return"Object"===i&&e.constructor&&(i=e.constructor.name),"Map"===i||"Set"===i?Array.from(e):"Arguments"===i||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(i)?m(e,t):void 0}}(e))||t&&e&&"number"==typeof e.length){i&&(e=i);var n=0;return function(){return n>=e.length?{done:!0}:{done:!1,value:e[n++]}}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var c,d="object"==typeof Reflect?Reflect:null,h=d&&"function"==typeof d.apply?d.apply:function(e,t,i){return Function.prototype.apply.call(e,t,i)};c=d&&"function"==typeof d.ownKeys?d.ownKeys:Object.getOwnPropertySymbols?function(e){return Object.getOwnPropertyNames(e).concat(Object.getOwnPropertySymbols(e))}:function(e){return Object.getOwnPropertyNames(e)};var f=Number.isNaN||function(e){return e!=e};function g(){g.init.call(this)}var p=g;g.EventEmitter=g,g.prototype._events=void 0,g.prototype._eventsCount=0,g.prototype._maxListeners=void 0;var v=10;function k(e){if("function"!=typeof e)throw new TypeError('The "listener" argument must be of type Function. Received type '+typeof e)}function y(e){return void 0===e._maxListeners?g.defaultMaxListeners:e._maxListeners}function T(e,t,i,n){var a,s,r;if(k(i),void 0===(s=e._events)?(s=e._events=Object.create(null),e._eventsCount=0):(void 0!==s.newListener&&(e.emit("newListener",t,i.listener?i.listener:i),s=e._events),r=s[t]),void 0===r)r=s[t]=i,++e._eventsCount;else if("function"==typeof r?r=s[t]=n?[i,r]:[r,i]:n?r.unshift(i):r.push(i),(a=y(e))>0&&r.length>a&&!r.warned){r.warned=!0;var o=new Error("Possible EventEmitter memory leak detected. "+r.length+" "+String(t)+" listeners added. Use emitter.setMaxListeners() to increase limit");o.name="MaxListenersExceededWarning",o.emitter=e,o.type=t,o.count=r.length,console&&console.warn&&console.warn(o)}return e}function _(){if(!this.fired)return this.target.removeListener(this.type,this.wrapFn),this.fired=!0,0===arguments.length?this.listener.call(this.target):this.listener.apply(this.target,arguments)}function I(e,t,i){var n={fired:!1,wrapFn:void 0,target:e,type:t,listener:i},a=_.bind(n);return a.listener=i,n.wrapFn=a,a}function b(e,t,i){var n=e._events;if(void 0===n)return[];var a=n[t];return void 0===a?[]:"function"==typeof a?i?[a.listener||a]:[a]:i?function(e){for(var t=new Array(e.length),i=0;i<t.length;++i)t[i]=e[i].listener||e[i];return t}(a):A(a,a.length)}function L(e){var t=this._events;if(void 0!==t){var i=t[e];if("function"==typeof i)return 1;if(void 0!==i)return i.length}return 0}function A(e,t){for(var i=new Array(t),n=0;n<t;++n)i[n]=e[n];return i}function N(e,t,i,n){if("function"==typeof e.on)n.once?e.once(t,i):e.on(t,i);else{if("function"!=typeof e.addEventListener)throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type '+typeof e);e.addEventListener(t,function a(s){n.once&&e.removeEventListener(t,a),i(s)})}}function H(e,t,i,n){if(void 0===t&&(t=0),void 0===i&&(i=10),void 0===n&&(n=!1),"number"==typeof e)return isNaN(e)?t:e;var a;try{a=n?parseFloat(e):parseInt(e,i),isNaN(a)&&(a=t)}catch(e){a=t}return a}Object.defineProperty(g,"defaultMaxListeners",{enumerable:!0,get:function(){return v},set:function(e){if("number"!=typeof e||e<0||f(e))throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received '+e+".");v=e}}),g.init=function(){void 0!==this._events&&this._events!==Object.getPrototypeOf(this)._events||(this._events=Object.create(null),this._eventsCount=0),this._maxListeners=this._maxListeners||void 0},g.prototype.setMaxListeners=function(e){if("number"!=typeof e||e<0||f(e))throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received '+e+".");return this._maxListeners=e,this},g.prototype.getMaxListeners=function(){return y(this)},g.prototype.emit=function(e){for(var t=[],i=1;i<arguments.length;i++)t.push(arguments[i]);var n="error"===e,a=this._events;if(void 0!==a)n=n&&void 0===a.error;else if(!n)return!1;if(n){var s;if(t.length>0&&(s=t[0]),s instanceof Error)throw s;var r=new Error("Unhandled error."+(s?" ("+s.message+")":""));throw r.context=s,r}var o=a[e];if(void 0===o)return!1;if("function"==typeof o)h(o,this,t);else{var l=o.length,m=A(o,l);for(i=0;i<l;++i)h(m[i],this,t)}return!0},g.prototype.on=g.prototype.addListener=function(e,t){return T(this,e,t,!1)},g.prototype.prependListener=function(e,t){return T(this,e,t,!0)},g.prototype.once=function(e,t){return k(t),this.on(e,I(this,e,t)),this},g.prototype.prependOnceListener=function(e,t){return k(t),this.prependListener(e,I(this,e,t)),this},g.prototype.off=g.prototype.removeListener=function(e,t){var i,n,a,s,r;if(k(t),void 0===(n=this._events))return this;if(void 0===(i=n[e]))return this;if(i===t||i.listener===t)0==--this._eventsCount?this._events=Object.create(null):(delete n[e],n.removeListener&&this.emit("removeListener",e,i.listener||t));else if("function"!=typeof i){for(a=-1,s=i.length-1;s>=0;s--)if(i[s]===t||i[s].listener===t){r=i[s].listener,a=s;break}if(a<0)return this;0===a?i.shift():function(e,t){for(;t+1<e.length;t++)e[t]=e[t+1];e.pop()}(i,a),1===i.length&&(n[e]=i[0]),void 0!==n.removeListener&&this.emit("removeListener",e,r||t)}return this},g.prototype.removeAllListeners=function(e){var t,i,n;if(void 0===(i=this._events))return this;if(void 0===i.removeListener)return 0===arguments.length?(this._events=Object.create(null),this._eventsCount=0):void 0!==i[e]&&(0==--this._eventsCount?this._events=Object.create(null):delete i[e]),this;if(0===arguments.length){var a,s=Object.keys(i);for(n=0;n<s.length;++n)"removeListener"!==(a=s[n])&&this.removeAllListeners(a);return this.removeAllListeners("removeListener"),this._events=Object.create(null),this._eventsCount=0,this}if("function"==typeof(t=i[e]))this.removeListener(e,t);else if(void 0!==t)for(n=t.length-1;n>=0;n--)this.removeListener(e,t[n]);return this},g.prototype.listeners=function(e){return b(this,e,!0)},g.prototype.rawListeners=function(e){return b(this,e,!1)},g.listenerCount=function(e,t){return"function"==typeof e.listenerCount?e.listenerCount(t):L.call(e,t)},g.prototype.listenerCount=L,g.prototype.eventNames=function(){return this._eventsCount>0?c(this._events):[]},p.once=function(e,t){return new Promise(function(i,n){function a(i){e.removeListener(t,s),n(i)}function s(){"function"==typeof e.removeListener&&e.removeListener("error",a),i([].slice.call(arguments))}N(e,t,s,{once:!0}),"error"!==t&&function(e,t,i){"function"==typeof e.on&&N(e,"error",t,{once:!0})}(e,a)})};var O,E,S=function(e){this.lineSplit=void 0,this.timestamp=void 0,this.lineSplit=e,this.timestamp=new Date(this.lineSplit[1])},w=/*#__PURE__*/function(e){function t(t){var i;return(i=e.call(this,t)||this).message=void 0,i.message=i.lineSplit[2],i}return o(t,e),t}(S),D=/*#__PURE__*/function(e){function t(t){var i;return(i=e.call(this,t)||this).phaseCode=void 0,i.phaseCode=H(t[2]),i}return o(t,e),t}(S),C=/*#__PURE__*/function(e){function t(t){var i;return(i=e.call(this,t)||this).id=void 0,i.name=void 0,i.classId=void 0,i.class=void 0,i.gearScore=void 0,i.currentHp=void 0,i.maxHp=void 0,i.id=t[2],i.name=t[3]||"Unknown Entity",i.classId=H(t[4]),i.class=t[5]||"UnknownClass",i.gearScore=H(t[7],0,10,!0),i.currentHp=H(t[8]),i.maxHp=H(t[9]),i}return o(t,e),t}(S),P=/*#__PURE__*/function(e){function t(t){var i;return(i=e.call(this,t)||this).id=void 0,i.npcId=void 0,i.name=void 0,i.currentHp=void 0,i.maxHp=void 0,i.id=t[2],i.npcId=H(t[3]),i.name=t[4]||"Unknown Entity",i.currentHp=H(t[5]),i.maxHp=H(t[6]),i}return o(t,e),t}(S),R=/*#__PURE__*/function(e){function t(t){var i;return(i=e.call(this,t)||this).id=void 0,i.name=void 0,i.killerId=void 0,i.killerName=void 0,i.id=t[2],i.name=t[3]||"Unknown Entity",i.killerId=t[4],i.killerName=t[5]||"Unknown Entity",i}return o(t,e),t}(S),F=/*#__PURE__*/function(e){function t(t){var i;return(i=e.call(this,t)||this).id=void 0,i.name=void 0,i.skillId=void 0,i.skillName=void 0,i.id=t[2],i.name=t[3]||"Unknown Entity",i.skillId=H(t[4]),i.skillName=t[5]||"Unknown Skill",i}return o(t,e),t}(S),x=/*#__PURE__*/function(e){function t(t){var i;return(i=e.call(this,t)||this).id=void 0,i.name=void 0,i.skillId=void 0,i.skillName=void 0,i.skillStage=void 0,i.id=t[2],i.name=t[3]||"Unknown Entity",i.skillId=t[4],i.skillName=t[5]||"Unknown Skill",i.skillStage=H(t[6]),i}return o(t,e),t}(S),G=/*#__PURE__*/function(e){function t(t){var i;return(i=e.call(this,t)||this).id=void 0,i.name=void 0,i.skillId=void 0,i.skillName=void 0,i.skillEffectId=void 0,i.skillEffect=void 0,i.targetId=void 0,i.targetName=void 0,i.damage=void 0,i.damageModifier=void 0,i.currentHp=void 0,i.maxHp=void 0,i.id=t[2],i.name=t[3]||"Unknown Entity",i.skillId=H(t[4]),i.skillName=t[5]||"Unknown Skill",i.skillEffectId=H(t[6]),i.skillEffect=t[7],i.targetId=t[8],i.targetName=t[9]||"Unknown Entity",i.damage=H(t[10]),i.damageModifier=H(t[11],0,16),i.currentHp=H(t[12]),i.maxHp=H(t[13]),i}return o(t,e),t}(S),M=/*#__PURE__*/function(e){function t(t){var i;return(i=e.call(this,t)||this).id=void 0,i.name=void 0,i.healAmount=void 0,i.id=t[2],i.name=t[3]||"Unknown Entity",i.healAmount=H(t[4]),i}return o(t,e),t}(S),j=/*#__PURE__*/function(e){function t(t){var i;return(i=e.call(this,t)||this).id=void 0,i.name=void 0,i.buffId=void 0,i.buffName=void 0,i.isNew=void 0,i.sourceId=void 0,i.sourceName=void 0,i.shieldAmount=void 0,i.id=t[2],i.name=t[3]||"Unknown Entity",i.buffId=t[4],i.buffName=t[5],i.isNew="1"==t[6],i.sourceId=t[7],i.sourceName=t[8]||"Unknown Entity",i.shieldAmount=H(t[9]),i}return o(t,e),t}(S),U=/*#__PURE__*/function(e){function t(t){var i;return(i=e.call(this,t)||this).id=void 0,i.name=void 0,i.id=t[2],i.name=t[3]||"Unknown Entity",i}return o(t,e),t}(S),K={"Serenade of Salvation":{duration:3},"Holy Aura":{duration:16e3},"Holy Protection":{duration:7e3},Demonize:{duration:1500}};!function(e){e[e.HIT_OPTION_NONE=-1]="HIT_OPTION_NONE",e[e.HIT_OPTION_BACK_ATTACK=0]="HIT_OPTION_BACK_ATTACK",e[e.HIT_OPTION_FRONTAL_ATTACK=1]="HIT_OPTION_FRONTAL_ATTACK",e[e.HIT_OPTION_FLANK_ATTACK=2]="HIT_OPTION_FLANK_ATTACK",e[e.HIT_OPTION_MAX=3]="HIT_OPTION_MAX"}(O||(O={})),function(e){e[e.HIT_FLAG_NORMAL=0]="HIT_FLAG_NORMAL",e[e.HIT_FLAG_CRITICAL=1]="HIT_FLAG_CRITICAL",e[e.HIT_FLAG_MISS=2]="HIT_FLAG_MISS",e[e.HIT_FLAG_INVINCIBLE=3]="HIT_FLAG_INVINCIBLE",e[e.HIT_FLAG_DOT=4]="HIT_FLAG_DOT",e[e.HIT_FLAG_IMMUNE=5]="HIT_FLAG_IMMUNE",e[e.HIT_FLAG_IMMUNE_SILENCED=6]="HIT_FLAG_IMMUNE_SILENCED",e[e.HIT_FLAG_FONT_SILENCED=7]="HIT_FLAG_FONT_SILENCED",e[e.HIT_FLAG_DOT_CRITICAL=8]="HIT_FLAG_DOT_CRITICAL",e[e.HIT_FLAG_DODGE=9]="HIT_FLAG_DODGE",e[e.HIT_FLAG_REFLECT=10]="HIT_FLAG_REFLECT",e[e.HIT_FLAG_DAMAGE_SHARE=11]="HIT_FLAG_DAMAGE_SHARE",e[e.HIT_FLAG_DODGE_HIT=12]="HIT_FLAG_DODGE_HIT",e[e.HIT_FLAG_MAX=13]="HIT_FLAG_MAX"}(E||(E={}));var B=/*#__PURE__*/function(e){function i(t){var i;return void 0===t&&(t=!1),(i=e.call(this)||this).resetTimer=void 0,i.debugLines=void 0,i.isLive=void 0,i.dontResetOnZoneChange=void 0,i.resetAfterPhaseTransition=void 0,i.splitOnPhaseTransition=void 0,i.removeOverkillDamage=void 0,i.phaseTransitionResetRequest=void 0,i.phaseTransitionResetRequestTime=void 0,i.game=void 0,i.encounters=void 0,i.healSources=void 0,i.resetTimer=null,i.debugLines=!1,i.isLive=t,i.dontResetOnZoneChange=!1,i.resetAfterPhaseTransition=!1,i.splitOnPhaseTransition=!1,i.removeOverkillDamage=!0,i.phaseTransitionResetRequest=!1,i.phaseTransitionResetRequestTime=0,i.resetState(),i.encounters=[],i.isLive&&setInterval(i.broadcastStateChange.bind(function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(i)),100),i}o(i,e);var n=i.prototype;return n.resetState=function(){this.debugLines&&this.emit("log",{type:"debug",message:"Resetting state"});var e=t(this.game),i=+new Date;this.game={startedOn:i,lastCombatPacket:i,fightStartedOn:0,entities:{},damageStatistics:{totalDamageDealt:0,topDamageDealt:0,totalDamageTaken:0,topDamageTaken:0,totalHealingDone:0,topHealingDone:0,totalShieldDone:0,topShieldDone:0}},this.healSources=[],this.emit("reset-state",e)},n.softReset=function(){this.resetTimer=null;var e=t(this.game.entities);this.resetState();for(var i=0,n=Object.keys(e);i<n.length;i++){var a=n[i];+new Date-e[a].lastUpdate>6e5||this.updateEntity(e[a].name,{name:e[a].name,npcId:e[a].npcId,class:e[a].class,classId:e[a].classId,isPlayer:e[a].isPlayer,gearScore:e[a].gearScore,maxHp:e[a].maxHp,currentHp:e[a].currentHp})}},n.cancelReset=function(){this.resetTimer&&clearTimeout(this.resetTimer),this.resetTimer=null},n.splitEncounter=function(){var e=t(this.game);0==e.fightStartedOn||0==e.damageStatistics.totalDamageDealt&&!e.damageStatistics.totalDamageTaken||this.encounters.push(e),this.resetState()},n.broadcastStateChange=function(){var e=t(this.game);Object.values(e.entities).forEach(function(e){Object.values(e.skills).forEach(function(e){e.breakdown=[]})}),this.emit("state-change",e)},n.parseLogLine=function(e){if(e){var t=e.trim().split("|");if(!(t.length<1)&&t[0]){var i=H(t[0]);try{switch(i){case 0:this.onMessage(t);break;case 1:this.onInitEnv();break;case 2:this.onPhaseTransition(t);break;case 3:this.onNewPc(t);break;case 4:this.onNewNpc(t);break;case 5:this.onDeath(t);break;case 6:this.onSkillStart(t);break;case 7:this.onSkillStage(t);break;case 8:this.onDamage(t);break;case 9:this.onHeal(t);break;case 10:this.onBuff(t);break;case 12:this.onCounterattack(t)}}catch(e){this.emit("log",{type:"error",message:e})}}}},n.updateEntity=function(e,t){var i={},n=this.game.entities[e];!t.currentHp||n&&t.currentHp===n.currentHp||(i.lastUpdate=+new Date),this.game.entities[e]=r({},n||{lastUpdate:0,id:"",npcId:0,name:"",class:"",classId:0,isPlayer:!1,isDead:!1,deaths:0,deathTime:0,gearScore:0,currentHp:0,maxHp:0,damageDealt:0,healingDone:0,shieldDone:0,damageTaken:0,skills:{},hits:{casts:0,total:0,crit:0,backAttack:0,frontAttack:0,counter:0}},t,i)},n.onMessage=function(e){var t=new w(e);this.debugLines&&this.emit("log",{type:"debug",message:"onMessage: "+t.message}),t.message.startsWith("Arguments:")||this.emit("message",t.message)},n.onInitEnv=function(){this.debugLines&&this.emit("log",{type:"debug",message:"onInitEnv"}),this.isLive?!1===this.dontResetOnZoneChange&&null==this.resetTimer&&(this.debugLines&&this.emit("log",{type:"debug",message:"Setting a reset timer"}),this.resetTimer=setTimeout(this.softReset.bind(this),6e3),this.emit("message","new-zone")):(this.splitEncounter(),this.emit("message","new-zone"))},n.onPhaseTransition=function(e){var t=new D(e);this.debugLines&&this.emit("log",{type:"debug",message:"onPhaseTransition: "+t.phaseCode}),this.isLive&&(this.emit("message","phase-transition-"+t.phaseCode),this.resetAfterPhaseTransition&&(this.phaseTransitionResetRequest=!0,this.phaseTransitionResetRequestTime=+new Date)),!this.isLive&&this.splitOnPhaseTransition&&this.splitEncounter()},n.onNewPc=function(e){var t=new C(e);this.debugLines&&this.emit("log",{type:"debug",message:"onNewPc: "+t.id+", "+t.name+", "+t.classId+", "+t.class+", "+t.gearScore+", "+t.currentHp+", "+t.maxHp}),this.updateEntity(t.name,r({id:t.id,name:t.name,class:t.class,classId:t.classId,isPlayer:!0},t.gearScore&&0!=t.gearScore&&{gearScore:t.gearScore},{currentHp:t.currentHp,maxHp:t.maxHp}))},n.onNewNpc=function(e){var t=new P(e);this.debugLines&&this.emit("log",{type:"debug",message:"onNewNpc: "+t.id+", "+t.name+", "+t.currentHp+", "+t.maxHp}),this.updateEntity(t.name,{id:t.id,name:t.name,npcId:t.npcId,isPlayer:!1,currentHp:t.currentHp,maxHp:t.maxHp})},n.onDeath=function(e){var t=new R(e);this.debugLines&&this.emit("log",{type:"debug",message:"onDeath: "+t.name+" "+t.killerName});var i=this.game.entities[t.name];this.updateEntity(t.name,{name:t.name,isDead:!0,deathTime:+t.timestamp,deaths:i?i.isDead?i.deaths:i.deaths+1:1})},n.onSkillStart=function(e){var t=new F(e);this.debugLines&&this.emit("log",{type:"debug",message:"onSkillStart: "+t.id+", "+t.name+", "+t.skillId+", "+t.skillName}),Object.keys(K).includes(t.skillName)&&this.healSources.push({source:t.name,expires:+t.timestamp+K[t.skillName].duration}),this.updateEntity(t.name,{name:t.name,isDead:!1});var i=this.game.entities[t.name];i&&(i.hits.casts+=1,t.skillName in i.skills||(i.skills[t.skillName]=r({},{id:0,name:"",totalDamage:0,maxDamage:0,hits:{casts:0,total:0,crit:0,backAttack:0,frontAttack:0,counter:0},breakdown:[]},{id:t.skillId,name:t.skillName}),i.skills[t.skillName].hits.casts+=1))},n.onSkillStage=function(e){var t=new x(e);this.debugLines&&this.emit("log",{type:"debug",message:"onSkillStage: "+t.name+", "+t.skillId+", "+t.skillName+", "+t.skillStage})},n.onDamage=function(e){if(!(e.length<13)){var t=new G(e);this.debugLines&&this.emit("log",{type:"debug",message:"onDamage: "+t.id+", "+t.name+", "+t.skillId+", "+t.skillName+", "+t.skillEffectId+", "+t.skillEffect+", "+t.targetId+", "+t.targetName+", "+t.damage+", "+t.currentHp+", "+t.maxHp}),this.phaseTransitionResetRequest&&this.phaseTransitionResetRequestTime>0&&this.phaseTransitionResetRequestTime<+new Date-1500&&(this.softReset(),this.phaseTransitionResetRequest=!1),this.updateEntity(t.name,{id:t.id,name:t.name}),this.updateEntity(t.targetName,{id:t.targetId,name:t.targetName,currentHp:t.currentHp,maxHp:t.maxHp});var i=this.game.entities[t.name],n=this.game.entities[t.targetName];!n.isPlayer&&this.removeOverkillDamage&&t.currentHp<0&&(t.damage=t.damage+t.currentHp),0===t.skillId&&0!==t.skillEffectId&&(t.skillId=t.skillEffectId,t.skillName=t.skillEffect),t.skillName in i.skills||(i.skills[t.skillName]=r({},{id:0,name:"",totalDamage:0,maxDamage:0,hits:{casts:0,total:0,crit:0,backAttack:0,frontAttack:0,counter:0},breakdown:[]},{id:t.skillId,name:t.skillName}));var a=15&t.damageModifier,s=(t.damageModifier>>4&7)-1;if(!("Bleed"===t.skillName&&t.damage>1e7||"Bleed"===t.skillName&&a===E.HIT_FLAG_DAMAGE_SHARE)){var o=a===E.HIT_FLAG_CRITICAL||a===E.HIT_FLAG_DOT_CRITICAL,l=s===O.HIT_OPTION_BACK_ATTACK,m=s===O.HIT_OPTION_FRONTAL_ATTACK,u=o?1:0,c=l?1:0,d=m?1:0;i.skills[t.skillName].totalDamage+=t.damage,t.damage>i.skills[t.skillName].maxDamage&&(i.skills[t.skillName].maxDamage=t.damage),i.damageDealt+=t.damage,n.damageTaken+=t.damage,"Bleed"!==t.skillName&&(i.hits.total+=1,i.hits.crit+=u,i.hits.backAttack+=c,i.hits.frontAttack+=d,i.skills[t.skillName].hits.total+=1,i.skills[t.skillName].hits.crit+=u,i.skills[t.skillName].hits.backAttack+=c,i.skills[t.skillName].hits.frontAttack+=d),i.isPlayer&&(this.game.damageStatistics.totalDamageDealt+=t.damage,this.game.damageStatistics.topDamageDealt=Math.max(this.game.damageStatistics.topDamageDealt,i.damageDealt),i.skills[t.skillName].breakdown.push({timestamp:+t.timestamp,damage:t.damage,targetEntity:n.id,isCrit:o,isBackAttack:l,isFrontAttack:m})),n.isPlayer&&(this.game.damageStatistics.totalDamageTaken+=t.damage,this.game.damageStatistics.topDamageTaken=Math.max(this.game.damageStatistics.topDamageTaken,n.damageTaken)),0===this.game.fightStartedOn&&(this.game.fightStartedOn=+t.timestamp),this.game.lastCombatPacket=+t.timestamp}}},n.onHeal=function(e){var t=new M(e);this.debugLines&&this.emit("log",{type:"debug",message:"onHeal: "+t.id+", "+t.name+", "+t.healAmount});for(var i,n="",a=u(this.healSources);!(i=a()).done;){var s=i.value;if(s.expires>=+t.timestamp){n=s.source;break}}n&&(this.updateEntity(n,{name:n}),this.game.entities[n].healingDone+=t.healAmount,this.game.entities[n].isPlayer&&(this.game.damageStatistics.totalHealingDone+=t.healAmount,this.game.damageStatistics.topHealingDone=Math.max(this.game.damageStatistics.topHealingDone,this.game.entities[n].healingDone)))},n.onBuff=function(e){var t=new j(e);this.debugLines&&this.emit("log",{type:"debug",message:"onBuff: "+t.id+", "+t.name+", "+t.buffId+", "+t.buffName+", "+t.sourceId+", "+t.sourceName+", "+t.shieldAmount}),t.shieldAmount&&t.isNew&&(this.updateEntity(t.name,{name:t.name}),this.game.entities[t.name].shieldDone+=t.shieldAmount,this.game.entities[t.name].isPlayer&&(this.game.damageStatistics.totalShieldDone+=t.shieldAmount,this.game.damageStatistics.topShieldDone=Math.max(this.game.damageStatistics.topShieldDone,this.game.entities[t.name].shieldDone)))},n.onCounterattack=function(e){var t=new U(e);this.debugLines&&this.emit("log",{type:"debug",message:"onCounterattack: "+t.id+", "+t.name}),this.updateEntity(t.name,{name:t.name}),this.game.entities[t.name].hits.counter+=1},i}(p.EventEmitter);function q(e,t,s,o,l){try{var m=e.slice(0,-4),c=m+".json",d=n.readFileSync(a.join(s,e),"utf-8");if(!d)return l(null,"empty log");var h=new B(!1);!0===t&&(h.splitOnPhaseTransition=!0);for(var f,g=u(d.split("\n").filter(function(e){return null!=e&&""!=e}));!(f=g()).done;)h.parseLogLine(f.value);h.splitEncounter();var p=h.encounters;if(p.length>0){for(var v,k={encounters:[]},y=u(p);!(v=y()).done;){var T=v.value,_=T.lastCombatPacket-T.fightStartedOn;if(!(_<=1e3)){for(var I={name:"",damageTaken:0,isPlayer:!1},b=0,L=Object.values(T.entities);b<L.length;b++){var A=L[b];A.damageTaken>I.damageTaken&&(I={name:A.name,damageTaken:A.damageTaken,isPlayer:A.isPlayer})}var N={duration:_,mostDamageTakenEntity:I},H=i(),O=m+"_"+H+"_encounter.json";k.encounters.push(r({encounterId:H,encounterFile:O},N)),n.writeFileSync(a.join(o,O),JSON.stringify(r({},T,N)))}}return n.writeFileSync(a.join(o,c),JSON.stringify(k)),l(null,"log parsed")}return l(null,"no encounters found")}catch(e){return l(e,"log parser error")}}e.extend(s);export{q as default};
//# sourceMappingURL=file-parser-worker.module.js.map
