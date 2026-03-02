import { useState, useEffect, useRef } from "react";

const STORAGE_KEYS = {
  profile: "gym_profile",
  sessions: "gym_sessions",
  workoutLogs: "gym_workout_logs",
  nutritionLogs: "gym_nutrition_logs",
  photos: "gym_photos",
};

const defaultProfile = {
  name: "", weight: "", height: "", goal: "muscle_gain",
  daysPerWeek: 4, minutesPerSession: 60, proteinTarget: 150,
};

const WGER_BASE = "https://wger.de/api/v2";

// ExerciseDB open dataset - animated GIFs, no API key needed
// Base URL: https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/{id}/images/0.jpg
const GIF_BASE = "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises";

// Curated exercise instructions for the most common exercises
const EXERCISE_TIPS = {
  "Bench Press": "Lie flat, grip slightly wider than shoulder-width. Lower the bar to mid-chest with control, keeping elbows at ~75°. Press up explosively. Keep your feet flat, back slightly arched, and shoulder blades retracted throughout.",
  "Squat": "Bar on upper traps, feet shoulder-width. Brace core, push knees out, sit back and down until thighs are parallel to floor. Drive through heels to stand. Keep chest tall and don't let knees cave inward.",
  "Deadlift": "Bar over mid-foot, hip-width stance. Hinge at hips to grip bar, lats tight, chest up. Drive floor away with legs, then lock hips through at the top. Keep bar close to body the whole way.",
  "Pull-ups": "Hang from bar with overhand grip wider than shoulders. Pull elbows down and back, bringing chest toward bar. Lower with control. Avoid kipping — full range of motion builds the most muscle.",
  "Overhead Press": "Bar at shoulder level, grip just outside shoulders. Brace core hard. Press straight up, slightly back behind ears at lockout. Lower with control. Keep rib cage down — don't hyperextend lower back.",
  "Romanian Deadlift": "Hold bar at hips, soft knee bend. Push hips back, lowering bar along legs until you feel hamstring stretch (usually mid-shin). Drive hips forward to stand. Keep back flat throughout.",
  "Dumbbell Row": "Place knee and hand on bench for support. Pull dumbbell to hip, keeping elbow close to body. Lower with control. Drive elbow back, not just the hand — focus on feeling your lat contract.",
  "Barbell Row": "Hip-hinge until torso is ~45°, grip shoulder-width. Pull bar to lower chest/belly button, squeezing shoulder blades together at top. Lower with control. Keep head neutral.",
  "Lat Pulldown": "Grip bar wider than shoulders, slight lean back. Pull bar to upper chest, driving elbows down and back. Squeeze lats at bottom. Control the return — don't let weight yank you up.",
  "Leg Press": "Feet shoulder-width on platform. Lower sled until knees reach ~90°, then press through full foot. Never lock knees fully at top. Keep lower back pressed into pad throughout.",
  "Dumbbell Curl": "Stand with dumbbells at sides. Curl up, rotating palms to ceiling at top. Squeeze bicep hard at peak. Lower slowly — the eccentric builds muscle too. Keep elbows pinned at sides.",
  "Tricep Pushdown": "Stand at cable, grip bar/rope at chest height. Keeping elbows pinned to sides, press down until arms fully extended. Squeeze triceps. Let handles rise back to start with control.",
  "Lateral Raises": "Stand with dumbbells at sides, slight elbow bend. Raise arms to shoulder height, leading with elbows not hands. Pause briefly at top. Lower slowly — 3-4 seconds down builds more muscle.",
  "Plank": "Forearms on floor, body in straight line from head to heels. Brace abs hard, squeeze glutes, keep hips level. Don't let hips sag or pike. Breathe normally. Progress by increasing time.",
  "Hip Thrust": "Shoulders on bench, bar on hips with pad. Drive through heels, thrusting hips up until body is flat. Squeeze glutes hard at top for 1 second. Lower until glutes nearly touch floor.",
  "Face Pulls": "Cable at head height, rope attachment. Pull toward face, hands moving to ears, elbows flaring wide. Squeeze rear delts and rotator cuff at end. Light weight with perfect form here.",
  "Skull Crushers": "Lie on bench, bar above forehead with elbows vertical. Hinge only at elbows, lowering bar toward forehead. Press back up without moving upper arms. Keep elbows pointing straight up.",
  "Arnold Press": "Hold dumbbells at shoulder height, palms facing you. As you press up, rotate palms to face forward. Reverse on the way down. The rotation hits all three delt heads in one movement.",
};

const MUSCLE_ID_MAP = {
  chest: [4], "upper chest": [4], pecs: [4],
  lats: [12], "mid-back": [9], rhomboids: [9], "entire back": [12, 9, 8],
  shoulders: [2], "all delts": [2], "side delts": [2], "front delts": [2], "rear delts": [13],
  biceps: [1], brachialis: [1],
  triceps: [5],
  quads: [10], glutes: [8], hamstrings: [11], calves: [7],
  abs: [6], core: [6], "lower abs": [6], obliques: [14],
};

