const axios = require('axios');

/**
 * Handler that will be called during the execution of a PostLogin flow.
 *
 * @param {Event} event - Details about the user and the context in which they are logging in.
 * @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
 */
exports.onExecutePostLogin = async (event, api) => {
  const orgs = event.user.user_metadata?.orgs ? JSON.parse(event.user.user_metadata.orgs) : null;
  if (!orgs) {
    return api.access.deny(`Access denied`);
  }
  const hasMultipleOrgsAssociated = orgs?.length > 1;
  console.log('Has multiple orgs', hasMultipleOrgsAssociated);
  if (hasMultipleOrgsAssociated) {
    const token = api.redirect.encodeToken({
      secret: event.secrets.TOKEN_SECRET,
      payload: {
        email: event.user.email,
        id: event.user.app_metadata.userId,
        org: event.user.user_metadata.org,
        userId: event.user.user_metadata.userId,
      },
    });
    api.redirect.sendUserTo(event.secrets.ORG_SELECT_REDIRECT, {
      query: { session_token: token },
    });
  } else {
    try {
      console.log('Single org login flow....');
      const userId = event.user.user_metadata.userId;
      const orgs = JSON.parse(event.user.user_metadata.orgs);
      if (!orgs || orgs?.length === 0) {
        return api.access.deny(`Something went wrong!`);
      }
      console.log(userId, orgs);
      console.log(`API Endpoint`, event.secrets.API_URL);
      const token = api.redirect.encodeToken({
        secret: event.secrets.TOKEN_SECRET,
        payload: {
          email: event.user.email,
          id: event.user.app_metadata.userId,
          org: orgs[0],
          userId: event.user.user_metadata.userId,
        },
      });

      const roleResponse = await axios.get(`${event.secrets.API_URL}/users/${userId}/orgs/${orgs[0]}/permissions`, {
        headers: {
          'x-session-token': token,
        },
      });
      console.log('Role Response Data', roleResponse.data);

      const projectsResponse = await axios.get(`${event.secrets.API_URL}/users/${userId}/orgs/${orgs[0]}/projects`, {
        headers: {
          'x-session-token': token,
        },
      });
      console.log('Project Response Status', roleResponse.status);
      if (roleResponse.status !== 200) {
        return api.access.deny(`Something went wrong!`);
      }
      if (projectsResponse.status !== 200) {
        return api.access.deny(`Something went wrong!`);
      }
      const namespace = event.secrets.CLAIM_NAMESPACE;
      if (event.authorization) {
        api.idToken.setCustomClaim(`${namespace}/role`, roleResponse.data.role);
        api.accessToken.setCustomClaim(`${namespace}/role`, roleResponse.data.role);
        api.idToken.setCustomClaim(`${namespace}/projects`, roleResponse.data.projects);
        api.accessToken.setCustomClaim(`${namespace}/projects`, roleResponse.data.projects);
        api.idToken.setCustomClaim(`${namespace}/org`, orgs[0]);
        api.accessToken.setCustomClaim(`${namespace}/org`, orgs[0]);
        api.idToken.setCustomClaim(`${namespace}/userId`, event.user.user_metadata.userId);
        api.accessToken.setCustomClaim(`${namespace}/userId`, event.user.user_metadata.userId);
      }
    } catch (error) {
      console.error(error);
      return api.access.deny(`Something went wrong`);
    }
  }
};

/**
 * Handler that will be invoked when this action is resuming after an external redirect. If your
 * onExecutePostLogin function does not perform a redirect, this function can be safely ignored.
 *
 * @param {Event} event - Details about the user and the context in which they are logging in.
 * @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
 */
exports.onContinuePostLogin = async (event, api) => {
  try {
    const userId = event.user.user_metadata.userId;
    const orgId = event.request.query.orgId;
    if (!orgId) {
      return api.access.deny(`Something went wrong`);
    }
    const token = api.redirect.encodeToken({
      secret: event.secrets.TOKEN_SECRET,
      payload: {
        email: event.user.email,
        id: event.user.app_metadata.userId,
        org: event.user.user_metadata.org,
        userId: event.user.user_metadata.userId,
      },
    });
    const roleResponse = await axios.get(`${event.secrets.API_URL}/users/${userId}/orgs/${orgId}/permissions`, {
      headers: {
        'x-session-token': token,
      },
    });
    const projectsResponse = await axios.get(`${event.secrets.API_URL}/users/${userId}/orgs/${orgId}/projects`, {
      headers: {
        'x-session-token': token,
      },
    });
    if (roleResponse.status !== 200) {
      return api.access.deny(`Something went wrong!`);
    }
    if (projectsResponse.status !== 200) {
      return api.access.deny(`Something went wrong!`);
    }

    const namespace = event.secrets.CLAIM_NAMESPACE;
    if (event.authorization) {
      api.idToken.setCustomClaim(`${namespace}/role`, roleResponse.role);
      api.accessToken.setCustomClaim(`${namespace}/role`, roleResponse.role);
      api.idToken.setCustomClaim(`${namespace}/projects`, roleResponse.data.projects);
      api.accessToken.setCustomClaim(`${namespace}/projects`, roleResponse.data.projects);
      api.idToken.setCustomClaim(`${namespace}/org`, orgId);
      api.accessToken.setCustomClaim(`${namespace}/org`, orgId);
      api.idToken.setCustomClaim(`${namespace}/userId`, event.user.user_metadata.userId);
      api.accessToken.setCustomClaim(`${namespace}/userId`, event.user.user_metadata.userId);
    }
  } catch (error) {
    return api.access.deny(`Something went wrong`);
  }
};
