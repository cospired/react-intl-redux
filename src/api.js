function api({ baseUrl }) {

  function fetchJson(url) {

    const request = {
      headers: {
        Accept: 'application/json'
      }
    };

    return fetch(url, request)
      .then( (response) => {

        if (response.status >= 200 && response.status < 300) {
          return response;
        }
        throw response;

      })
      .then( (response) => {

        // console.log('response', response);
        switch (response.status) {
          case 204:
            return null;
          default:
            return response;
        }
      })
      .catch( (response) => {

        const error = new Error(response.statusText);
        error.status = response.status;
        error.response = response;
        throw error;
      });
  }

  function getManifest() {

    const url = `${baseUrl}manifest.json`;

    return fetchJson(url);
  }

  function getLocale(locale) {

    const url = `${baseUrl}${locale}.json`;

    return fetchJson(url);
  }

  return {
    getLocale,
    getManifest
  };
}

export default api({ baseUrl: 'localhost:3000/assets/locales/' });
