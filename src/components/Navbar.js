// Frameworks
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

// Actions
import * as AppActions from '../actions/AppActions'

import { Connect, SimpleSigner } from 'uport-connect'
const uport = new Connect('CryptoX', {
  clientId: '0xe2fef711a5988fbe84b806d4817197f033dde050',
  signer: SimpleSigner('4894506ba6ed1a2d21cb11331620784ad1ff9adf1676dc2720de5435dcf76ac2')
})

class Navbar extends Component {

  constructor (props) {
    super(props)
    this.signInbtnClick = this.signInbtnClick.bind(this)
    this.credentialsbtnClick = this.credentialsbtnClick.bind(this)
  }

  signInbtnClick () {
    console.log(uport)
    uport
      .requestCredentials({requested: ['name', 'phone', 'country'], notifications: true})
      .then((credentials) => {
        this.props.actions.connectUport(credentials)
        console.log(this.props, this.state)
      })
  }

  credentialsbtnClick () {
    // TODO when uport-connect is updated the following line should be all thats necessary
    // uport.attestCredentials({sub: this.props.uport.address, claim: {name: this.props.uport.name}, exp: new Date().getTime() + 2592000000}) // 30days
    uport.credentials.attest({sub: this.props.uport.address, claim: {name: this.props.uport.name}, exp: new Date().getTime() + 2592000000}).then(attestation => {
      uport.credentials.push(this.props.uport.pushToken, {url:`me.uport:add?attestations=${encodeURIComponent(attestation)}`})
    })
  }

  render () {
    return (
      <nav className='navbar navbar-toggleable-md navbar-inverse d-flex flex-row'>
        <a className='navbar-brand p-2' href='#'><h3>Crypto-X</h3></a>
        <div
          id='navbarsExampleDefault'
          className='collapse navbar-collapse d-flex flex-row ml-auto p-2'
          style={{padding: '0 !important'}}>
          {
            !this.props.uport
              ? (
                <button
                  style={{cursor: 'pointer'}}
                  onClick={() => this.signInbtnClick()}
                  className='btn btn-primary btn-md ml-auto p-2'>SIGN IN</button>
              )
              : (
                <div>
                  <button className='btn btn-primary btn-sm ml-auto p-2'
                    onClick={() => this.credentialsbtnClick()}
                    style={{
                      display: 'inline-block',
                      'verticalAlign': 'middle',
                      cursor: 'pointer',
                      marginRight: '10px'
                    }}>
                      GET CREDENTIALS
                    </button>
                  <div style={{
                    display: 'inline-block',
                    'verticalAlign': 'bottom'}}>
                    <span style={{
                      display: 'block',
                      textAlign: 'right'
                    }}>{this.props.uport.name}</span>
                    <span style={{
                      display: 'block',
                      textAlign: 'right',
                      'fontSize': '12px'}}>
                      {
                        `${
                          this.props.uport.address.slice(0, 6)
                        } ...
                        ${
                          this.props.uport.address.slice(this.props.uport.address.length - 6)
                        }`
                      }
                    </span>
                  </div>
                  <span>&nbsp;&nbsp;</span>
                  {this.props.uport.image
                   ? <img
                    style={{
                      display: 'inline-block',
                      borderRadius: '50%',
                      width: '50px',
                      height: '50px',
                      border: '2px solid white'
                    }}
                    alt='user-img'
                    src={
                      'https://ipfs.infura.io' +
                      this.props.uport.image.contentUrl} />
                  : null }

                </div>
              )
          }
        </div>
      </nav>
    )
  }
}

function mapStateToProps (state, props) {
  return {
    uport: state.App.uport
  }
}
function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(AppActions, dispatch)
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Navbar)