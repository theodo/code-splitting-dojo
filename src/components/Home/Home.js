import React, { Component, lazy, Suspense } from "react";
import Button from "@material-ui/core/Button";

const Modal = lazy(() => import("../Modal"));

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
          Just click me already
        </Button>
        <Suspense fallback={null}>
          <Modal open={this.state.open} onClose={this.handleClose} />
        </Suspense>
      </div>
    );
  }
}

export default Home;
