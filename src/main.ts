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

    // Weather Placeholder
    const weatherEl = document.getElementById('weather-widget');
    if (weatherEl) {
        weatherEl.innerHTML = `
            <div class="flex items-center justify-center space-x-4">
                <span class="text-4xl">☀️</span>
                <div class="text-left">
                    <p class="text-2xl font-bold">72°F</p>
                    <p class="text-gray-600">Clear Skies in St. Louis</p>
                </div>
            </div>
        `;
    }
});
