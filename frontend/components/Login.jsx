import React, {Component} from 'react';
import {render} from 'react-dom';

import authService from '../services/auth.js';

const style = {
    fontFamily: 'source code pro, courier',
    fontSize: 16,
    fontWeight: 600,
    background: '#aabbcc',
    textAlign: 'left'
};


class Login extends Component {
    constructor (props) {
        super(props);

        this.state = { 
            username: '',
            password: ''
        };
    }

    updateValue (name, event) {
        let newState = {};
        newState[name] = event.target.value;
        this.setState(newState);
    }

    submitForm (event) {
        //perform validation here

        authService.login({
            username: this.state.username,
            password: this.state.password
        })
        .then( (result) => {
            console.log(`submitForm: ${result}`);
        })
        .catch( (error) => {
            console.log(`[error] submitForm: ${error}`);
        });

        event.preventDefault();
    }

    render () {
        return (
            <div style={style}>
                <h3>Login</h3>
                <input type="text" value={this.state.username} onChange={this.updateValue.bind(this, 'username')} /><br/>
                <input type="password" value={this.state.password} onChange={this.updateValue.bind(this, 'password')} /><br/>
                <input type="submit" onClick={this.submitForm.bind(this)} value="continue" />
            </div>
        );
    }
}


render(<Login />, document.getElementById('app'));
