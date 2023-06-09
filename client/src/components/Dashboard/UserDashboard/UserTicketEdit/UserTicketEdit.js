// React
import React, { Component } from "react";
import getTicketApi from "../../../../api/getTicket";
import editTicketApi from "../../../../api/editTicket";

// Redux
import { connect } from "react-redux";

// Actions
import { RESET_STATE, TICKET_INPUT_CHANGED } from "../../../../actions/actions";

// Material-UI
import { Grid, Typography, Paper, TextField, Button,FormControl, Select, MenuItem, InputLabel} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

// Material UI custom styles
const styles = {
  paper: {
    marginTop: "17vh",
    textAlign: "center"
  },

  formWrapper: {
    padding: 20
  },

  form: {
    display: "flex",
    flexDirection: "column"
  },

  formButton: {
    width: "50%",
    margin: "20px auto 0px auto"
  }
};

class UserTicketEdit extends Component {
  componentWillMount = () => {
    // Get ticket data
    this.props.getTicket(this.props.userID, this.props.match.params.id);
  };

  componentDidUpdate = () => {
    // When ticket data loaded, check compare IDs for authorization
    this.props.userID !== this.props.ticketUserID &&
      this.props.history.push("/");
  };

  componentWillUnmount = () => {
    // On unmounting reset state
    this.props.resetState();
  };

  render() {
    const { classes } = this.props;
    return (
      <>
        <Grid container>
          <Grid item xs={1} sm={3} md={4} />
          <Grid item xs={10} sm={6} md={4}>
            <Paper className={classes.paper}>
              {/* WRAPPER FOR PADDING */}
              <div className={classes.formWrapper}>
                {/* FORM TITLE */}
                <Typography variant="h5">Edit ticket</Typography>

                {/* FORM */}
                <form
                  onSubmit={event =>
                    this.props.handleSubmit(
                      event,
                      this.props.userID,
                      this.props.ticketID,
                      this.props.ticketTitle,
                      this.props.ticketDescription,
                      this.props.ticketReason,
                      this.props.ticketPriority,
                      "edited",
                      this.props.history
                    )
                  }
                  className={classes.form}
                >
                  {/* TICKET TITLE */}
                  <TextField
                    required
                    id="title"
                    name="title"
                    label="Ticket title"
                    className={classes.textField}
                    margin="normal"
                    value={this.props.ticketTitle}
                    onChange={this.props.onInputChange}
                  />

                  {/* TICKET DESCRIPTION */}
                  <TextField
                    required
                    id="description"
                    name="description"
                    label="Ticket description"
                    multiline
                    rows="4"
                    margin="normal"
                    value={this.props.ticketDescription}
                    onChange={this.props.onInputChange}
                  />

                  {/* TICKET REASON */}
                  <TextField
                        required
                        id="reason"
                        name="reason"
                        label="Ticket Reason"
                        className={classes.textField}
                        value={this.props.ticketReason}
                        onChange={this.props.onInputChange}
                      />

                      <FormControl>
                        <InputLabel id="demo-simple-select-label">Ticket Priority</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="priority" 
                          name="priority"
                          required
                          value={this.props.ticketPriority} 
                          onChange={this.props.onInputChange}
                        >
                          <MenuItem value={1}>MIN</MenuItem>
                          <MenuItem value={2}>MID</MenuItem>
                          <MenuItem value={3}>MAX</MenuItem>
                        </Select>
                      </FormControl>

                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    className={classes.formButton}
                  >
                    Edit
                  </Button>
                </form>
              </div>
            </Paper>
          </Grid>
        </Grid>
        <Grid item xs={1} sm={3} md={4} />
      </>
    );
  }
}

const mapStateToProps = state => {
  console.log(state);
  return {
    // USER DATA
    userID: state.loggerReducer.userID,

    // TICKET DATA
    ticketID: state.ticketReducer.id,
    ticketUserID: state.ticketReducer.userID,
    ticketTitle: state.ticketReducer.title,
    ticketDescription: state.ticketReducer.description,
    ticketReason: state.ticketReducer.reason,
    ticketPriority: state.ticketReducer.priority,
    ticketCreationDate: state.ticketReducer.created
  };
};

const mapDispatchToProps = dispatch => {
  return {
    resetState: () => dispatch({ type: RESET_STATE }),
    onInputChange: event => {
      dispatch({
        type: TICKET_INPUT_CHANGED,
        name: event.target.name,
        value: event.target.value
      });
    },

    getTicket: (userID, ticketID) => {
      getTicketApi.getTicket(dispatch, userID, ticketID);
    },

    handleSubmit: (
      event,
      _userID,
      _ticketID,
      _title,
      _description,
      _reason,
      _priority,
      _status,
      _history
    ) => {
      event.preventDefault();

      dispatch({
        type: RESET_STATE
      });

      editTicketApi.editTicket(
        dispatch,
        _userID,
        _ticketID,
        _title,
        _description,
        _reason,
        _priority,
        _status,
        _history
      );
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(UserTicketEdit));
