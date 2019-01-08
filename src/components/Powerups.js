import './css/powerups.css';
import React from 'react';
import Flex from 'react-flexview';

import Emoji from './Emoji';
import powerups, {hasExpired, inUse} from '../lib/powerups';

import _ from 'lodash';

export default class Powerups extends React.Component {
  constructor() {
    super();
    this.renderPowerup = this.renderPowerup.bind(this);
  }

  // TODO: forceUpdate to make sure hasExpired check clears powerups that time out.
  // Maybe by using a delay callback?
  renderPowerup(powerup, idx) {
    if (hasExpired(powerup)) {
      return;
    }
    const {type} = powerup;
    const {icon, name} = powerups[type];
    const inuse = inUse(powerup);
    const className = inuse ? 'powerups--in-use' : 'powerups--unused';
    const onClick = inuse ? undefined : () => this.props.handleUsePowerup(powerup);

    return (
      <Flex className="powerups--powerup" onClick={onClick}>
        <Flex className="powerups--label">{name}</Flex>
        <Flex key={idx} className={className}>
          <Emoji emoji={icon} big={true} />
        </Flex>
      </Flex>
    );
  }

  render() {
    return <Flex className="powerups--main">{_.map(this.props.powerups, this.renderPowerup)}</Flex>;
  }
}
