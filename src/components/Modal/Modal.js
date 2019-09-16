import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import blue from "@material-ui/core/colors/blue";
import SingleDatePicker from "react-dates/lib/components/SingleDatePicker";
import moment from "moment";
import "moment/locale/en-gb";
import "moment/locale/fr";
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";

const styles = {
  avatar: {
    backgroundColor: blue[100],
    color: blue[600]
  }
};

class SimpleDialog extends React.Component {
  state = {
    focused: false,
    date: moment()
  };

  handleClose = () => {
    this.props.onClose();
  };

  render() {
    const { classes, onClose, ...other } = this.props;

    return (
      <Dialog
        onClose={this.handleClose}
        maxWidth={false}
        aria-labelledby="simple-dialog-title"
        {...other}
      >
        <DialogTitle id="simple-dialog-title">
          This popin is displaying a datepicker
        </DialogTitle>
        <DialogContent style={{ width: "700px", height: "400px" }}>
          <div>Date I learned to split my code:</div>
          <SingleDatePicker
            date={this.state.date}
            onDateChange={date => this.setState({ date })}
            focused={this.state.focused}
            onFocusChange={({ focused }) => this.setState({ focused })}
            id="your_unique_id"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="primary">
            Close popin
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(styles)(SimpleDialog);
