import { render } from '@testing-library/react';
import React from 'react';

class testImplementation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {value: ''};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
        console.log(event.target.value);
    }

    handleClick(event) {
        window.api.button();
        //alert('Clicked button' + event.target.value);
    }

    handleSubmit = async(event) => {
        event.preventDefault();
        const profileInfo = await window.api.submit({name: this.state.value});
        alert('A name was submitted: ' + this.state.value);
    }

    handleClipboard = async(event) => {
        event.preventDefault();
        const sendData = await window.api.clipboard({clipboard: 'ANY VALUE HERE'});
    }


    render() {
        return (
            <form onSubmit={this.handleSubmit}>        
                <label>
                    Name:
                    <input type="text" value={this.state.value} onChange={this.handleChange} />        
                </label>
                <br />
                <button type="button" value='test' onClick={this.handleClick}> Test Button</button>
                <br />
                <input type="submit" value="Submit" />
            </form>
        );
    }
}




export default testImplementation;