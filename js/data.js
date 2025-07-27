// Processes and transforms raw data for display and charting
class DataProcessor {
    // Count passed and failed projects from progress list
    static countGrades(progressList) {
        let pass = 0, fail = 0;
        progressList.forEach(p => {
            if (p.grade === 1) pass++;
            else fail++;
        });
        return { pass, fail };
    }

    // Group XP transactions by day for charting
    static groupXpByDay(transactions) {
        const xpByDay = {};
        transactions.forEach(tx => {
            const date = new Date(tx.createdAt).toLocaleDateString();
            xpByDay[date] = (xpByDay[date] || 0) + tx.amount;
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

    // Format date string to locale-specific format
    static formatDate(dateString) {
        return new Date(dateString).toLocaleDateString();
    }

    // Format number with thousands separators
    static formatNumber(number) {
        return number.toLocaleString();
    }
}

export default DataProcessor;