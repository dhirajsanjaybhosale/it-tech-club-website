// Animated Counter
function animateCounter(id, target) {
    let count = 0;
    const element = document.getElementById(id);
    const interval = setInterval(() => {
        count++;
        element.textContent = count;
        if (count >= target) clearInterval(interval);
    }, 30);
}

animateCounter("eventCount", 12);
animateCounter("registeredCount", 150);

// Chart.js Analytics
const ctx = document.getElementById('eventChart').getContext('2d');

new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Workshops', 'Hackathons', 'Seminars'],
        datasets: [{
            label: 'Events Conducted',
            data: [5, 4, 3],
            borderWidth: 1
        }]
    },
});