const EXERCISE_DB = {
  chest: [
    { name: "Bench Press", muscles: ["chest", "triceps", "shoulders"], equipment: "barbell", wgerId: 192, gifId: "0026" },
    { name: "Incline Bench Press", muscles: ["upper chest", "shoulders"], equipment: "barbell", wgerId: 314, gifId: "0190" },
    { name: "Decline Bench Press", muscles: ["chest", "triceps"], equipment: "barbell", wgerId: 0, gifId: "0058" },
    { name: "Dumbbell Bench Press", muscles: ["chest", "triceps"], equipment: "dumbbell", wgerId: 0, gifId: "0082" },
    { name: "Incline Dumbbell Press", muscles: ["upper chest", "shoulders"], equipment: "dumbbell", wgerId: 0, gifId: "0192" },
    { name: "Dumbbell Flyes", muscles: ["chest"], equipment: "dumbbell", wgerId: 119, gifId: "0084" },
    { name: "Incline Dumbbell Flyes", muscles: ["upper chest"], equipment: "dumbbell", wgerId: 0, gifId: "0194" },
    { name: "Push-ups", muscles: ["chest", "triceps"], equipment: "bodyweight", wgerId: 10, gifId: "0720" },
    { name: "Wide Push-ups", muscles: ["chest"], equipment: "bodyweight", wgerId: 0, gifId: "0721" },
    { name: "Cable Crossover", muscles: ["chest"], equipment: "cable", wgerId: 351, gifId: "1174" },
    { name: "Low Cable Fly", muscles: ["upper chest"], equipment: "cable", wgerId: 0, gifId: "1175" },
    { name: "Dips", muscles: ["chest", "triceps"], equipment: "bodyweight", wgerId: 37, gifId: "0235" },
    { name: "Pec Deck Machine", muscles: ["chest"], equipment: "machine", wgerId: 0, gifId: "0868" },
    { name: "Chest Press Machine", muscles: ["chest", "triceps"], equipment: "machine", wgerId: 0, gifId: "0869" },
  ],
  back: [
    { name: "Pull-ups", muscles: ["lats", "biceps"], equipment: "bodyweight", wgerId: 31, gifId: "0700" },
    { name: "Chin-ups", muscles: ["lats", "biceps"], equipment: "bodyweight", wgerId: 0, gifId: "0176" },
    { name: "Wide Grip Pull-ups", muscles: ["lats"], equipment: "bodyweight", wgerId: 0, gifId: "0701" },
    { name: "Barbell Row", muscles: ["lats", "rhomboids"], equipment: "barbell", wgerId: 167, gifId: "0020" },
    { name: "Pendlay Row", muscles: ["lats", "rhomboids"], equipment: "barbell", wgerId: 0, gifId: "0021" },
    { name: "T-Bar Row", muscles: ["lats", "mid-back"], equipment: "barbell", wgerId: 0, gifId: "0813" },
    { name: "Lat Pulldown", muscles: ["lats"], equipment: "machine", wgerId: 122, gifId: "0290" },
    { name: "Close Grip Pulldown", muscles: ["lats", "biceps"], equipment: "cable", wgerId: 0, gifId: "0292" },
    { name: "Seated Cable Row", muscles: ["mid-back"], equipment: "cable", wgerId: 239, gifId: "0763" },
    { name: "Deadlift", muscles: ["entire back", "hamstrings"], equipment: "barbell", wgerId: 241, gifId: "0207" },
    { name: "Sumo Deadlift", muscles: ["entire back", "glutes"], equipment: "barbell", wgerId: 0, gifId: "0208" },
    { name: "Rack Pull", muscles: ["entire back"], equipment: "barbell", wgerId: 0, gifId: "0735" },
    { name: "Dumbbell Row", muscles: ["lats", "rhomboids"], equipment: "dumbbell", wgerId: 321, gifId: "0110" },
    { name: "Shrugs", muscles: ["traps"], equipment: "dumbbell", wgerId: 0, gifId: "0790" },
    { name: "Barbell Shrugs", muscles: ["traps"], equipment: "barbell", wgerId: 0, gifId: "0027" },
    { name: "Hyperextensions", muscles: ["entire back", "glutes"], equipment: "bodyweight", wgerId: 0, gifId: "0387" },
    { name: "Cable Pullover", muscles: ["lats"], equipment: "cable", wgerId: 0, gifId: "1458" },
  ],
  shoulders: [
    { name: "Overhead Press", muscles: ["shoulders", "triceps"], equipment: "barbell", wgerId: 65, gifId: "0047" },
    { name: "Seated Overhead Press", muscles: ["shoulders", "triceps"], equipment: "barbell", wgerId: 0, gifId: "0048" },
    { name: "Dumbbell Shoulder Press", muscles: ["shoulders", "triceps"], equipment: "dumbbell", wgerId: 0, gifId: "0096" },
    { name: "Seated Dumbbell Press", muscles: ["shoulders", "triceps"], equipment: "dumbbell", wgerId: 0, gifId: "0756" },
    { name: "Arnold Press", muscles: ["all delts"], equipment: "dumbbell", wgerId: 113, gifId: "0062" },
    { name: "Lateral Raises", muscles: ["side delts"], equipment: "dumbbell", wgerId: 526, gifId: "0294" },
    { name: "Cable Lateral Raise", muscles: ["side delts"], equipment: "cable", wgerId: 0, gifId: "0155" },
    { name: "Front Raises", muscles: ["front delts"], equipment: "dumbbell", wgerId: 527, gifId: "0265" },
    { name: "Face Pulls", muscles: ["rear delts"], equipment: "cable", wgerId: 346, gifId: "0259" },
    { name: "Reverse Flyes", muscles: ["rear delts", "rhomboids"], equipment: "dumbbell", wgerId: 0, gifId: "0745" },
    { name: "Upright Row", muscles: ["side delts", "traps"], equipment: "barbell", wgerId: 0, gifId: "0842" },
    { name: "Push Press", muscles: ["shoulders", "triceps", "quads"], equipment: "barbell", wgerId: 0, gifId: "0716" },
  ],
  legs: [
    { name: "Squat", muscles: ["quads", "glutes", "hamstrings"], equipment: "barbell", wgerId: 6, gifId: "0802" },
    { name: "Front Squat", muscles: ["quads", "glutes"], equipment: "barbell", wgerId: 0, gifId: "0269" },
    { name: "Box Squat", muscles: ["quads", "glutes"], equipment: "barbell", wgerId: 0, gifId: "0803" },
    { name: "Goblet Squat", muscles: ["quads", "glutes"], equipment: "dumbbell", wgerId: 0, gifId: "1460" },
    { name: "Bulgarian Split Squat", muscles: ["quads", "glutes"], equipment: "dumbbell", wgerId: 0, gifId: "1462" },
    { name: "Romanian Deadlift", muscles: ["hamstrings", "glutes"], equipment: "barbell", wgerId: 157, gifId: "0607" },
    { name: "Stiff-leg Deadlift", muscles: ["hamstrings", "glutes"], equipment: "barbell", wgerId: 0, gifId: "0608" },
    { name: "Good Mornings", muscles: ["hamstrings", "entire back"], equipment: "barbell", wgerId: 0, gifId: "0300" },
    { name: "Leg Press", muscles: ["quads", "glutes"], equipment: "machine", wgerId: 127, gifId: "0306" },
    { name: "Hack Squat", muscles: ["quads", "glutes"], equipment: "machine", wgerId: 0, gifId: "0323" },
    { name: "Lunges", muscles: ["quads", "glutes"], equipment: "dumbbell", wgerId: 99, gifId: "0339" },
    { name: "Walking Lunges", muscles: ["quads", "glutes"], equipment: "dumbbell", wgerId: 0, gifId: "0340" },
    { name: "Reverse Lunges", muscles: ["quads", "glutes"], equipment: "dumbbell", wgerId: 0, gifId: "0341" },
    { name: "Step-ups", muscles: ["quads", "glutes"], equipment: "dumbbell", wgerId: 0, gifId: "0806" },
    { name: "Leg Curl", muscles: ["hamstrings"], equipment: "machine", wgerId: 126, gifId: "0302" },
    { name: "Seated Leg Curl", muscles: ["hamstrings"], equipment: "machine", wgerId: 0, gifId: "0766" },
    { name: "Leg Extension", muscles: ["quads"], equipment: "machine", wgerId: 0, gifId: "0303" },
    { name: "Hip Thrust", muscles: ["glutes", "hamstrings"], equipment: "barbell", wgerId: 0, gifId: "0381" },
    { name: "Glute Bridge", muscles: ["glutes"], equipment: "bodyweight", wgerId: 0, gifId: "1456" },
    { name: "Calf Raises", muscles: ["calves"], equipment: "machine", wgerId: 128, gifId: "0146" },
    { name: "Seated Calf Raises", muscles: ["calves"], equipment: "machine", wgerId: 0, gifId: "0762" },
    { name: "Wall Sit", muscles: ["quads"], equipment: "bodyweight", wgerId: 0, gifId: "0849" },
    { name: "Jump Squats", muscles: ["quads", "glutes"], equipment: "bodyweight", wgerId: 0, gifId: "0801" },
  ],
  biceps: [
    { name: "Barbell Curl", muscles: ["biceps"], equipment: "barbell", wgerId: 86, gifId: "0020" },
    { name: "EZ Bar Curl", muscles: ["biceps"], equipment: "barbell", wgerId: 0, gifId: "0246" },
    { name: "Dumbbell Curl", muscles: ["biceps"], equipment: "dumbbell", wgerId: 228, gifId: "0222" },
    { name: "Alternating Dumbbell Curl", muscles: ["biceps"], equipment: "dumbbell", wgerId: 0, gifId: "0065" },
    { name: "Incline Dumbbell Curl", muscles: ["biceps"], equipment: "dumbbell", wgerId: 0, gifId: "0200" },
    { name: "Hammer Curl", muscles: ["biceps", "brachialis"], equipment: "dumbbell", wgerId: 396, gifId: "0356" },
    { name: "Cross Body Hammer Curl", muscles: ["biceps", "brachialis"], equipment: "dumbbell", wgerId: 0, gifId: "0042" },
    { name: "Preacher Curl", muscles: ["biceps"], equipment: "barbell", wgerId: 294, gifId: "0706" },
    { name: "Concentration Curl", muscles: ["biceps"], equipment: "dumbbell", wgerId: 0, gifId: "0182" },
    { name: "Cable Curl", muscles: ["biceps"], equipment: "cable", wgerId: 383, gifId: "0148" },
    { name: "Reverse Curl", muscles: ["brachialis"], equipment: "barbell", wgerId: 0, gifId: "0744" },
    { name: "Zottman Curl", muscles: ["biceps", "brachialis"], equipment: "dumbbell", wgerId: 0, gifId: "0876" },
  ],
  triceps: [
    { name: "Skull Crushers", muscles: ["triceps"], equipment: "barbell", wgerId: 69, gifId: "0796" },
    { name: "EZ Bar Skull Crushers", muscles: ["triceps"], equipment: "barbell", wgerId: 0, gifId: "0248" },
    { name: "Tricep Pushdown", muscles: ["triceps"], equipment: "cable", wgerId: 198, gifId: "0830" },
    { name: "Rope Pushdown", muscles: ["triceps"], equipment: "cable", wgerId: 0, gifId: "0831" },
    { name: "Overhead Tricep Extension", muscles: ["triceps"], equipment: "dumbbell", wgerId: 114, gifId: "0663" },
    { name: "Cable Overhead Extension", muscles: ["triceps"], equipment: "cable", wgerId: 0, gifId: "0151" },
    { name: "Single Arm Overhead Extension", muscles: ["triceps"], equipment: "dumbbell", wgerId: 0, gifId: "0664" },
    { name: "Diamond Push-ups", muscles: ["triceps"], equipment: "bodyweight", wgerId: 10, gifId: "1070" },
    { name: "Tricep Dips", muscles: ["triceps", "chest"], equipment: "bodyweight", wgerId: 37, gifId: "0827" },
    { name: "Bench Dips", muscles: ["triceps"], equipment: "bodyweight", wgerId: 0, gifId: "0077" },
    { name: "Close-grip Bench Press", muscles: ["triceps", "chest"], equipment: "barbell", wgerId: 75, gifId: "0179" },
    { name: "Kickbacks", muscles: ["triceps"], equipment: "dumbbell", wgerId: 0, gifId: "0285" },
  ],
  core: [
    { name: "Plank", muscles: ["core"], equipment: "bodyweight", wgerId: 45, gifId: "0700" },
    { name: "Side Plank", muscles: ["obliques"], equipment: "bodyweight", wgerId: 0, gifId: "0793" },
    { name: "Crunches", muscles: ["abs"], equipment: "bodyweight", wgerId: 91, gifId: "0203" },
    { name: "Bicycle Crunches", muscles: ["abs", "obliques"], equipment: "bodyweight", wgerId: 0, gifId: "0078" },
    { name: "Reverse Crunches", muscles: ["lower abs"], equipment: "bodyweight", wgerId: 0, gifId: "0742" },
    { name: "Leg Raises", muscles: ["lower abs"], equipment: "bodyweight", wgerId: 85, gifId: "0305" },
    { name: "Hanging Leg Raises", muscles: ["lower abs"], equipment: "bodyweight", wgerId: 0, gifId: "0360" },
    { name: "Russian Twists", muscles: ["obliques"], equipment: "bodyweight", wgerId: 346, gifId: "0752" },
    { name: "Cable Crunches", muscles: ["abs"], equipment: "cable", wgerId: 116, gifId: "0152" },
    { name: "Ab Wheel Rollout", muscles: ["core", "abs"], equipment: "bodyweight", wgerId: 0, gifId: "0001" },
    { name: "Mountain Climbers", muscles: ["core", "abs"], equipment: "bodyweight", wgerId: 0, gifId: "0630" },
    { name: "V-ups", muscles: ["abs", "lower abs"], equipment: "bodyweight", wgerId: 0, gifId: "0840" },
    { name: "Flutter Kicks", muscles: ["lower abs"], equipment: "bodyweight", wgerId: 0, gifId: "0263" },
  ],
  cardio: [
    { name: "Burpees", muscles: ["quads", "chest", "core"], equipment: "bodyweight", wgerId: 0, gifId: "0130" },
    { name: "Box Jumps", muscles: ["quads", "glutes"], equipment: "bodyweight", wgerId: 0, gifId: "0119" },
    { name: "Jump Rope", muscles: ["calves", "core"], equipment: "bodyweight", wgerId: 0, gifId: "0415" },
    { name: "Kettlebell Swing", muscles: ["glutes", "hamstrings", "core"], equipment: "dumbbell", wgerId: 0, gifId: "0424" },
    { name: "Battle Ropes", muscles: ["shoulders", "core"], equipment: "bodyweight", wgerId: 0, gifId: "0073" },
    { name: "Farmer's Walk", muscles: ["traps", "core", "quads"], equipment: "dumbbell", wgerId: 0, gifId: "0258" },
    { name: "Sled Push", muscles: ["quads", "glutes", "shoulders"], equipment: "machine", wgerId: 0, gifId: "0797" },
  ],
  olympic: [
    { name: "Power Clean", muscles: ["entire back", "quads", "shoulders"], equipment: "barbell", wgerId: 0, gifId: "0704" },
    { name: "Hang Clean", muscles: ["entire back", "quads"], equipment: "barbell", wgerId: 0, gifId: "0357" },
    { name: "Clean and Jerk", muscles: ["entire back", "shoulders", "quads"], equipment: "barbell", wgerId: 0, gifId: "0178" },
    { name: "Snatch", muscles: ["entire back", "shoulders"], equipment: "barbell", wgerId: 0, gifId: "0798" },
    { name: "Overhead Squat", muscles: ["quads", "shoulders", "core"], equipment: "barbell", wgerId: 0, gifId: "0665" },
  ],
  stretching: [
    { name: "Hip Flexor Stretch", muscles: ["quads", "glutes"], equipment: "bodyweight", wgerId: 0, gifId: "0383" },
    { name: "Hamstring Stretch", muscles: ["hamstrings"], equipment: "bodyweight", wgerId: 0, gifId: "0355" },
    { name: "Quad Stretch", muscles: ["quads"], equipment: "bodyweight", wgerId: 0, gifId: "0726" },
    { name: "Cat-Cow", muscles: ["entire back", "core"], equipment: "bodyweight", wgerId: 0, gifId: "0141" },
    { name: "Child's Pose", muscles: ["lats", "entire back"], equipment: "bodyweight", wgerId: 0, gifId: "1411" },
    { name: "Pigeon Pose", muscles: ["glutes"], equipment: "bodyweight", wgerId: 0, gifId: "1415" },
  ],
};

const COMMON_FOODS = [
  { name: "Chicken Breast (100g)", protein: 31, calories: 165 },
  { name: "Egg (1 large)", protein: 6, calories: 78 },
  { name: "Greek Yogurt (100g)", protein: 10, calories: 59 },
  { name: "Tuna (100g)", protein: 28, calories: 132 },
  { name: "Whey Protein Shake", protein: 25, calories: 130 },
  { name: "Ground Beef (100g)", protein: 26, calories: 254 },
  { name: "Salmon (100g)", protein: 25, calories: 208 },
  { name: "Cottage Cheese (100g)", protein: 11, calories: 98 },
  { name: "Lentils (100g cooked)", protein: 9, calories: 116 },
  { name: "Tofu (100g)", protein: 8, calories: 76 },
];

async function callClaude(messages, systemPrompt, maxTokens = 1000) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: maxTokens, system: systemPrompt, messages }),
  });
  const data = await response.json();
  return data.content?.map(b => b.text || "").join("") || "";
}

function load(key, def) { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : def; } catch { return def; } }
function save(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} }

