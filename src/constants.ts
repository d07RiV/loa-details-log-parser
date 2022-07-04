interface HealingSkills {
  [key: string]: HealingSkillDetails;
}
interface HealingSkillDetails {
  duration: number;
}
export const healingSkills: HealingSkills = {
  "Serenade of Salvation": {
    duration: 3
  },
  "Holy Aura": {
    duration: 16 * 1000
  },
  "Holy Protection": {
    duration: 7 * 1000
  },
  Demonize: {
    duration: 1.5 * 1000
  }
};
