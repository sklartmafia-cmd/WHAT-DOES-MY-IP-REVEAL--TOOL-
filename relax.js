function generateRelaxPlan() {

  const env = document.getElementById("environment").value;
  const light = document.getElementById("lighting").value;
  const sound = document.getElementById("sound").value;
  const screen = document.getElementById("screens").value;
  const body = document.getElementById("body").value;

  let score = 100;
  let actions = [];

  // ENVIRONMENT
  if (env.includes("Noisy")) {
    score -= 25;
    actions.push("Reduce noise and visual clutter where possible");
  } else if (env.includes("Moderate")) {
    score -= 10;
  }

  // LIGHTING
  if (light.includes("Bright")) {
    score -= 20;
    actions.push("Lower lighting or switch to warm tones");
  }

  // SOUND
  if (sound.includes("Social media")) {
    score -= 40;
    actions.push("Remove high-stimulation audio (social media / active content)");
  } else if (sound.includes("TV")) {
    score -= 15;
  }

  // SCREENS
  if (screen.includes("Active")) {
    score -= 40;
    actions.push("Stop active screen use (scrolling/messages)");
  } else if (screen.includes("Passive")) {
    score -= 10;
  }

  // BODY
  if (body.includes("Active")) {
    score -= 15;
    actions.push("Switch to seated or lying position to downshift");
  }

  if (score < 0) score = 0;

  let level =
    score > 75 ? "Very Relaxed" :
    score > 50 ? "Moderately Relaxed" :
    score > 25 ? "High Stimulation" :
    "Overstimulated";

  if (actions.length === 0) {
    actions.push("Maintain current environment — already supportive for relaxation");
  }

  document.getElementById("output").innerHTML = `
    <div class="block">
      <h2>Relaxation Status: ${level}</h2>
      <p><strong>Score:</strong> ${score}/100</p>
    </div>

    <div class="block">
      <p><strong>Recommended adjustments:</strong></p>
      <ul>
        ${actions.map(a => `<li>${a}</li>`).join("")}
      </ul>
    </div>

    <div class="block small">
      Focus on lowering stimulation rather than eliminating comfort tools entirely.
    </div>
  `;
}