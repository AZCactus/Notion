import React from 'react';
import store from './store';
import {Route, IndexRoute, Router, browserHistory} from 'react-router';

//containers
import HomepageContainer from './containers/HomepageContainer';
import BoardContainer from './containers/BoardContainer';
import CreateBoardContainer from './containers/CreateBoardContainer';
import CreateNoteContainer from './containers/CreateNoteContainer';
import ViewNoteContainer from './containers/ViewNoteContainer';
import SignupContainer from './containers/SignupContainer';

//action-creators
import {getBoard, getAllBoards} from './actions/board';
// import {getNotes} from './actions/noteboard';
import {getAllNotes} from './actions/note';
import {checkLoginStatus} from './actions/user';

//components
import Index from './components/Index';


//onEnters
function indexEnter() {
  store.dispatch(checkLoginStatus());
}

function onBoardEnter(nextRouterState) {
  const boardHash = nextRouterState.params.boardHash;
  store.dispatch(getBoard(boardHash));
  if (!store.getState().noteReducer.all.length) {
    store.dispatch(getAllNotes({boardHash}));
  }

}

function onMyBoardEnter(nextRouterState) {
  store.dispatch(getAllBoards());
}

export default function Routes() {
  return (
    <Router history={browserHistory}>
      <Route path="/" component={Index} onEnter={indexEnter}>
       <IndexRoute component={HomepageContainer} />
       <Route path="/signup" component={SignupContainer} />
       <Route path="/myboards" component={CreateBoardContainer} onEnter={onMyBoardEnter} />
         <Route path='/boards/:boardHash' component={BoardContainer} onEnter={onBoardEnter} />
       <Route path="/note">
         <IndexRoute component={CreateNoteContainer} />
         <Route path=":id" component={ViewNoteContainer} />
       </Route>
      </Route>
    </Router>
  );
}
