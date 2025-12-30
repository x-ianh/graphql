// Handles GraphQL API requests for user data
class GraphQLService {
    // QUERY 1: Fetch basic user info
    static async fetchUserInfo(jwt, userId) {
        const query = `
            query GetUser($userId: Int!) {
                user(where: { id: { _eq: $userId } }) {
                    id
                    login
                    createdAt
                }
            }
        `;

        const res = await fetch("https://learn.reboot01.com/api/graphql-engine/v1/graphql", {
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

        if (!res.ok) {
            const error = await res.json().catch(() => ({ errors: [{ message: "Unknown error" }] }));
            throw new Error(error.errors?.[0]?.message || "GraphQL error");
        }

        return res.json().then(r => r.data);
    }

    // QUERY 2: Fetch XP transactions
    static async fetchUserXP(jwt, userId) {
        const query = `
            query GetUserXP($userId: Int!) {
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
            }
        `;

        const res = await fetch("https://learn.reboot01.com/api/graphql-engine/v1/graphql", {
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

        if (!res.ok) {
            const error = await res.json().catch(() => ({ errors: [{ message: "Unknown error" }] }));
            throw new Error(error.errors?.[0]?.message || "GraphQL error");
        }

        return res.json().then(r => r.data);
    }

    // QUERY 3: Fetch progress/grades with object info
    static async fetchUserProgress(jwt, userId) {
        const query = `
            query GetUserProgress($userId: Int!) {
                progress(where: { userId: { _eq: $userId } }) {
                    grade
                    path
                    createdAt
                    object {
                        type
                        name
                    }
                }
            }
        `;

        const res = await fetch("https://learn.reboot01.com/api/graphql-engine/v1/graphql", {
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

        if (!res.ok) {
            const error = await res.json().catch(() => ({ errors: [{ message: "Unknown error" }] }));
            throw new Error(error.errors?.[0]?.message || "GraphQL error");
        }

        return res.json().then(r => r.data);
    }

    // QUERY 4: Fetch audit ratio (up vs down)
    static async fetchAuditRatio(jwt, userId) {
        const query = `
            query GetAuditRatio($userId: Int!) {
                up: transaction_aggregate(
                    where: { 
                        userId: { _eq: $userId }, 
                        type: { _eq: "up" } 
                    }
                ) {
                    aggregate {
                        sum {
                            amount
                        }
                    }
                }

                down: transaction_aggregate(
                    where: { 
                        userId: { _eq: $userId }, 
                        type: { _eq: "down" } 
                    }
                ) {
                    aggregate {
                        sum {
                            amount
                        }
                    }
                }
            }
        `;

        const res = await fetch("https://learn.reboot01.com/api/graphql-engine/v1/graphql", {
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

        if (!res.ok) {
            const error = await res.json().catch(() => ({ errors: [{ message: "Unknown error" }] }));
            throw new Error(error.errors?.[0]?.message || "GraphQL error");
        }

        return res.json().then(r => r.data);
    }
}

export default GraphQLService;