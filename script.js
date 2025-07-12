
let enigmes = [
  {
    question: "Je suis un lieu de prière situé tout en haut de Samer, qui suis-je ?",
    reponse: "calvaire",
    coords: { lat: 50.63857639718161, lon: 1.7407606101609256 }
  },
  {
    question: "Je suis un endroit où les enfants vont apprendre à Samer.",
    reponse: "école",
    coords: { lat: 50.63729383989245, lon: 1.7445575608526371 }
  },
  {
    question: "Je suis un bâtiment où travaille le maire.",
    reponse: "mairie",
    coords: { lat: 50.6396705576965, lon: 1.7455409669591149 }
  },
  {
    question: "Je suis un lieu de repos et de verdure ouvert au publique.",
    reponse: "Jardin de l'abbaye",
    coords: { lat: 50.6342296242716, lon: 1.7562645139939927 }
  },
  {
    question: "On y achète de la nourriture en grande quantité.",
    reponse: "supermarché",
    coords: { lat: 50.638337931190755, lon: 1.759872772284442 }
    },
  {
    question: "https://www.youtube.com/watch?v=NwLZB39EJVQ&list=RDNwLZB39EJVQ&start_radio=1 ps: c'est la fin 😊",
    reponse: "maison",
    coords: { lat: 50.63473328180439, lon: 1.7436017177602179 }
  }
];

let currentStep = 0;
let timerInterval;
let seconds = 0;

function startGame() {
  document.getElementById("intro").classList.add("hidden");
  document.getElementById("game").classList.remove("hidden");
  document.getElementById("chronometre").classList.remove("hidden");
  showEnigme();
  timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
  seconds++;
  const min = String(Math.floor(seconds / 60)).padStart(2, '0');
  const sec = String(seconds % 60).padStart(2, '0');
  document.getElementById("timer").textContent = `${min}:${sec}`;
}

function showEnigme() {
  const e = enigmes[currentStep];
  document.getElementById("enigme-text").textContent = e.question;
  document.getElementById("feedback").textContent = "";
  document.getElementById("answer-input").value = "";
  document.getElementById("step").classList.remove("hidden");
  document.getElementById("gps-check").classList.add("hidden");
}

function checkAnswer() {
  const input = document.getElementById("answer-input").value.trim().toLowerCase();
  const e = enigmes[currentStep];
  if (input === e.reponse.toLowerCase()) {
    document.getElementById("step").classList.add("hidden");
    document.getElementById("gps-check").classList.remove("hidden");
    document.getElementById("gps-coords").textContent = `${e.coords.lat}, ${e.coords.lon}`;
  } else {
    document.getElementById("feedback").textContent = "Mauvaise réponse.";
  }
}

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const toRad = x => x * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function checkGPS() {
  const coords = enigmes[currentStep].coords;
  navigator.geolocation.getCurrentPosition(pos => {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;
    const dist = getDistance(lat, lon, coords.lat, coords.lon);
    const gpsRes = document.getElementById("gps-result");
    if (dist <= 20) {
      gpsRes.textContent = `✅ Bien joué ! Prochaine étape.`;
      currentStep++;
      if (currentStep < enigmes.length) {
        setTimeout(showEnigme, 1500);
      } else {
        endGame();
      }
    } else {
      gpsRes.textContent = `❌ Trop loin ! (${Math.round(dist)} m)`;
    }
  }, err => {
    document.getElementById("gps-result").textContent = "Erreur de géolocalisation.";
  });
}

function endGame() {
  clearInterval(timerInterval);
  document.getElementById("game").classList.add("hidden");
  document.getElementById("end").classList.remove("hidden");
  document.getElementById("final-time").textContent = document.getElementById("timer").textContent;
}
