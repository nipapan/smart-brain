import React, { useState } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import './ProfileIcon.css';

const ProfileIcon = (props) => {
   const [dropdownOpen, setDropdownOpen] = useState(false);
   const toggle = () => setDropdownOpen(prevState => !prevState);

   const onSignOut = () => {
      fetch('http://localhost:3000/signout', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            'Authorization': window.sessionStorage.getItem('token')
         }
      })
         .then(res => {
            console.log(res.json());
            window.sessionStorage.clear();
            props.onRouteChange('signout');
         })
   }

   return (
      <div className="tc pa4">
         <Dropdown isOpen={dropdownOpen} toggle={toggle}>
            <DropdownToggle nav tag="span" data-toggle="dropdown" aria-expanded={dropdownOpen}>
               <img
                  src="http://tachyons.io/img/avatar_1.jpg"
                  className="br-100 ba h3 w3 dib"
                  alt="avatar" />
            </DropdownToggle>
            <DropdownMenu
               right
               className="shadow-5"
               style={{backgroundColor: 'rgba(255,255,255,0.5)'}}
            >
               <DropdownItem onClick={props.toggleModal}>View Profile</DropdownItem>
               <DropdownItem onClick={onSignOut}>Sign out</DropdownItem>
            </DropdownMenu>
         </Dropdown>
      </div>
   );
}

export default ProfileIcon;