// ─── MUSCLE MAP SVG ───────────────────────────────────────────────────────────
function MuscleMap({ muscles = [], size = 120 }) {
  const allMuscleIds = new Set();
  muscles.forEach(m => {
    const ids = MUSCLE_ID_MAP[m.toLowerCase()] || [];
    ids.forEach(id => allMuscleIds.add(id));
  });
  const isActive = (...ids) => ids.some(id => allMuscleIds.has(id));
  const mc = (active) => active ? "#e63c2f" : "#2a2a3a";
  const mf = (active) => active ? "rgba(230,60,47,0.65)" : "rgba(30,30,42,0.6)";

  return (
    <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
      <svg width={size * 0.52} height={size} viewBox="0 0 110 210">
        <ellipse cx="55" cy="24" rx="18" ry="20" fill="#1a1a2e" stroke="#333" strokeWidth="1.5"/>
        <rect x="34" y="44" width="42" height="58" rx="8" fill="#1a1a2e" stroke="#333" strokeWidth="1.5"/>
        <rect x="14" y="46" width="20" height="52" rx="8" fill="#1a1a2e" stroke="#333" strokeWidth="1.5"/>
        <rect x="76" y="46" width="20" height="52" rx="8" fill="#1a1a2e" stroke="#333" strokeWidth="1.5"/>
        <rect x="34" y="102" width="18" height="66" rx="8" fill="#1a1a2e" stroke="#333" strokeWidth="1.5"/>
        <rect x="58" y="102" width="18" height="66" rx="8" fill="#1a1a2e" stroke="#333" strokeWidth="1.5"/>
        {/* Chest */}
        <ellipse cx="44" cy="62" rx="9" ry="9" fill={mf(isActive(4))} stroke={mc(isActive(4))} strokeWidth="1.5"/>
        <ellipse cx="66" cy="62" rx="9" ry="9" fill={mf(isActive(4))} stroke={mc(isActive(4))} strokeWidth="1.5"/>
        {/* Shoulders */}
        <ellipse cx="28" cy="52" rx="8" ry="8" fill={mf(isActive(2))} stroke={mc(isActive(2))} strokeWidth="1.5"/>
        <ellipse cx="82" cy="52" rx="8" ry="8" fill={mf(isActive(2))} stroke={mc(isActive(2))} strokeWidth="1.5"/>
        {/* Biceps */}
        <rect x="15" y="54" width="17" height="22" rx="6" fill={mf(isActive(1))} stroke={mc(isActive(1))} strokeWidth="1.5"/>
        <rect x="78" y="54" width="17" height="22" rx="6" fill={mf(isActive(1))} stroke={mc(isActive(1))} strokeWidth="1.5"/>
        {/* Abs */}
        <rect x="44" y="74" width="9" height="9" rx="2.5" fill={mf(isActive(6))} stroke={mc(isActive(6))} strokeWidth="1.5"/>
        <rect x="57" y="74" width="9" height="9" rx="2.5" fill={mf(isActive(6))} stroke={mc(isActive(6))} strokeWidth="1.5"/>
        <rect x="44" y="86" width="9" height="9" rx="2.5" fill={mf(isActive(6))} stroke={mc(isActive(6))} strokeWidth="1.5"/>
        <rect x="57" y="86" width="9" height="9" rx="2.5" fill={mf(isActive(6))} stroke={mc(isActive(6))} strokeWidth="1.5"/>
        {/* Obliques */}
        <ellipse cx="35" cy="86" rx="4.5" ry="9" fill={mf(isActive(14))} stroke={mc(isActive(14))} strokeWidth="1.5"/>
        <ellipse cx="75" cy="86" rx="4.5" ry="9" fill={mf(isActive(14))} stroke={mc(isActive(14))} strokeWidth="1.5"/>
        {/* Quads */}
        <rect x="36" y="106" width="14" height="40" rx="6" fill={mf(isActive(10))} stroke={mc(isActive(10))} strokeWidth="1.5"/>
        <rect x="60" y="106" width="14" height="40" rx="6" fill={mf(isActive(10))} stroke={mc(isActive(10))} strokeWidth="1.5"/>
        {/* Calves */}
        <rect x="36" y="150" width="14" height="16" rx="5" fill={mf(isActive(7))} stroke={mc(isActive(7))} strokeWidth="1.5"/>
        <rect x="60" y="150" width="14" height="16" rx="5" fill={mf(isActive(7))} stroke={mc(isActive(7))} strokeWidth="1.5"/>
        <text x="55" y="204" textAnchor="middle" fill="#444" fontSize="8" fontFamily="Syne">FRONT</text>
      </svg>
      <svg width={size * 0.52} height={size} viewBox="0 0 110 210">
        <ellipse cx="55" cy="24" rx="18" ry="20" fill="#1a1a2e" stroke="#333" strokeWidth="1.5"/>
        <rect x="34" y="44" width="42" height="58" rx="8" fill="#1a1a2e" stroke="#333" strokeWidth="1.5"/>
        <rect x="14" y="46" width="20" height="52" rx="8" fill="#1a1a2e" stroke="#333" strokeWidth="1.5"/>
        <rect x="76" y="46" width="20" height="52" rx="8" fill="#1a1a2e" stroke="#333" strokeWidth="1.5"/>
        <rect x="34" y="102" width="18" height="66" rx="8" fill="#1a1a2e" stroke="#333" strokeWidth="1.5"/>
        <rect x="58" y="102" width="18" height="66" rx="8" fill="#1a1a2e" stroke="#333" strokeWidth="1.5"/>
        {/* Lats */}
        <ellipse cx="40" cy="74" rx="7" ry="16" fill={mf(isActive(12))} stroke={mc(isActive(12))} strokeWidth="1.5"/>
        <ellipse cx="70" cy="74" rx="7" ry="16" fill={mf(isActive(12))} stroke={mc(isActive(12))} strokeWidth="1.5"/>
        {/* Traps */}
        <ellipse cx="55" cy="54" rx="14" ry="9" fill={mf(isActive(9))} stroke={mc(isActive(9))} strokeWidth="1.5"/>
        {/* Lower back */}
        <rect x="44" y="92" width="22" height="12" rx="4" fill={mf(isActive(8))} stroke={mc(isActive(8))} strokeWidth="1.5"/>
        {/* Rear delts */}
        <ellipse cx="28" cy="51" rx="7" ry="7" fill={mf(isActive(13))} stroke={mc(isActive(13))} strokeWidth="1.5"/>
        <ellipse cx="82" cy="51" rx="7" ry="7" fill={mf(isActive(13))} stroke={mc(isActive(13))} strokeWidth="1.5"/>
        {/* Triceps */}
        <rect x="15" y="58" width="17" height="20" rx="6" fill={mf(isActive(5))} stroke={mc(isActive(5))} strokeWidth="1.5"/>
        <rect x="78" y="58" width="17" height="20" rx="6" fill={mf(isActive(5))} stroke={mc(isActive(5))} strokeWidth="1.5"/>
        {/* Glutes */}
        <ellipse cx="44" cy="105" rx="9" ry="7" fill={mf(isActive(8))} stroke={mc(isActive(8))} strokeWidth="1.5"/>
        <ellipse cx="66" cy="105" rx="9" ry="7" fill={mf(isActive(8))} stroke={mc(isActive(8))} strokeWidth="1.5"/>
        {/* Hamstrings */}
        <rect x="36" y="110" width="14" height="38" rx="6" fill={mf(isActive(11))} stroke={mc(isActive(11))} strokeWidth="1.5"/>
        <rect x="60" y="110" width="14" height="38" rx="6" fill={mf(isActive(11))} stroke={mc(isActive(11))} strokeWidth="1.5"/>
        {/* Calves back */}
        <rect x="36" y="150" width="14" height="16" rx="5" fill={mf(isActive(7))} stroke={mc(isActive(7))} strokeWidth="1.5"/>
        <rect x="60" y="150" width="14" height="16" rx="5" fill={mf(isActive(7))} stroke={mc(isActive(7))} strokeWidth="1.5"/>
        <text x="55" y="204" textAnchor="middle" fill="#444" fontSize="8" fontFamily="Syne">BACK</text>
      </svg>
    </div>
  );
}

// ─── EXERCISE DEMO MODAL ──────────────────────────────────────────────────────
// Uses ExerciseDB open dataset hosted on GitHub — no API key, loads instantly.
// Each exercise has a gifId that maps to animated GIF images.
// We try image index 0 and 1 (start/end frame). If gifId missing, show fallback.
function ExerciseDemo({ exercise, onClose }) {
  const [imgFailed, setImgFailed] = useState(false);

  const gifId = exercise.gifId;
  // ExerciseDB stores images at: /exercises/{id}/images/0.jpg and /exercises/{id}/images/1.jpg
  const imgUrl = gifId ? `${GIF_BASE}/${gifId}/images/0.jpg` : null;
  const img2Url = gifId ? `${GIF_BASE}/${gifId}/images/1.jpg` : null;
  const [showSecond, setShowSecond] = useState(false);
  const [img2Failed, setImg2Failed] = useState(false);

  const tip = EXERCISE_TIPS[exercise.name] ||
    `Keep full control through every rep. Focus tension on the target muscles (${exercise.muscles?.join(", ")}). Avoid momentum. Rest 60–90s between sets for hypertrophy, 2–3 min for strength work.`;

  return (
    <div style={{ position: "fixed", inset: 0, background: "#0a0a0f", zIndex: 400, display: "flex", flexDirection: "column", maxWidth: 480, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ padding: "18px 20px 14px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid #1a1a24" }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 800, lineHeight: 1.2 }}>{exercise.name}</div>
          <div style={{ color: "#e63c2f", fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginTop: 4 }}>
            {exercise.equipment} · {exercise.muscles?.join(", ")}
          </div>
        </div>
        <button onClick={onClose} style={{ background: "#1a1a24", border: "1px solid #2a2a3a", borderRadius: 10, padding: 8, color: "#aaa", flexShrink: 0, marginLeft: 12 }}>
          <Icon name="close" size={18} />
        </button>
      </div>

      <div style={{ flex: 1, overflow: "auto", padding: "16px 18px 32px" }}>

        {/* Demo image */}
        {imgUrl && !imgFailed ? (
          <div style={{ marginBottom: 16 }}>
            <div style={{ borderRadius: 16, overflow: "hidden", background: "#111", border: "1px solid #1a1a24", position: "relative" }}>
              <img
                src={showSecond && !img2Failed ? img2Url : imgUrl}
                alt={exercise.name}
                style={{ width: "100%", display: "block", minHeight: 200, objectFit: "cover" }}
                onError={() => { if (showSecond) setImg2Failed(true); else setImgFailed(true); }}
              />
              {/* Position label */}
              <div style={{ position: "absolute", bottom: 10, left: 10, background: "rgba(0,0,0,0.7)", borderRadius: 6, padding: "3px 8px", fontSize: 10, fontWeight: 700, color: "#e8e4dc", letterSpacing: 1 }}>
                {showSecond ? "POSITION 2" : "POSITION 1"}
              </div>
            </div>
            {/* Toggle between position 1 and 2 */}
            {!img2Failed && (
              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                <button
                  onClick={() => setShowSecond(false)}
                  style={{ flex: 1, background: !showSecond ? "#e63c2f" : "#111", border: `1px solid ${!showSecond ? "#e63c2f" : "#2a2a3a"}`, borderRadius: 8, padding: "8px", color: !showSecond ? "#fff" : "#666", fontSize: 12, fontWeight: 700 }}
                >
                  Start Position
                </button>
                <button
                  onClick={() => setShowSecond(true)}
                  style={{ flex: 1, background: showSecond ? "#e63c2f" : "#111", border: `1px solid ${showSecond ? "#e63c2f" : "#2a2a3a"}`, borderRadius: 8, padding: "8px", color: showSecond ? "#fff" : "#666", fontSize: 12, fontWeight: 700 }}
                >
                  End Position
                </button>
              </div>
            )}
          </div>
        ) : (
          <div style={{ background: "#111", border: "1px solid #1a1a24", borderRadius: 16, padding: "28px 20px", marginBottom: 16, textAlign: "center" }}>
            <div style={{ fontSize: 44, marginBottom: 10 }}>🏋️</div>
            <div style={{ color: "#555", fontSize: 14, fontWeight: 600 }}>No image available</div>
            <a
              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(exercise.name + " exercise form")}`}
              target="_blank" rel="noreferrer"
              style={{ display: "inline-block", marginTop: 10, color: "#e63c2f", fontSize: 13, fontWeight: 700 }}
            >
              Watch on YouTube →
            </a>
          </div>
        )}

        {/* Muscles activated */}
        <div style={{ background: "#111", border: "1px solid #1a1a24", borderRadius: 14, padding: 16, marginBottom: 14 }}>
          <div style={{ fontSize: 10, letterSpacing: 2, color: "#e63c2f", fontWeight: 700, textTransform: "uppercase", marginBottom: 12 }}>Muscles Activated</div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <MuscleMap muscles={exercise.muscles || []} size={150} />
            <div style={{ flex: 1 }}>
              {exercise.muscles?.map(m => (
                <div key={m} style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 7 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: "#e63c2f", flexShrink: 0 }} />
                  <div style={{ fontSize: 13, fontWeight: 600, textTransform: "capitalize" }}>{m}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form tips */}
        <div style={{ background: "#111", border: "1px solid #1a1a24", borderRadius: 14, padding: 16 }}>
          <div style={{ fontSize: 10, letterSpacing: 2, color: "#e63c2f", fontWeight: 700, textTransform: "uppercase", marginBottom: 12 }}>Form Tips</div>
          <div style={{ fontSize: 14, lineHeight: 1.8, color: "#bbb" }}>{tip}</div>
        </div>

      </div>
    </div>
  );
}

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 20 }) => {
  const icons = {
    dumbbell: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.4 14.4 9.6 9.6"/><path d="M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767 1.768a2 2 0 1 1-2.829-2.829l6.364-6.364a2 2 0 1 1 2.829 2.829l-1.768 1.767a2 2 0 1 1 2.828 2.829z"/><path d="m21.5 21.5-1.4-1.4"/><path d="M3.9 3.9 2.5 2.5"/><path d="M6.404 12.768a2 2 0 1 1-2.829-2.829l1.768-1.767a2 2 0 1 1-2.828-2.829l2.828-2.828a2 2 0 1 1 2.829 2.828l1.767-1.768a2 2 0 1 1 2.829 2.829z"/></svg>,
    chart: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>,
    apple: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06z"/><path d="M10 2c1 .5 2 2 2 5"/></svg>,
    camera: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z"/><circle cx="12" cy="13" r="3"/></svg>,
    plus: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    brain: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2z"/></svg>,
    check: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
    trash: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
    swap: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>,
    user: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    close: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    arrow: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>,
    star: <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    send: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
    info: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
  };
  return icons[name] || null;
};

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function GymTracker() {
  const [tab, setTab] = useState("sessions");
  const [profile, setProfile] = useState(() => load(STORAGE_KEYS.profile, defaultProfile));
  const [sessions, setSessions] = useState(() => load(STORAGE_KEYS.sessions, []));
  const [workoutLogs, setWorkoutLogs] = useState(() => load(STORAGE_KEYS.workoutLogs, []));
  const [nutritionLogs, setNutritionLogs] = useState(() => load(STORAGE_KEYS.nutritionLogs, []));
  const [photos, setPhotos] = useState(() => load(STORAGE_KEYS.photos, []));
  const [showProfileSetup, setShowProfileSetup] = useState(!profile.name);

  useEffect(() => { save(STORAGE_KEYS.profile, profile); }, [profile]);
  useEffect(() => { save(STORAGE_KEYS.sessions, sessions); }, [sessions]);
  useEffect(() => { save(STORAGE_KEYS.workoutLogs, workoutLogs); }, [workoutLogs]);
  useEffect(() => { save(STORAGE_KEYS.nutritionLogs, nutritionLogs); }, [nutritionLogs]);
  useEffect(() => { save(STORAGE_KEYS.photos, photos); }, [photos]);

  const tabs = [
    { id: "sessions", label: "Training", icon: "dumbbell" },
    { id: "track", label: "Log", icon: "check" },
    { id: "stats", label: "Stats", icon: "chart" },
    { id: "nutrition", label: "Nutrition", icon: "apple" },
    { id: "photos", label: "Progress", icon: "camera" },
    { id: "ai", label: "AI Coach", icon: "brain" },
  ];

  return (
    <div style={{ fontFamily: "'Syne', sans-serif", background: "#0a0a0f", minHeight: "100vh", color: "#e8e4dc", display: "flex", flexDirection: "column", maxWidth: 480, margin: "0 auto" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #111; } ::-webkit-scrollbar-thumb { background: #e63c2f; border-radius: 2px; }
        input, textarea, select, button { font-family: 'Syne', sans-serif; }
        button { cursor: pointer; }
        .slide-in { animation: slideIn 0.25s ease; }
        @keyframes slideIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .pulse { animation: pulse 1.8s ease infinite; }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
      `}</style>

      <div style={{ padding: "18px 20px 10px", borderBottom: "1px solid #1a1a24", background: "#0a0a0f", position: "sticky", top: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 10, letterSpacing: 4, color: "#e63c2f", textTransform: "uppercase", fontWeight: 700 }}>Iron Protocol</div>
          <div style={{ fontSize: 17, fontWeight: 800 }}>{profile.name || "Set up profile"}</div>
        </div>
        <button onClick={() => setShowProfileSetup(true)} style={{ background: "#1a1a24", border: "1px solid #2a2a3a", borderRadius: 10, padding: "7px 12px", color: "#e8e4dc", display: "flex", alignItems: "center", gap: 5, fontSize: 12 }}>
          <Icon name="user" size={14} /> Profile
        </button>
      </div>

      <div style={{ flex: 1, overflow: "auto", paddingBottom: 80 }}>
        {tab === "sessions" && <SessionsTab sessions={sessions} setSessions={setSessions} profile={profile} workoutLogs={workoutLogs} />}
        {tab === "track" && <TrackTab sessions={sessions} workoutLogs={workoutLogs} setWorkoutLogs={setWorkoutLogs} />}
        {tab === "stats" && <StatsTab workoutLogs={workoutLogs} setWorkoutLogs={setWorkoutLogs} />}
        {tab === "nutrition" && <NutritionTab nutritionLogs={nutritionLogs} setNutritionLogs={setNutritionLogs} profile={profile} workoutLogs={workoutLogs} />}
        {tab === "photos" && <PhotosTab photos={photos} setPhotos={setPhotos} />}
        {tab === "ai" && <AICoachTab profile={profile} sessions={sessions} workoutLogs={workoutLogs} nutritionLogs={nutritionLogs} photos={photos} setSessions={setSessions} />}
      </div>

      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: "#0d0d18", borderTop: "1px solid #1a1a24", display: "flex", padding: "8px 4px 12px", zIndex: 100 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, background: "none", border: "none", padding: "5px 2px", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, color: tab === t.id ? "#e63c2f" : "#444", transition: "color 0.15s" }}>
            <Icon name={t.icon} size={19} />
            <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: 0.5 }}>{t.label}</span>
          </button>
        ))}
      </div>

      {showProfileSetup && <ProfileModal profile={profile} setProfile={setProfile} onClose={() => setShowProfileSetup(false)} />}
    </div>
  );
}

