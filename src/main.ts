import { bibleVerses } from './verses';

const holidayQuotes: Record<string, { text: string; reference: string }> = {
    "01-01": { text: "New Year, New Hope. May this year bring healing and new beginnings.", reference: "New Year's Day" },
    "07-04": { text: "Celebrating the freedom we served to protect. God bless our veterans.", reference: "Independence Day" },
    "11-11": { text: "Today we honor your sacrifice. You are seen, you are valued, and you are home.", reference: "Veterans Day" },
    "12-25": { text: "Wishing you the peace of the season. May hope be born in your heart today.", reference: "Christmas Day" },
    "05-25": { text: "Remembering our brothers and sisters. Their legacy lives on in our service to each other.", reference: "Memorial Day" }
};

function getDailyQuote(): { text: string; reference: string } {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const dateKey = `${month}-${day}`;

    if (holidayQuotes[dateKey]) {
        return holidayQuotes[dateKey];
    }

    const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    const verse = bibleVerses[dayOfYear % bibleVerses.length];
    return { text: verse.verse, reference: verse.reference };
}

document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const menuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');
    
    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('hidden');
            navLinks.classList.toggle('flex');
        });
    }

    // Daily Quote
    const quoteEl = document.getElementById('scripture-text');
    const referenceEl = document.getElementById('scripture-reference');
    if (quoteEl) {
        const { text, reference } = getDailyQuote();
        quoteEl.innerText = text;
        if (referenceEl) {
            referenceEl.innerText = reference;
        }
    }

    // Weather Dynamic Fetch
    const weatherEl = document.getElementById('weather-widget');
    if (weatherEl) {
        fetch('https://api.open-meteo.com/v1/forecast?latitude=38.6273&longitude=-90.1979&current_weather=true')
            .then(res => res.json())
            .then(data => {
                const temp = Math.round(data.current_weather.temperature * 9/5 + 32);
                const code = data.current_weather.weathercode;
                let icon = '☀️';
                let desc = 'Clear Skies';
                
                if (code > 0) { icon = '⛅'; desc = 'Partly Cloudy'; }
                if (code > 45) { icon = '🌫️'; desc = 'Foggy'; }
                if (code > 60) { icon = '🌧️'; desc = 'Raining'; }
                if (code > 70) { icon = '❄️'; desc = 'Snowing'; }
                
                weatherEl.innerHTML = `
                    <div class="flex items-center justify-center space-x-4">
                        <span class="text-5xl animate-bounce">${icon}</span>
                        <div class="text-left">
                            <p class="text-3xl font-bold text-faith-gold">${temp}°F</p>
                            <p class="text-gray-400 font-bold uppercase tracking-widest text-xs">${desc} in St. Louis</p>
                        </div>
                    </div>
                `;
            })
            .catch(() => {
                weatherEl.innerHTML = `<p class="text-gray-400">Weather data temporarily unavailable</p>`;
            });
    }
});
