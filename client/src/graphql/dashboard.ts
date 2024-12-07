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
        action
        createdAt
      }
      pendingCommunications
    }
  }
`;
