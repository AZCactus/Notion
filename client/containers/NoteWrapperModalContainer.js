import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import Note from '../components/Note';

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
    this.refs.subtitle.style.color = '#f00';
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }

  render() {

    console.log('MODAL PROPS', this.props);
    return (
      <div>
        <a className='addBoard thumbnail' onClick={this.openModal}>test</a>
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
        <div> "TEST" </div>


          <button onClick={this.closeModal}>close</button>
        </Modal>
      </div>
    );
  }
}

export default NoteWrapperModalContainer;
