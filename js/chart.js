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

        // Chart dimensions - standardized to match other graphs
        const width = 850;
        const height = 500;
        const padding = 80;
        const bottomPadding = 120;

        // Calculate maximum values for scaling
        const maxXp = Math.max(...data.map(d => d.xp));
        const maxDateIndex = data.length - 1;

        // Scale functions to map data to pixel coordinates
        const x = i => padding + (i / maxDateIndex) * (width - 2 * padding);
        const y = xp => height - bottomPadding - (xp / maxXp) * (height - padding - bottomPadding);

        // Match dark theme
        let svg = `<svg width="${width}" height="${height}" style="font-family: sans-serif; background: rgba(255,255,255,0.05); border-radius: 12px;">`;

        // Axes - lighter colors for dark background
        svg += `<line x1="${padding}" y1="${height-bottomPadding}" x2="${width-padding}" y2="${height-bottomPadding}" stroke="#aaa" stroke-width="2" />`;
        svg += `<line x1="${padding}" y1="${padding}" x2="${padding}" y2="${height-bottomPadding}" stroke="#aaa" stroke-width="2" />`;

        // Grid lines and Y-axis labels with KB/MB formatting
        for (let i = 0; i <= 5; i++) {
            const yp = height - bottomPadding - (i/5) * (height - padding - bottomPadding);
            const xpValue = Math.round((i/5)*maxXp);
            svg += `<line x1="${padding}" y1="${yp}" x2="${width-padding}" y2="${yp}" stroke="#555" stroke-dasharray="4" opacity="0.5"/>`;
            svg += `<text x="${padding-15}" y="${yp+4}" text-anchor="end" fill="#ccc" font-size="12">${DataProcessor.formatXP(xpValue)}</text>`;
        }

        // Line path with gradient (purple to gold)
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

        // Data points with custom styled tooltips
        data.forEach((d, i) => {
            const circleId = `circle-${i}`;
            svg += `
                <circle 
                    id="${circleId}" 
                    cx="${x(i)}" 
                    cy="${y(d.xp)}" 
                    r="4" 
                    fill="var(--primary)" 
                    stroke="white" 
                    stroke-width="2"
                    onmouseover="showTooltip('${circleId}', '${d.date}', '${DataProcessor.formatXP(d.xp)}', ${x(i)}, ${y(d.xp)})"
                    onmouseout="hideTooltip('${circleId}')"
                />
            `;
        });

        // Add tooltip container (will be positioned by JS)
        svg += `
            <g id="xp-tooltip" style="display: none; pointer-events: none;">
                <rect id="tooltip-bg" x="0" y="0" rx="8" ry="8" 
                      fill="#2d3348" 
                      stroke="rgba(106, 13, 173, 0.5)" 
                      stroke-width="2"
                      filter="drop-shadow(0 4px 8px rgba(0,0,0,0.3))"/>
                <text id="tooltip-date" x="0" y="0" 
                      fill="#D4AF37" 
                      font-size="12" 
                      font-weight="600"/>
                <text id="tooltip-xp" x="0" y="0" 
                      fill="#fff" 
                      font-size="14" 
                      font-weight="700"/>
            </g>
        `;

        // X-axis labels (smart spacing to avoid crowding) - more space from axis
        const labelStep = Math.max(1, Math.ceil(data.length / 10));
        for (let i = 0; i < data.length; i += labelStep) {
            svg += `<text x="${x(i)}" y="${height-bottomPadding+40}" font-size="11" text-anchor="middle" fill="#aaa" transform="rotate(-45 ${x(i)} ${height-bottomPadding+40})">${data[i].date}</text>`;
        }

        // Chart title
        svg += `<text x="${width/2}" y="30" text-anchor="middle" font-size="18" font-weight="bold" fill="#fff">XP Progress Over Time</text>`;

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

        // Chart dimensions - match XP graph width (850px)
        const width = 850;
        const height = 280; // Keep original height
        const barHeight = 50;
        const padding = 50;

        // Calculate scaling for bars
        const max = Math.max(pass, fail, 1);
        const xScale = val => (val / max) * (width - 2 * padding - 100);

        let svg = `<svg width="${width}" height="${height}" style="font-family: sans-serif;">`;

        // Background - keep dark theme
        svg += `<rect width="${width}" height="${height}" fill="rgba(255,255,255,0.1)" rx="12"/>`;

        // Title and success rate
        svg += `<text x="${width/2}" y="30" text-anchor="middle" font-size="18" font-weight="bold" fill="#fff">Project Results</text>`;

        const successRate = ((pass / total) * 100).toFixed(1);
        svg += `<text x="${width/2}" y="50" text-anchor="middle" font-size="13" fill="#ccc">Success Rate: ${successRate}%</text>`;

        // Pass bar (gold color)
        const passBarWidth = xScale(pass);
        svg += `<rect x="${padding}" y="80" width="${passBarWidth}" height="${barHeight}" fill="var(--secondary)" opacity="0.9" rx="4"/>`;
        svg += `<text x="${padding + passBarWidth + 10}" y="${80 + barHeight/2 + 5}" font-size="14" font-weight="600" fill="#fff">${pass} Passed</text>`;

        // Fail bar (darker purple)
        const failBarWidth = xScale(fail);
        svg += `<rect x="${padding}" y="150" width="${failBarWidth}" height="${barHeight}" fill="var(--primary-dark)" opacity="0.8" rx="4"/>`;
        svg += `<text x="${padding + failBarWidth + 10}" y="${150 + barHeight/2 + 5}" font-size="14" font-weight="600" fill="#fff">${fail} Failed</text>`;

        // Axis line
        svg += `<line x1="${padding}" y1="70" x2="${padding}" y2="210" stroke="#aaa" stroke-width="2"/>`;

        // Grid lines for reference
        for (let i = 0; i <= max; i += Math.ceil(max / 5)) {
            const xPos = padding + xScale(i);
            svg += `<line x1="${xPos}" y1="70" x2="${xPos}" y2="210" stroke="#555" stroke-dasharray="2,2" opacity="0.5"/>`;
            svg += `<text x="${xPos}" y="230" text-anchor="middle" font-size="11" fill="#aaa">${i}</text>`;
        }

        // Total projects count at bottom
        svg += `<text x="${width/2}" y="260" text-anchor="middle" font-size="13" fill="#ccc">Total Projects: ${total}</text>`;

        svg += `</svg>`;
        container.innerHTML = svg;
    }

    // Render Audit Ratio gauge/meter
    static renderAuditRatioGraph(auditData, selector) {
        const container = document.querySelector(selector);
        if (!container) return;

        const up = auditData.up?.aggregate?.sum?.amount || 0;
        const down = auditData.down?.aggregate?.sum?.amount || 0;
        
        if (up === 0 && down === 0) {
            container.innerHTML = '<p style="color: #ccc; text-align: center; padding: 40px;">No audit data available</p>';
            return;
        }

        const ratio = down > 0 ? (up / down).toFixed(2) : up > 0 ? "∞" : "0.00";
        const total = up + down;
        const upPercentage = total > 0 ? (up / total) * 100 : 0;
        const downPercentage = total > 0 ? (down / total) * 100 : 0;

        const width = 850;
        const height = 460; // Keep original height
        const centerX = width / 2;
        const centerY = 200;
        const outerRadius = 120;
        const innerRadius = 80;

        // Determine color based on ratio
        let ratioColor = "#FF5252"; // Red for < 1
        let ratioStatus = "Below Required";
        
        if (ratio >= 1) {
            ratioColor = "#4CAF50"; // Green for >= 1
            ratioStatus = "Good Standing";
        }
        if (ratio >= 1.5) {
            ratioColor = "#2196F3"; // Blue for excellent
            ratioStatus = "Excellent!";
        }

        let svg = `<svg width="${width}" height="${height}" style="font-family: sans-serif; background: rgba(255,255,255,0.05); border-radius: 12px;">`;

        // Title
        svg += `<text x="${centerX}" y="35" text-anchor="middle" font-size="20" fill="#fff" font-weight="bold">Audit Ratio</text>`;
        svg += `<text x="${centerX}" y="60" text-anchor="middle" font-size="14" fill="#ccc">Reviews Given vs Received</text>`;

        // Draw donut chart for visual representation
        const upAngle = (upPercentage / 100) * Math.PI * 2;
        const downAngle = (downPercentage / 100) * Math.PI * 2;

        // Up (done) segment - green
        const upStartX = centerX;
        const upStartY = centerY - outerRadius;
        const upEndX = centerX + outerRadius * Math.sin(upAngle);
        const upEndY = centerY - outerRadius * Math.cos(upAngle);
        const upLargeArc = upAngle > Math.PI ? 1 : 0;

        svg += `<path d="M ${centerX} ${centerY} L ${upStartX} ${upStartY} A ${outerRadius} ${outerRadius} 0 ${upLargeArc} 1 ${upEndX} ${upEndY} Z" fill="#4CAF50" opacity="0.8"/>`;

        // Down (received) segment - blue
        const downStartX = upEndX;
        const downStartY = upEndY;
        const downEndX = upStartX;
        const downEndY = upStartY;
        const downLargeArc = downAngle > Math.PI ? 1 : 0;

        svg += `<path d="M ${centerX} ${centerY} L ${downStartX} ${downStartY} A ${outerRadius} ${outerRadius} 0 ${downLargeArc} 1 ${downEndX} ${downEndY} Z" fill="#2196F3" opacity="0.8"/>`;

        // Inner circle to create donut effect
        svg += `<circle cx="${centerX}" cy="${centerY}" r="${innerRadius}" fill="#2d3348"/>`;

        // Center ratio text
        svg += `<text x="${centerX}" y="${centerY - 10}" text-anchor="middle" font-size="36" fill="${ratioColor}" font-weight="bold">${ratio}</text>`;
        svg += `<text x="${centerX}" y="${centerY + 20}" text-anchor="middle" font-size="14" fill="#ccc">Ratio</text>`;
        svg += `<text x="${centerX}" y="${centerY + 40}" text-anchor="middle" font-size="13" fill="${ratioColor}" font-weight="500">${ratioStatus}</text>`;

        // Legend and stats - moved further down with KB/MB formatting
        const legendY = 360;
        
        // Up stats - format as KB/MB
        svg += `<rect x="80" y="${legendY}" width="20" height="20" fill="#4CAF50" opacity="0.8"/>`;
        svg += `<text x="110" y="${legendY + 15}" fill="#fff" font-size="14">Done (Up): ${DataProcessor.formatXP(up)} (${upPercentage.toFixed(1)}%)</text>`;
        
        // Down stats - format as KB/MB
        svg += `<rect x="80" y="${legendY + 35}" width="20" height="20" fill="#2196F3" opacity="0.8"/>`;
        svg += `<text x="110" y="${legendY + 50}" fill="#fff" font-size="14">Received (Down): ${DataProcessor.formatXP(down)} (${downPercentage.toFixed(1)}%)</text>`;

        // Info text
        svg += `<text x="${centerX}" y="${height - 20}" text-anchor="middle" fill="#aaa" font-size="12">Audit ratio should be ≥ 1.0 to maintain good standing</text>`;

        svg += `</svg>`;
        container.innerHTML = svg;
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

// Global tooltip functions for SVG hover events
window.showTooltip = function(circleId, date, xp, cx, cy) {
    const tooltip = document.getElementById('xp-tooltip');
    if (!tooltip) return;
    
    const tooltipBg = document.getElementById('tooltip-bg');
    const tooltipDate = document.getElementById('tooltip-date');
    const tooltipXp = document.getElementById('tooltip-xp');
    
    // Set text content
    tooltipDate.textContent = date;
    tooltipXp.textContent = xp;
    
    // Calculate tooltip dimensions
    const dateBox = tooltipDate.getBBox();
    const xpBox = tooltipXp.getBBox();
    const width = Math.max(dateBox.width, xpBox.width) + 20;
    const height = 45;
    
    // Position tooltip above the point
    const tooltipX = cx - width / 2;
    const tooltipY = cy - height - 15;
    
    // Update background
    tooltipBg.setAttribute('x', tooltipX);
    tooltipBg.setAttribute('y', tooltipY);
    tooltipBg.setAttribute('width', width);
    tooltipBg.setAttribute('height', height);
    
    // Position text
    tooltipDate.setAttribute('x', tooltipX + width / 2);
    tooltipDate.setAttribute('y', tooltipY + 18);
    tooltipDate.setAttribute('text-anchor', 'middle');
    
    tooltipXp.setAttribute('x', tooltipX + width / 2);
    tooltipXp.setAttribute('y', tooltipY + 35);
    tooltipXp.setAttribute('text-anchor', 'middle');
    
    // Show tooltip
    tooltip.style.display = 'block';
    
    // Highlight circle
    const circle = document.getElementById(circleId);
    if (circle) {
        circle.setAttribute('r', '6');
        circle.setAttribute('stroke-width', '3');
    }
};

window.hideTooltip = function(circleId) {
    const tooltip = document.getElementById('xp-tooltip');
    if (tooltip) {
        tooltip.style.display = 'none';
    }
    
    // Reset circle
    const circle = document.getElementById(circleId);
    if (circle) {
        circle.setAttribute('r', '4');
        circle.setAttribute('stroke-width', '2');
    }
};

export default ChartRenderer;