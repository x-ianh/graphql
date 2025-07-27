// Handles GraphQL API requests for user data
class GraphQLService {
    // Fetch comprehensive user profile data including XP, projects, and progress
    static async fetchUserProfile(jwt, userId) {
        // GraphQL query to fetch user data, XP transactions, and project progress
        const query = `
            query GetUserProfile($userId: Int!) {
                user(where: { id: { _eq: $userId } }) {
                    id
                    login
                    createdAt
                }

                transactions: transaction_aggregate(
                    where: { userId: { _eq: $userId }, type: { _eq: "xp" } }
                ) {
                    aggregate {
                        sum {
                            amount
                        }
                    }
                    nodes {
                        amount
                        createdAt
                    }
                }

                progress(where: { userId: { _eq: $userId } }) {
                    grade
                    path
                    createdAt
                }
            }
        `;

        // Send GraphQL request to API
        const res = await fetch("https://learn.reboot01.com/api/graphql-engine/v1/graphql  ", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwt}`
            },
            body: JSON.stringify({
                query,
                variables: { userId }
            })
        });

        // Handle HTTP errors
        if (!res.ok) {
            const error = await res.json().catch(() => ({ errors: [{ message: "Unknown error" }] }));
            throw new Error(error.errors?.[0]?.message || "GraphQL error");
        }

        // Return parsed data
        return res.json().then(r => r.data);
    }
}

export default GraphQLService;