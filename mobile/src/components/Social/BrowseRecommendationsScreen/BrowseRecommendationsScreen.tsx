/**
 * BrowseRecommendationsScreen
 */

import * as React from 'react';
import { Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import SubScreenContainer from '../../shared/Containers/SubScreenContainer';
import { ListCurrentUserRecommendationsQuery } from '../../../graphql/requests/Recommendation/ListCurrentUserRecommendationsQuery';
import RecommendationCard from '../../shared/Cards/RecommendationCard';
import PlaceholderList from '../../shared/Lists/PlaceholderList';
import { Icon } from 'react-native-elements';
import SearchSubHeader from '../../shared/SubHeaders/SearchSubHeader';

export default class BrowseRecommendationsScreen extends React.Component {
  render() {
    const extractRecommendations = data => {
      if (
        Object.keys(data).length === 0 ||
        Object.keys(data.private).length === 0
      ) {
        return [];
      }
      return data.private.listCurrentUserRecommendations;
    };
    return (
      <ListCurrentUserRecommendationsQuery variables={{ offset: 0, count: 20 }}>
        {({ loading, error, data, refetch, fetchMore }) => {
          const recommendations = extractRecommendations(data);
          return (
            <SubScreenContainer
              title={'My Recommendations'}
              flatList
              contentContainerStyle={{
                marginTop: 10,
                paddingBottom: hp('16%'),
              }}
              data={recommendations}
              keyExtractor={item => item.id}
              renderFlatListHeader={() => {
                return (
                  <>
                    {error && (
                      <Text style={{ paddingTop: 50 }}>
                        Error Loading Recommendation
                      </Text>
                    )}
                    <SearchSubHeader />
                  </>
                );
              }}
              renderItem={({ item }) => {
                return (
                  <RecommendationCard
                    recommendation={item}
                    onPress={() => {}}
                  />
                );
              }}
              refreshing={loading}
              onRefresh={() => refetch()}
              onEndReached={() => {
                fetchMore({
                  variables: {
                    offset: recommendations.length,
                  },
                  updateQuery: (prev, { fetchMoreResult }) => {
                    const prevRecommendations = extractRecommendations(prev);
                    const fetchMoreRecommendations = extractRecommendations(
                      fetchMoreResult
                    );
                    if (!fetchMoreResult) return prev;
                    return Object.assign({}, prev, {
                      private: {
                        listCurrentUserRecommendations: [
                          ...prevRecommendations,
                          ...fetchMoreRecommendations,
                        ],
                        __typename: 'PrivateQueryMethods',
                      },
                    });
                  },
                });
              }}
              onEndReachedThreshold={0.5}
            />
          );
        }}
      </ListCurrentUserRecommendationsQuery>
    );
  }
}
