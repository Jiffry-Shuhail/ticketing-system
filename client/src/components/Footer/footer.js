import React from "react";

// Material UI
import { withStyles } from "@material-ui/core/styles";
import { AppBar, Typography } from "@material-ui/core";

//---------------- Material UI custom styles
const styles = theme => ({
  footerToolbar: {
    width: "100%",
    textAlign: "center",
    fontSize: "1.2rem"
  },
  aLink: {
    textDecoration: "none",
    color: "#FFA441"
  }
});

const footer = props => {
  const { classes } = props;
  return (
    <div>
      <AppBar position="static" color="primary">
        <Typography color="inherit" className={classes.footerToolbar}>
          Copyright &copy; 2023{" "}
          <a href="https://jiffryshuhail.com/" className={classes.aLink}>
            Jiffry Shuhail
          </a>
          .
        </Typography>
      </AppBar>
    </div>
  );
};

export default withStyles(styles)(footer);
