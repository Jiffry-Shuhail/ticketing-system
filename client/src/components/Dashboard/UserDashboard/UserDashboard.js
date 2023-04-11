// React
import React, { Component } from "react";
import PropTypes from "prop-types";

// Redux
import { connect } from "react-redux";

// API
import createTicketApi from "../../../api/createTicket";
import getUserTicketsApi from "../../../api/getUserTickets";
import deleteTicketApi from "../../../api/deleteTicket";

// Actions
import {
  RESET_STATE,
  TICKET_INPUT_CHANGED,
  TICKET_DIALOG_OPEN
} from "../../../actions/actions";

// Material-UI
import {
  AppBar,
  Tabs,
  Tab,
  Button,
  Typography,
  Divider,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  ExpansionPanelActions,
  Paper,
  FormControl, Select, MenuItem, InputLabel,
  TextField,
  Grid,
  Dialog,
  DialogTitle,
  DialogActions
} from "@material-ui/core";
import AnnoucementIcon from "@material-ui/icons/Announcement";
import AddIcon from "@material-ui/icons/AddCircle";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { withStyles } from "@material-ui/core/styles";

// Expansion tab container
function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired
};

// Material UI custom styles
const styles = {
  heading: {
    flexBasis: "33.33%",
    flexShrink: 0,
    fontSize: 18
  },

  secondaryHeading: {
    fontSize: 18
  },

  expansionBar: {
    overflow: "hidden",
    margin: "1vh 0"
  },

  expansionPanelDetails: {
    flexDirection: "column",
    backgroundColor: "#fff"
  },

  expansionPanelActions: {
    backgroundColor: "#fff"
  },

  ticketDate: {
    padding: "1vh 0",
    fontSize: 17
  },

  ticketStatus: {
    padding: "1vh 0",
    fontSize: 17
  },

  ticketBody: {
    padding: "2vh 0 0 0"
  },

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

class UserDashboard extends Component {
  state = {
    expanded: null,
    activeTab: 0
  };

  componentWillMount = () => {
    // Check if user is authorized
    if (this.props.userRole !== "admin") this.props.history.push("/");
  };

  componentDidMount = () => {
    // Get user tickets array
    this.props.userTickets.length === 0 &&
      this.props.getTickets(this.props.userID);
  };

  componentWillUnmount = () => {
    // On unmounting reset state
    this.props.resetState();
  };

  // Active tab change
  handleActiveChange = (event, activeTab) => {
    this.setState({ activeTab });
  };

  // Tab expanded panel change
  handleChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false
    });
  };

  // Handle new ticket form submit
  handleSubmit = event => {
    event.preventDefault();
  };

  render() {
    const { classes } = this.props;
    const { activeTab, expanded } = this.state;

    return (
      <>
        {/* ---------- APP BAR, TABS ---------- */}
        <AppBar position="static" color="default">
          <Tabs
            value={activeTab}
            onChange={this.handleActiveChange}
            indicatorColor="primary"
            textColor="primary"
            centered={true}
            scrollButtons="off"
          >
            <Tab label="My tickets" icon={<AnnoucementIcon />} />
            <Tab label="New ticket" icon={<AddIcon />} />
          </Tabs>
        </AppBar>

        {/* "MY TICKETS" TAB  */}
        {activeTab === 0 && (
          <TabContainer>
            {this.props.userTickets.map(ticket => {
              return (
                // UNIQUE KEY
                <div key={ticket.ticketID}>
                  {/* PANEL START */}
                  <ExpansionPanel
                    expanded={expanded === ticket.ticketID}
                    onChange={this.handleChange(ticket.ticketID)}
                    className={classes.expansionBar}
                  >
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                      {/* TICKET ID */}
                      <Typography className={classes.heading}>
                        #{ticket.ticketID}
                      </Typography>

                      {/* TICKET TITLE */}
                      <Typography className={classes.secondaryHeading}>
                        {ticket.title}
                      </Typography>
                    </ExpansionPanelSummary>

                    {/* PANEL DETAILS */}
                    <ExpansionPanelDetails
                      className={classes.expansionPanelDetails}
                    >
                      {/* PANEL DIVIDER */}
                      <Divider />

                      {/* DATE OF CREATION/EDITION 'dd-mm-yyyy' */}
                      <Typography className={classes.ticketDate}>
                        <span style={{ color: "blue" }}>Date: </span>
                        {ticket.dateOfCreation
                          .split("T")[0]
                          .split("-")
                          .reverse()
                          .join("-")}
                      </Typography>

                      {/* DESCRIPTION */}
                      <Typography className={classes.ticketStatus}>
                        <span style={{ color: "blue" }}> Description: </span>{" "}
                        {ticket.description}
                      </Typography>

                      {/* REASON */}
                      <Typography className={classes.ticketStatus}>
                        <span style={{ color: "blue" }}> Reason: </span>{" "}
                        {ticket.reason}
                      </Typography>

                      {/* STATUS */}
                      <Typography className={classes.ticketStatus}>
                        <span style={{ color: "#00ad0e" }}>Priority: </span>
                        {ticket.priority === "1"
                          ? "MIN"
                          : (ticket.priority === "2" ? "MID" : "MAX")}
                      </Typography>

                    </ExpansionPanelDetails>

                    {/* PANEL DIVIDER */}
                    <Divider />

                    {/* PANEL BUTTONS */}
                    <ExpansionPanelActions
                      className={classes.expansionPanelActions}
                    >
                      {/* EDIT BUTTON */}
                      <Button
                        size="small"
                        color="primary"
                        onClick={() =>
                          this.props.history.push(`/edit/${ticket.ticketID}`)
                        }
                      >
                        Edit
                      </Button>

                      {/* DELETE TICKET DIALOG BUTTON */}
                      <Button
                        size="small"
                        onClick={() =>
                          this.props.handleDialogOpen(ticket.ticketID)
                        }
                      >
                        {/* DIALOG */}
                        <Dialog
                          open={ticket.dialogOpen}
                          onClose={() =>
                            this.props.handleDialogOpen(ticket.ticketID)
                          }
                          aria-labelledby="alert-dialog-title"
                          aria-describedby="alert-dialog-description"
                        >
                          {/* DIALOG TITLE */}
                          <DialogTitle id="alert-dialog-title">
                            {"Are you sure you want to delete this ticket?"}
                          </DialogTitle>

                          {/* BUTTON ACTIONS */}
                          <DialogActions>
                            {/* AGREE BUTTON */}
                            <Button
                              onClick={() =>
                                this.props.deleteTicket(
                                  ticket.ticketID,
                                  this.props.userID,
                                  this.props.history
                                )
                              }
                              color="primary"
                              autoFocus
                            >
                              Agree
                            </Button>

                            {/* Disagree button */}
                            <Button color="primary">Disagree</Button>
                          </DialogActions>
                        </Dialog>
                        Delete
                      </Button>
                    </ExpansionPanelActions>
                  </ExpansionPanel>
                </div>
              );
            })}
          </TabContainer>
        )}

        {/* CREATE NEW TICKET TAB */}
        {activeTab === 1 && (
          <TabContainer>
            <Grid container>
              <Grid item xs={1} sm={3} md={4} />
              <Grid item xs={10} sm={6} md={4}>
                <Paper className={classes.paper}>
                  {/* WRAPPER FOR PADDING */}
                  <div className={classes.formWrapper}>
                    {/* FORM TITLE */}
                    <Typography variant="h5">Create new ticket</Typography>

                    {/* FORM */}
                    <form
                      onSubmit={event =>
                        this.props.handleSubmit(
                          event,
                          this.props.userID,
                          this.props.ticketTitle,
                          this.props.ticketDescription,
                          this.props.ticketReason,
                          this.props.ticketPriority,
                          this.props.ticketCreationDate,
                          "new",
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
                        label="Project description"
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
                          defaultValue="2"
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
                        Send
                      </Button>
                    </form>
                  </div>
                </Paper>
              </Grid>
            </Grid>
            <Grid item xs={1} sm={3} md={4} />
          </TabContainer>
        )}
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    // USER ROLE
    userRole: state.loggerReducer.role,

    // VARIABLES FOR NEW TICKET SUBMISSION
    ticketTitle: state.ticketReducer.title,
    ticketDescription: state.ticketReducer.description,
    ticketReason: state.ticketReducer.reason,
    ticketPriority: state.ticketReducer.priority,
    ticketCreationDate: state.ticketReducer.created,
    userID: state.loggerReducer.userID,

    // ARRAY OF USER TICKETS
    userTickets: state.ticketReducer.userTickets
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

    // NEW TICKET SUBMISSION
    handleSubmit: (
      event,
      _userID,
      _title,
      _description,
      _reason,
      _priority,
      _dateOfCreation,
      _status,
      _history
    ) => {

      dispatch({
        type: RESET_STATE
      });

      event.preventDefault();

      createTicketApi.createTicket(
        dispatch,
        _userID,
        _title,
        _description,
        _reason,
        _priority,
        _dateOfCreation,
        _status,
        _history
      );
    },

    getTickets: userID => {
      return getUserTicketsApi.getUserTickets(dispatch, userID);
    },

    handleDialogOpen: ticketID => {
      return dispatch({ type: TICKET_DIALOG_OPEN, ticketID });
    },

    deleteTicket: (ticketID, userID, history) => {
      return deleteTicketApi.deleteTicket(dispatch, ticketID, userID, history);
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(UserDashboard));
