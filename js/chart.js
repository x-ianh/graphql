// Handles rendering of various charts using SVG
import DataProcessor from './data.js';

class ChartRenderer {
    // Render XP progression over time as a line chart
    static renderXpOverTimeGraph(transactions, selector) {
        const container = document.querySelector(selector);
        if (!container || transactions.length === 0) {
            container.innerHTML = '<p>No XP data available</p>';
            return;
        }

        // Process transaction data by day
        const data = DataProcessor.groupXpByDay(transactions);
        if (data.length === 0) {
            container.innerHTML = '<p>No XP transactions found</p>';
            return;
        }

        // Chart dimensions and padding
        const width = 600;
        const height = 300;
        const padding = 50;

        // Calculate maximum values for scaling
        const maxXp = Math.max(...data.map(d => d.xp));
        const maxDateIndex = data.length - 1;

        // Scale functions to map data to pixel coordinates
        const x = i => padding + (i / maxDateIndex) * (width - 2 * padding);
        const y = xp => height - padding - (xp / maxXp) * (height - 2 * padding);

        let svg = `<svg width="${width}" height="${height}" style="font-family: sans-serif; background: white; border-radius: 8px;">`;

        // Background grid
        this._addGridLines(svg, width, height, padding, maxXp);

        // Axes
        svg += `<line x1="${padding}" y1="${height-padding}" x2="${width-padding}" y2="${height-padding}" stroke="#888" stroke-width="2" />`;
        svg += `<line x1="${padding}" y1="${padding}" x2="${padding}" y2="${height-padding}" stroke="#888" stroke-width="2" />`;

        // Grid lines and Y-axis labels
        for (let i = 0; i <= 5; i++) {
            const yp = height - padding - (i/5) * (height - 2*padding);
            svg += `<line x1="${padding}" y1="${yp}" x2="${width-padding}" y2="${yp}" stroke="#ddd" stroke-dasharray="4" />`;
            svg += `<text x="${padding-10}" y="${yp+4}" text-anchor="end" fill="#666" font-size="12">${DataProcessor.formatNumber(Math.round((i/5)*maxXp))}</text>`;
        }

        // Line path with gradient
        let path = `M ${x(0)} ${y(data[0].xp)}`;
        for (let i = 1; i < data.length; i++) {
            path += ` L ${x(i)} ${y(data[i].xp)}`;
        }
        
        // Add gradient definition for the line
        svg += `<defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:var(--primary);stop-opacity:1" />
                <stop offset="100%" style="stop-color:var(--secondary);stop-opacity:1" />
            </linearGradient>
        </defs>`;
        
        svg += `<path d="${path}" fill="none" stroke="url(#lineGradient)" stroke-width="3" />`;

        // Data points with hover tooltips
        data.forEach((d, i) => {
            svg += `<circle cx="${x(i)}" cy="${y(d.xp)}" r="4" fill="var(--primary)" stroke="white" stroke-width="2">
                <title>Date: ${d.date}\nXP: ${DataProcessor.formatNumber(d.xp)}</title>
            </circle>`;
        });

        // X-axis labels (smart spacing to avoid crowding)
        const labelStep = Math.max(1, Math.ceil(data.length / 8));
        for (let i = 0; i < data.length; i += labelStep) {
            svg += `<text x="${x(i)}" y="${height-padding+20}" font-size="11" text-anchor="middle" fill="#555" transform="rotate(-45 ${x(i)} ${height-padding+20})">${data[i].date}</text>`;
        }

        // Chart title
        svg += `<text x="${width/2}" y="25" text-anchor="middle" font-size="16" font-weight="bold" fill="#333">XP Progress Over Time</text>`;

        svg += `</svg>`;
        container.innerHTML = svg;
    }

    // Render pass/fail statistics as a bar chart
    static renderPassFailBarChart(pass, fail, selector) {
        const container = document.querySelector(selector);
        if (!container) return;

        const total = pass + fail;
        if (total === 0) {
            container.innerHTML = '<p>No project data available</p>';
            return;
        }

        // Chart dimensions
        const width = 450;
        const height = 250;
        const barHeight = 50;
        const padding = 40;

        // Calculate scaling for bars
        const max = Math.max(pass, fail, 1); // Prevent division by zero
        const xScale = val => (val / max) * (width - 2 * padding);

        let svg = `<svg width="${width}" height="${height}" style="font-family: sans-serif;">`;

        // Background
        svg += `<rect width="${width}" height="${height}" fill="rgba(255,255,255,0.1)" rx="12"/>`;

        // Title and success rate
        svg += `<text x="${width/2}" y="30" text-anchor="middle" font-size="18" font-weight="bold" fill="#fff">Project Results</text>`;

        const successRate = ((pass / total) * 100).toFixed(1);
        svg += `<text x="${width/2}" y="50" text-anchor="middle" font-size="12" fill="#ccc">Success Rate: ${successRate}%</text>`;

        // Pass bar
        const passBarWidth = xScale(pass);
        svg += `<rect x="${padding}" y="80" width="${passBarWidth}" height="${barHeight}" fill="var(--secondary)" opacity="0.9" rx="4"/>`;
        svg += `<text x="${padding + passBarWidth + 15}" y="110" font-size="14" font-weight="600" fill="#fff">${pass} Passed</text>`;

        // Fail bar
        const failBarWidth = xScale(fail);
        svg += `<rect x="${padding}" y="150" width="${failBarWidth}" height="${barHeight}" fill="var(--primary-dark)" opacity="0.8" rx="4"/>`;
        svg += `<text x="${padding + failBarWidth + 15}" y="180" font-size="14" font-weight="600" fill="#fff">${fail} Failed</text>`;

        // Axis line
        svg += `<line x1="${padding}" y1="70" x2="${padding}" y2="210" stroke="#aaa" stroke-width="2"/>`;

        // Grid lines for reference
        for (let i = 0; i <= max; i += Math.ceil(max / 5)) {
            const xPos = padding + xScale(i);
            svg += `<line x1="${xPos}" y1="70" x2="${xPos}" y2="210" stroke="#555" stroke-dasharray="2,2" opacity="0.5"/>`;
            svg += `<text x="${xPos}" y="230" text-anchor="middle" font-size="10" fill="#aaa">${i}</text>`;
        }

        svg += `</svg>`;
        container.innerHTML = svg;
    }

    // Placeholder for grid line rendering (currently handled inline)
    static _addGridLines(svg, width, height, padding, maxValue) {
        // This could be expanded for more sophisticated grid rendering
        // Currently handled in the main render methods
    }

    // Display loading state for charts
    static renderLoadingState(selector, message = 'Loading...') {
        const container = document.querySelector(selector);
        if (container) {
            container.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #ccc;">
                    <div style="font-size: 18px; margin-bottom: 10px;">📊</div>
                    <div>${message}</div>
                </div>
            `;
        }
    }

    // Display error state for charts
    static renderErrorState(selector, error = 'Unable to load chart data') {
        const container = document.querySelector(selector);
        if (container) {
            container.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #ff6b6b;">
                    <div style="font-size: 18px; margin-bottom: 10px;">⚠️</div>
                    <div>${error}</div>
                </div>
            `;
        }
    }
}

export default ChartRenderer;