// ─── PROFILE MODAL ────────────────────────────────────────────────────────────
function ProfileModal({ profile, setProfile, onClose }) {
  const [form, setForm] = useState(profile);
  const doSave = () => { setProfile(form); onClose(); };
  const inp = (field, label, type = "text") => (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 10, letterSpacing: 2, color: "#e63c2f", marginBottom: 4, fontWeight: 700, textTransform: "uppercase" }}>{label}</div>
      <input value={form[field] || ""} onChange={e => setForm({ ...form, [field]: e.target.value })} type={type}
        style={{ width: "100%", background: "#111", border: "1px solid #2a2a3a", borderRadius: 8, padding: "9px 12px", color: "#e8e4dc", fontSize: 14 }} />
    </div>
  );
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", zIndex: 200, display: "flex", alignItems: "flex-end" }}>
      <div style={{ background: "#0f0f1a", borderRadius: "18px 18px 0 0", padding: 22, width: "100%", maxHeight: "90vh", overflow: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div style={{ fontWeight: 800, fontSize: 19 }}>Your Profile</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#666" }}><Icon name="close" /></button>
        </div>
        {inp("name", "Name")}
        {inp("weight", "Weight (kg)", "number")}
        {inp("height", "Height (cm)", "number")}
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 10, letterSpacing: 2, color: "#e63c2f", marginBottom: 4, fontWeight: 700, textTransform: "uppercase" }}>Goal</div>
          <select value={form.goal} onChange={e => setForm({ ...form, goal: e.target.value })} style={{ width: "100%", background: "#111", border: "1px solid #2a2a3a", borderRadius: 8, padding: "9px 12px", color: "#e8e4dc", fontSize: 14 }}>
            <option value="muscle_gain">Muscle Gain</option>
            <option value="fat_loss">Fat Loss</option>
            <option value="strength">Strength</option>
            <option value="endurance">Endurance</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
          {[["daysPerWeek", "Gym Days/Week"], ["minutesPerSession", "Min/Session"]].map(([f, l]) => (
            <div key={f}>
              <div style={{ fontSize: 10, letterSpacing: 2, color: "#e63c2f", marginBottom: 4, fontWeight: 700, textTransform: "uppercase" }}>{l}</div>
              <input type="number" value={form[f]} onChange={e => setForm({ ...form, [f]: +e.target.value })} style={{ width: "100%", background: "#111", border: "1px solid #2a2a3a", borderRadius: 8, padding: "9px 12px", color: "#e8e4dc", fontSize: 14 }} />
            </div>
          ))}
        </div>
        {inp("proteinTarget", "Daily Protein Target (g)", "number")}
        <button onClick={doSave} style={{ width: "100%", background: "#e63c2f", border: "none", borderRadius: 12, padding: "13px", fontWeight: 800, fontSize: 15, color: "#fff", marginTop: 6 }}>Save Profile</button>
      </div>
    </div>
  );
}

