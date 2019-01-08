import moment from 'moment';
import _ from 'lodash';

const reverseClues = (game) => {
  const {clues} = game;
  const reverseString = (s) => s && _.reverse(s.split('')).join('');
  const across = _.map(clues.across, reverseString);
  const down = _.map(clues.down, reverseString);
  return {
    ...game,
    clues: {across, down},
  };
};

// There should probably be an enum here with the keys of the following.

const secondsSince = (t) => parseInt(moment.duration(moment(Date.now()).diff(moment(t))).asSeconds());

export const hasExpired = (powerup) => {
  const {type, used} = powerup;
  const {duration} = powerups[type];
  return used && secondsSince(used) > duration;
};

export const inUse = (powerup) => {
  const {type, used} = powerup;
  const {duration} = powerups[type];
  return used && secondsSince(used) <= duration;
};

export const apply = (ownGame, opponentGame, ownPowerups, opponentPowerups) => {
  if (!ownGame || !opponentGame) {
    return {ownGame, opponentGame};
  }

  const applyOneDirection = (ownGame, opponentGame, currentPowerups) => {
    const inUsePowerups = _.filter(currentPowerups, inUse);
    return _.reduce(inUsePowerups, (g, p) => powerups[p.type].action(g), {ownGame, opponentGame});
  };

  // TODO: better names for these variables / better way to do this.
  const {ownGame: ownGame1, opponentGame: opponentGame1} = applyOneDirection(
    ownGame,
    opponentGame,
    ownPowerups
  );
  const {ownGame: opponentGame2, opponentGame: ownGame2} = applyOneDirection(
    opponentGame1,
    ownGame1,
    opponentPowerups
  );
  return {ownGame: ownGame2, opponentGame: opponentGame2};
};

const powerups = {
  REVERSE: {
    name: 'Reverse!',
    icon: 'steven',
    duration: 60,
    action: ({ownGame, opponentGame}) => ({ownGame, opponentGame: reverseClues(opponentGame)}),
  },
};

export default powerups;
