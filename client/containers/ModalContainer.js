import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import {Link} from 'react-router';


const customStyles = {
  content: {
    top        : '50%',
    left       : '50%',
    right      : 'auto',
    bottom     : 'auto',
    marginRight: '-50%',
    transform  : 'translate(-50%, -50%)'
  }
};

class ModalContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalIsOpen: false,
      createBoard: props.createBoard,
      inputValue : '',
    };

    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  openModal() {
    this.setState({modalIsOpen: true});
  }

  handleChange(event) {
    this.setState({inputValue: event.target.value});
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
    this.refs.subtitle.style.color = '#f00';
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }

  render() {
    return (
      <div>
        <a className='addBoard thumbnail' onClick={this.openModal}>Create Board</a>
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >

          <h2 ref="subtitle">Create a new Board</h2>
          <div>Board Name</div>
          <form id='cBoard' onSubmit={(event) => {
            event.preventDefault();
            this.state.createBoard(this.state.inputValue);
            this.setState({inputValue: ''});
            this.closeModal();
          }}>
            <input
              type='text'
              className="form-control"
              value={this.state.inputValue}
              onChange={(event) => { this.handleChange(event); }}
            />
          </form>
          <button form='cBoard'>Create</button>
          <button onClick={this.closeModal}>close</button>
        </Modal>
      </div>
    );
  }
}

export default ModalContainer;
