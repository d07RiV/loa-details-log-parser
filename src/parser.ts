import cloneDeep from "lodash/cloneDeep.js";
import EventEmitter from "events";

import * as LogLines from "./log-lines.js";
import { tryParseInt } from "./util.js";
import { healingSkills, HitFlag } from "./constants.js";

interface Game {
  startedOn: number;
  lastCombatPacket: number;
  fightStartedOn: number;
  entities: { [name: string]: Entity };
  damageStatistics: {
    totalDamageDealt: number;
    topDamageDealt: number;
    totalDamageTaken: number;
    topDamageTaken: number;
    totalHealingDone: number;
    topHealingDone: number;
    totalShieldDone: number;
    topShieldDone: number;
    targetMaximumHealth: number;
    targetCurrentHealth: number;
  };
}
interface HealSource {
  source: string;
  expires: number;
}

interface Entity {
  lastUpdate: number;
  id: string;
  name: string;
  class: string;
  isPlayer: boolean;
  isDead: boolean;
  deathTime: number;
  gearScore: string;
  currentHp: number;
  maxHp: number;
  damageDealt: number;
  healingDone: number;
  shieldDone: number;
  damageTaken: number;
  skills: { [name: string]: EntitySkills };
  hits: Hits;
}
interface EntitySkills {
  name: string;
  totalDamage: number;
  maxDamage: number;
  hits: Hits;
}
function createEntitySkill(): EntitySkills {
  const newEntitySkill: EntitySkills = {
    name: "",
    totalDamage: 0,
    maxDamage: 0,
    hits: {
      total: 0,
      crit: 0,
      backAttack: 0,
      frontAttack: 0,
      counter: 0
    }
  };
  return newEntitySkill;
}

interface Hits {
  total: number;
  crit: number;
  backAttack: number;
  frontAttack: number;
  counter: number;
}
function createEntity(): Entity {
  const newEntity: Entity = {
    lastUpdate: 0,
    id: "",
    name: "",
    class: "",
    isPlayer: false,
    isDead: false,
    deathTime: 0,
    gearScore: "",
    currentHp: 0,
    maxHp: 0,
    damageDealt: 0,
    healingDone: 0,
    shieldDone: 0,
    damageTaken: 0,
    skills: {},
    hits: {
      total: 0,
      crit: 0,
      backAttack: 0,
      frontAttack: 0,
      counter: 0
    }
  };
  return newEntity;
}

export class LogParser {
  eventEmitter: EventEmitter;
  resetTimer: ReturnType<typeof setTimeout>;

  debugLines: boolean;
  isLive: boolean;
  dontResetOnZoneChange: boolean;
  resetAfterPhaseTransition: boolean;
  splitOnPhaseTransition: boolean;
  removeOverkillDamage: boolean;

  phaseTransitionResetRequest: boolean;
  phaseTransitionResetRequestTime: number;

  game: Game;
  encounters: Game[];
  healSources: HealSource[];

  constructor(isLive = false) {
    this.eventEmitter = new EventEmitter();
    this.resetTimer = null;

    this.debugLines = false;
    this.isLive = isLive;
    this.dontResetOnZoneChange = false;
    this.resetAfterPhaseTransition = false;
    this.splitOnPhaseTransition = false;
    this.removeOverkillDamage = true;

    this.phaseTransitionResetRequest = false;
    this.phaseTransitionResetRequestTime = 0;

    this.resetState();
    this.encounters = [];

    if (this.isLive) {
      setInterval(this.broadcastStateChange.bind(this), 100);
    }
  }

  resetState() {
    if (this.debugLines)
      this.eventEmitter.emit("log", {
        type: "debug",
        message: "Resetting state"
      });

    const curTime = +new Date();

    this.game = {
      startedOn: curTime,
      lastCombatPacket: curTime,
      fightStartedOn: 0,
      entities: {},
      damageStatistics: {
        totalDamageDealt: 0,
        topDamageDealt: 0,
        totalDamageTaken: 0,
        topDamageTaken: 0,
        totalHealingDone: 0,
        topHealingDone: 0,
        totalShieldDone: 0,
        topShieldDone: 0,
        targetMaximumHealth: 0,
        targetCurrentHealth: 0,
      }
    };

    this.healSources = [];

    this.eventEmitter.emit("reset-state");
  }
  softReset() {
    this.resetTimer = null;
    const entitiesCopy = cloneDeep(this.game.entities);
    this.resetState();
    for (const entity of Object.keys(entitiesCopy)) {
      // don't keep entity if it hasn't been updated in 10 minutes
      if (+new Date() - entitiesCopy[entity].lastUpdate > 10 * 60 * 1000)
        continue;

      this.updateEntity(entitiesCopy[entity].name, {
        name: entitiesCopy[entity].name,
        class: entitiesCopy[entity].class,
        isPlayer: entitiesCopy[entity].isPlayer,
        gearScore: entitiesCopy[entity].gearScore,
        maxHp: entitiesCopy[entity].maxHp,
        currentHp: entitiesCopy[entity].currentHp
      });
    }
  }
  cancelReset() {
    if (this.resetTimer) clearTimeout(this.resetTimer);
    this.resetTimer = null;
  }
  splitEncounter() {
    const curState = cloneDeep(this.game);
    if (
      curState.fightStartedOn != 0 && // no combat packets
      (curState.damageStatistics.totalDamageDealt != 0 ||
        curState.damageStatistics.totalDamageTaken) // no player damage dealt OR taken
    )
      this.encounters.push(curState);
    this.resetState();
  }

