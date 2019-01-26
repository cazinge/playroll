/**
 * LoginScreen
 */

import * as React from "react";
import {
  Text,
  View,
  Button,
  TextInput,
  Switch,
  SafeAreaView,
} from "react-native";
import { Auth } from "aws-amplify";
import { Query } from "react-apollo";
import { GET_AUTHENTICATION_STATUS } from "../../graphql/requests/Auth/GetAuthenticationStatus";

import { SIGN_IN_MUTATION, SignInMutation } from "../../graphql/requests/Auth";

export interface Props {
  onLoginPress?: () => void;
  onLogoutPress?: () => void;
  navigation: any;
}

interface State {
  username: string;
  password: string;
  showPassword: boolean;
  signedUp: boolean;
}

export default class LoginScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      username: "Mai",
      password: "Sakurajima123!",
      showPassword: true,
      signedUp: true,
    };
    this.toggleSwitch = this.toggleSwitch.bind(this);
    this.toggleSignUp = this.toggleSignUp.bind(this);
  }

  toggleSwitch() {
    this.setState({ showPassword: !this.state.showPassword });
  }

  toggleSignUp() {
    this.props.navigation.navigate("SignUp");
  }

  render() {
    return (
      <View style={{ backgroundColor: "white", flex: 2 }}>
        <Text>Log In</Text>
        <TextInput
          style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
          autoCapitalize="none"
          onChangeText={(username: string) => this.setState({ username })}
          value={this.state.username}
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TextInput
            secureTextEntry={this.state.showPassword}
            autoCapitalize="none"
            style={{
              flex: 4,
              height: 40,
              borderColor: "gray",
              borderWidth: 1,
            }}
            onChangeText={(password: string) => this.setState({ password })}
            value={this.state.password}
          />
          <Switch
            onValueChange={this.toggleSwitch}
            value={!this.state.showPassword}
          />
        </View>

        <Button
          title="Current info"
          onPress={() => {
            Auth.currentUserInfo().then(user => console.log(user));
          }}
        />
        <SignInMutation
          mutation={SIGN_IN_MUTATION}
          variables={{
            username: this.state.username,
            password: this.state.password,
          }}
        >
          {(signIn, { data }) => {
            return (
              <Button
                title="Sign In"
                onPress={() => {
                  signIn().then(() => this.props.navigation.navigate("App"));
                }}
              />
            );
          }}
        </SignInMutation>
        {/* <Button
          title="Don't have an account? Sign up here"
          onPress={this.toggleSignUp}
        /> */}
      </View>
    );
  }
}
