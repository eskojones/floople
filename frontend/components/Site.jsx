import React, {Component} from 'react';
import {render} from 'react-dom';

const style = {
    fontFamily: 'source code pro, courier',
    fontSize: 16,
    fontWeight: 600,
    background: '#aabbcc',
    textAlign: 'left'
};


class Site extends Component {
    constructor (props) {
        super(props);

        this.state = { 
        };
    }

    render () {
        return (
            <div style={style}>Site</div>
        );
    }
}


render(<Site />, document.getElementById('app'));
