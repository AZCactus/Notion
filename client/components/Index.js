import React from 'react';
import {default as TouchBackend} from 'react-dnd-touch-backend';
import { DragDropContext } from 'react-dnd';
import SidebarContainer from '../containers/SidebarContainer';


import NavbarContainer from '../containers/NavbarContainer';

const Index = (props) => {
  return (
    <div>
      <NavbarContainer />
      <div >
        {/*<div className='col-lg-2'>
       <SidebarContainer />
        </div>*/}
        <div>
        {
          props.children && React.cloneElement(props.children, props)
        }
      </div>
    </div>
  </div>

  );
};

export default DragDropContext(TouchBackend({enableMouseEvents: true}))(Index);
