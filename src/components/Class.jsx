import { Component } from "react";


class Me extends Component{

    state = {count: 1}

    increment = () => {
        this.setState({count: this.state.count + 1})
    }

    render() {
        return(
        <>
        <div>hello {this.state.count}</div>
        <button onClick={this.increment}>increment</button>
        </>
    )
    }
}

export default Me