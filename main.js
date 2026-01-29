document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const progressBar = document.getElementById('progress-bar');
    const stepInfo = document.getElementById('step-info');
    const priceInfo = document.getElementById('price-info');
    const cashInfo = document.getElementById('cash-info');
    const sharesInfo = document.getElementById('shares-info');
    const portfolioValue = document.getElementById('portfolio-value');
    const buyBtn = document.getElementById('buy-btn');
    const sellBtn = document.getElementById('sell-btn');
    const nextBtn = document.getElementById('next-btn');
    const restartBtn = document.getElementById('restart-btn');
    const ctx = document.getElementById('price-chart').getContext('2d');

    // --- Game State ---
    let cash = 10000;
    let shares = 0;
    let currentStep = 0;
    const totalSteps = 100;
    let priceData = [];
    let chart;

    // --- Functions ---

    /**
     * Generates mock price data using a random walk.
     */
    function generatePriceData() {
        let lastPrice = 100;
        priceData.push(lastPrice);
        for (let i = 1; i < totalSteps; i++) {
            const change = (Math.random() - 0.48) * 10; // Slight upward bias
            lastPrice = Math.max(10, lastPrice + change); // Ensure price doesn't go below 10
            priceData.push(lastPrice);
        }
    }

    /**
     * Initializes the progress bar cells.
     */
    function createProgressBar() {
        for (let i = 0; i < totalSteps; i++) {
            const cell = document.createElement('div');
            cell.classList.add('progress-cell');
            cell.dataset.index = i;
            progressBar.appendChild(cell);
        }
    }

    /**
     * Updates all UI elements based on the current game state.
     */
    function updateUI() {
        const currentPrice = priceData[currentStep];
        const currentPortfolioValue = cash + shares * currentPrice;

        stepInfo.textContent = `${currentStep + 1}/${totalSteps}`;
        priceInfo.textContent = currentPrice.toFixed(2);
        cashInfo.textContent = cash.toFixed(2);
        sharesInfo.textContent = shares;
        portfolioValue.textContent = currentPortfolioValue.toFixed(2);

        const progressCells = progressBar.querySelectorAll('.progress-cell');
        progressCells.forEach((cell, index) => {
            if (index <= currentStep) {
                cell.classList.add('filled');
            }
        });
        
        updateChart();
    }
    
    /**
     * Updates the chart to show data up to the current step.
     */
    function updateChart() {
        const labels = Array.from({ length: currentStep + 1 }, (_, i) => i + 1);
        const visibleData = priceData.slice(0, currentStep + 1);

        chart.data.labels = labels;
        chart.data.datasets[0].data = visibleData;
        chart.update();
    }


    /**
     * Handles the 'Buy' action.
     */
    function handleBuy() {
        const currentPrice = priceData[currentStep];
        if (cash >= currentPrice) {
            cash -= currentPrice;
            shares += 1;
            proceedToNextStep();
        } else {
            alert('현금이 부족합니다!');
        }
    }

    /**
     * Handles the 'Sell' action.
     */
    function handleSell() {
        if (shares > 0) {
            const currentPrice = priceData[currentStep];
            cash += currentPrice;
            shares -= 1;
            proceedToNextStep();
        } else {
            alert('보유한 주식이 없습니다!');
        }
    }
    
    /**
     * Advances the game to the next step.
     */
    function proceedToNextStep() {
        if (currentStep < totalSteps - 1) {
            currentStep++;
            updateUI();
        } else {
            endGame();
        }
    }
    
    /**
     * Initializes the chart.
     */
    function initializeChart() {
        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: '가격',
                    data: [],
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderWidth: 2,
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: false
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }


    /**
     * Ends the game and shows the final result.
     */
    function endGame() {
        const finalValue = cash + shares * priceData[currentStep];
        alert(`게임 종료!\n최종 자산: ${finalValue.toFixed(2)}`);
        buyBtn.disabled = true;
        sellBtn.disabled = true;
        nextBtn.disabled = true;
    }

    /**
     * Restarts the game to its initial state.
     */
    function restartGame() {
        // Reset game state
        cash = 10000;
        shares = 0;
        currentStep = 0;
        priceData = [];

        // Regenerate data
        generatePriceData();

        // Reset progress bar
        const progressCells = progressBar.querySelectorAll('.progress-cell');
        progressCells.forEach(cell => {
            cell.classList.remove('filled');
        });

        // Enable buttons
        buyBtn.disabled = false;
        sellBtn.disabled = false;
        nextBtn.disabled = false;

        // Reset chart
        chart.destroy();
        initializeChart();

        // Update UI to initial state
        updateUI();
    }

    /**
     * Initializes the game.
     */
    function init() {
        generatePriceData();
        createProgressBar();
        initializeChart();
        updateUI();

        buyBtn.addEventListener('click', handleBuy);
        sellBtn.addEventListener('click', handleSell);
        nextBtn.addEventListener('click', proceedToNextStep);
        restartBtn.addEventListener('click', restartGame);
    }

    // --- Start the game ---
    init();
});
