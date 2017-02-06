import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import NoteWrapper from '../components/NoteWrapper';
import {connect} from 'react-redux';

const customStyles = {
  content: {
    top        : '200%',
    left       : '200%',
    right      : 'auto',
    bottom     : 'auto',
    marginRight: '-50%',
    transform  : 'translate(-200%, -200%)'
  }
};

class NoteWrapperModalContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalIsOpen: false,

    };

    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  openModal() {
    this.setState({modalIsOpen: true});
  }


  afterOpenModal() {
    // references are now sync'd and can be accessed.
    console.log('THIS', this);
    this.refs.subtitle.style.color = '#f00';
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }

  render() {

    console.log('MODAL PROPS', this.props);
    return (
      <div>
        <a className='note thumbnail' onClick={this.openModal}>test</a>
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
        <div>
          <NoteWrapper/>
        </div>


          <button onClick={this.closeModal}>close</button>
        </Modal>
      </div>
    );
  }
}


const mapStateToProps = (state) => ({
  board: state.board.selectedBoard,
  notes: state.noteReducer.all});

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(NoteWrapperModalContainer);
