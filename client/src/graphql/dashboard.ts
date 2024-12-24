import gql from 'graphql-tag';

export const DASHBOARD_STATS = gql`
  query DashboardStats {
    dashboardStats {
      totalProducts
      productsByBrand {
        categoryOrBrand
        count
      }
      productsByCategory {
        categoryOrBrand
        count
      }
      recentHistory {
        action {
          name
          description
          type
          active
        }
        createdAt
        user {
          firstName
          lastName
        }
        product {
          name
          reference
        }
        createdAt
      }
      pendingCommunications
    }
  }
`;
