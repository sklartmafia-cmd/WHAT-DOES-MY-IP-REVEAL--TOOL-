// =========================
// WEIGHT TOOL
// =========================
function generatePlan() {

  const height = parseFloat(document.getElementById("height").value);
  const weight = parseFloat(document.getElementById("weight").value);
  const diet = document.getElementById("diet").value;
  const walking = document.getElementById("walking").value;
  const sugar = document.getElementById("sugar").value;
  const alcohol = document.getElementById("alcohol").value;
  const sleep = document.getElementById("sleep").value;
  const cardio = document.getElementById("cardio").value;
  const strength = document.getElementById("strength").value;
  const junk = document.getElementById("junkType").value;

  let issues = [];

  // BMI
  let bmi = null;
  if (height && weight) {
    bmi = weight / ((height / 100) ** 2);
  }

  // Difficulty
  let difficulty = "Moderate";

  // FOOD SWAPS
  let foodSwap = "";

  if (junk.includes("Burger")) {
    foodSwap = "Swap burgers for grilled chicken or steak with rice and vegetables";
  } else if (junk.includes("Pizza")) {
    foodSwap = "Swap pizza for pasta with lean protein or homemade alternatives";
  } else if (junk.includes("Chinese")) {
    foodSwap = "Swap takeaway for homemade soy chicken/fish with rice and veg";
  } else if (junk.includes("Indian")) {
    foodSwap = "Swap for homemade tandoori-style meals with rice and veg";
  } else if (junk.includes("Kebab")) {
    foodSwap = "Swap kebabs for grilled wraps or rice bowls with lean protein";
  } else if (junk.includes("Fish")) {
    foodSwap = "Swap fried fish & chips for grilled fish with rice and veg";
  } else {
    foodSwap = "Focus on simple meals: protein + carbs + vegetables";
  }

  // DIET
  if (diet.includes("Highly")) {
    issues.push({
      type: "Diet",
      score: 3,
      fix: "High reliance on processed/takeaway food",
      action: `Replace at least 2 takeaway meals this week. ${foodSwap}`
    });
  }

  // WALKING
  if (walking.includes("Less")) {
    issues.push({
      type: "Movement",
      score: 3,
      fix: "Low daily movement",
      action: "Commit to at least 30 minutes walking daily"
    });
  }

  // CARDIO
  if (cardio === "None") {
    issues.push({
      type: "Cardio",
      score: 2,
      fix: "No cardiovascular activity",
      action: "Start with 2 × 30 min light cardio sessions weekly"
    });
  }

  // STRENGTH
  if (strength === "None") {
    issues.push({
      type: "Strength",
      score: 2,
      fix: "No resistance training",
      action: "Start 2 short bodyweight sessions weekly"
    });
  }

  // DRINKS
  if (sugar !== "Rarely/never" || alcohol !== "Rare/none") {
    issues.push({
      type: "Drinks",
      score: 2,
      fix: "Sugary drinks/alcohol slowing progress",
      action: "Limit sugary drinks and alcohol to 1–2 times per week"
    });
  }

  // SLEEP
  if (sleep === "<6 hours") {
    issues.push({
      type: "Sleep",
      score: 2,
      fix: "Poor sleep",
      action: "Aim for 7+ hours sleep"
    });
  }

  // SORT
  issues.sort((a, b) => b.score - a.score);
  const top = issues.slice(0, 3);

  if (issues.length >= 4) difficulty = "Hard";
  if (issues.length <= 2) difficulty = "Easier";

  if (top.length === 0) {
    top.push({
      type: "Consistency",
      fix: "Your habits are balanced",
      action: "Focus on consistency"
    });
  }

  document.getElementById("planOutput").innerHTML = `
    <div class="card">
      <h2>Your Plan</h2>

      ${bmi ? `<p><strong>BMI:</strong> ${bmi.toFixed(1)}</p>` : ""}
      <p><strong>Difficulty:</strong> ${difficulty}</p>

      <hr>

      <ul>
        ${top.map(i => `<li><strong>${i.type}:</strong> ${i.action}</li>`).join("")}
      </ul>
    </div>
  `;
}


// =========================
// IP TOOL
// =========================

function calculatePrivacyScore(data) {
  let base = 60;
  const org = (data.org || "").toLowerCase();

  if (org.includes("vpn") || org.includes("proxy")) base += 25;
  if (org.includes("amazon") || org.includes("google")) base -= 15;
  if (org.includes("vodafone") || org.includes("telecom")) base += 10;

  return Math.max(0, Math.min(100, base));
}

fetch("https://ipapi.co/json/")
  .then(res => res.json())
  .then(data => {

    const score = calculatePrivacyScore(data);

    let risks = [];

    if (data.org && data.org.toLowerCase().includes("amazon")) {
      risks.push("Datacenter/VPN detected");
    }

    if (data.city) {
      risks.push("Your city-level location is visible");
    }

document.getElementById("output").innerHTML = `
  <h1>IP Privacy Report</h1>
  <p class="small">Instant analysis of what your network reveals</p>

  <div class="data-row"><span class="label">IP</span> ${data.ip}</div>
  <div class="data-row"><span class="label">Location</span> ${data.city}, ${data.region}, ${data.country_name}</div>
  <div class="data-row"><span class="label">ISP</span> ${data.org}</div>
  <div class="data-row"><span class="label">Timezone</span> ${data.timezone}</div>

  <hr>

  <div class="score-wrap">

    <p class="small">
      Score is based on ISP type, network signals, and exposure heuristics.
    </p>

    <div class="score-title">
      <span class="label">Privacy Score</span>
      <span class="score-number">${score}/100</span>
    </div>

    <div class="score-bar">
      <div class="score-fill ${
        score > 70 ? "high" : score > 40 ? "medium" : "low"
      }" style="width:${score}%"></div>
    </div>

    <div class="badge ${
      score > 70 ? "high" : score > 40 ? "medium" : "low"
    }">
      ${
        score > 70 ? "High Exposure" :
        score > 40 ? "Moderate Exposure" :
        "Low Exposure"
      }
    </div>

  </div>

  ${risks.length > 0 ? `
    <hr>

    <div class="score-wrap">
      <p><strong>Potential exposure:</strong></p>
      <ul>
        ${risks.map(r => `<li>${r}</li>`).join("")}
      </ul>
    </div>
  ` : ""}

  <hr>
`;
  })
  .catch(err => {
    console.log("API error:", err);
    document.getElementById("output").innerHTML =
      "Failed to load IP data.";
  });