// ─── SESSIONS TAB ─────────────────────────────────────────────────────────────
function SessionsTab({ sessions, setSessions, profile, workoutLogs }) {
  const [showCreate, setShowCreate] = useState(false);
  const [editSession, setEditSession] = useState(null);
  const [showAlts, setShowAlts] = useState(null);
  const [altResults, setAltResults] = useState(""); const [altLoading, setAltLoading] = useState(false);
  const [showDemo, setShowDemo] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const getAlternatives = async (exercise) => {
    setAltLoading(true); setAltResults("");
    try {
      const res = await callClaude([{ role: "user", content: `Give 4 alternatives for "${exercise.name}" (targets: ${exercise.muscles?.join(", ")}). For each briefly explain why it's a good substitute.` }], "You are a knowledgeable fitness coach. Be concise and practical.");
      setAltResults(res);
    } catch { setAltResults("Could not load alternatives."); }
    setAltLoading(false);
  };

  const getSessionMuscles = (s) => [...new Set((s.exercises || []).flatMap(e => e.muscles || []))];

  return (
    <div style={{ padding: 18 }} className="slide-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 800 }}>Training Sessions</div>
          <div style={{ color: "#555", fontSize: 12, marginTop: 2 }}>{profile.daysPerWeek}×/week · {profile.minutesPerSession} min</div>
        </div>
        <button onClick={() => setShowCreate(true)} style={{ background: "#e63c2f", border: "none", borderRadius: 11, padding: "9px 14px", color: "#fff", fontWeight: 700, display: "flex", alignItems: "center", gap: 5, fontSize: 13 }}>
          <Icon name="plus" size={15} /> New
        </button>
      </div>

      {sessions.length === 0 ? (
        <div style={{ textAlign: "center", padding: "50px 20px", color: "#444" }}>
          <div style={{ fontSize: 44, marginBottom: 10 }}>🏋️</div>
          <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>No sessions yet</div>
          <div style={{ fontSize: 13 }}>Create one manually or ask the AI Coach to suggest a full program</div>
        </div>
      ) : sessions.map((session, idx) => {
        const logs = workoutLogs.filter(l => l.sessionId === session.id);
        const lastLog = logs[logs.length - 1];
        const muscles = getSessionMuscles(session);
        const open = expandedId === session.id;

        return (
          <div key={session.id} style={{ background: "#111", border: "1px solid #1a1a24", borderRadius: 15, marginBottom: 14, overflow: "hidden" }}>
            <div style={{ padding: "14px 14px 0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 17 }}>{session.name}</div>
                  <div style={{ color: "#e63c2f", fontSize: 11, fontWeight: 600, letterSpacing: 1 }}>{session.exercises?.length || 0} EXERCISES</div>
                  {lastLog && <div style={{ color: "#444", fontSize: 11, marginTop: 2 }}>Last: {new Date(lastLog.date).toLocaleDateString()}</div>}
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={() => setEditSession({ ...session, idx })} style={{ background: "#1a1a24", border: "1px solid #252535", borderRadius: 7, padding: "5px 9px", color: "#888", fontSize: 12 }}>Edit</button>
                  <button onClick={() => setSessions(s => s.filter((_, i) => i !== idx))} style={{ background: "none", border: "1px solid #252535", borderRadius: 7, padding: "5px 7px", color: "#444" }}><Icon name="trash" size={13} /></button>
                </div>
              </div>

              {/* Session muscle map */}
              <div style={{ background: "#0d0d18", borderRadius: 10, padding: "10px 12px", marginBottom: 10, display: "flex", alignItems: "center", gap: 10 }}>
                <MuscleMap muscles={muscles} size={88} />
                <div>
                  <div style={{ fontSize: 9, letterSpacing: 2, color: "#e63c2f", fontWeight: 700, textTransform: "uppercase", marginBottom: 6 }}>Muscles Today</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {muscles.map(m => (
                      <span key={m} style={{ background: "#e63c2f1a", border: "1px solid #e63c2f33", borderRadius: 5, padding: "2px 7px", fontSize: 10, color: "#e63c2f", fontWeight: 600, textTransform: "capitalize" }}>{m}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <button onClick={() => setExpandedId(open ? null : session.id)} style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center", background: "none", border: "none", borderTop: "1px solid #1a1a24", padding: "9px 14px", color: "#555", fontSize: 12 }}>
              <span>{open ? "Hide exercises" : "Show exercises"}</span>
              <span style={{ transform: open ? "rotate(90deg)" : "rotate(0)", transition: "0.2s" }}><Icon name="arrow" size={14} /></span>
            </button>

            {open && (
              <div style={{ padding: "4px 14px 14px" }}>
                {session.exercises?.map((ex, ei) => (
                  <div key={ei} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderTop: "1px solid #1a1a24" }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{ex.name}</div>
                      <div style={{ fontSize: 11, color: "#555" }}>{ex.sets} × {ex.reps} {ex.weight ? `@ ${ex.weight}kg` : ""}</div>
                    </div>
                    <div style={{ display: "flex", gap: 5 }}>
                      <button onClick={() => setShowDemo(ex)} style={{ background: "#1a1a24", border: "1px solid #252535", borderRadius: 7, padding: "4px 8px", color: "#e63c2f", fontSize: 11, display: "flex", alignItems: "center", gap: 3 }}>
                        <Icon name="info" size={12} /> How
                      </button>
                      <button onClick={() => { setShowAlts({ exercise: ex }); getAlternatives(ex); }} style={{ background: "#1a1a24", border: "1px solid #252535", borderRadius: 7, padding: "4px 8px", color: "#666", fontSize: 11, display: "flex", alignItems: "center", gap: 3 }}>
                        <Icon name="swap" size={12} /> Alt
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {(showCreate || editSession) && (
        <SessionEditor initial={editSession} onSave={s => { if (editSession) setSessions(p => p.map((x, i) => i === editSession.idx ? s : x)); else setSessions(p => [...p, { ...s, id: Date.now() }]); setShowCreate(false); setEditSession(null); }} onClose={() => { setShowCreate(false); setEditSession(null); }} />
      )}

      {showAlts && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", zIndex: 200, display: "flex", alignItems: "flex-end" }}>
          <div style={{ background: "#0f0f1a", borderRadius: "18px 18px 0 0", padding: 22, width: "100%", maxHeight: "75vh", overflow: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
              <div style={{ fontWeight: 800, fontSize: 17 }}>Alternatives for {showAlts.exercise?.name}</div>
              <button onClick={() => setShowAlts(null)} style={{ background: "none", border: "none", color: "#666" }}><Icon name="close" /></button>
            </div>
            {altLoading ? <div className="pulse" style={{ color: "#e63c2f", fontWeight: 700 }}>Finding alternatives...</div>
              : <div style={{ whiteSpace: "pre-wrap", fontSize: 14, lineHeight: 1.7, color: "#bbb" }}>{altResults}</div>}
          </div>
        </div>
      )}

      {showDemo && <ExerciseDemo exercise={showDemo} onClose={() => setShowDemo(null)} />}
    </div>
  );
}

// ─── SESSION EDITOR ───────────────────────────────────────────────────────────
function SessionEditor({ initial, onSave, onClose }) {
  const [name, setName] = useState(initial?.name || "");
  const [exercises, setExercises] = useState(initial?.exercises || []);
  const [showPicker, setShowPicker] = useState(false);
  const [showDemo, setShowDemo] = useState(null);

  const addEx = ex => { setExercises(p => [...p, { ...ex, sets: 3, reps: "8-12", weight: "" }]); setShowPicker(false); };
  const updateEx = (idx, f, v) => setExercises(p => p.map((e, i) => i === idx ? { ...e, [f]: v } : e));
  const removeEx = idx => setExercises(p => p.filter((_, i) => i !== idx));
  const muscles = [...new Set(exercises.flatMap(e => e.muscles || []))];

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 200, display: "flex", alignItems: "flex-end" }}>
      <div style={{ background: "#0f0f1a", borderRadius: "18px 18px 0 0", padding: 20, width: "100%", maxHeight: "92vh", overflow: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ fontWeight: 800, fontSize: 19 }}>{initial ? "Edit Session" : "New Session"}</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#666" }}><Icon name="close" /></button>
        </div>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 10, letterSpacing: 2, color: "#e63c2f", marginBottom: 4, fontWeight: 700, textTransform: "uppercase" }}>Session Name</div>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Push Day, Leg Day..." style={{ width: "100%", background: "#111", border: "1px solid #2a2a3a", borderRadius: 8, padding: "9px 12px", color: "#e8e4dc", fontSize: 14 }} />
        </div>

        {exercises.length > 0 && (
          <div style={{ background: "#111", border: "1px solid #1a1a24", borderRadius: 12, padding: "10px 12px", marginBottom: 14, display: "flex", alignItems: "center", gap: 10 }}>
            <MuscleMap muscles={muscles} size={80} />
            <div>
              <div style={{ fontSize: 9, letterSpacing: 2, color: "#e63c2f", fontWeight: 700, textTransform: "uppercase", marginBottom: 5 }}>Session Muscles</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {muscles.map(m => <span key={m} style={{ background: "#e63c2f1a", borderRadius: 4, padding: "2px 6px", fontSize: 10, color: "#e63c2f", fontWeight: 600, textTransform: "capitalize" }}>{m}</span>)}
              </div>
            </div>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div style={{ fontSize: 10, letterSpacing: 2, color: "#e63c2f", fontWeight: 700, textTransform: "uppercase" }}>Exercises</div>
          <button onClick={() => setShowPicker(true)} style={{ background: "#e63c2f1a", border: "1px solid #e63c2f33", borderRadius: 7, padding: "4px 10px", color: "#e63c2f", fontSize: 12, fontWeight: 700 }}>+ Add</button>
        </div>

        {exercises.map((ex, idx) => (
          <div key={idx} style={{ background: "#111", border: "1px solid #1a1a24", borderRadius: 10, padding: 11, marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7, alignItems: "center" }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{ex.name}</div>
              <div style={{ display: "flex", gap: 5 }}>
                <button onClick={() => setShowDemo(ex)} style={{ background: "#1a1a24", border: "1px solid #252535", borderRadius: 6, padding: "3px 7px", color: "#e63c2f", fontSize: 11 }}>How?</button>
                <button onClick={() => removeEx(idx)} style={{ background: "none", border: "none", color: "#444" }}><Icon name="trash" size={13} /></button>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 7 }}>
              {["sets", "reps", "weight"].map(f => (
                <div key={f}>
                  <div style={{ fontSize: 9, color: "#555", marginBottom: 2, textTransform: "uppercase", letterSpacing: 1 }}>{f === "weight" ? "kg" : f}</div>
                  <input value={ex[f] || ""} onChange={e => updateEx(idx, f, e.target.value)} placeholder={f === "weight" ? "BW" : ""}
                    style={{ width: "100%", background: "#0a0a0f", border: "1px solid #2a2a3a", borderRadius: 5, padding: "5px 7px", color: "#e8e4dc", fontSize: 13 }} />
                </div>
              ))}
            </div>
          </div>
        ))}

        <button onClick={() => name && onSave({ id: initial?.id || Date.now(), name, exercises })} style={{ width: "100%", background: "#e63c2f", border: "none", borderRadius: 12, padding: "13px", fontWeight: 800, fontSize: 15, color: "#fff", marginTop: 4 }}>Save Session</button>

        {showPicker && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.96)", zIndex: 300, overflow: "auto", padding: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
              <div style={{ fontWeight: 800, fontSize: 17 }}>Add Exercise</div>
              <button onClick={() => setShowPicker(false)} style={{ background: "none", border: "none", color: "#666" }}><Icon name="close" /></button>
            </div>
            {Object.entries(EXERCISE_DB).map(([cat, exs]) => (
              <div key={cat} style={{ marginBottom: 18 }}>
                <div style={{ fontSize: 10, letterSpacing: 2, color: "#e63c2f", fontWeight: 700, textTransform: "uppercase", marginBottom: 7 }}>{cat}</div>
                {exs.map(ex => (
                  <div key={ex.name} style={{ display: "flex", background: "#111", border: "1px solid #1a1a24", borderRadius: 9, marginBottom: 5, overflow: "hidden" }}>
                    <button onClick={() => addEx(ex)} style={{ flex: 1, textAlign: "left", background: "none", border: "none", padding: "9px 12px", color: "#e8e4dc" }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{ex.name}</div>
                      <div style={{ fontSize: 11, color: "#555" }}>{ex.equipment} · {ex.muscles?.join(", ")}</div>
                    </button>
                    <button onClick={() => setShowDemo(ex)} style={{ background: "#1a1a24", border: "none", borderLeft: "1px solid #1a1a24", padding: "0 11px", color: "#e63c2f", fontSize: 11, fontWeight: 700 }}>How?</button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
        {showDemo && <ExerciseDemo exercise={showDemo} onClose={() => setShowDemo(null)} />}
      </div>
    </div>
  );
}

// ─── TRACK TAB ────────────────────────────────────────────────────────────────
function TrackTab({ sessions, workoutLogs, setWorkoutLogs }) {
  const [sel, setSel] = useState(null);
  const [sessionExercises, setSessionExercises] = useState([]);
  const [logData, setLogData] = useState({});
  const [suggestedWeights, setSuggestedWeights] = useState({}); // { exIdx: "20" }
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState(false);
  const [showDemo, setShowDemo] = useState(null);
  const [showExtraPicker, setShowExtraPicker] = useState(false);
  const [extraSearch, setExtraSearch] = useState("");

  // Look back at past logs to find the best weight for an exercise
  const getLastWeight = (exName) => {
    for (let i = workoutLogs.length - 1; i >= 0; i--) {
      const log = workoutLogs[i];
      const found = log.exercises?.find(e => e.name === exName);
      if (found) {
        const weights = (found.sets || []).map(s => parseFloat(s.weight)).filter(w => !isNaN(w) && w > 0);
        if (weights.length > 0) return Math.max(...weights).toString();
      }
    }
    return null;
  };

  const initLog = s => {
    const exs = s.exercises || [];
    const d = {};
    const suggested = {};
    exs.forEach((ex, i) => {
      const lastW = getLastWeight(ex.name);
      // Pre-fill weight from last session if available, otherwise leave empty (placeholder shows suggested)
      const fillWeight = lastW || "";
      d[i] = Array.from({ length: +ex.sets || 3 }, () => ({ weight: fillWeight, reps: "", done: false }));
      if (lastW) suggested[i] = { weight: lastW, isFromHistory: true };
      else if (ex.weight) suggested[i] = { weight: ex.weight, isFromHistory: false };
    });
    setLogData(d);
    setSuggestedWeights(suggested);
    setSel(s);
    setSessionExercises(exs);
    setSaved(false);
    setNotes("");
  };

  const addExtraExercise = ex => {
    const newIdx = sessionExercises.length;
    const lastW = getLastWeight(ex.name);
    const fillWeight = lastW || "";
    setSessionExercises(p => [...p, { ...ex, sets: 3, reps: "8-12", weight: "" }]);
    setLogData(d => ({ ...d, [newIdx]: Array.from({ length: 3 }, () => ({ weight: fillWeight, reps: "", done: false })) }));
    if (lastW) setSuggestedWeights(sw => ({ ...sw, [newIdx]: { weight: lastW, isFromHistory: true } }));
    setShowExtraPicker(false);
    setExtraSearch("");
  };

  // When user types a weight in any set, apply to all empty sets of that exercise
  const handleWeightChange = (ei, si, val) => {
    setLogData(d => {
      const sets = d[ei].map((s, idx) => idx === si ? { ...s, weight: val } : s);
      return { ...d, [ei]: sets };
    });
  };

  // Apply one weight to ALL sets of an exercise
  const applyWeightToAll = (ei, weight) => {
    setLogData(d => ({ ...d, [ei]: d[ei].map(s => ({ ...s, weight })) }));
  };

  const saveLog = () => {
    setWorkoutLogs(p => [...p, {
      id: Date.now(), date: new Date().toISOString(),
      sessionId: sel.id, sessionName: sel.name,
      exercises: sessionExercises.map((ex, i) => ({ ...ex, sets: logData[i] })), notes
    }]);
    setSaved(true);
  };

  const allExs = Object.values(EXERCISE_DB).flat();
  const filteredExs = extraSearch.trim().length > 0
    ? allExs.filter(e => e.name.toLowerCase().includes(extraSearch.toLowerCase()) || e.muscles?.some(m => m.toLowerCase().includes(extraSearch.toLowerCase())))
    : null;

  if (!sel) return (
    <div style={{ padding: 18 }} className="slide-in">
      <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 5 }}>Log Workout</div>
      <div style={{ color: "#555", fontSize: 13, marginBottom: 18 }}>Select today's session</div>
      {sessions.length === 0
        ? <div style={{ textAlign: "center", padding: 40, color: "#555", fontSize: 14 }}>Create sessions in the Training tab first</div>
        : sessions.map(s => (
          <button key={s.id} onClick={() => initLog(s)} style={{ display: "flex", width: "100%", background: "#111", border: "1px solid #1a1a24", borderRadius: 13, padding: 14, marginBottom: 10, alignItems: "center", justifyContent: "space-between", color: "#e8e4dc" }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, textAlign: "left" }}>{s.name}</div>
              <div style={{ color: "#555", fontSize: 12 }}>{s.exercises?.length} exercises</div>
            </div>
            <Icon name="arrow" />
          </button>
        ))}
    </div>
  );

  return (
    <div style={{ padding: 18 }} className="slide-in">
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
        <button onClick={() => setSel(null)} style={{ background: "#1a1a24", border: "none", borderRadius: 7, padding: "5px 9px", color: "#888" }}>←</button>
        <div>
          <div style={{ fontSize: 19, fontWeight: 800 }}>{sel.name}</div>
          <div style={{ color: "#555", fontSize: 12 }}>{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</div>
        </div>
      </div>

      {saved ? (
        <div style={{ textAlign: "center", padding: 48 }}>
          <div style={{ fontSize: 52 }}>🔥</div>
          <div style={{ fontSize: 22, fontWeight: 800, marginTop: 12 }}>Session Logged!</div>
          <div style={{ color: "#666", marginTop: 6 }}>Check your stats for progress.</div>
          <button onClick={() => setSel(null)} style={{ marginTop: 20, background: "#e63c2f", border: "none", borderRadius: 12, padding: "11px 24px", color: "#fff", fontWeight: 700 }}>Done</button>
        </div>
      ) : (
        <>
          {sessionExercises.map((ex, ei) => {
            const sets = logData[ei] || [];
            const suggested = suggestedWeights[ei];
            // The weight typed in set 0 (used to show apply-all if it differs from others)
            const set0Weight = sets[0]?.weight || "";
            const allSameWeight = sets.every(s => s.weight === set0Weight);
            const anyWeightFilled = sets.some(s => s.weight && s.weight.trim() !== "");
            const showApplyAll = anyWeightFilled && sets.length > 1 && !allSameWeight;

            return (
              <div key={ei} style={{ background: "#111", border: "1px solid #1a1a24", borderRadius: 13, padding: 13, marginBottom: 12 }}>
                {/* Header row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{ex.name}</div>
                    {ei >= (sel.exercises?.length || 0) && (
                      <div style={{ fontSize: 10, color: "#e63c2f", fontWeight: 700, letterSpacing: 1 }}>ADDED</div>
                    )}
                    {/* Suggested weight badge */}
                    {suggested && (
                      <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 3 }}>
                        <div style={{
                          background: suggested.isFromHistory ? "#4ade8022" : "#e63c2f18",
                          border: `1px solid ${suggested.isFromHistory ? "#4ade8044" : "#e63c2f33"}`,
                          borderRadius: 5, padding: "2px 7px", fontSize: 10, fontWeight: 700,
                          color: suggested.isFromHistory ? "#4ade80" : "#e63c2f",
                          display: "flex", alignItems: "center", gap: 3,
                        }}>
                          {suggested.isFromHistory ? "📈" : "💡"} {suggested.isFromHistory ? `Last: ${suggested.weight}kg` : `Suggested: ${suggested.weight}kg`}
                        </div>
                      </div>
                    )}
                  </div>
                  <button onClick={() => setShowDemo(ex)} style={{ background: "#1a1a24", border: "1px solid #252535", borderRadius: 7, padding: "4px 9px", color: "#e63c2f", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", gap: 3, flexShrink: 0 }}>
                    <Icon name="info" size={12} /> How to
                  </button>
                </div>

                {/* Column headers */}
                <div style={{ display: "grid", gridTemplateColumns: "24px 1fr 1fr 34px", gap: 5, marginBottom: 5 }}>
                  {["#", "Weight (kg)", "Reps", "✓"].map(h => (
                    <div key={h} style={{ fontSize: 9, color: "#444", textTransform: "uppercase", letterSpacing: 1 }}>{h}</div>
                  ))}
                </div>

                {/* Set rows */}
                {sets.map((set, si) => (
                  <div key={si} style={{ display: "grid", gridTemplateColumns: "24px 1fr 1fr 34px", gap: 5, marginBottom: 5, alignItems: "center" }}>
                    <div style={{ color: "#444", fontSize: 12 }}>{si + 1}</div>
                    <input
                      value={set.weight}
                      onChange={e => handleWeightChange(ei, si, e.target.value)}
                      placeholder={suggested ? suggested.weight : "kg"}
                      style={{
                        background: "#0a0a0f",
                        border: `1px solid ${set.weight ? "#3a3a4a" : suggested ? "#e63c2f22" : "#2a2a3a"}`,
                        borderRadius: 5, padding: "5px 7px",
                        color: "#e8e4dc", fontSize: 13, width: "100%",
                      }}
                    />
                    <input
                      value={set.reps}
                      onChange={e => setLogData(d => ({ ...d, [ei]: d[ei].map((s, i) => i === si ? { ...s, reps: e.target.value } : s) }))}
                      placeholder={ex.reps || "reps"}
                      style={{ background: "#0a0a0f", border: "1px solid #2a2a3a", borderRadius: 5, padding: "5px 7px", color: "#e8e4dc", fontSize: 13, width: "100%" }}
                    />
                    <button
                      onClick={() => setLogData(d => ({ ...d, [ei]: d[ei].map((s, i) => i === si ? { ...s, done: !s.done } : s) }))}
                      style={{ background: set.done ? "#e63c2f" : "#1a1a24", border: "1px solid #252535", borderRadius: 5, padding: 5, color: set.done ? "#fff" : "#444", display: "flex", alignItems: "center", justifyContent: "center" }}
                    >
                      <Icon name="check" size={12} />
                    </button>
                  </div>
                ))}

                {/* Apply to all button — appears when you've typed a weight in at least one set */}
                {showApplyAll && (
                  <button
                    onClick={() => applyWeightToAll(ei, set0Weight)}
                    style={{
                      marginTop: 6, width: "100%", background: "#e63c2f18",
                      border: "1px solid #e63c2f44", borderRadius: 7, padding: "6px 10px",
                      color: "#e63c2f", fontSize: 12, fontWeight: 700,
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                    }}
                  >
                    <Icon name="check" size={13} /> Apply {set0Weight}kg to all sets
                  </button>
                )}
              </div>
            );
          })}

          {/* Add extra exercise */}
          <button onClick={() => setShowExtraPicker(true)} style={{ display: "flex", width: "100%", alignItems: "center", justifyContent: "center", gap: 7, background: "#111", border: "1px dashed #2a2a3a", borderRadius: 11, padding: "11px 14px", color: "#555", fontSize: 13, fontWeight: 600, marginBottom: 14 }}>
            <Icon name="plus" size={15} /> Add Exercise to This Session
          </button>

          <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Session notes..." style={{ width: "100%", background: "#111", border: "1px solid #1a1a24", borderRadius: 9, padding: "9px 11px", color: "#e8e4dc", fontSize: 13, resize: "none", height: 72, marginBottom: 14 }} />
          <button onClick={saveLog} style={{ width: "100%", background: "#e63c2f", border: "none", borderRadius: 12, padding: 13, fontWeight: 800, fontSize: 15, color: "#fff" }}>💪 Complete Session</button>
        </>
      )}

      {showDemo && <ExerciseDemo exercise={showDemo} onClose={() => setShowDemo(null)} />}

      {/* Extra exercise picker */}
      {showExtraPicker && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.96)", zIndex: 300, display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "18px 18px 10px", borderBottom: "1px solid #1a1a24" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ fontWeight: 800, fontSize: 17 }}>Add Extra Exercise</div>
              <button onClick={() => { setShowExtraPicker(false); setExtraSearch(""); }} style={{ background: "none", border: "none", color: "#666" }}><Icon name="close" /></button>
            </div>
            <input
              value={extraSearch} onChange={e => setExtraSearch(e.target.value)}
              placeholder="Search by name or muscle..."
              autoFocus
              style={{ width: "100%", background: "#111", border: "1px solid #2a2a3a", borderRadius: 9, padding: "9px 12px", color: "#e8e4dc", fontSize: 14, outline: "none" }}
            />
          </div>
          <div style={{ flex: 1, overflow: "auto", padding: 18 }}>
            {filteredExs !== null ? (
              filteredExs.length === 0
                ? <div style={{ color: "#555", textAlign: "center", padding: 30 }}>No exercises found for "{extraSearch}"</div>
                : filteredExs.map(ex => (
                  <div key={ex.name} style={{ display: "flex", background: "#111", border: "1px solid #1a1a24", borderRadius: 9, marginBottom: 6, overflow: "hidden" }}>
                    <button onClick={() => addExtraExercise(ex)} style={{ flex: 1, textAlign: "left", background: "none", border: "none", padding: "9px 12px", color: "#e8e4dc" }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{ex.name}</div>
                      <div style={{ fontSize: 11, color: "#555" }}>{ex.equipment} · {ex.muscles?.join(", ")}</div>
                    </button>
                    {ex.wgerId > 0 && <button onClick={() => setShowDemo(ex)} style={{ background: "#1a1a24", border: "none", borderLeft: "1px solid #1a1a24", padding: "0 11px", color: "#e63c2f", fontSize: 11, fontWeight: 700 }}>How?</button>}
                  </div>
                ))
            ) : (
              Object.entries(EXERCISE_DB).map(([cat, exs]) => (
                <div key={cat} style={{ marginBottom: 18 }}>
                  <div style={{ fontSize: 10, letterSpacing: 2, color: "#e63c2f", fontWeight: 700, textTransform: "uppercase", marginBottom: 7 }}>{cat}</div>
                  {exs.map(ex => (
                    <div key={ex.name} style={{ display: "flex", background: "#111", border: "1px solid #1a1a24", borderRadius: 9, marginBottom: 5, overflow: "hidden" }}>
                      <button onClick={() => addExtraExercise(ex)} style={{ flex: 1, textAlign: "left", background: "none", border: "none", padding: "9px 12px", color: "#e8e4dc" }}>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{ex.name}</div>
                        <div style={{ fontSize: 11, color: "#555" }}>{ex.equipment} · {ex.muscles?.join(", ")}</div>
                      </button>
                      {ex.wgerId > 0 && <button onClick={() => setShowDemo(ex)} style={{ background: "#1a1a24", border: "none", borderLeft: "1px solid #1a1a24", padding: "0 11px", color: "#e63c2f", fontSize: 11, fontWeight: 700 }}>How?</button>}
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SWIPEABLE LOG CARD ───────────────────────────────────────────────────────
function SwipeableLogCard({ log, onDelete }) {
  const [offset, setOffset] = useState(0);
  const [swiping, setSwiping] = useState(false);
  const startX = useRef(null);
  const DELETE_THRESHOLD = 80;

  const onTouchStart = e => { startX.current = e.touches[0].clientX; setSwiping(true); };
  const onTouchMove = e => {
    if (startX.current === null) return;
    const dx = e.touches[0].clientX - startX.current;
    if (dx < 0) setOffset(Math.max(dx, -120));
  };
  const onTouchEnd = () => {
    if (offset < -DELETE_THRESHOLD) onDelete();
    else setOffset(0);
    setSwiping(false); startX.current = null;
  };

  return (
    <div style={{ position: "relative", marginBottom: 7, borderRadius: 11, overflow: "hidden" }}>
      {/* Red delete background */}
      <div style={{ position: "absolute", inset: 0, background: "#e63c2f", display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 20, borderRadius: 11 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
          <Icon name="trash" size={18} />
          <span style={{ fontSize: 10, fontWeight: 700, color: "#fff" }}>DELETE</span>
        </div>
      </div>
      {/* Card */}
      <div
        onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
        style={{ background: "#111", border: "1px solid #1a1a24", borderRadius: 11, padding: "11px 13px", transform: `translateX(${offset}px)`, transition: swiping ? "none" : "transform 0.25s ease", cursor: "grab", userSelect: "none" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontWeight: 700, fontSize: 14 }}>{log.sessionName}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ color: "#444", fontSize: 11 }}>{new Date(log.date).toLocaleDateString()}</div>
            <button onClick={onDelete} style={{ background: "none", border: "none", color: "#333", padding: 2 }}><Icon name="trash" size={14} /></button>
          </div>
        </div>
        <div style={{ color: "#555", fontSize: 12, marginTop: 2 }}>{log.exercises?.length || 0} exercises</div>
        {log.notes && <div style={{ color: "#555", fontSize: 12, marginTop: 3, fontStyle: "italic" }}>{log.notes}</div>}
        {offset < -20 && <div style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", color: "#e63c2f44", fontSize: 11, pointerEvents: "none" }}>← swipe to delete</div>}
      </div>
    </div>
  );
}

// ─── STATS TAB ────────────────────────────────────────────────────────────────
function StatsTab({ workoutLogs, setWorkoutLogs }) {
  const [selEx, setSelEx] = useState(null);
  const total = workoutLogs.length;
  const week = workoutLogs.filter(l => new Date(l.date) > new Date(Date.now() - 7 * 864e5)).length;
  const month = workoutLogs.filter(l => new Date(l.date) > new Date(Date.now() - 30 * 864e5)).length;
  const exProgress = {};
  workoutLogs.forEach(log => { log.exercises?.forEach(ex => { if (!exProgress[ex.name]) exProgress[ex.name] = []; const maxW = Math.max(...(ex.sets || []).map(s => +s.weight || 0)); if (maxW > 0) exProgress[ex.name].push({ date: log.date, weight: maxW }); }); });
  const exNames = Object.keys(exProgress).filter(k => exProgress[k].length > 1);
  const deleteLog = id => setWorkoutLogs(p => p.filter(l => l.id !== id));

  return (
    <div style={{ padding: 18 }} className="slide-in">
      <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 18 }}>Progress Stats</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 9, marginBottom: 22 }}>
        {[["Total", total], ["This Week", week], ["This Month", month]].map(([label, val]) => (
          <div key={label} style={{ background: "#111", border: "1px solid #1a1a24", borderRadius: 13, padding: "13px 8px", textAlign: "center" }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: "#e63c2f" }}>{val}</div>
            <div style={{ fontSize: 9, color: "#555", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>{label}</div>
          </div>
        ))}
      </div>
      {workoutLogs.length === 0 ? <div style={{ textAlign: "center", padding: 40, color: "#555" }}>Log workouts to see charts</div> : (
        <>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, color: "#e63c2f", textTransform: "uppercase", marginBottom: 10 }}>Weight Progress</div>
          {exNames.length === 0 ? <div style={{ color: "#555", fontSize: 13, marginBottom: 20 }}>Need 2+ sessions with weights to show charts.</div> : (
            <>
              <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 14 }}>
                {exNames.map(name => (
                  <button key={name} onClick={() => setSelEx(name === selEx ? null : name)} style={{ background: selEx === name ? "#e63c2f" : "#1a1a24", border: `1px solid ${selEx === name ? "#e63c2f" : "#2a2a3a"}`, borderRadius: 7, padding: "5px 11px", color: selEx === name ? "#fff" : "#888", fontSize: 11, fontWeight: 600 }}>
                    {name}
                  </button>
                ))}
              </div>
              {selEx && exProgress[selEx] && <MiniChart data={exProgress[selEx]} name={selEx} />}
            </>
          )}
          <div style={{ marginTop: 22, fontSize: 12, fontWeight: 700, letterSpacing: 2, color: "#e63c2f", textTransform: "uppercase", marginBottom: 4 }}>Recent Sessions</div>
          <div style={{ color: "#444", fontSize: 11, marginBottom: 12 }}>Swipe left to delete a session</div>
          {[...workoutLogs].reverse().map(log => (
            <SwipeableLogCard key={log.id} log={log} onDelete={() => deleteLog(log.id)} />
          ))}
        </>
      )}
    </div>
  );
}

function MiniChart({ data, name }) {
  const sorted = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
  const max = Math.max(...sorted.map(d => d.weight)), min = Math.min(...sorted.map(d => d.weight)), range = max - min || 1;
  const W = 320, H = 110, P = 18;
  const pts = sorted.map((d, i) => ({ x: P + (i / (sorted.length - 1 || 1)) * (W - P * 2), y: P + (1 - (d.weight - min) / range) * (H - P * 2) }));
  const path = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const trend = sorted[sorted.length - 1].weight - sorted[0].weight;
  return (
    <div style={{ background: "#111", border: "1px solid #1a1a24", borderRadius: 13, padding: 14, marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{ fontWeight: 700, fontSize: 14 }}>{name}</div>
        <div style={{ color: trend >= 0 ? "#4ade80" : "#e63c2f", fontSize: 13, fontWeight: 700 }}>{trend >= 0 ? "+" : ""}{trend.toFixed(1)}kg</div>
      </div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
        <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#e63c2f" stopOpacity="0.25"/><stop offset="100%" stopColor="#e63c2f" stopOpacity="0"/></linearGradient></defs>
        <path d={path + ` L${pts[pts.length-1].x},${H} L${pts[0].x},${H} Z`} fill="url(#g)"/>
        <path d={path} fill="none" stroke="#e63c2f" strokeWidth="2.5" strokeLinecap="round"/>
        {pts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="#e63c2f"/>)}
      </svg>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#444", marginTop: 3 }}>
        <span>Start: {sorted[0].weight}kg</span><span>Best: {max}kg</span><span>Last: {sorted[sorted.length-1].weight}kg</span>
      </div>
    </div>
  );
}

// ─── NUTRITION TAB ────────────────────────────────────────────────────────────
function NutritionTab({ nutritionLogs, setNutritionLogs, profile, workoutLogs }) {
  const today = new Date().toDateString();
  const todayLogs = nutritionLogs.filter(l => new Date(l.date).toDateString() === today);
  const totalProtein = todayLogs.reduce((s, l) => s + (l.protein || 0), 0);
  const totalCals = todayLogs.reduce((s, l) => s + (l.calories || 0), 0);
  const [showAdd, setShowAdd] = useState(false);
  const [custom, setCustom] = useState({ name: "", protein: "", calories: "" });
  const target = profile.proteinTarget || 150;
  const pct = Math.min(100, (totalProtein / target) * 100);
  const todayWorkout = workoutLogs.find(l => new Date(l.date).toDateString() === today);
  const addFood = f => { setNutritionLogs(p => [...p, { ...f, date: new Date().toISOString(), id: Date.now() }]); setShowAdd(false); setCustom({ name: "", protein: "", calories: "" }); };

  return (
    <div style={{ padding: 18 }} className="slide-in">
      <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 5 }}>Nutrition</div>
      <div style={{ color: "#555", fontSize: 12, marginBottom: 16 }}>{today}</div>
      <div style={{ background: "#111", border: "1px solid #1a1a24", borderRadius: 18, padding: 20, marginBottom: 14, textAlign: "center" }}>
        <svg width="130" height="130" viewBox="0 0 130 130">
          <circle cx="65" cy="65" r="52" fill="none" stroke="#1a1a24" strokeWidth="11"/>
          <circle cx="65" cy="65" r="52" fill="none" stroke="#e63c2f" strokeWidth="11" strokeDasharray={`${2*Math.PI*52}`} strokeDashoffset={`${2*Math.PI*52*(1-pct/100)}`} strokeLinecap="round" transform="rotate(-90 65 65)" style={{ transition: "stroke-dashoffset 0.5s ease" }}/>
          <text x="65" y="60" textAnchor="middle" fill="#e8e4dc" fontSize="26" fontWeight="800" fontFamily="Syne">{totalProtein}</text>
          <text x="65" y="78" textAnchor="middle" fill="#555" fontSize="12" fontFamily="Syne">/ {target}g protein</text>
        </svg>
        <div style={{ display: "flex", justifyContent: "center", gap: 22, marginTop: 4 }}>
          <div><div style={{ color: "#e63c2f", fontWeight: 800, fontSize: 18 }}>{Math.max(0, target - totalProtein)}g</div><div style={{ color: "#555", fontSize: 11 }}>remaining</div></div>
          <div><div style={{ color: "#f5a623", fontWeight: 800, fontSize: 18 }}>{totalCals}</div><div style={{ color: "#555", fontSize: 11 }}>calories</div></div>
        </div>
        {todayWorkout && <div style={{ marginTop: 10, background: "#e63c2f1a", border: "1px solid #e63c2f33", borderRadius: 7, padding: "7px 11px", fontSize: 12, color: "#e63c2f", fontWeight: 600 }}>🏋️ Workout day — hit your protein goal!</div>}
      </div>
      <button onClick={() => setShowAdd(true)} style={{ width: "100%", background: "#e63c2f1a", border: "1px solid #e63c2f33", borderRadius: 11, padding: 11, color: "#e63c2f", fontWeight: 700, marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
        <Icon name="plus" size={15} /> Log Food
      </button>
      {todayLogs.length === 0 ? <div style={{ color: "#555", fontSize: 13 }}>Nothing logged yet</div>
        : todayLogs.map(l => (
          <div key={l.id} style={{ display: "flex", justifyContent: "space-between", background: "#111", border: "1px solid #1a1a24", borderRadius: 9, padding: "9px 13px", marginBottom: 7 }}>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{l.name}</div>
            <div style={{ color: "#e63c2f", fontWeight: 700, fontSize: 14 }}>{l.protein}g</div>
          </div>
        ))}

      {showAdd && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 200, display: "flex", alignItems: "flex-end" }}>
          <div style={{ background: "#0f0f1a", borderRadius: "18px 18px 0 0", padding: 20, width: "100%", maxHeight: "85vh", overflow: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <div style={{ fontWeight: 800, fontSize: 18 }}>Add Food</div>
              <button onClick={() => setShowAdd(false)} style={{ background: "none", border: "none", color: "#666" }}><Icon name="close" /></button>
            </div>
            <div style={{ fontSize: 10, letterSpacing: 2, color: "#555", textTransform: "uppercase", marginBottom: 9 }}>Quick Add</div>
            {COMMON_FOODS.map(f => (
              <button key={f.name} onClick={() => addFood(f)} style={{ display: "flex", width: "100%", justifyContent: "space-between", background: "#111", border: "1px solid #1a1a24", borderRadius: 9, padding: "9px 13px", marginBottom: 5, color: "#e8e4dc", alignItems: "center" }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{f.name}</div>
                <div style={{ color: "#e63c2f", fontWeight: 700 }}>{f.protein}g</div>
              </button>
            ))}
            <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid #1a1a24" }}>
              <div style={{ fontSize: 10, letterSpacing: 2, color: "#555", textTransform: "uppercase", marginBottom: 10 }}>Custom</div>
              {["name", "protein", "calories"].map(f => (
                <input key={f} value={custom[f]} onChange={e => setCustom(c => ({ ...c, [f]: e.target.value }))} placeholder={f === "name" ? "Food name" : f === "protein" ? "Protein (g)" : "Calories"} type={f === "name" ? "text" : "number"}
                  style={{ display: "block", width: "100%", background: "#111", border: "1px solid #2a2a3a", borderRadius: 7, padding: "9px 11px", color: "#e8e4dc", fontSize: 13, marginBottom: 7 }} />
              ))}
              <button onClick={() => custom.name && custom.protein && addFood({ name: custom.name, protein: +custom.protein, calories: +custom.calories || 0 })} style={{ width: "100%", background: "#e63c2f", border: "none", borderRadius: 9, padding: 11, color: "#fff", fontWeight: 700 }}>Add Food</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── PHOTOS TAB ───────────────────────────────────────────────────────────────
function PhotosTab({ photos, setPhotos }) {
  const [analysis, setAnalysis] = useState(""); const [analyzing, setAnalyzing] = useState(false); const [selPhoto, setSelPhoto] = useState(null);
  const fileRef = useRef();
  const handleUpload = e => { const file = e.target.files[0]; if (!file) return; const r = new FileReader(); r.onload = ev => setPhotos(p => [...p, { id: Date.now(), date: new Date().toISOString(), dataUrl: ev.target.result }]); r.readAsDataURL(file); };
  const analyzePhoto = async photo => {
    setAnalyzing(true); setAnalysis(""); setSelPhoto(photo);
    try {
      const base64 = photo.dataUrl.split(",")[1], mediaType = photo.dataUrl.split(";")[0].split(":")[1];
      const res = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, messages: [{ role: "user", content: [{ type: "image", source: { type: "base64", media_type: mediaType, data: base64 } }, { type: "text", text: "Analyze this gym progress photo. Comment on visible muscle development, posture, strong areas, areas needing work, and give specific workout recommendations. Be encouraging but honest." }] }] }) });
      const data = await res.json(); setAnalysis(data.content?.map(b => b.text || "").join("") || "");
    } catch { setAnalysis("Analysis failed. Please try again."); }
    setAnalyzing(false);
  };
  return (
    <div style={{ padding: 18 }} className="slide-in">
      <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 5 }}>Progress Photos</div>
      <div style={{ color: "#555", fontSize: 12, marginBottom: 16 }}>Track your visual transformation</div>
      <button onClick={() => fileRef.current.click()} style={{ width: "100%", background: "#111", border: "2px dashed #252535", borderRadius: 13, padding: 22, color: "#555", fontWeight: 700, marginBottom: 18, display: "flex", flexDirection: "column", alignItems: "center", gap: 7 }}>
        <Icon name="camera" size={30} /><span>Upload Progress Photo</span><span style={{ fontSize: 11, fontWeight: 400 }}>Tap to choose from gallery</span>
      </button>
      <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} style={{ display: "none" }} />
      {photos.length === 0 ? <div style={{ textAlign: "center", color: "#555", fontSize: 13 }}>No photos yet</div> : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[...photos].reverse().map(photo => (
            <div key={photo.id} style={{ borderRadius: 11, overflow: "hidden", position: "relative", aspectRatio: "3/4", cursor: "pointer" }} onClick={() => analyzePhoto(photo)}>
              <img src={photo.dataUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 55%)", display: "flex", alignItems: "flex-end", padding: 9 }}>
                <div><div style={{ fontSize: 10, color: "#bbb" }}>{new Date(photo.date).toLocaleDateString()}</div><div style={{ fontSize: 11, color: "#e63c2f", fontWeight: 700 }}>Tap to analyze</div></div>
              </div>
              <button onClick={e => { e.stopPropagation(); setPhotos(p => p.filter(x => x.id !== photo.id)); }} style={{ position: "absolute", top: 7, right: 7, background: "rgba(0,0,0,0.6)", border: "none", borderRadius: 5, padding: 4, color: "#fff" }}><Icon name="trash" size={13} /></button>
            </div>
          ))}
        </div>
      )}
      {(analyzing || analysis) && selPhoto && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.95)", zIndex: 200, overflow: "auto", padding: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
            <div style={{ fontWeight: 800, fontSize: 17 }}>AI Analysis</div>
            <button onClick={() => { setAnalysis(""); setSelPhoto(null); }} style={{ background: "none", border: "none", color: "#666" }}><Icon name="close" /></button>
          </div>
          <img src={selPhoto.dataUrl} alt="" style={{ width: "100%", borderRadius: 11, marginBottom: 14, maxHeight: 260, objectFit: "cover" }} />
          {analyzing ? <div className="pulse" style={{ color: "#e63c2f", fontWeight: 700 }}>🔍 Analyzing...</div>
            : <div style={{ whiteSpace: "pre-wrap", fontSize: 14, lineHeight: 1.8, color: "#ccc", background: "#111", borderRadius: 12, padding: 14 }}>{analysis}</div>}
        </div>
      )}
    </div>
  );
}

// ─── AI COACH TAB ─────────────────────────────────────────────────────────────
function AICoachTab({ profile, sessions, workoutLogs, nutritionLogs, photos, setSessions }) {
  const [messages, setMessages] = useState([{ role: "assistant", content: "Hey! I'm your AI coach 💪\n\nI can suggest a complete workout plan tailored to your goals, adapt your current sessions, or answer any training and nutrition question.\n\nTry asking me to create a plan, or tap one of the prompts below!", hasPlan: false }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [pendingPlan, setPendingPlan] = useState(null);
  const messagesRef = useRef();

  useEffect(() => { if (messagesRef.current) messagesRef.current.scrollTop = messagesRef.current.scrollHeight; }, [messages, pendingPlan]);

  const ctx = () => `Profile: ${JSON.stringify(profile)}\nSessions: ${JSON.stringify(sessions.map(s => ({ name: s.name, exercises: s.exercises?.map(e => e.name) })))}\nRecent workouts: ${JSON.stringify(workoutLogs.slice(-5).map(l => ({ date: l.date, session: l.sessionName })))}\nRecent nutrition: ${JSON.stringify(nutritionLogs.slice(-8).map(l => ({ name: l.name, protein: l.protein })))}`;

  const isPlanRequest = t => { const l = t.toLowerCase(); return l.includes("suggest") || l.includes("create") || l.includes("plan") || l.includes("program") || l.includes("routine") || l.includes("generate") || l.includes("make") || l.includes("design") || l.includes("build"); };

  const send = async (overrideInput) => {
    const text = overrideInput || input;
    if (!text.trim() || loading) return;
    const userMsg = { role: "user", content: text };
    setMessages(p => [...p, userMsg]);
    setInput("");
    setLoading(true);

    try {
      if (isPlanRequest(text)) {
        const [planJson, explanation] = await Promise.all([
          callClaude([{ role: "user", content: `${text}\n\nContext: ${ctx()}\n\nGenerate a training program as JSON array. ONLY JSON, no text. Each session: {"id":number,"name":"string","exercises":[{"name":"string","muscles":["string"],"equipment":"string","sets":number,"reps":"string","weight":"string","wgerId":number}]}. Known wgerIds: bench_press=192,squat=6,deadlift=241,pull_ups=31,overhead_press=65,barbell_row=167,lat_pulldown=122,dumbbell_curl=228,tricep_pushdown=198,leg_press=127,romanian_deadlift=157,plank=45,lateral_raises=526,push_ups=10,dips=37,lunges=99,calf_raises=128,skull_crushers=69,barbell_curl=86,seated_cable_row=239. Others: wgerId=0.` }], "Return ONLY a valid JSON array of training sessions. No markdown, no explanation.", 1800),
          callClaude([...messages.map(m => ({ role: m.role, content: m.content })), userMsg, { role: "user", content: "In 2-3 sentences, explain the training plan you created — the structure, why you chose it for this user's goals, and what to expect." }], `You are a personal AI fitness coach. Context: ${ctx()}`)
        ]);
        let parsed = [];
        try { parsed = JSON.parse(planJson.replace(/```json|```/g, "").trim()); } catch {}
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPendingPlan(parsed.map((s, i) => ({ ...s, id: Date.now() + i })));
          setMessages(p => [...p, { role: "assistant", content: explanation, hasPlan: true }]);
        } else {
          setMessages(p => [...p, { role: "assistant", content: explanation }]);
        }
      } else {
        const reply = await callClaude([...messages.map(m => ({ role: m.role, content: m.content })), userMsg].slice(1), `You are a personal AI fitness coach. Context: ${ctx()}\nBe specific, encouraging, and reference their actual data when helpful.`);
        setMessages(p => [...p, { role: "assistant", content: reply }]);
      }
    } catch { setMessages(p => [...p, { role: "assistant", content: "Connection error. Please try again." }]); }
    setLoading(false);
  };

  const acceptPlan = () => {
    setSessions(pendingPlan);
    setPendingPlan(null);
    setMessages(p => [...p, { role: "assistant", content: "✅ Your training plan is live! Go to the Training tab to see your sessions, tap any exercise to learn how to do it, and start logging when you're ready. Let's go! 💪" }]);
  };

  const quickPrompts = ["Suggest a 4-day muscle gain program", "Build a beginner full body routine", "I have 45 min and want to train push muscles", "Create a program to improve my weak legs"];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 128px)" }} className="slide-in">
      <div ref={messagesRef} style={{ flex: 1, overflow: "auto", padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
        {messages.map((m, i) => (
          <div key={i}>
            <div style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
              <div style={{ maxWidth: "88%", background: m.role === "user" ? "#e63c2f" : "#111", border: m.role === "assistant" ? "1px solid #1a1a24" : "none", borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px", padding: "9px 13px", fontSize: 14, lineHeight: 1.65, whiteSpace: "pre-wrap", color: m.role === "user" ? "#fff" : "#e8e4dc" }}>
                {m.content}
              </div>
            </div>
            {m.hasPlan && pendingPlan && i === messages.length - 1 && (
              <div style={{ marginTop: 10 }}>
                <PlanPreview plan={pendingPlan} setPlan={setPendingPlan} onAccept={acceptPlan} onDiscard={() => setPendingPlan(null)} />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex" }}>
            <div style={{ background: "#111", border: "1px solid #1a1a24", borderRadius: "16px 16px 16px 4px", padding: "9px 13px" }}>
              <div className="pulse" style={{ color: "#e63c2f", fontSize: 14 }}>Thinking...</div>
            </div>
          </div>
        )}
        {messages.length === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 7, marginTop: 4 }}>
            {quickPrompts.map(p => (
              <button key={p} onClick={() => send(p)} style={{ background: "#111", border: "1px solid #1a1a24", borderRadius: 11, padding: "9px 13px", color: "#888", fontSize: 13, textAlign: "left" }}>💬 {p}</button>
            ))}
          </div>
        )}
      </div>

      <div style={{ padding: "10px 14px 14px", borderTop: "1px solid #1a1a24", display: "flex", gap: 7 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
          placeholder="Ask your coach..." style={{ flex: 1, background: "#111", border: "1px solid #2a2a3a", borderRadius: 11, padding: "9px 13px", color: "#e8e4dc", fontSize: 14, outline: "none" }} />
        <button onClick={() => send()} disabled={loading || !input.trim()} style={{ background: "#e63c2f", border: "none", borderRadius: 11, padding: "9px 13px", color: "#fff", opacity: loading || !input.trim() ? 0.4 : 1 }}>
          <Icon name="send" size={15} />
        </button>
      </div>
    </div>
  );
}

// ─── PLAN PREVIEW (editable) ──────────────────────────────────────────────────
function PlanPreview({ plan, setPlan, onAccept, onDiscard }) {
  const [expanded, setExpanded] = useState(0);
  const [showDemo, setShowDemo] = useState(null);

  const updateEx = (si, ei, f, v) => setPlan(p => p.map((s, i) => i !== si ? s : { ...s, exercises: s.exercises.map((e, j) => j !== ei ? e : { ...e, [f]: v }) }));
  const removeEx = (si, ei) => setPlan(p => p.map((s, i) => i !== si ? s : { ...s, exercises: s.exercises.filter((_, j) => j !== ei) }));

  return (
    <div style={{ background: "#0c1520", border: "2px solid #e63c2f33", borderRadius: 14, overflow: "hidden" }}>
      <div style={{ background: "#e63c2f12", padding: "11px 14px", borderBottom: "1px solid #e63c2f22" }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: "#e63c2f", letterSpacing: 1, textTransform: "uppercase" }}>📋 Suggested Plan — {plan.length} Sessions</div>
        <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>Review and edit, then accept to start training</div>
      </div>
      <div style={{ padding: 12 }}>
        {plan.map((session, si) => {
          const muscles = [...new Set(session.exercises?.flatMap(e => e.muscles || []))];
          const open = expanded === si;
          return (
            <div key={si} style={{ background: "#111", border: "1px solid #1a1a24", borderRadius: 11, marginBottom: 8, overflow: "hidden" }}>
              <button onClick={() => setExpanded(open ? -1 : si)} style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center", background: "none", border: "none", padding: "10px 13px", color: "#e8e4dc" }}>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{session.name}</div>
                  <div style={{ color: "#e63c2f", fontSize: 10, fontWeight: 600, letterSpacing: 1 }}>{session.exercises?.length} EXERCISES</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <MuscleMap muscles={muscles} size={46} />
                  <span style={{ color: "#444", transform: open ? "rotate(90deg)" : "rotate(0)", transition: "0.2s" }}><Icon name="arrow" size={13} /></span>
                </div>
              </button>
              {open && (
                <div style={{ padding: "0 13px 13px" }}>
                  {session.exercises?.map((ex, ei) => (
                    <div key={ei} style={{ borderTop: "1px solid #1a1a24", paddingTop: 9, marginTop: 9 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{ex.name}</div>
                        <div style={{ display: "flex", gap: 5 }}>
                          {ex.wgerId > 0 && <button onClick={() => setShowDemo(ex)} style={{ background: "#1a1a24", border: "1px solid #252535", borderRadius: 5, padding: "3px 7px", color: "#e63c2f", fontSize: 10 }}>How?</button>}
                          <button onClick={() => removeEx(si, ei)} style={{ background: "none", border: "none", color: "#333" }}><Icon name="trash" size={12} /></button>
                        </div>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 5 }}>
                        {["sets", "reps", "weight"].map(f => (
                          <div key={f}>
                            <div style={{ fontSize: 9, color: "#444", marginBottom: 2, textTransform: "uppercase", letterSpacing: 1 }}>{f === "weight" ? "kg" : f}</div>
                            <input value={ex[f] || ""} onChange={e => updateEx(si, ei, f, e.target.value)} style={{ width: "100%", background: "#0a0a0f", border: "1px solid #2a2a3a", borderRadius: 5, padding: "4px 7px", color: "#e8e4dc", fontSize: 12 }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9, marginTop: 4 }}>
          <button onClick={onDiscard} style={{ background: "none", border: "1px solid #252535", borderRadius: 9, padding: 11, color: "#555", fontWeight: 700 }}>Discard</button>
          <button onClick={onAccept} style={{ background: "#e63c2f", border: "none", borderRadius: 9, padding: 11, color: "#fff", fontWeight: 800 }}>✓ Accept Plan</button>
        </div>
      </div>
      {showDemo && <ExerciseDemo exercise={showDemo} onClose={() => setShowDemo(null)} />}
    </div>
  );
}