  broadcastStateChange() {
    this.eventEmitter.emit("state-change", this.game);
  }

  parseLogLine(line: string) {
    if (!line) return;

    const lineSplit = line.trim().split("|");
    if (lineSplit.length < 1 || !lineSplit[0]) return;

    const logType = tryParseInt(lineSplit[0]);

    try {
      switch (logType) {
        case 0:
          this.onMessage(lineSplit);
          break;
        case 1:
          this.onInitEnv(/* lineSplit */);
          break;
        case 2:
          this.onPhaseTransition(lineSplit);
          break;
        case 3:
          this.onNewPc(lineSplit);
          break;
        case 4:
          this.onNewNpc(lineSplit);
          break;
        case 5:
          this.onDeath(lineSplit);
          break;
        case 6:
          this.onSkillStart(lineSplit);
          break;
        case 7:
          this.onSkillStage(lineSplit);
          break;
        case 8:
          this.onDamage(lineSplit);
          break;
        case 9:
          this.onHeal(lineSplit);
          break;
        case 10:
          this.onBuff(lineSplit);
          break;
        case 11:
          this.onCounterattack(lineSplit);
          break;
      }
    } catch (e) {
      this.eventEmitter.emit("log", { type: "error", message: e });
    }
  }

  updateEntity(entityName: string, values) {
    const updateTime = { lastUpdate: +new Date() };
    if (!(entityName in this.game.entities)) {
      this.game.entities[entityName] = {
        ...createEntity(),
        ...values,
        ...updateTime
      };
    } else {
      this.game.entities[entityName] = {
        ...this.game.entities[entityName],
        ...values,
        ...updateTime
      };
    }
  }

  // logId = 0
  onMessage(lineSplit: string[]) {
    const logLine = new LogLines.LogMessage(lineSplit);

    if (this.debugLines) {
      this.eventEmitter.emit("log", {
        type: "debug",
        message: `onMessage: ${logLine.message}`
      });
    }

    if (!logLine.message.startsWith("Arguments:")) {
      this.eventEmitter.emit("message", logLine.message);
    }
  }

  // logId = 1
  onInitEnv(/* lineSplit: string[] */) {
    //const logLine = new LogLines.LogInitEnv(lineSplit);

    if (this.debugLines) {
      this.eventEmitter.emit("log", {
        type: "debug",
        message: `onInitEnv`
      });
    }

    if (this.isLive) {
      if (this.dontResetOnZoneChange === false && this.resetTimer == null) {
        if (this.debugLines) {
          this.eventEmitter.emit("log", {
            type: "debug",
            message: `Setting a reset timer`
          });
        }

        this.resetTimer = setTimeout(this.softReset.bind(this), 6000);
        this.eventEmitter.emit("message", "new-zone");
      }
    } else {
      this.splitEncounter();
      this.eventEmitter.emit("message", "new-zone");
    }
  }

  // logId = 2
  onPhaseTransition(lineSplit: string[]) {
    const logLine = new LogLines.LogPhaseTransition(lineSplit);

    if (this.debugLines) {
      this.eventEmitter.emit("log", {
        type: "debug",
        message: `onPhaseTransition: ${logLine.phaseCode}`
      });
    }

    if (this.isLive) {
      this.eventEmitter.emit(
        "message",
        `phase-transition-${logLine.phaseCode}`
      );

      if (this.resetAfterPhaseTransition) {
        this.phaseTransitionResetRequest = true;
        this.phaseTransitionResetRequestTime = +new Date();
      }
    }

    if (!this.isLive && this.splitOnPhaseTransition) {
      this.splitEncounter();
    }
  }

  // logId = 3
  onNewPc(lineSplit: string[]) {
    const logLine = new LogLines.LogNewPc(lineSplit);

    if (this.debugLines) {
      this.eventEmitter.emit("log", {
        type: "debug",
        message: `onNewPc: ${logLine.id}, ${logLine.name}, ${logLine.classId}, ${logLine.class}, ${logLine.gearScore}, ${logLine.currentHp}, ${logLine.maxHp}`
      });
    }

    this.updateEntity(logLine.name, {
      name: logLine.name,
      class: logLine.class,
      isPlayer: true,
      ...(logLine.gearScore &&
        logLine.gearScore != "0" && { gearScore: logLine.gearScore }),
      currentHp: logLine.currentHp,
      maxHp: logLine.maxHp
    });
  }

