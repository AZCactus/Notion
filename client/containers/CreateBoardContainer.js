import React, {Component} from 'react';
import {connect} from 'react-redux';
import CreateBoard from '../components/CreateBoard';
import {createBoard} from '../actions/board';
import {getAllNotes} from '../actions/note';

const mapStateToProps = (state, ownProps) => {
  return {

    user       : state.userReducer.loggedInUser,
    boards     : state.board.allBoards,
    permissions: state.board.permissions

  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    create: (boardName) => {
      dispatch(createBoard(boardName));
    },
    onBoardEnter: function() {
      dispatch(getAllNotes({}));
    }
  };
};

export class CB extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filterStatus: 'all'
    };

    this.filterChange = this.filterChange.bind(this);
  }

  componentDidMount() {
    this.props.onBoardEnter();

  }

  filterChange(filterValue) {
    this.setState({filterStatus: filterValue});
  }

  render() {
    return (
      <CreateBoard
        user={this.props.user}
        boards={this.props.boards}
        permissions={this.props.permissions}
        create={this.props.create}
        filterStatus={this.state.filterStatus}
        filterChange={this.filterChange}
      />
    );
  }
}

const CreateBoardContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(CB);

export default CreateBoardContainer;
