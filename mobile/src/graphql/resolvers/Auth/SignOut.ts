import { Auth } from "aws-amplify";
import { GET_AUTHENTICATION_STATUS } from "../../requests/Auth/GetAuthenticationStatus";

export const signOut = async (_, {}, { cache }) => {
  try {
    await Auth.signOut();
    console.log("signed out");
    cache.writeQuery({
      query: GET_AUTHENTICATION_STATUS,
      data: {
        coreData: { isAuthenticated: false, __typename: "CoreData" },
      },
    });
    console.log(cache.readQuery({ query: GET_AUTHENTICATION_STATUS }));
    console.log("deauthenticated");

    return null;
  } catch (e) {
    throw e;
  }
};
