const initialState = {
  mode: 'light'
};

const themeReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'TOGGLE_THEME':
      return {
        ...state,
        mode: action.payload
      };
    default:
      return state;
  }
};

export default themeReducer; 