import React, {Component} from 'react';
import {render} from 'react-dom';
import _ from 'lodash';

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
            password: '',
            status: ''
        };
    }

    updateValue (name, event) {
        let newState = {};
        newState[name] = event.target.value;
        this.setState(newState);
    }

    validateForm () {
        return this.state.username.length > 4 && this.state.password.length > 5;
    }

    submitForm (event) {
        event.preventDefault();

        if (!this.validateForm()) {
            this.setState({
                status: 'Please enter the required fields'
            });
            return;
        }

        let _this = this;

        authService.login({
            username: this.state.username,
            password: this.state.password
        })
        .then( (result) => {
            let status = _.get(result, 'status', '');
            let newState = {
                status: status
            };
            if (status !== 'Success') {
                //errorz
                console.log(status);
                newState = Object.assign({}, newState, {
                    username: '',
                    password: ''
                });
                _this.setState(newState);
            } else {
                //TODO: use react-redirect or similar
                window.location = '/app';
                return;
            }


        })
        .catch( (error) => {
            console.log(`[error] submitForm: ${error}`);
            _this.setState({
                status: 'An error occured, please try again later'
            });
        });
    }

    render () {
        return (
            <div style={style}>
                <h3>Login</h3>
                <div><em>{this.state.status}</em></div>
                <input type="text" value={this.state.username} onChange={this.updateValue.bind(this, 'username')} /><br/>
                <input type="password" value={this.state.password} onChange={this.updateValue.bind(this, 'password')} /><br/>
                <input type="submit" onClick={this.submitForm.bind(this)} value="continue" />
            </div>
        );
    }
}


render(<Login />, document.getElementById('app'));
