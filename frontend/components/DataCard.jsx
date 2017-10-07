import React, {Component} from 'react';
import {render} from 'react-dom';
import _ from 'lodash';

const defaultCardStyle = {
    //width: '50%',
    padding: 5,
    backgroundColor: '#666666',
    fontFamily: 'source code pro, courier',
    fontSize: 16,
    fontWeight: 200,
    color: '#ffffff'
};


class DataCard extends Component {
    constructor (props) {
        super(props);

        this.state = {
            data: props.data,
            format: _.isNil(props.format) ? (k,v) => { return `${k}: ${v}`; } : props.format,
            style: _.isNil(props.style) ? {} : props.style,
            position: _.isNil(props.position) ? null : props.position
        };
    }

    onMouseEnter () {
        this.setState({
            style: Object.assign({}, this.state.style, {
                backgroundColor: '#000000'
            })
        });
    }

    onMouseLeave () {
        this.setState({
            style: Object.assign({}, this.state.style, {
                backgroundColor: defaultCardStyle.backgroundColor
            })
        });
    }

    render () {
        let cardStyle = Object.assign({}, defaultCardStyle, this.state.style);
        if (!_.isNil(this.state.position)) {
            cardStyle = Object.assign({}, cardStyle, {
                position: 'absolute',
                left: this.state.position.x,
                top: this.state.position.y
            });
        }

        let mapData = Object.keys(this.state.data).map( (property) => {
            let key = `dataCard_${property}`;
            let str = this.state.format(property, this.state.data[property]);
            return (
                <div key={key}>{str}</div>
            );
        });

        return (
            <div 
                key="dataCardContainer" 
                style={cardStyle} 
                onMouseEnter={this.onMouseEnter.bind(this)} 
                onMouseLeave={this.onMouseLeave.bind(this)}>
                {mapData}
            </div>
        )
    }
}


export default DataCard;
