import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {say} from '../utils';
import classNames from 'classnames';


export default class ToggleButton extends Component {
  static propTypes = {
    onToggle: PropTypes.func.isRequired
  }

  state = {
    blockMode: false
  }

  handleToggle = () => {
    this.setState({blockMode: !this.state.blockMode});
    this.props.onToggle(this.state.blockMode);
  }

  render() {
    const glyphClass = this.state.blockMode
      ? classNames('glyphicon', 'glyphicon-pencil')
      : classNames('glyphicon', 'glyphicon-align-left');
    const modeName = this.state.blockMode ? "text" : "blocks";
    const buttonAria = "Switch to " + modeName + " mode";
    return (
      <button className="blocks-toggle-btn btn btn-default btn-sm"
              aria-label={buttonAria}
              onClick={this.handleToggle}
              tabIndex="0">
        <span className={glyphClass}></span>
      </button>
    );
  }
}