  // logId = 4
  onNewNpc(lineSplit: string[]) {
    const logLine = new LogLines.LogNewNpc(lineSplit);

    if (this.debugLines) {
      this.eventEmitter.emit("log", {
        type: "debug",
        message: `onNewNpc: ${logLine.id}, ${logLine.name}, ${logLine.currentHp}, ${logLine.maxHp}`
      });
    }

    this.updateEntity(logLine.name, {
      name: logLine.name,
      isPlayer: false,
      currentHp: logLine.currentHp,
      maxHp: logLine.maxHp
    });
  }

  // logId = 5
  onDeath(lineSplit: string[]) {
    const logLine = new LogLines.LogDeath(lineSplit);

    if (this.debugLines) {
      this.eventEmitter.emit("log", {
        type: "debug",
        message: `onDeath: ${logLine.name} ${logLine.killerName}`
      });
    }

    this.updateEntity(logLine.name, {
      name: logLine.name,
      isDead: true,
      deathTime: logLine.timestamp.getTime()
    });
  }

  // logId = 6
  onSkillStart(lineSplit: string[]) {
    const logLine = new LogLines.LogSkillStart(lineSplit);

    if (this.debugLines) {
      this.eventEmitter.emit("log", {
        type: "debug",
        message: `onSkillStart: ${logLine.id}, ${logLine.name}, ${logLine.skillId}, ${logLine.skillName}`
      });
    }

    if (Object.keys(healingSkills).includes(logLine.skillName)) {
      this.healSources.push({
        source: logLine.name,
        expires: +logLine.timestamp + healingSkills[logLine.skillName].duration
      });
    }

    this.updateEntity(logLine.name, {
      name: logLine.name,
      isDead: false
    });
  }

  // logId = 7
  onSkillStage(lineSplit: string[]) {
    const logLine = new LogLines.LogSkillStage(lineSplit);

    if (this.debugLines) {
      this.eventEmitter.emit("log", {
        type: "debug",
        message: `onSkillStage: ${logLine.name}, ${logLine.skillId}, ${logLine.skillName}, ${logLine.skillStage}`
      });
    }
  }

  // logId = 8
  onDamage(lineSplit: string[]) {
    if (lineSplit.length < 13) return;
    const logLine = new LogLines.LogDamage(lineSplit);

    if (this.debugLines) {
      this.eventEmitter.emit("log", {
        type: "debug",
        message: `onDamage: ${logLine.id}, ${logLine.name}, ${logLine.skillId}, ${logLine.skillName}, ${logLine.skillEffectId}, ${logLine.skillEffect}, ${logLine.targetId}, ${logLine.targetName}, ${logLine.damage}, ${logLine.currentHp}, ${logLine.maxHp}`
      });
    }

    if (
      this.phaseTransitionResetRequest &&
      this.phaseTransitionResetRequestTime > 0 &&
      this.phaseTransitionResetRequestTime < +new Date() - 1500
    ) {
      this.softReset();
      this.phaseTransitionResetRequest = false;
    }

    this.updateEntity(logLine.name, {
      name: logLine.name
    });

    this.updateEntity(logLine.targetName, {
      name: logLine.targetName,
      currentHp: logLine.currentHp,
      maxHp: logLine.maxHp
    });

    const damageOwner = this.game.entities[logLine.name];
    const damageTarget = this.game.entities[logLine.targetName];

    if (
      !damageTarget.isPlayer &&
      this.removeOverkillDamage &&
      logLine.currentHp < 0
    ) {
      logLine.damage = logLine.damage + logLine.currentHp;
    }

    if (!(logLine.skillName in this.game.entities[logLine.name].skills)) {
      this.game.entities[logLine.name].skills[logLine.skillName] = {
        ...createEntitySkill(),
        ...{ name: logLine.skillName }
      };
    }

    // TODO: Not sure if this is fixed in the logger
    if (logLine.skillName === "Bleed" && logLine.damage > 10000000) return;

    // Remove 'sync' bleeds on G1 Valtan
    if (logLine.skillName === "Bleed" && logLine.damageModifier === 11) return;

    const isCrit =
      (logLine.damageModifier &
        (HitFlag.HIT_FLAG_CRITICAL | HitFlag.HIT_FLAG_DOT_CRITICAL)) >
      0;
    const isBackAttack =
      (logLine.damageModifier & HitFlag.HIT_OPTION_BACK_ATTACK) > 0;
    const isFrontAttack =
      (logLine.damageModifier & HitFlag.HIT_OPTION_FRONTAL_ATTACK) > 0;

    const critCount = isCrit ? 1 : 0;
    const backAttackCount = isBackAttack ? 1 : 0;
    const frontAttackCount = isFrontAttack ? 1 : 0;

    this.game.entities[logLine.name].skills[logLine.skillName].totalDamage +=
      logLine.damage;
    if (
      logLine.damage >
      this.game.entities[logLine.name].skills[logLine.skillName].maxDamage
    )
      this.game.entities[logLine.name].skills[logLine.skillName].maxDamage =
        logLine.damage;

    this.game.entities[logLine.name].damageDealt += logLine.damage;
    this.game.entities[logLine.targetName].damageTaken += logLine.damage;

    if (logLine.skillName !== "Bleed") {
      this.game.entities[logLine.name].hits.total += 1;
      this.game.entities[logLine.name].hits.crit += critCount;
      this.game.entities[logLine.name].hits.backAttack += backAttackCount;
      this.game.entities[logLine.name].hits.frontAttack += frontAttackCount;

      this.game.entities[logLine.name].skills[
        logLine.skillName
      ].hits.total += 1;
      this.game.entities[logLine.name].skills[logLine.skillName].hits.crit +=
        critCount;
      this.game.entities[logLine.name].skills[
        logLine.skillName
      ].hits.backAttack += backAttackCount;
      this.game.entities[logLine.name].skills[
        logLine.skillName
      ].hits.frontAttack += frontAttackCount;
    }

    if (damageOwner.isPlayer) {
      this.game.damageStatistics.totalDamageDealt += logLine.damage;
      this.game.damageStatistics.topDamageDealt = Math.max(
        this.game.damageStatistics.topDamageDealt,
        damageOwner.damageDealt
      );
      this.game.damageStatistics.targetMaximumHealth = logLine.maxHp;
      this.game.damageStatistics.targetCurrentHealth = logLine.currentHp;
    }

    if (damageTarget.isPlayer) {
      this.game.damageStatistics.totalDamageTaken += logLine.damage;
      this.game.damageStatistics.topDamageTaken = Math.max(
        this.game.damageStatistics.topDamageTaken,
        damageTarget.damageTaken
      );
    }

    if (this.game.fightStartedOn === 0)
      this.game.fightStartedOn = +logLine.timestamp;
    this.game.lastCombatPacket = +logLine.timestamp;
  }

