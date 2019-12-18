import React from 'react';
import ReactDom from 'react-dom';
import './Modal.css';

const modalRoot = document.getElementById('modal-root');

class Modal extends React.Component {
   constructor(props) {
      super(props);
      this.container = document.createElement('div')
   }

   componentDidMount() {
      modalRoot.append(this.container);
   }

   componentWillUnmount() {
      modalRoot.removeChild(this.container);
   }

   render() {
      return ReactDom.createPortal(this.props.children, this.container);
   }
}

export default Modal;