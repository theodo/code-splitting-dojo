import React, { Component } from "react";

class Random extends Component {
  render() {
    return <span>{parseInt(Math.random() * 100)}</span>;
  }
}

export default Random;
