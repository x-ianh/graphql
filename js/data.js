// Processes and transforms raw data for display and charting
class DataProcessor {
    // Count passed and failed projects from progress list
    // UPDATED: Now filters by object.type === 'project' to only count actual projects
    // Uses grade > 0 for pass (works correctly)
    static countGrades(progressList) {
        let pass = 0, fail = 0;
        progressList.forEach(p => {
            // Only count items where object.type === 'project'
            if (p.object && p.object.type === 'project') {
                if (p.grade > 0) pass++;        // Any grade > 0 is pass
                else if (p.grade === 0) fail++; // grade 0 is fail
            }
        });
        return { pass, fail };
    }

    // Group XP transactions by day for charting
    static groupXpByDay(transactions) {
        const xpByDay = {};
        transactions.forEach(tx => {
            const date = new Date(tx.createdAt);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            const formattedDate = `${day}/${month}/${year}`;
            xpByDay[formattedDate] = (xpByDay[formattedDate] || 0) + tx.amount;
        });
        return Object.entries(xpByDay).map(([date, xp]) => ({ date, xp }));
    }

    // Calculate overall statistics from user data
    static calculateStats(userData) {
        const totalXp = userData.transactions.aggregate.sum.amount || 0;
        const { pass, fail } = this.countGrades(userData.progress);
        const totalProjects = pass + fail;
        const successRate = totalProjects > 0 ? ((pass / totalProjects) * 100).toFixed(1) : 0;

        return {
            totalXp,
            pass,
            fail,
            totalProjects,
            successRate
        };
    }

    // Format date string to d/m/y format
    static formatDate(dateString) {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    // Format number with thousands separators
    static formatNumber(number) {
        return number.toLocaleString();
    }

    // NEW: Format XP to KB or MB automatically
    static formatXP(xp) {
        if (xp >= 1000000) {
            // Convert to MB if >= 1,000,000
            return `${(xp / 1000000).toFixed(2)} MB`;
        } else if (xp >= 1000) {
            // Convert to KB if >= 1,000
            return `${(xp / 1000).toFixed(2)} kB`;
        } else {
            // Show as bytes if < 1,000
            return `${xp} B`;
        }
    }
}

export default DataProcessor;