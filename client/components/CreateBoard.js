import React from 'react';
import {Link} from 'react-router';
import ModalContainer from '../containers/ModalContainer';
import UserBoardsContainer from '../containers/UserBoardsContainer';

const CreateBoard = (props) => {
  const boards = props.boards;
  const permissions = props.permissions;
  let filterArr = [];

  if (props.filterStatus !== 'all') {
    filterArr = permissions.filter(permission => {
      return permission.permission === props.filterStatus;
    }).map(permission => permission.board_id);
  } else {
    filterArr = permissions.map(permission => permission.board_id);
  }
  return (
    <div>

      <div className="row">
      <div className="col-xs-4 col-md-4 col-lg-4 col-xs-offset-1">
        <h3 >Boards</h3>
      </div>
      <div className="col-xs-5 col-md-3 col-lg-4 col-xs-offset-1">
        <h5 style={{float: 'right', marginTop: '30px'}}>
          <a onClick={() => { props.filterChange('all'); }}>all </a>/
          <a onClick={() => { props.filterChange('admin'); }}> admin </a>/
          <a onClick={() => { props.filterChange('user'); }}> user</a>
        </h5>
      </div>
    </div>
      <div className="row">
        {
          !!boards.length && boards.map((board) => {
            if (filterArr.indexOf(board.id) !== -1) {
              return (
              <div className="col-xs-10 col-md-8 col-lg-4 col-xs-offset-1" key={ board.id }>
                  <Link className="thumbnail" to={`/boards/${board.hash}`}>
                  <UserBoardsContainer board={board} />
                  <div className="caption">
                    <h5>
                      <span>{ board.name }</span>
                    </h5>
                  </div>
                </Link>
              </div>
              ); }
          })
          }
          <div className="col-xs-10 col-md-8 col-lg-4 col-xs-offset-1">
          <ModalContainer createBoard={props.create}/>
          </div>

      </div>
    </div>
  );
};
export default CreateBoard;
