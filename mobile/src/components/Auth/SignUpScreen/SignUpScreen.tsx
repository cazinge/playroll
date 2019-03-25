/**
 * SignUpScreen
 */

import * as React from 'react';
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  SafeAreaView,
  Image,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { WebBrowser, ImagePicker, Permissions } from 'expo';
import { NavigationScreenProp } from 'react-navigation';
import { SignUpMutation } from '../../../graphql/requests/Auth';
import styles from './SignUpScreen.styles';
import NavigationService from '../../../services/NavigationService';

export interface Props {
  toggleSignUp?: () => void;
  navigation?: NavigationScreenProp<{}>;
}

interface State {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  avatar: {
    uri: string;
    source: string;
  };
  error?: string;
}

export default class SignUpScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      avatar: {
        uri:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/440px-User_icon_2.svg.png',
        source: '',
      },
      error: undefined,
    };
    this.renderError = this.renderError.bind(this);
    this.selectProfileImage = this.selectProfileImage.bind(this);
  }

  handleOpenTOSURL() {
    const url =
      'https://www.freeprivacypolicy.com/privacy/view/919ec0f8123830156075504b5da568d3';

    WebBrowser.openBrowserAsync(url);
  }

  validateInput(signUp) {
    if (
      this.state.username === '' ||
      this.state.email === '' ||
      this.state.password === '' ||
      this.state.confirmPassword === '' ||
      this.state.avatar.uri === ''
    ) {
      return this.setState(
        {
          error: 'All fields must have a value',
        },
        () => {
          setTimeout(() => {
            this.setState({ error: null });
          }, 3000);
        }
      );
    }
    if (this.state.password !== this.state.confirmPassword) {
      return this.setState(
        {
          password: '',
          confirmPassword: '',
          error: 'Passwords do not match!',
        },
        () => {
          setTimeout(() => {
            this.setState({ error: null });
          }, 3000);
        }
      );
    }
    signUp();
  }

  renderSegueToSignIn() {
    return (
      <TouchableOpacity
        style={styles.segueToSignInContainer}
        onPress={() => {
          NavigationService.goBack();
        }}
      >
        <Icon
          name='arrow-back'
          type='material'
          color='#6A0070'
          onPress={() => {
            NavigationService.goBack();
          }}
        />
        <Text style={styles.signInTitle}>Sign In</Text>
      </TouchableOpacity>
    );
  }

  selectProfileImage() {
    Permissions.askAsync(Permissions.CAMERA_ROLL)
      .then(async data => {
        console.log('Permissions.getAsync data', data);
        if (data.status === 'granted') {
          const image = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'Images',
            allowsEditing: true,
            base64: true,
          });
          console.log('image', image);
          this.setState({
            avatar: {
              uri: image.uri,
              source: image.base64,
            },
          });
        }
      })
      .catch(error => {
        console.log('selectProfileImage() error', error);
      });
  }

  renderHeader() {
    return (
      <View style={styles.signupHeader}>
        <View style={styles.signupTextContainer}>
          <Text style={styles.signupText}>Sign Up</Text>
        </View>
        <TouchableOpacity
          style={styles.imageSelectionContainer}
          onPress={this.selectProfileImage}
          disabled
        >
          <Image source={{ uri: this.state.avatar.uri }} style={styles.image} />
          <Text style={[styles.editPhotoText, { color: 'grey' }]}>
            Edit Photo
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  termsOfServiceLink() {
    return (
      <TouchableOpacity onPress={() => this.handleOpenTOSURL()}>
        <Text style={styles.tosLink}>
          By signing up, you are agreeing to our Terms of Service.
        </Text>
      </TouchableOpacity>
    );
  }

  renderSignupButton() {
    return (
      <SignUpMutation
        variables={{
          username: this.state.username,
          password: this.state.password,
          email: this.state.email,
          avatar: this.state.avatar.uri,
        }}
      >
        {(signUp, { loading, error, data }) => {
          if (data) {
            this.props.navigation.navigate('Confirmation');
          }
          return (
            <TouchableOpacity
              onPress={() => this.validateInput(signUp)}
              style={styles.submitButton}
            >
              {loading ? (
                <ActivityIndicator color={'white'} />
              ) : (
                <Text style={styles.submitButtonText}>Sign Up</Text>
              )}
            </TouchableOpacity>
          );
        }}
      </SignUpMutation>
    );
  }

  renderError() {
    return <Text style={styles.errorMessage}>{this.state.error}</Text>;
  }

  render() {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}
      >
        <SafeAreaView style={styles.mainContainer}>
          <View style={styles.container}>
            {this.renderSegueToSignIn()}
            {this.renderHeader()}
            <Text style={styles.formText}>Username</Text>
            <TextInput
              placeholder='Username'
              autoCapitalize='none'
              style={styles.inputContainer}
              onChangeText={(username: string) => this.setState({ username })}
              value={this.state.username}
            />
            <Text style={styles.formText}>Email</Text>
            <TextInput
              placeholder='Email'
              style={styles.inputContainer}
              onChangeText={(email: string) => this.setState({ email })}
              autoCapitalize={'none'}
              value={this.state.email}
            />
            <Text style={styles.formText}>Password</Text>
            <TextInput
              placeholder='Password'
              style={styles.inputContainer}
              onChangeText={(password: string) => this.setState({ password })}
              secureTextEntry={true}
              value={this.state.password}
            />
            <Text style={styles.formText}>Confirm Password</Text>
            <TextInput
              placeholder='Confirm Password'
              style={styles.inputContainer}
              onChangeText={(confirmPassword: string) =>
                this.setState({ confirmPassword })
              }
              secureTextEntry={true}
              value={this.state.confirmPassword}
            />
            {this.termsOfServiceLink()}
            {this.renderError()}
          </View>
          {this.renderSignupButton()}
        </SafeAreaView>
      </TouchableWithoutFeedback>
    );
  }
}
