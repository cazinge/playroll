/**
 * Application component for Playroll mobile application.
 */

import React from 'react';
import { Text, View, ActivityIndicator } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';

import NavigationService from '../../../services/NavigationService';

import {
  ListCurrentUserPlayrollsQuery,
  CreatePlayrollMutation,
} from '../../../graphql/requests/Playroll/';

import PlayrollCard from '../../shared/Cards/PlayrollCard';
import SubScreenHeader from '../../shared/Headers/SubScreenHeader';
import SubScreenContainer from '../../shared/Containers/SubScreenContainer';
import { Playroll } from '../../../graphql/types';
import Icons from '../../../themes/Icons';
import { LIST_CURRENT_USER_PLAYROLLS } from '../../../graphql/requests/Playroll/ListCurrentUserPlayrollsQuery';
import { Button } from 'react-native-elements';

import styles from './BrowsePlayrollsScreen.styles';

export interface Props {
  navigation?: NavigationScreenProp<{}>;
}

interface State {
  addPlayrollName: string;
}

export default class BrowsePlayrollsScreen extends React.Component<
  Props,
  State
> {
  constructor(props: Props) {
    super(props);
    this.state = {
      addPlayrollName: '',
    };
    this.renderHeader = this.renderHeader.bind(this);
  }

  render() {
    const extractPlayrolls = data => {
      if (
        Object.keys(data).length === 0 ||
        Object.keys(data.private).length === 0
      ) {
        return [];
      }
      return data.private.listCurrentUserPlayrolls;
    };
    return (
      <ListCurrentUserPlayrollsQuery>
        {({ loading, error, data }) => {
          const playrolls = extractPlayrolls(data);
          const success = !loading && !error;
          return (
            <View
              style={{
                flex: 1,
                // TODO(ianlizzo): Fix this pls
                // marginBottom: 30,
              }}
            >
              <SubScreenContainer
                renderHeader={this.renderHeader}
                flatList={success}
                data={playrolls}
                keyExtractor={item => item.id}
                renderItem={({ item }) => {
                  const playroll = item as Playroll;
                  return (
                    <PlayrollCard
                      playroll={playroll}
                      editPlayroll={() =>
                        this.props.navigation &&
                        this.props.navigation.navigate('ViewPlayroll', {
                          managePlayroll: 'View Playroll',
                          playroll,
                        })
                      }
                      key={playroll.id}
                    />
                  );
                }}
              >
                {loading && (
                  <ActivityIndicator
                    color={'gray'}
                    style={{ paddingTop: 50 }}
                  />
                )}
                {error && (
                  <Text style={{ paddingTop: 50 }}>
                    Error Loading Playrolls
                  </Text>
                )}
              </SubScreenContainer>
              {this.renderNewPlayrollButton()}
            </View>
          );
        }}
      </ListCurrentUserPlayrollsQuery>
    );
  }

  renderHeader() {
    const extractPlayroll = data => {
      if (
        Object.keys(data).length === 0 ||
        Object.keys(data.private).length === 0
      ) {
        return null;
      }
      return data.private.createCurrentUserPlayroll;
    };
    return (
      <CreatePlayrollMutation
        variables={{
          input: { name: 'New Playroll' },
        }}
        onCompleted={data => {
          const playroll = extractPlayroll(data);
          NavigationService.navigate('ViewPlayroll', {
            playroll,
          });
        }}
        refetchQueries={[LIST_CURRENT_USER_PLAYROLLS]}
      >
        {createPlayroll => {
          const addPlayrollIcon = {
            ...Icons.addIcon,
            onPress: () => createPlayroll(),
          };
          return (
            <SubScreenHeader title={'My Playrolls'} icons={[addPlayrollIcon]} />
          );
        }}
      </CreatePlayrollMutation>
    );
  }
  renderNewPlayrollButton() {
    // return (
    const extractPlayroll = data => {
      if (
        Object.keys(data).length === 0 ||
        Object.keys(data.private).length === 0
      ) {
        return null;
      }
      return data.private.createCurrentUserPlayroll;
    };
    return (
      <CreatePlayrollMutation
        variables={{
          input: { name: 'New Playroll' },
        }}
        onCompleted={data => {
          const playroll = extractPlayroll(data);
          NavigationService.navigate('ViewPlayroll', {
            playroll,
          });
        }}
        refetchQueries={[LIST_CURRENT_USER_PLAYROLLS]}
      >
        {createPlayroll => {
          return (
            <View style={styles.footerView}>
              <Button
                title='New Playroll'
                containerStyle={styles.newPlayrollButton}
                onPress={() => {
                  createPlayroll();
                }}
              />
            </View>
          );
        }}
      </CreatePlayrollMutation>
    );
  }
}
