import axios from "axios";
import { HANDLE_ERROR } from "../actions/actions";

const editTicket = (
  dispatch,
  userID,
  ticketID,
  title,
  description,
  reason,
  priority,
  status,
  history
) => {
  axios
    .post(`/edit/${ticketID}`, {
      userID,
      title,
      description,
      reason,
      priority,
      status
    })
    .then(result => {
      // Redirect user to dashboard page after success
      return history.push("/dashboard");
    })
    .catch(error => {
      return dispatch({
        type: HANDLE_ERROR,
        message: error.response.data.message
      });
    });
};

export default { editTicket };
