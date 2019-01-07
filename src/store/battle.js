import actions from '../actions';
import {db} from './firebase';

import EventEmitter from 'events';
import async from 'async';
import _ from 'lodash';

// a wrapper class that models Room
export default class Battle extends EventEmitter {
  constructor(path) {
    super();
    this.path = path;
    this.ref = db.ref(path);
  }

  attach() {
    this.ref.child('games').on('value', (snapshot) => {
      this.emit('games', snapshot.val());
    });
    this.ref.child('powerups').on('value', (snapshot) => {
      this.emit('powerups', snapshot.val());
    });
    this.ref.child('started').on('value', (snapshot) => {
      this.emit('started', snapshot.val());
    });
  }

  detach() {
    this.ref.child('games').off('value');
    this.ref.child('powerups').off('value');
    this.ref.child('started').off('value');
  }

  start() {
    this.ref.child('started').set(true);
  }

  initialize(pid, bid, teams = 2) {
    const shiftCbkArg = (fn) => (args, cbk) => fn(args, (val) => cbk(null, val)); // async style fun

    const args = _.map(_.range(teams), (team) => ({
      pid,
      battleData: {bid, team},
    }));

    async.map(args, shiftCbkArg(actions.createGameForBattle), (err, gids) => {
      this.ref.child('games').set(gids, () => {
        this.emit('ready');
      });
    });
  }
}
