import gql from "graphql-tag";
import { Query } from "react-apollo";
import { Playroll } from "../../../graphql/types";

export const LIST_PLAYROLLS_QUERY = gql`
  query LIST_PLAYROLLS {
    listPlayrolls {
      id
      name
      rolls {
        id
        data {
          sources {
            cover
            name
            type
          }
        }
      }
      tracklists {
        id
      }
    }
  }
`;

type ListPlayrollsVariables = {};

type ListPlayrollsData = {
  listPlayrolls?: Playroll[];
};

export class ListPlayrollsQuery extends Query<
  ListPlayrollsData,
  ListPlayrollsVariables
> {}
