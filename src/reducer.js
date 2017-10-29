import { IntlActionTypes } from './actions';


function initialState() {

  return {
    messages: {},
    locales: [],
    locale: 'en'
  };
}

function setLocale(state, action) {

  return {
    ...state,
    locale: action.locale
  };
}

function setAvailableLocales(state, action) {

  return {
    ...state,
    locales: action.locales
  };
}

function updateMessages(state, action) {

  const oldMessages = state.messages[action.locale] || {};

  return {
    ...state,
    messages: {
      ...state.messages,
      [action.locale]: {
        ...oldMessages,
        ...action.messages
      }
    }
  };
}

const handlers = {
  [IntlActionTypes.SET_LOCALE]: setLocale,
  [IntlActionTypes.SET_AVAILABLE_LOCALES]: setAvailableLocales,
  [IntlActionTypes.EXTEND_LOCALE_MESSAGES]: updateMessages
};

function IntlReducer(state = initialState(), action = {}) {

  const handler = handlers[action.type];
  if (handler) {
    return handler(state, action);
  }

  return state;
}

export default IntlReducer;
