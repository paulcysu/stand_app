import React, { Component } from 'react'
import { ReactMic } from 'react-mic';
import axios from 'axios';
import '../assets/css/microphone.css';
import Modal from 'react-modal';

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

class Microphone extends Component {
  constructor(props) {
    super(props);
    this.state = {
      record: false,
      modalIsOpen: false,
      audiofile: '',
      blobfile: '',
      recording: ''
    }

    this.startRecording = this.startRecording.bind(this);
    this.stopRecording = this.stopRecording.bind(this);
    // this.postRecording = this.postRecording.bind(this);
    // Modal binding

    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }
 
  startRecording(){
    this.setState({
      record: true
    });
  }
 
  stopRecording(){
    this.setState({
      record: false
    });
  }
 
  onData(recordedBlob) {
    console.log('chunk of real-time data is: ', recordedBlob);
  }
 
  //unable to add async because npm install components: old axios
  onStop(recordedBlob) {
    console.log('recordedBlob is: ', recordedBlob);

    // debugger;
    var blob = recordedBlob.blob;
    var audioFile = new File([blob], "music2.mp3", {
      type: "audio/mp3"
    });
    this.setState({
      audiofile: audioFile,
      blobfile: recordedBlob
    })

    var form = new FormData();
    form.set('audio', blob);
    form.set('id', 'mattkirby');
    var name = 'mikeyim';
    form.set('name', name);

    // let recording = {};
    // recording.audio_name = 'Audio Testing Name';
    // recording.audio_duration = recordedBlob.stopTime - recordedBlob.startTime
    // recording.user_id = 10;
    // console.log()

    // this.setState({
    //   recording: recording
    // })
    // {audio_name(strings), audio_duration('string'), user_id(number)}
  }

async postRecording (e){
  e.preventDefault();
  var form = new FormData();
  form.set('audio', this.state.audiofile);
  form.set('id', 'mattkirby');
  var name = 'mikeyim'
  console.log('form post on recording: ', form);
  console.log('postRecording: ', this.state.recording);

  // const resp = await axios.post('/api/stand_app.php', this.state.recording,{
  //   params: {
  //     action: 'add_item'
  //   }
  // })

  // const { errors, success } = resp.data;

  // if(!success){
  //     return this.setState({ 
  //       errors 
  //     });
  // }
  
  axios({
    method: 'post',
    url: '/api/stand_app.php?action=add_item',
    data: form, 
    config: { headers: {'Content-Type': 'multipart/form-data' }}   
  }).then(function(response) {
    console.log("Response", response);
  });
}

  // Modal methods
  openModal() {
    this.setState({modalIsOpen: true});
  }
 
  afterOpenModal() {
    // references are now sync'd and can be accessed.
    this.subtitle.style.color = '#f00';
  }
 
  closeModal() {
    this.setState({modalIsOpen: false});

  }
 
  render() {

    // console.log('AUDIO:', this.state.blobfile.blobURL);

    return (
      <div className='microphone'>
        <ReactMic
          record={this.state.record}
          className="sound-wave centered"
          onStop={this.onStop.bind(this)}
          strokeColor="#FFFFFF"
          backgroundColor="black"
        />
        <div className='record-controls text-center'>
          <button onClick={this.startRecording} type="button">
            <span className={!this.state.record ? 'fa-stack fa-2x' : 'd-none'}>
              <i className="far fa-circle fa-stack-2x"></i>
              <i className="fas fa-circle fa-stack-1x fa-inverse inner-record"></i>
            </span>
          </button>
          <button onClick={(event) => { this.stopRecording(); this.openModal()}}  type="button">
            <i className={!this.state.record ? 'd-none' : "far fa-stop-circle fa-4x"}></i>
          </button>
          <Modal
            isOpen={this.state.modalIsOpen}
            onAfterOpen={this.afterOpenModal}
            onRequestClose={this.closeModal}
            style={customStyles}
            contentLabel="Example Modal"
            ariaHideApp={false}
          >
 
          <h2 ref={subtitle => this.subtitle = subtitle}>Completed Recording</h2>
          {/* <button onClick={this.closeModal}>close</button> */}
          <form >
            <input placeholder = "Enter audio title here"/>
            <button>Audio Player (BLOB) file</button>
            <audio controls>
              <source src={this.state.blobfile.blobURL} type="audio/webm"/>
            </audio>
            <button><i className="fa fa-trash" aria-hidden="false"></i></button>
            <button  onClick={(e) => {this.postRecording(e)}}><i className="fas fa-sign-in-alt"></i></button>
          </form>
        </Modal>
        </div>
      </div>
    )
  }
}

export default Microphone;
