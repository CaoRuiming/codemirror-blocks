import React, {Component} from 'react';
import Modal from 'react-modal';
import {SPACE, UP, DOWN, ESC, ENTER, PGUP, PGDN, F3} from '../keycode';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.less';

// TODO: Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
// Modal.setAppElement('#yourAppElement');

export default class extends Component {
  // NOTE(Oak): we need to store all panels' states here so that the states are not
  // forgotten

  // NOTE(Oak): the prop `searchModes` should not be changed once it's given
  // (could potentially make it changeable by using getDerivedStatefromProps)
  constructor(props) {
    super(props);
    let state = {showSearchModal: false, tabIndex: 0};
    for (const searchMode of this.props.searchModes) {
      state = {...state, ...searchMode.init}; // just merge this in
    }
    this.state = state;
  }

  handleKeyModal = e => {
    if (e.keyCode === ENTER || e.keyCode === ESC) { // enter or escape
      this.handleCloseModal();
      return;
    }
  }

  handleKeyGlobal = e => {
    if (!this.props.blocks.blockMode) return;

    switch (e.keyCode) {
    case F3:
      e.preventDefault(); // prevent the browser search
      this.setState({showSearchModal: true});
      return;

    case PGUP: {
      e.preventDefault(); // we never want pgup and pgdn to actually do pgup and pgdn
      this.props.searchModes[this.state.tabIndex].find(
        this.props.blocks,
        this.state,
        false,
        e
      );
      return;
    }

    case PGDN: {
      e.preventDefault(); // we never want pgup and pgdn to actually do pgup and pgdn
      this.props.searchModes[this.state.tabIndex].find(
        this.props.blocks,
        this.state,
        true,
        e
      );
      return;
    }

    }
  }

  handleTab = tabIndex => this.setState({tabIndex})

  handleCloseModal = () => {
    this.setState({showSearchModal: false});
    this.props.searchModes[this.state.tabIndex].initSearch(
      this.props.blocks,
      this.state
    );
  }

  // NOTE: to intercept f3, we need to use keydown
  componentDidMount() {
    document.body.addEventListener("keydown", this.handleKeyGlobal);
  }

  componentWillUnmount() {
    document.body.removeEventListener("keydown", this.handleKeyGlobal);
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value
    });
  }

  render() {
    const tabs = this.props.searchModes.map(({label}, i) => <Tab key={i}>{label}</Tab>);
    const tabPanels = this.props.searchModes.map(({component: SearchMode}, i) => (
      <TabPanel key={i}>
        <SearchMode state={this.state} handleChange={this.handleChange}
                    blocks={this.props.blocks} />
      </TabPanel>
    ));

    return (
      <Modal isOpen={this.state.showSearchModal}
             className="wrapper-modal">
        <div tabIndex="-1" className="react-modal" onKeyUp={this.handleKeyModal}
             role="dialog">
          <div className="modal-content" role="document">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal"
                      onClick={this.handleCloseModal}>
                &times;
              </button>
              <h5 className="modal-title">Search</h5>
            </div>
            <div className="modal-body">
              <Tabs selectedIndex={this.state.tabIndex} onSelect={this.handleTab}
                    defaultFocus={true}>
                <TabList>{tabs}</TabList>
                {tabPanels}
              </Tabs>
            </div>
            <div className="modal-footer">
              <small className="form-text text-muted">
                <div>
                  <kbd>&uarr;</kbd>
                  <kbd>&darr;</kbd> to change modes;
                  <kbd>&crarr;</kbd>
                  <kbd>esc</kbd> to save the search config;
                  <kbd>⇥</kbd> to focus next element
                </div>
              </small>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}