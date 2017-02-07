import React from 'react';
import {Link} from 'react-router';

const Navbar = (props) => {
  return (
    <div>
    <nav className="navbar navbar navbar-static-top" role="navigation">
      <div className="container-fluid">
        <div className="navbar-header" id='navHeader' >
          <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar"
            aria-expanded={props.aria} aria-controls="navbar" onClick={() => { props.expandNav(); }}>
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
            <a className='navbar-brand' style={{float: 'right'}} href='/'>Notion</a>
              <button className="ion-gear-b navbarGearIcon" style={{fontSize: '2em', marginTop: '10px', paddingLeft: '10px'}} type='button' onClick={() => { props.toggleSidebar('sidebarToggle'); }}></button>
        </div>


          <div id='navbar' className={props.navClass} style={{float: 'right'}} aria-expanded={props.aria}>
            <ul className="nav navbar-nav" onClick={() => { props.expandNav(); }}>
              { !Object.keys(props.user).length ? (
                <li><Link to="/signup">Login/SignUp</Link></li>
              ) : (
                <li><Link onClick={() => { props.logoutUser(); }}>Logout</Link></li>
              )
              }
              <li><Link to="/myboards">My Boards</Link></li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
  );
};
export default Navbar;
