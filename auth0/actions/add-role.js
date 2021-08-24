const axios = require('axios');

/**
 * Handler that will be called during the execution of a PostLogin flow.
 *
 * @param {Event} event - Details about the user and the context in which they are logging in.
 * @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
 */
exports.onExecutePostLogin = async (event, api) => {
  const userId = event.user.user_metadata.userId;
  if (!userId) {
    return api.access.deny(`Access denied`);
  }
  try {
    const token = api.redirect.encodeToken({
      secret: event.secrets.TOKEN_SECRET,
      payload: {
        email: event.user.email,
        userId: event.user.user_metadata.userId,
      },
    });
    const { status, data } = await axios.get(`${event.secrets.API_URL}/users/auth`, {
      headers: {
        'x-session-token': token,
      },
    });
    if (status !== 200) {
      return api.access.deny(`Something went wrong!`);
    }
    console.log('User Detail retrieved', status);
    const { partOfMultipleOrgs, pendingInvites, orgs, roles, projects } = data;
    console.log('Part of Multiple Orgs', partOfMultipleOrgs);
    console.log('Has pending invites', pendingInvites);
    if (partOfMultipleOrgs || pendingInvites) {
      return api.redirect.sendUserTo(event.secrets.ORG_SELECT_REDIRECT, {
        query: { session_token: token },
      });
    }
    const namespace = event.secrets.CLAIM_NAMESPACE;
    if (event.authorization) {
      const org = orgs[0];
      const role = roles[org.id];
      api.accessToken.setCustomClaim(`${namespace}/role`, role);
      api.accessToken.setCustomClaim(`${namespace}/projects`, projects);
      api.accessToken.setCustomClaim(`${namespace}/org`, org);
      api.accessToken.setCustomClaim(`${namespace}/userId`, userId);
      api.accessToken.setCustomClaim(`${namespace}/email`, event.user.email);
      api.idToken.setCustomClaim(`${namespace}/role`, role);
      api.idToken.setCustomClaim(`${namespace}/projects`, projects);
      api.idToken.setCustomClaim(`${namespace}/org`, org);
      api.idToken.setCustomClaim(`${namespace}/userId`, userId);
    }
  } catch (e) {
    return api.access.deny(`Something went wrong`);
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
        org: orgId,
        userId: event.user.user_metadata.userId,
      },
    });
    const { status, data } = await axios.get(`${event.secrets.API_URL}/users/auth`, {
      headers: {
        'x-session-token': token,
      },
    });
    console.log('Project Response Status', status);
    if (status !== 200 || data == null) {
      return api.access.deny(`Something went wrong!`);
    }
    const { org, role, projects } = data;
    const namespace = event.secrets.CLAIM_NAMESPACE;
    if (event.authorization) {
      api.accessToken.setCustomClaim(`${namespace}/role`, role);
      api.accessToken.setCustomClaim(`${namespace}/projects`, projects);
      api.accessToken.setCustomClaim(`${namespace}/org`, org);
      api.accessToken.setCustomClaim(`${namespace}/userId`, userId);
      api.accessToken.setCustomClaim(`${namespace}/email`, event.user.email);
      api.idToken.setCustomClaim(`${namespace}/role`, role);
      api.idToken.setCustomClaim(`${namespace}/projects`, projects);
      api.idToken.setCustomClaim(`${namespace}/org`, org);
      api.idToken.setCustomClaim(`${namespace}/userId`, userId);
    }
  } catch (error) {
    return api.access.deny(`Something went wrong`);
  }
};
