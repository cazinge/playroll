/**
 * AccountScreen
 */

import * as React from 'react';
import { Text, View, SafeAreaView, Image } from 'react-native';

import styles from './AccountScreen.styles';
import { SignOutMutation } from '../../../graphql/requests/Auth';
import { GetCurrentUserQuery } from '../../../graphql/requests/User';
import {
  NavigationScreenProp,
  StackActions,
  NavigationActions,
} from 'react-navigation';
import NavigationService from '../../../services/NavigationService';
import SubScreenContainer from '../../shared/Containers/SubScreenContainer';
import { Button } from 'react-native-elements';

export interface Props {
  navigation?: NavigationScreenProp<{}>;
}

interface State {}

export default class AccountScreen extends React.Component<Props, State> {
  render() {
    return (
      <GetCurrentUserQuery>
        {({ loading, error, data }) => {
          if (loading || error || Object.keys(data).length === 0) {
            return <SubScreenContainer title='My Account' modal />;
          }
          const currentUser = (data && data.private.currentUser) || {};
          return (
            <SubScreenContainer title='My Account' modal>
              <View style={{ alignItems: 'center' }}>
                <View style={{ alignItems: 'center', marginVertical: 20 }}>
                  <Image
                    source={{
                      uri: currentUser.avatar,
                    }}
                    style={{ height: 100, width: 100, borderRadius: 5 }}
                  />
                  <Text
                    style={{
                      fontWeight: 'bold',
                      fontSize: 20,
                      color: '#993399',
                    }}
                  >
                    {currentUser.name}
                  </Text>
                </View>
                <Button
                  style={{ marginVertical: 3 }}
                  title='Connect Spotify'
                  onPress={() => {
                    NavigationService.navigate('ConnectSpotify');
                  }}
                />
                <Button
                  style={{ marginVertical: 3 }}
                  title='My Public Profile'
                  onPress={() => {
                    NavigationService.navigate('ViewProfile');
                  }}
                  disabled
                />
                <Button
                  style={{ marginVertical: 3 }}
                  title='My Friends'
                  onPress={() => {
                    NavigationService.navigate('FriendsMenu');
                  }}
                  disabled
                />
                <Button
                  style={{ marginVertical: 3 }}
                  title='Edit Profile'
                  onPress={() => {
                    NavigationService.navigate('EditProfile');
                  }}
                  disabled
                />
                <Button
                  style={{ marginVertical: 3 }}
                  title='Settings'
                  onPress={() => {
                    NavigationService.navigate('Settings');
                  }}
                  disabled
                />
                <SignOutMutation>
                  {signOut => {
                    return (
                      <Button
                        style={{ marginVertical: 50 }}
                        title='Sign Out'
                        onPress={() => {
                          signOut().then(
                            () =>
                              this.props.navigation &&
                              this.props.navigation.dispatch(
                                StackActions.reset({
                                  key: null,
                                  index: 0,
                                  actions: [
                                    NavigationActions.navigate({
                                      routeName: 'Auth',
                                    }),
                                  ],
                                })
                              )
                          );
                        }}
                      />
                    );
                  }}
                </SignOutMutation>
              </View>
            </SubScreenContainer>
          );
        }}
      </GetCurrentUserQuery>
    );
  }
}
