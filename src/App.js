import React, { Component } from 'react';
import Particles from 'react-particles-js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Modal from './components/Modal/Modal';
import Profile from './components/Profile/Profile';
import './App.css';

const particlesOptions = {
   particles: {
      number: {
         value: 30,
         density: {
            enable: true,
            value_area: 800
         }
      }
   }
}

const initialState = {
   input: '',
   imageUrl: '',
   boxes: [],
   route: 'signin',
   isSignedIn: false,
   isProfileOpen: false,
   user: {
      id: '',
      name: '',
      email: '',
      entries: 0,
      joined: '',
      pet: '',
      age: 0
   }
}

class App extends Component {
   constructor() {
      super();
      this.state = initialState;
   }

   componentDidMount() {
      const token = window.sessionStorage.getItem('token');
      if (token) {
         fetch('http://localhost:3000/signin', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               'Authorization': token
            }
         })
         .then(response => response.json())
         .then(data => {
            if(data && data.id) {
               this.loadUser(data.id);
               this.onRouteChange('home');
            }
         })
         .catch(console.log)
      }
   }

   loadUser = (id) => {
      fetch(`http://localhost:3000/profile/${id}`, {
         method: 'GET',
         headers: {
            'Content-Type': 'application/json',
            'Authorization': window.sessionStorage.getItem('token')
         }
      })
      .then(res => res.json())
      .then( data => { this.setState({user: data})} )
      .catch(err => { console.log(err); })
   }

   calculateFaceLocation = (data) => {
      const boxes = [];
      const image = document.getElementById('inputimage');
      const width = Number(image.width);
      const height = Number(image.height);
      for (let i = 0; i < data.outputs[0].data.regions.length; i++) {
         const clarifaiFace = data.outputs[0].data.regions[i].region_info.bounding_box;
         const box = {
            leftCol: clarifaiFace.left_col * width,
            topRow: clarifaiFace.top_row * height,
            rightCol: width - (clarifaiFace.right_col * width),
            bottomRow: height - (clarifaiFace.bottom_row * height)
         }
         boxes.push(box);
      }
      return boxes;
   }

   displayFaceBox = (boxes) => {
      this.setState({boxes: boxes});
   }

   onInputChange = (event) => {
      this.setState({input: event.target.value});
   }

   onButtonSubmit = () => {
      this.setState({imageUrl: this.state.input});
      fetch('http://localhost:3000/imageurl', {
         method: 'post',
         headers: {
            'Content-Type': 'application/json',
            'Authorization': window.sessionStorage.getItem('token')
         },
         body: JSON.stringify({
            input: this.state.input
         })
      })
      .then(response => {
         if(response.status === 401) {
            this.onRouteChange('signout')
         }
         return response.json();
      })
      .then(data => {
         if (data) {
            fetch('http://localhost:3000/image', {
               method: 'put',
               headers: {
                  'Content-Type': 'application/json',
                  'Authorization': window.sessionStorage.getItem('token')
               },
               body: JSON.stringify({
                  id: this.state.user.id
               })
            })
            .then(response => response.json())
            .then(count => {
               this.setState(Object.assign(this.state.user, { entries: count}))
            })
            .catch(console.log)
         }
         this.displayFaceBox(this.calculateFaceLocation(data))
      })
      .catch(err => console.log(err));
   }

   onRouteChange = (route) => {
      if (route === 'signout') {
         return this.setState(initialState)
      } else if (route === 'home') {
         this.setState({isSignedIn: true})
      }
      this.setState({route: route});
   }

   toggleModal = () => {
      this.setState(prevState => ({
         ...prevState,
         isProfileOpen: !prevState.isProfileOpen
      }))
   }

   render() {
      const { isSignedIn, imageUrl, route, boxes, isProfileOpen, user } = this.state;
      return (
         <div className="App">
            <Particles className='particles'
                       params={particlesOptions}
            />
            <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} toggleModal={this.toggleModal}/>
            { isProfileOpen &&
               <Modal>
                  <Profile
                     isProfileOpen={isProfileOpen}
                     toggleModal={this.toggleModal}
                     user={user}
                     loadUser={this.loadUser}
                     onRouteChange={this.onRouteChange}
                  />
               </Modal>
            }
            { route === 'home'
               ? <div>
                  <Logo />
                  <Rank
                     name={this.state.user.name}
                     entries={this.state.user.entries}
                  />
                  <ImageLinkForm
                     onInputChange={this.onInputChange}
                     onButtonSubmit={this.onButtonSubmit}
                  />
                  <FaceRecognition boxes={boxes} imageUrl={imageUrl} />
               </div>
               : (
                  route === 'signin'
                     ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
                     : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
               )
            }
         </div>
      );
   }
}

export default App;
