import { gql } from "@apollo/client";

export const QUERY_USER = gql`
    {
        user {
            _id
            username
            email
            positions {
                positionId
                purchaseDate
                purchasePrice
                symbol
                currentPrice
            }
        }
    }
`;
