export const initialState = {
  userToken: "",
  user: {},
};

const reducer = (state, action) => {
  switch (action.type) {
    case "GET_CURRENT_USER":
      return {
        ...state,
        userToken: action.item.userToken,
        user: action.item.user,
      };

    default:
      return {
        ...state,
      };
  }
};

export default reducer;
