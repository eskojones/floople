import React, {Component} from 'react';
import {render} from 'react-dom';
import dbService from '../services/db.js';
import DataCard from './DataCard.jsx';

const appStyle = {
    width: 800,
    //height: 600,
    padding: 10,
    overflow: 'none',
    fontFamily: 'source code pro, courier',
    fontSize: 16,
    fontWeight: 600,
    background: '#aabbcc',
    textAlign: 'left'
};


class App extends Component {
    constructor (props) {
        super(props);

        this.state = { 
            rows: []
        };

        dbService.select({
            model: 'users', 
            attributes: ['id','username','password','type'], 
            order:['id','desc'],
        })
        .then( (rows) => {
            this.setState({ rows: rows });
        });
    }

    render () {
        if (this.state.rows.length == 0) {
            return <div style={appStyle}>Loading...</div>;
        }

        console.log(this.state.rows);

        let mapUsers = this.state.rows.map( (user, idx) => {
            return <DataCard data={user} key={user.id}_card format={(k,v) => `${k}: ${v}`} />;
        });

        return (
            <div style={appStyle}>{mapUsers}</div>
        );
    }
}


render(<App />, document.getElementById('app'));