  // logId = 9
  onHeal(lineSplit: string[]) {
    const logLine = new LogLines.LogHeal(lineSplit);

    if (this.debugLines) {
      this.eventEmitter.emit("log", {
        type: "debug",
        message: `onHeal: ${logLine.id}, ${logLine.name}, ${logLine.healAmount}`
      });
    }

    let sourceName = "";
    for (const source of this.healSources) {
      if (source.expires >= +logLine.timestamp) {
        sourceName = source.source;
        break;
      }
    }
    if (!sourceName) return;

    this.updateEntity(sourceName, {
      name: sourceName
    });

    this.game.entities[sourceName].healingDone += logLine.healAmount;

    if (this.game.entities[sourceName].isPlayer) {
      this.game.damageStatistics.totalHealingDone += logLine.healAmount;
      this.game.damageStatistics.topHealingDone = Math.max(
        this.game.damageStatistics.topHealingDone,
        this.game.entities[sourceName].healingDone
      );
    }
  }

  // logId = 10
  onBuff(lineSplit: string[]) {
    const logLine = new LogLines.LogBuff(lineSplit);

    if (this.debugLines) {
      this.eventEmitter.emit("log", {
        type: "debug",
        message: `onBuff: ${logLine.id}, ${logLine.name}, ${logLine.buffId}, ${logLine.buffName}, ${logLine.sourceId}, ${logLine.sourceName}, ${logLine.shieldAmount}`
      });
    }

    if (logLine.shieldAmount && logLine.isNew) {
      this.updateEntity(logLine.name, {
        name: logLine.name
      });

      this.game.entities[logLine.name].shieldDone += logLine.shieldAmount;

      if (this.game.entities[logLine.name].isPlayer) {
        this.game.damageStatistics.totalShieldDone += logLine.shieldAmount;
        this.game.damageStatistics.topShieldDone = Math.max(
          this.game.damageStatistics.topShieldDone,
          this.game.entities[logLine.name].shieldDone
        );
      }
    }
  }

  // logId = 11
  onCounterattack(lineSplit: string[]) {
    const logLine = new LogLines.LogCounterattack(lineSplit);

    if (this.debugLines) {
      this.eventEmitter.emit("log", {
        type: "debug",
        message: `onCounterattack: ${logLine.id}, ${logLine.name}`
      });
    }

    this.updateEntity(logLine.name, {
      name: logLine.name
    });

    // TODO: Add skill name from logger
    this.game.entities[logLine.name].hits.counter += 1;
  }
}
