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

      <div className='clearfix' style={{width: '87%', margin: '0 auto'}}>
        <h3 style={{float: 'left'}}>Boards</h3>
        <h5 style={{float: 'right', marginTop: '30px', textAlign: 'right'}}>
          <a onClick={() => { props.filterChange('all'); }}>all </a>/
          <a onClick={() => { props.filterChange('admin'); }}> admin </a>/
          <a onClick={() => { props.filterChange('user'); }}> user</a>
        </h5>
    </div>
      <div style={{textAlign: 'center'}}>
        {
          !!boards.length && boards.map((board) => {
            if (filterArr.indexOf(board.id) !== -1) {
              return (
              <div style={{display: 'inline-block', margin: '0 5px 0 5px'}} key={ board.id }>
                <div className="thumbnail clearfix" style={{ overflow: 'hidden' }}>
                  <Link to={`/boards/${board.hash}`}>
                    <UserBoardsContainer board={board} />
                  </Link>
                  <div className="caption" style={{float: 'left', display: 'inline-block'}}>
                    <h5>
                      <span style={{display: 'inline-block', verticalAlign: 'middle', font: 'bold'}}>{ board.name }</span>
                    </h5>
                  </div>
                  <button className="btn btn-secondary deleteButton" type='button' onClick={
                    () => { props.delete(board.id); }
                  }>Delete</button>
                </div>
              </div>
              ); }
          })
          }
          <div style={{display: 'inline-block', verticalAlign: 'top'}}>
          <ModalContainer createBoard={props.create}/>
          </div>

      </div>
    </div>
  );
};
export default CreateBoard;
