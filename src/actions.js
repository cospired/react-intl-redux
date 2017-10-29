/*
 * Actions for Intl
 */
import { canUseDom } from 'exenv';

import api from './api';

export const IntlActionTypes = {
  SET_LOCALE: '@intl/SET_LOCALE',
  SET_AVAILABLE_LOCALES: '@intl/SET_AVAILABLE_LOCALES',
  EXTEND_LOCALE_MESSAGES: '@intl/EXTEND_LOCALE_MESSAGES'
};

function extendLocaleData(locale, messages) {

  return {
    type: IntlActionTypes.EXTEND_LOCALE_MESSAGES,
    locale,
    messages
  };
}

function getLocaleData(locale) {

  return (dispatch, _getState) =>

    api.getLocale(locale)
      .then( (response) => {

        if (response.status >= 200 && response.status < 400) {
          return response;
        }
        throw response;

      })
      .then( response => response.json() )
      .then( json =>

        dispatch({
          type: IntlActionTypes.EXTEND_LOCALE_MESSAGES,
          locale,
          messages: json
        }))
      .catch( (response) => {

        const error = new Error(response.statusText);
        error.status = response.status;
        throw error;
      });
}

function getLocalesManifest(params) {

  const { dispatch, state } = params;

  if (state.locales.length !== 0) {

    return params;
  }

  return api.getManifest()
    .then( response => response.json() )
    .then( (data) => {

      dispatch({
        type: 'SET_AVAILABLE_LOCALES',
        locales: data
      });

      return {
        ...params,
        state: {
          ...state,
          locales: data
        }
      };
    });
}

function degregateLocale(locale, locales) {

  if (locales.indexOf(locale) !== -1 || locale === '') {

    return locale;
  }

  const cleanLocale = locale.split('-').slice(0, -1).join('-');

  return degregateLocale(cleanLocale, locales);
}

function checkLocale(params) {

  const locale = params.newLocale.reduce( (result, loc) => result || degregateLocale(loc, params.state.locales), '');

  return {
    ...params,
    newLocale: locale || 'en'
  };
}

function getTranslations(params) {

  const { dispatch, newLocale } = params;

  return api.getLocale(newLocale)
    .then( response => response.json() )
    .then( (data) => {

      dispatch({
        type: IntlActionTypes.EXTEND_LOCALE_MESSAGES,
        locale: newLocale,
        messages: data
      });

      return params;
    });
}

function setLocale(locale) {

  const newLocale = [].concat(locale);

  return (dispatch, getState) => {

    const state = getState().intl;

    return Promise.resolve({
      dispatch, state, newLocale
    })
      .then(getLocalesManifest)
      .then(checkLocale)
      .then(getTranslations)
      .then(params =>

        dispatch({
          type: IntlActionTypes.SET_LOCALE,
          locale: params.newLocale
        }));
  };
}

function detectBrowserLocale() {

  if ( canUseDom ) {
    const locale = navigator ? navigator.languages : ['en'];

    return (dispatch, _getState) => {

      dispatch(setLocale(locale));
    };
  }

  return (dispatch, _getState) => {

    dispatch(setLocale('en'));
  };
}

export const Actions = {
  detectBrowserLocale,
  extendLocaleData,
  getLocaleData,
  setLocale
};
