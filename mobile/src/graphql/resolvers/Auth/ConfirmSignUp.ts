import { Auth } from 'aws-amplify';

export const confirmSignUp = async (_, { username, code }) => {
  try {
    const confirmSignUpData = await Auth.confirmSignUp(username, code, {
      forceAliasCreation: true,
    });
    return confirmSignUpData;
  } catch (e) {
    console.log(e);
    throw e;
  }
};
