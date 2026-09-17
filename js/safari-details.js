/**
 * safari-details.js — populates the safari detail page based on the
 * ?safari= query parameter. In the full build this content is served
 * by php/safari-details.php from the `safaris` table; this client-side
 * map keeps the static HTML demo functional without a database.
 */
(function () {
  "use strict";

  const safaris = {
    serengeti: {
      name: "Serengeti Safari",
      duration: "6 Days",
      hero: "images/lion-pride.jpg",
      summary:
        "The Serengeti is Tanzania's signature safari ground: open grassland to every horizon, resident big-cat populations, and, depending on the month, the Great Migration moving through in enormous herds.",
      highlights: [
        "Game drives across the central and northern Serengeti",
        "Opportunities to see lion, leopard and cheetah",
        "Seasonal access to the Great Migration river crossings",
        "Sundowner stops overlooking the plains",
      ],
      itinerary: [
        { day: "Day 1", text: "Arrive in Arusha, transfer to your lodge and briefing on the days ahead." },
        { day: "Day 2-3", text: "Drive into the Serengeti with game viewing en route; full days of game drives." },
        { day: "Day 4-5", text: "Explore different regions of the park depending on wildlife movement and season." },
        { day: "Day 6", text: "Final morning game drive, then transfer back to Arusha for departure." },
      ],
    },
    ngorongoro: {
      name: "Ngorongoro Crater Safari",
      duration: "3 Days",
      hero: "images/ngorongoro-crater.jpg",
      summary:
        "The Ngorongoro Crater is a self-contained ecosystem inside a collapsed volcanic caldera, home to an exceptional density of wildlife within a compact, dramatic setting.",
      highlights: [
        "A full day descending into the crater floor",
        "High chance of sighting the 'big five'",
        "Views from the crater rim at sunrise",
        "Visit to a Maasai community by arrangement",
      ],
      itinerary: [
        { day: "Day 1", text: "Transfer from Arusha to the crater highlands, afternoon at leisure." },
        { day: "Day 2", text: "Full-day descent into the crater floor for game viewing, return to the rim for the night." },
        { day: "Day 3", text: "Morning at leisure or optional cultural visit, transfer back to Arusha." },
      ],
    },
    tarangire: {
      name: "Tarangire Safari",
      duration: "4 Days",
      hero: "images/buffalo-under-tree.jpg",
      summary:
        "Tarangire is known for ancient baobab trees and some of the largest elephant herds in East Africa, drawn to the Tarangire River during the dry season.",
      highlights: [
        "Large elephant herds along the Tarangire River",
        "Iconic baobab-studded landscapes",
        "Strong birdlife, especially in the wetter months",
        "Quieter game drives than the northern circuit",
      ],
      itinerary: [
        { day: "Day 1", text: "Depart Arusha for Tarangire, afternoon game drive." },
        { day: "Day 2-3", text: "Full days of game drives across the river valley and surrounding plains." },
        { day: "Day 4", text: "Final morning drive, transfer back to Arusha." },
      ],
    },
    manyara: {
      name: "Lake Manyara Safari",
      duration: "2 Days",
      hero: "images/manyara-flamingos.jpg",
      summary:
        "Set beneath the wall of the Rift Valley, Lake Manyara is a compact and scenic park known for its tree-climbing lions, forest trails and flamingo-lined shoreline.",
      highlights: [
        "Dense groundwater forest at the park entrance",
        "Alkaline lake shoreline with flamingos in season",
        "Chance to see tree-climbing lions",
        "Short drive time from Arusha",
      ],
      itinerary: [
        { day: "Day 1", text: "Depart Arusha, morning and afternoon game drive through the forest and lake shore." },
        { day: "Day 2", text: "Final game drive, transfer back to Arusha." },
      ],
    },
    kilimanjaro: {
      name: "Kilimanjaro Adventure",
      duration: "7 Days",
      hero: "images/kilimanjaro-elephant.jpg",
      summary:
        "A guided ascent of Mount Kilimanjaro, Africa's highest peak, on a route selected for proper acclimatisation and a realistic summit attempt.",
      highlights: [
        "Experienced mountain crew and guides",
        "Acclimatisation-focused route selection",
        "All camping and porter logistics arranged",
        "Certificate on successful summit",
      ],
      itinerary: [
        { day: "Day 1-2", text: "Arrive, briefing and gear check, begin the ascent." },
        { day: "Day 3-5", text: "Progressive climbing days with acclimatisation stops." },
        { day: "Day 6", text: "Summit attempt and descent to a lower camp." },
        { day: "Day 7", text: "Final descent and transfer back to Arusha." },
      ],
    },
    zanzibar: {
      name: "Tanzania & Zanzibar Experience",
      duration: "9 Days",
      hero: "images/zanzibar-beach-lodge.jpg",
      summary:
        "Combine the northern safari circuit with time on Zanzibar's beaches and in Stone Town, pairing wildlife with coastline and Swahili history.",
      highlights: [
        "Northern circuit game drives (Serengeti, Ngorongoro or Tarangire)",
        "Flight transfer to Zanzibar",
        "Beach time on the north or east coast",
        "Guided walk through Stone Town",
      ],
      itinerary: [
        { day: "Day 1-5", text: "Northern circuit safari across your chosen parks." },
        { day: "Day 6", text: "Fly from Arusha to Zanzibar." },
        { day: "Day 7-8", text: "Beach time, with an optional Stone Town tour." },
        { day: "Day 9", text: "Departure from Zanzibar." },
      ],
    },
  };

  const params = new URLSearchParams(window.location.search);
  const key = params.get("safari") || "serengeti";
  const data = safaris[key] || safaris.serengeti;

  document.title = data.name + " | Tanzania Safari";

  const heroImg = document.querySelector("[data-field='hero-image']");
  const heroTitle = document.querySelector("[data-field='hero-title']");
  const durationEl = document.querySelector("[data-field='duration']");
  const summaryEl = document.querySelector("[data-field='summary']");
  const highlightsEl = document.querySelector("[data-field='highlights']");
  const itineraryEl = document.querySelector("[data-field='itinerary']");

  if (heroImg) { heroImg.src = data.hero; heroImg.alt = data.name + " landscape"; }
  if (heroTitle) heroTitle.textContent = data.name;
  if (durationEl) durationEl.textContent = data.duration;
  if (summaryEl) summaryEl.textContent = data.summary;

  if (highlightsEl) {
    highlightsEl.innerHTML = "";
    data.highlights.forEach((item) => {
      const li = document.createElement("li");
      li.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M5 13l4 4L19 7"/></svg><span></span>';
      li.querySelector("span").textContent = item;
      highlightsEl.appendChild(li);
    });
  }

  if (itineraryEl) {
    itineraryEl.innerHTML = "";
    data.itinerary.forEach((step) => {
      const row = document.createElement("div");
      row.className = "itinerary-row";
      row.innerHTML = "<strong></strong><p></p>";
      row.querySelector("strong").textContent = step.day;
      row.querySelector("p").textContent = step.text;
      itineraryEl.appendChild(row);
    });
  }
})();
