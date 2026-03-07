import { Component } from "react";


class Me extends Component{

    constructor(props){
    super(props)
    this.state = {count: 1}
    }

    increment = () => {
        
        this.setState({count: this.state.count + 1})
    }
    dec = () => {
        if(this.state.count > 0){
        this.setState({count: this.state.count - 1})  
        }
    }

    render() {
        return(
        <>
        <div>hello {this.props.what} {this.state.count}</div>
        <button onClick={this.increment}>increment</button>
        <><button onClick={this.dec}>dec</button></>
        </>
    )
    }
}

export default Me