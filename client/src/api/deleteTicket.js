import axios from "axios";
import { HANDLE_ERROR } from "../actions/actions";

const deleteTicket = (dispatch, ticketID, userID, history) => {
  console.log("************************* "+ ticketID);
  axios
    .post(`/delete/${ticketID}`, { userID })
    .then(result => {
      // Refresh page on success
      console.log("+++++++++++++++++++++++++++++++");
      return window.location.reload();
    })
    .catch(error => {
      console.log(error)
      return dispatch({
        type: HANDLE_ERROR,
        message: error.response.data.message
      });
    });
};

export default { deleteTicket };
