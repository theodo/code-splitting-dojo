import React, { Component } from "react";
import Modal from "../Modal";
import Button from "@material-ui/core/Button";

class Home extends Component {
  state = {
    open: false
  };

  handleClickOpen = () => {
    this.setState({
      open: true
    });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    return (
      <div>
        <h1>This page is displaying a popin</h1>
        <Button
          variant="outlined"
          color="primary"
          onClick={this.handleClickOpen}
        >
          Choose a date
        </Button>
        <Modal open={this.state.open} onClose={this.handleClose} />
      </div>
    );
  }
}

export default Home;
