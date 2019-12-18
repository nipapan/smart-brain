import React from 'react';
import './Profile.css';

class Profile extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         name: this.props.user.name,
         age: this.props.user.age,
         pet: this.props.user.pet
      }
   }

   onFormChange = (event) => {
      switch (event.target.name) {
         case 'user-name':
            this.setState({name: event.target.value});
            break;

         case 'user-age':
            this.setState({age: event.target.value});
            break;

         case 'user-pet':
            this.setState({pet: event.target.value});
            break;

         default:
            return;
      }
   }

   onSubmitSaveProfile = (data) => {
      fetch(`http://localhost:3000/profile/${this.props.user.id}`, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            'Authorization': window.sessionStorage.getItem('token')
         },
         body: JSON.stringify({
            profileFormInput: data
         })
      })
      .then(res => {
         if(res.status === 401) {
            this.props.toggleModal();
            this.props.onRouteChange('signout');
         } else {
            this.props.toggleModal();
            this.props.loadUser(this.props.user.id);
         }
      })
   }

   render() {
      const {user, toggleModal} = this.props;
      const {name, age, pet} = this.state;
      return (
         <div className="profile-modal">
            <article className="br3 ba bg-white b--white mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
               <main className="pa2 black-80">
                  <div className="">
                     <div className="tc">
                        <img src="http://tachyons.io/img/avatar_1.jpg" className="br-100 h4 w-4 dib ba b--black-05 pa2"
                             title="Photo of a kitty staring at you" alt="profile" />
                        <h1 className="f3 mb2">{this.state.name}</h1>
                        <h2 className="f5 fw4 gray mt0">{`Image Submitted: ${user.entries}`}</h2>
                        <p className="f5 fw4 gray mt0">{`Member since: ${new Date(user.joined).toLocaleDateString()}`}</p>
                     </div>
                     <hr />
                     <fieldset id="profile-update" className="ba b--white ph0 mh0">
                        <div className="mt3">
                           <label className="db fw6 lh-copy f6" htmlFor="name">Name</label>
                           <input
                              onChange={this.onFormChange}
                              className="pa2 input-reset ba bg-white w-100"
                              type="text"
                              name="user-name"
                              id="name"
                              placeholder={this.state.name}
                           />
                        </div>
                        <div className="mt3">
                           <label className="db fw6 lh-copy f6" htmlFor="age">Age</label>
                           <input
                              onChange={this.onFormChange}
                              className="pa2 input-reset ba bg-white w-100"
                              type="text"
                              name="user-age"
                              id="age"
                              placeholder={this.state.age}
                           />
                        </div>
                        <div className="mt3">
                           <label className="db fw6 lh-copy f6" htmlFor="pet">Pet</label>
                           <input
                              onChange={this.onFormChange}
                              className="pa2 input-reset ba bg-white w-100"
                              type="text"
                              name="user-pet"
                              id="pet"
                              placeholder={this.state.pet}
                           />
                        </div>
                     </fieldset>
                     <div className="tc">
                        <input
                           className="b ph3 pv2 ma2 input-reset ba b--black bg-green f6 dib dim"
                           type="submit"
                           value="Save"
                           onClick={() => this.onSubmitSaveProfile({name, age, pet})}
                        />
                        <input
                           className="b ph3 pv2 ma2 input-reset ba b--black bg-red f6 dib dim"
                           type="submit"
                           value="Cancel"
                           onClick={toggleModal}
                        />
                     </div>
                  </div>
               </main>
            </article>
         </div>
      );
   }
}

export default Profile;