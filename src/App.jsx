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
  daysPerWeek: 4, minutesPerSession: 60, proteinTarget: 150, language: "en",
};

const T = {
  en: {
    training: "Training", log: "Log", stats: "Stats", nutrition: "Nutrition", progress: "Progress", aiCoach: "AI Coach",
    profile: "Profile", yourProfile: "Your Profile", name: "Name", weight: "Weight (kg)", height: "Height (cm)",
    goal: "Goal", gymDays: "Gym Days/Week", minSession: "Min/Session", proteinTarget: "Daily Protein Target (g)",
    autoCalc: "Auto-calculated", saveProfile: "Save Profile", language: "Language",
    muscleGain: "Muscle Gain", fatLoss: "Fat Loss", strength: "Strength", endurance: "Endurance", maintenance: "Maintenance",
    trainingSessions: "Training Sessions", newSession: "New", noSessions: "No sessions yet",
    createOrAsk: "Create one manually or ask the AI Coach to suggest a full program",
    exercises: "exercises", lastLog: "Last", edit: "Edit", muscleToday: "Muscles Today",
    hideExercises: "Hide exercises", showExercises: "Show exercises",
    logWorkout: "Log Workout", selectSession: "Select today's session",
    createFirst: "Create sessions in the Training tab first",
    completeSession: "Complete Session", sessionNotes: "Session notes...",
    sessionLogged: "Session Logged!", weightsSaved: "Weights saved to your program.", done: "Done",
    applyToAll: "Apply to all sets",
    progressStats: "Progress Stats", total: "Total", thisWeek: "This Week", thisMonth: "This Month",
    aiOptimizer: "AI Program Optimizer", analyzeDesc: "Analyzes your progress & suggests upgrades",
    applied: "Applied!", keepTraining: "Keep training consistently — not enough progress data yet to suggest changes.",
    changesApplied: "Your accepted changes have been applied to your training sessions!",
    analyzeSuggest: "Analyze & Suggest Upgrades", analyzing: "Analyzing your progress...",
    weightProgress: "Weight Progress", need2Sessions: "Need 2+ sessions with weights to show charts.",
    logToSee: "Log workouts to see charts",
    recentSessions: "Recent Sessions", suggestedUpgrades: "Suggested Upgrades",
    acceptReject: "Accept or reject each change, then apply",
    accepted: "accepted", rejected: "rejected", undecided: "undecided",
    applyChanges: "Apply Accepted Changes",
    reject: "Reject", accept: "Accept",
    currentWeight: "Current", newWeight: "New",
    sessionDetail: "Session Detail", backToStats: "Back to Stats",
    setsCompleted: "sets completed", notesLabel: "Notes",
    nutritionTitle: "Nutrition", remaining: "remaining", calories: "calories",
    workoutDay: "Workout day — hit your protein goal!", logFood: "Log Food",
    nothingLogged: "Nothing logged yet", swipeToRemove: "← Swipe left to remove",
    addFood: "Add Food", quickAdd: "Quick Add", custom: "Custom",
    foodName: "Food name", proteinG: "Protein (g)", caloriesLabel: "Calories",
    progressPhotos: "Progress Photos", trackVisual: "Track your visual transformation",
    uploadPhoto: "Upload Progress Photo", tapToChoose: "Tap to choose from gallery",
    noPhotos: "No photos yet", tapAnalyze: "Tap to analyze", aiAnalysis: "AI Analysis",
    analyzingPhoto: "Analyzing...",
    sessionName: "Session Name", sessionMuscles: "Session Muscles", exercisesLabel: "Exercises",
    addExercise: "Add", saveSession: "Save Session", addExerciseTitle: "Add Exercise",
    editSession: "Edit Session", newSessionTitle: "New Session",
    how: "How", alt: "Alt", alternativesFor: "Alternatives for",
    findingAlts: "Finding alternatives...",
    musclesActivated: "Muscles Activated", formTips: "Form Tips", noImage: "No image available",
    startPosition: "Start Position", endPosition: "End Position",
    sets: "Sets", reps: "Reps", kg: "kg",
    highPriority: "High Priority", recommended: "Recommended",
    start: "Start", best: "Best", last: "Last",
    suggestedPlan: "Suggested Plan", sessions: "Sessions",
    reviewEdit: "Review and edit, then accept to start training",
    discard: "Discard", acceptPlan: "Accept Plan",
    planLive: "Your training plan is live! Go to the Training tab to see your sessions, tap any exercise to learn how to do it, and start logging when you're ready. Let's go!",
    askCoach: "Ask your coach...",
    coachIntro: "Hey! I'm your AI coach\n\nI can suggest a complete workout plan tailored to your goals, adapt your current sessions, or answer any training and nutrition question.\n\nTry asking me to create a plan, or tap one of the prompts below!",
    prompt1: "Suggest a 4-day muscle gain program",
    prompt2: "Build a beginner full body routine",
    prompt3: "I have 45 min and want to train push muscles",
    prompt4: "Create a program to improve my weak legs",
    thinking: "Thinking...", connectionError: "Connection error. Please try again.",
    based: "Based on", forGoal: "for", perDay: "/day", override: "You can override above.",
    bodyweight: "BODYWEIGHT", timed: "TIMED", howTo: "How to",
    rounds: "rounds", position1: "POSITION 1", position2: "POSITION 2",
    deleteLog: "Delete this log", volume: "Volume", front: "FRONT", back: "BACK",
    howBtn: "How?", egSessionName: "e.g. Push Day, Leg Day...",
    aiSuggestReady: "AI has analyzed your recent sessions", reviewSuggestions: "Review Suggestions",
    dismissSuggest: "Later", autoSuggestTitle: "Program Upgrade Available",
    autoSuggestDesc: "Based on your last sessions, we found improvements for your training.",
  },
  fr: {
    training: "Entraînement", log: "Journal", stats: "Stats", nutrition: "Nutrition", progress: "Progrès", aiCoach: "Coach IA",
    profile: "Profil", yourProfile: "Votre Profil", name: "Nom", weight: "Poids (kg)", height: "Taille (cm)",
    goal: "Objectif", gymDays: "Jours/Semaine", minSession: "Min/Séance", proteinTarget: "Cible Protéines (g/j)",
    autoCalc: "Auto-calculé", saveProfile: "Enregistrer", language: "Langue",
    muscleGain: "Prise de muscle", fatLoss: "Perte de gras", strength: "Force", endurance: "Endurance", maintenance: "Maintien",
    trainingSessions: "Séances d'entraînement", newSession: "Créer", noSessions: "Aucune séance",
    createOrAsk: "Créez manuellement ou demandez au Coach IA de proposer un programme",
    exercises: "exercices", lastLog: "Dernier", edit: "Modifier", muscleToday: "Muscles ciblés",
    hideExercises: "Masquer exercices", showExercises: "Voir exercices",
    logWorkout: "Journal d'entraînement", selectSession: "Choisir la séance du jour",
    createFirst: "Créez des séances dans l'onglet Entraînement d'abord",
    completeSession: "Valider la séance", sessionNotes: "Notes de séance...",
    sessionLogged: "Séance enregistrée !", weightsSaved: "Poids sauvegardés dans votre programme.", done: "OK",
    applyToAll: "Appliquer à toutes les séries",
    progressStats: "Statistiques", total: "Total", thisWeek: "Semaine", thisMonth: "Ce mois",
    aiOptimizer: "Optimiseur IA", analyzeDesc: "Analyse vos progrès et suggère des améliorations",
    applied: "Appliqué !", keepTraining: "Continuez à vous entraîner — pas assez de données pour suggérer des changements.",
    changesApplied: "Les changements acceptés ont été appliqués à vos séances !",
    analyzeSuggest: "Analyser et suggérer", analyzing: "Analyse en cours...",
    weightProgress: "Progression des charges", need2Sessions: "2+ séances avec charges nécessaires pour les graphiques.",
    logToSee: "Enregistrez des séances pour voir les graphiques",
    recentSessions: "Séances récentes", suggestedUpgrades: "Améliorations suggérées",
    acceptReject: "Acceptez ou refusez chaque changement, puis appliquez",
    accepted: "accepté(s)", rejected: "refusé(s)", undecided: "en attente",
    applyChanges: "Appliquer les changements",
    reject: "Refuser", accept: "Accepter",
    currentWeight: "Actuel", newWeight: "Nouveau",
    sessionDetail: "Détail de la séance", backToStats: "Retour aux stats",
    setsCompleted: "séries complétées", notesLabel: "Notes",
    nutritionTitle: "Nutrition", remaining: "restant", calories: "calories",
    workoutDay: "Jour d'entraînement — atteignez votre objectif protéines !", logFood: "Ajouter un aliment",
    nothingLogged: "Rien enregistré", swipeToRemove: "← Glissez pour supprimer",
    addFood: "Ajouter un aliment", quickAdd: "Ajout rapide", custom: "Personnalisé",
    foodName: "Nom de l'aliment", proteinG: "Protéines (g)", caloriesLabel: "Calories",
    progressPhotos: "Photos de progrès", trackVisual: "Suivez votre transformation",
    uploadPhoto: "Ajouter une photo", tapToChoose: "Appuyez pour choisir",
    noPhotos: "Aucune photo", tapAnalyze: "Analyser", aiAnalysis: "Analyse IA",
    analyzingPhoto: "Analyse...",
    sessionName: "Nom de la séance", sessionMuscles: "Muscles de la séance", exercisesLabel: "Exercices",
    addExercise: "Ajouter", saveSession: "Enregistrer la séance", addExerciseTitle: "Ajouter un exercice",
    editSession: "Modifier la séance", newSessionTitle: "Nouvelle séance",
    how: "Guide", alt: "Alt", alternativesFor: "Alternatives pour",
    findingAlts: "Recherche d'alternatives...",
    musclesActivated: "Muscles activés", formTips: "Conseils de forme", noImage: "Pas d'image disponible",
    startPosition: "Position départ", endPosition: "Position fin",
    sets: "Séries", reps: "Reps", kg: "kg",
    highPriority: "Priorité haute", recommended: "Recommandé",
    start: "Début", best: "Max", last: "Dernier",
    suggestedPlan: "Plan suggéré", sessions: "Séances",
    reviewEdit: "Vérifiez et modifiez, puis acceptez pour commencer",
    discard: "Annuler", acceptPlan: "Accepter le plan",
    planLive: "Votre plan d'entraînement est prêt ! Allez dans l'onglet Entraînement pour voir vos séances, appuyez sur un exercice pour apprendre à le faire, et commencez à enregistrer quand vous êtes prêt. C'est parti !",
    askCoach: "Posez votre question...",
    coachIntro: "Salut ! Je suis votre coach IA\n\nJe peux suggérer un programme complet adapté à vos objectifs, adapter vos séances actuelles ou répondre à toute question.\n\nEssayez de me demander de créer un plan !",
    prompt1: "Suggère un programme 4 jours prise de muscle",
    prompt2: "Crée une routine full body débutant",
    prompt3: "J'ai 45 min pour un push, que faire ?",
    prompt4: "Crée un programme pour renforcer mes jambes",
    thinking: "Réflexion...", connectionError: "Erreur de connexion. Réessayez.",
    based: "Basé sur", forGoal: "pour", perDay: "/jour", override: "Vous pouvez modifier ci-dessus.",
    bodyweight: "POIDS DU CORPS", timed: "MINUTÉ", howTo: "Comment faire",
    rounds: "rounds", position1: "POSITION 1", position2: "POSITION 2",
    deleteLog: "Supprimer ce journal", volume: "Volume", front: "AVANT", back: "ARRIÈRE",
    howBtn: "Guide ?", egSessionName: "ex. Push Day, Leg Day...",
    aiSuggestReady: "L'IA a analysé vos dernières séances", reviewSuggestions: "Voir les suggestions",
    dismissSuggest: "Plus tard", autoSuggestTitle: "Amélioration disponible",
    autoSuggestDesc: "D'après vos dernières séances, nous avons trouvé des améliorations pour votre programme.",
  },
};

function useT(profile) {
  return T[profile?.language || "en"] || T.en;
}

const GIF_BASE = "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises";

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
    { name: "Dumbbell Bench Press", muscles: ["chest", "triceps"], equipment: "dumbbell", wgerId: 0, gifId: "0082" },
    { name: "Dumbbell Flyes", muscles: ["chest"], equipment: "dumbbell", wgerId: 119, gifId: "0084" },
    { name: "Push-ups", muscles: ["chest", "triceps"], equipment: "bodyweight", wgerId: 10, gifId: "0720" },
    { name: "Cable Crossover", muscles: ["chest"], equipment: "cable", wgerId: 351, gifId: "1174" },
    { name: "Dips", muscles: ["chest", "triceps"], equipment: "bodyweight", wgerId: 37, gifId: "0235" },
  ],
  back: [
    { name: "Pull-ups", muscles: ["lats", "biceps"], equipment: "bodyweight", wgerId: 31, gifId: "0700" },
    { name: "Barbell Row", muscles: ["lats", "rhomboids"], equipment: "barbell", wgerId: 167, gifId: "0020" },
    { name: "Lat Pulldown", muscles: ["lats"], equipment: "machine", wgerId: 122, gifId: "0290" },
    { name: "Seated Cable Row", muscles: ["mid-back"], equipment: "cable", wgerId: 239, gifId: "0763" },
    { name: "Deadlift", muscles: ["entire back", "hamstrings"], equipment: "barbell", wgerId: 241, gifId: "0207" },
    { name: "Dumbbell Row", muscles: ["lats", "rhomboids"], equipment: "dumbbell", wgerId: 321, gifId: "0110" },
    { name: "Hyperextensions", muscles: ["entire back", "glutes"], equipment: "bodyweight", wgerId: 0, gifId: "0387" },
  ],
  shoulders: [
    { name: "Overhead Press", muscles: ["shoulders", "triceps"], equipment: "barbell", wgerId: 65, gifId: "0047" },
    { name: "Dumbbell Shoulder Press", muscles: ["shoulders", "triceps"], equipment: "dumbbell", wgerId: 0, gifId: "0096" },
    { name: "Arnold Press", muscles: ["all delts"], equipment: "dumbbell", wgerId: 113, gifId: "0062" },
    { name: "Lateral Raises", muscles: ["side delts"], equipment: "dumbbell", wgerId: 526, gifId: "0294" },
    { name: "Face Pulls", muscles: ["rear delts"], equipment: "cable", wgerId: 346, gifId: "0259" },
    { name: "Reverse Flyes", muscles: ["rear delts", "rhomboids"], equipment: "dumbbell", wgerId: 0, gifId: "0745" },
  ],
  legs: [
    { name: "Squat", muscles: ["quads", "glutes", "hamstrings"], equipment: "barbell", wgerId: 6, gifId: "0802" },
    { name: "Romanian Deadlift", muscles: ["hamstrings", "glutes"], equipment: "barbell", wgerId: 157, gifId: "0607" },
    { name: "Leg Press", muscles: ["quads", "glutes"], equipment: "machine", wgerId: 127, gifId: "0306" },
    { name: "Bulgarian Split Squat", muscles: ["quads", "glutes"], equipment: "dumbbell", wgerId: 0, gifId: "1462" },
    { name: "Lunges", muscles: ["quads", "glutes"], equipment: "dumbbell", wgerId: 99, gifId: "0339" },
    { name: "Leg Curl", muscles: ["hamstrings"], equipment: "machine", wgerId: 126, gifId: "0302" },
    { name: "Leg Extension", muscles: ["quads"], equipment: "machine", wgerId: 0, gifId: "0303" },
    { name: "Hip Thrust", muscles: ["glutes", "hamstrings"], equipment: "barbell", wgerId: 0, gifId: "0381" },
    { name: "Calf Raises", muscles: ["calves"], equipment: "machine", wgerId: 128, gifId: "0146" },
  ],
  biceps: [
    { name: "Barbell Curl", muscles: ["biceps"], equipment: "barbell", wgerId: 86, gifId: "0020" },
    { name: "Dumbbell Curl", muscles: ["biceps"], equipment: "dumbbell", wgerId: 228, gifId: "0222" },
    { name: "Hammer Curl", muscles: ["biceps", "brachialis"], equipment: "dumbbell", wgerId: 396, gifId: "0356" },
    { name: "Preacher Curl", muscles: ["biceps"], equipment: "barbell", wgerId: 294, gifId: "0706" },
    { name: "Cable Curl", muscles: ["biceps"], equipment: "cable", wgerId: 383, gifId: "0148" },
  ],
  triceps: [
    { name: "Skull Crushers", muscles: ["triceps"], equipment: "barbell", wgerId: 69, gifId: "0796" },
    { name: "Tricep Pushdown", muscles: ["triceps"], equipment: "cable", wgerId: 198, gifId: "0830" },
    { name: "Overhead Tricep Extension", muscles: ["triceps"], equipment: "dumbbell", wgerId: 114, gifId: "0663" },
    { name: "Diamond Push-ups", muscles: ["triceps"], equipment: "bodyweight", wgerId: 10, gifId: "1070" },
    { name: "Close-grip Bench Press", muscles: ["triceps", "chest"], equipment: "barbell", wgerId: 75, gifId: "0179" },
  ],
  core: [
    { name: "Plank", muscles: ["core"], equipment: "bodyweight", wgerId: 45, gifId: "0700" },
    { name: "Crunches", muscles: ["abs"], equipment: "bodyweight", wgerId: 91, gifId: "0203" },
    { name: "Hanging Leg Raises", muscles: ["lower abs"], equipment: "bodyweight", wgerId: 0, gifId: "0360" },
    { name: "Russian Twists", muscles: ["obliques"], equipment: "bodyweight", wgerId: 346, gifId: "0752" },
    { name: "Ab Wheel Rollout", muscles: ["core", "abs"], equipment: "bodyweight", wgerId: 0, gifId: "0001" },
    { name: "Mountain Climbers", muscles: ["core", "abs"], equipment: "bodyweight", wgerId: 0, gifId: "0630" },
  ],
  cardio: [
    { name: "Burpees", muscles: ["quads", "chest", "core"], equipment: "bodyweight", wgerId: 0, gifId: "0130" },
    { name: "Box Jumps", muscles: ["quads", "glutes"], equipment: "bodyweight", wgerId: 0, gifId: "0119" },
    { name: "Kettlebell Swing", muscles: ["glutes", "hamstrings", "core"], equipment: "dumbbell", wgerId: 0, gifId: "0424" },
    { name: "Battle Ropes", muscles: ["shoulders", "core"], equipment: "bodyweight", wgerId: 0, gifId: "0073" },
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
];

async function callAI(messages, systemPrompt, maxTokens = 1000) {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, system: systemPrompt, maxTokens }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || `API error ${response.status}`);
  }
  const data = await response.json();
  return data.text || "";
}

async function callAIVision(base64, mediaType, prompt) {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image: base64, mediaType, prompt }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || `API error ${response.status}`);
  }
  const data = await response.json();
  return data.text || "";
}

function load(key, def) { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : def; } catch { return def; } }
function save(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} }

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
        <ellipse cx="44" cy="62" rx="9" ry="9" fill={mf(isActive(4))} stroke={mc(isActive(4))} strokeWidth="1.5"/>
        <ellipse cx="66" cy="62" rx="9" ry="9" fill={mf(isActive(4))} stroke={mc(isActive(4))} strokeWidth="1.5"/>
        <ellipse cx="28" cy="52" rx="8" ry="8" fill={mf(isActive(2))} stroke={mc(isActive(2))} strokeWidth="1.5"/>
        <ellipse cx="82" cy="52" rx="8" ry="8" fill={mf(isActive(2))} stroke={mc(isActive(2))} strokeWidth="1.5"/>
        <rect x="15" y="54" width="17" height="22" rx="6" fill={mf(isActive(1))} stroke={mc(isActive(1))} strokeWidth="1.5"/>
        <rect x="78" y="54" width="17" height="22" rx="6" fill={mf(isActive(1))} stroke={mc(isActive(1))} strokeWidth="1.5"/>
        <rect x="44" y="74" width="9" height="9" rx="2.5" fill={mf(isActive(6))} stroke={mc(isActive(6))} strokeWidth="1.5"/>
        <rect x="57" y="74" width="9" height="9" rx="2.5" fill={mf(isActive(6))} stroke={mc(isActive(6))} strokeWidth="1.5"/>
        <rect x="44" y="86" width="9" height="9" rx="2.5" fill={mf(isActive(6))} stroke={mc(isActive(6))} strokeWidth="1.5"/>
        <rect x="57" y="86" width="9" height="9" rx="2.5" fill={mf(isActive(6))} stroke={mc(isActive(6))} strokeWidth="1.5"/>
        <ellipse cx="35" cy="86" rx="4.5" ry="9" fill={mf(isActive(14))} stroke={mc(isActive(14))} strokeWidth="1.5"/>
        <ellipse cx="75" cy="86" rx="4.5" ry="9" fill={mf(isActive(14))} stroke={mc(isActive(14))} strokeWidth="1.5"/>
        <rect x="36" y="106" width="14" height="40" rx="6" fill={mf(isActive(10))} stroke={mc(isActive(10))} strokeWidth="1.5"/>
        <rect x="60" y="106" width="14" height="40" rx="6" fill={mf(isActive(10))} stroke={mc(isActive(10))} strokeWidth="1.5"/>
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
        <ellipse cx="40" cy="74" rx="7" ry="16" fill={mf(isActive(12))} stroke={mc(isActive(12))} strokeWidth="1.5"/>
        <ellipse cx="70" cy="74" rx="7" ry="16" fill={mf(isActive(12))} stroke={mc(isActive(12))} strokeWidth="1.5"/>
        <ellipse cx="55" cy="54" rx="14" ry="9" fill={mf(isActive(9))} stroke={mc(isActive(9))} strokeWidth="1.5"/>
        <rect x="44" y="92" width="22" height="12" rx="4" fill={mf(isActive(8))} stroke={mc(isActive(8))} strokeWidth="1.5"/>
        <ellipse cx="28" cy="51" rx="7" ry="7" fill={mf(isActive(13))} stroke={mc(isActive(13))} strokeWidth="1.5"/>
        <ellipse cx="82" cy="51" rx="7" ry="7" fill={mf(isActive(13))} stroke={mc(isActive(13))} strokeWidth="1.5"/>
        <rect x="15" y="58" width="17" height="20" rx="6" fill={mf(isActive(5))} stroke={mc(isActive(5))} strokeWidth="1.5"/>
        <rect x="78" y="58" width="17" height="20" rx="6" fill={mf(isActive(5))} stroke={mc(isActive(5))} strokeWidth="1.5"/>
        <ellipse cx="44" cy="105" rx="9" ry="7" fill={mf(isActive(8))} stroke={mc(isActive(8))} strokeWidth="1.5"/>
        <ellipse cx="66" cy="105" rx="9" ry="7" fill={mf(isActive(8))} stroke={mc(isActive(8))} strokeWidth="1.5"/>
        <rect x="36" y="110" width="14" height="38" rx="6" fill={mf(isActive(11))} stroke={mc(isActive(11))} strokeWidth="1.5"/>
        <rect x="60" y="110" width="14" height="38" rx="6" fill={mf(isActive(11))} stroke={mc(isActive(11))} strokeWidth="1.5"/>
        <rect x="36" y="150" width="14" height="16" rx="5" fill={mf(isActive(7))} stroke={mc(isActive(7))} strokeWidth="1.5"/>
        <rect x="60" y="150" width="14" height="16" rx="5" fill={mf(isActive(7))} stroke={mc(isActive(7))} strokeWidth="1.5"/>
        <text x="55" y="204" textAnchor="middle" fill="#444" fontSize="8" fontFamily="Syne">BACK</text>
      </svg>
    </div>
  );
}

function ExerciseDemo({ exercise, onClose, t: tt }) {
  const t = tt || T.en;
  const [imgFailed, setImgFailed] = useState(false);
  const [showSecond, setShowSecond] = useState(false);
  const [img2Failed, setImg2Failed] = useState(false);
  const gifId = exercise.gifId;
  const imgUrl = gifId ? `${GIF_BASE}/${gifId}/images/0.jpg` : null;
  const img2Url = gifId ? `${GIF_BASE}/${gifId}/images/1.jpg` : null;
  const tip = EXERCISE_TIPS[exercise.name] || `Keep full control through every rep. Focus tension on the target muscles (${exercise.muscles?.join(", ")}). Avoid momentum.`;

  return (
    <div style={{ position: "fixed", inset: 0, background: "#0a0a0f", zIndex: 400, display: "flex", flexDirection: "column", maxWidth: 480, margin: "0 auto" }}>
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
        {imgUrl && !imgFailed ? (
          <div style={{ marginBottom: 16 }}>
            <div style={{ borderRadius: 16, overflow: "hidden", background: "#111", border: "1px solid #1a1a24", position: "relative" }}>
              <img src={showSecond && !img2Failed ? img2Url : imgUrl} alt={exercise.name} style={{ width: "100%", display: "block", minHeight: 200, objectFit: "cover" }} onError={() => { if (showSecond) setImg2Failed(true); else setImgFailed(true); }} />
              <div style={{ position: "absolute", bottom: 10, left: 10, background: "rgba(0,0,0,0.7)", borderRadius: 6, padding: "3px 8px", fontSize: 10, fontWeight: 700, color: "#e8e4dc", letterSpacing: 1 }}>{showSecond ? t.position2 : t.position1}</div>
            </div>
            {!img2Failed && (
              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                <button onClick={() => setShowSecond(false)} style={{ flex: 1, background: !showSecond ? "#e63c2f" : "#111", border: `1px solid ${!showSecond ? "#e63c2f" : "#2a2a3a"}`, borderRadius: 8, padding: "8px", color: !showSecond ? "#fff" : "#666", fontSize: 12, fontWeight: 700 }}>{t.startPosition}</button>
                <button onClick={() => setShowSecond(true)} style={{ flex: 1, background: showSecond ? "#e63c2f" : "#111", border: `1px solid ${showSecond ? "#e63c2f" : "#2a2a3a"}`, borderRadius: 8, padding: "8px", color: showSecond ? "#fff" : "#666", fontSize: 12, fontWeight: 700 }}>{t.endPosition}</button>
              </div>
            )}
          </div>
        ) : (
          <div style={{ background: "#111", border: "1px solid #1a1a24", borderRadius: 16, padding: "28px 20px", marginBottom: 16, textAlign: "center" }}>
            <div style={{ fontSize: 44, marginBottom: 10 }}>🏋️</div>
            <div style={{ color: "#555", fontSize: 14, fontWeight: 600 }}>{t.noImage}</div>
          </div>
        )}
        <div style={{ background: "#111", border: "1px solid #1a1a24", borderRadius: 14, padding: 16, marginBottom: 14 }}>
          <div style={{ fontSize: 10, letterSpacing: 2, color: "#e63c2f", fontWeight: 700, textTransform: "uppercase", marginBottom: 12 }}>{t.musclesActivated}</div>
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
        <div style={{ background: "#111", border: "1px solid #1a1a24", borderRadius: 14, padding: 16 }}>
          <div style={{ fontSize: 10, letterSpacing: 2, color: "#e63c2f", fontWeight: 700, textTransform: "uppercase", marginBottom: 12 }}>{t.formTips}</div>
          <div style={{ fontSize: 14, lineHeight: 1.8, color: "#bbb" }}>{tip}</div>
        </div>
      </div>
    </div>
  );
}

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
    send: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
    info: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
  };
  return icons[name] || null;
};

export default function GymTracker() {
  const [tab, setTab] = useState("sessions");
  const [profile, setProfile] = useState(() => load(STORAGE_KEYS.profile, defaultProfile));
  const [sessions, setSessions] = useState(() => load(STORAGE_KEYS.sessions, []));
  const [workoutLogs, setWorkoutLogs] = useState(() => load(STORAGE_KEYS.workoutLogs, []));
  const [nutritionLogs, setNutritionLogs] = useState(() => load(STORAGE_KEYS.nutritionLogs, []));
  const [photos, setPhotos] = useState(() => load(STORAGE_KEYS.photos, []));
  const [showProfileSetup, setShowProfileSetup] = useState(!profile.name);
  const [autoSuggestData, setAutoSuggestData] = useState(null); // null or { changes: [...] }
  const [showAutoSuggest, setShowAutoSuggest] = useState(false);
  const [autoSuggestLoading, setAutoSuggestLoading] = useState(false);
  const prevLogCount = useRef(workoutLogs.length);

  const t = useT(profile);

  useEffect(() => { save(STORAGE_KEYS.profile, profile); }, [profile]);
  useEffect(() => { save(STORAGE_KEYS.sessions, sessions); }, [sessions]);
  useEffect(() => { save(STORAGE_KEYS.workoutLogs, workoutLogs); }, [workoutLogs]);
  useEffect(() => { save(STORAGE_KEYS.nutritionLogs, nutritionLogs); }, [nutritionLogs]);
  useEffect(() => { save(STORAGE_KEYS.photos, photos); }, [photos]);

  // Auto-suggest: trigger AI analysis every 3 new sessions
  useEffect(() => {
    if (workoutLogs.length > prevLogCount.current && workoutLogs.length >= 3) {
      prevLogCount.current = workoutLogs.length;
      // Check if we should trigger (every 3 sessions)
      if (workoutLogs.length % 3 === 0 && sessions.length > 0) {
        runAutoSuggest();
      }
    } else {
      prevLogCount.current = workoutLogs.length;
    }
  }, [workoutLogs.length]);

  const runAutoSuggest = async () => {
    setAutoSuggestLoading(true);
    try {
      const exProgress = {};
      workoutLogs.forEach(log => {
        log.exercises?.forEach(ex => {
          if (!exProgress[ex.name]) exProgress[ex.name] = [];
          const maxW = Math.max(...(ex.sets || []).map(s => +s.weight || 0));
          const maxR = Math.max(...(ex.sets || []).map(s => +s.reps || 0));
          const muscles = ex.muscles || [];
          if (maxW > 0 || maxR > 0) exProgress[ex.name].push({ date: log.date, weight: maxW, reps: maxR, muscles });
        });
      });

      const exNames = Object.keys(exProgress).filter(k => exProgress[k].length >= 2);
      if (exNames.length < 2) { setAutoSuggestLoading(false); return; }

      const progressSummary = exNames.map(name => {
        const data = exProgress[name].sort((a, b) => new Date(a.date) - new Date(b.date));
        return {
          name, muscles: data[0].muscles,
          startWeight: data[0].weight, currentWeight: data[data.length - 1].weight,
          startReps: data[0].reps, currentReps: data[data.length - 1].reps,
          trend: data[data.length - 1].weight - data[0].weight,
          sessions: data.length,
        };
      });

      // Group by muscle for balance analysis
      const muscleVolume = {};
      workoutLogs.slice(-6).forEach(log => {
        log.exercises?.forEach(ex => {
          (ex.muscles || []).forEach(m => {
            muscleVolume[m] = (muscleVolume[m] || 0) + (ex.sets || []).length;
          });
        });
      });

      const sessionsSummary = sessions.map(s => ({
        id: s.id, name: s.name,
        exercises: s.exercises?.map((e, i) => ({ idx: i, name: e.name, sets: e.sets, reps: e.reps, weight: e.weight, muscles: e.muscles }))
      }));

      const goalText = profile.goal?.replace("_", " ") || "muscle gain";

      const prompt = `You are an expert personal trainer. The user's goal is: ${goalText}.

EXERCISE PROGRESS (last ${workoutLogs.length} sessions):
${JSON.stringify(progressSummary, null, 2)}

MUSCLE VOLUME (last 6 sessions, total sets per muscle):
${JSON.stringify(muscleVolume, null, 2)}

CURRENT PROGRAM:
${JSON.stringify(sessionsSummary, null, 2)}

Analyze and suggest specific changes. Consider:
1. Weight increases where 3+ consistent sessions at same weight
2. Volume adjustments for lagging muscle groups based on goal (${goalText})
3. Rep range changes if plateaued
4. Balance between muscle groups for the user's goal

Return ONLY a JSON array:
[{"sessionId":<number>,"exIdx":<number>,"field":"weight"|"sets"|"reps","newVal":"<string>","reason":"<1 sentence with data>","priority":"high"|"medium"}]

Be conservative with weight increases (2.5-5kg). Return empty array [] if no upgrades needed.`;

      const response = await callAI([{ role: "user", content: prompt }], "Return ONLY valid JSON. No markdown.", 1200);
      let parsed = [];
      try { parsed = JSON.parse(response.replace(/```json|```/g, "").trim()); } catch {}

      if (Array.isArray(parsed) && parsed.length > 0) {
        const enriched = parsed.map((s, i) => {
          const session = sessions.find(x => x.id === s.sessionId);
          const ex = session?.exercises?.[s.exIdx];
          return { ...s, id: i, sessionName: session?.name || "?", exName: ex?.name || "?", oldVal: ex?.[s.field] || "—", accepted: null };
        }).filter(s => s.exName !== "?");
        if (enriched.length > 0) {
          setAutoSuggestData({ changes: enriched });
          setShowAutoSuggest(true);
        }
      }
    } catch (e) { console.error("Auto-suggest failed:", e); }
    setAutoSuggestLoading(false);
  };

  const applyAutoSuggest = () => {
    const accepted = (autoSuggestData?.changes || []).filter(c => c.accepted === true);
    if (accepted.length > 0) {
      setSessions(prev => prev.map(session => {
        const changes = accepted.filter(c => c.sessionId === session.id);
        if (changes.length === 0) return session;
        const newExercises = [...(session.exercises || [])];
        changes.forEach(c => {
          if (newExercises[c.exIdx]) newExercises[c.exIdx] = { ...newExercises[c.exIdx], [c.field]: c.newVal };
        });
        return { ...session, exercises: newExercises };
      }));
    }
    setShowAutoSuggest(false);
    setAutoSuggestData(null);
  };

  const fieldLabel = f => f === "weight" ? t.kg : f === "sets" ? t.sets : t.reps;
  const fieldUnit = f => f === "weight" ? "kg" : "";

  const tabs = [
    { id: "sessions", label: t.training, icon: "dumbbell" },
    { id: "track", label: t.log, icon: "check" },
    { id: "stats", label: t.stats, icon: "chart" },
    { id: "nutrition", label: t.nutrition, icon: "apple" },
    { id: "photos", label: t.progress, icon: "camera" },
    { id: "ai", label: t.aiCoach, icon: "brain" },
  ];

  return (
    <div className="app-shell" style={{ fontFamily: "'Syne', sans-serif", background: "#0a0a0f", color: "#e8e4dc", display: "flex", flexDirection: "column", maxWidth: 480, margin: "0 auto", overflow: "hidden", position: "relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
        html, body, #root { height: 100%; overflow: hidden; background: #0a0a0f; position: fixed; inset: 0; width: 100%; }
        body { overscroll-behavior: none; }
        .app-shell { height: 100vh; height: 100dvh; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #111; } ::-webkit-scrollbar-thumb { background: #e63c2f; border-radius: 2px; }
        input, textarea, select, button { font-family: 'Syne', sans-serif; }
        input, textarea { font-size: 16px !important; }
        button { cursor: pointer; -webkit-user-select: none; user-select: none; }
        .slide-in { animation: slideIn 0.25s ease; }
        @keyframes slideIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .pulse { animation: pulse 1.8s ease infinite; }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
        .gym-btn { min-height: 48px; display: flex; align-items: center; justify-content: center; }
        .gym-btn:active { transform: scale(0.97); }
      `}</style>

      <div style={{ padding: "16px 20px 12px", borderBottom: "1px solid #1a1a24", background: "#0a0a0f", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 10, letterSpacing: 4, color: "#e63c2f", textTransform: "uppercase", fontWeight: 700 }}>Iron Protocol</div>
          <div style={{ fontSize: 17, fontWeight: 800 }}>{profile.name || t.yourProfile}</div>
        </div>
        <button onClick={() => setShowProfileSetup(true)} className="gym-btn" style={{ background: "#1a1a24", border: "1px solid #2a2a3a", borderRadius: 10, padding: "7px 14px", color: "#e8e4dc", display: "flex", alignItems: "center", gap: 6, fontSize: 12, minHeight: 40 }}>
          <Icon name="user" size={14} /> {t.profile}
        </button>
      </div>

      <div style={{ flex: 1, minHeight: 0, overflow: "auto", overscrollBehavior: "contain", WebkitOverflowScrolling: "touch", paddingBottom: "calc(80px + env(safe-area-inset-bottom, 0px))" }}>
        {tab === "sessions" && <SessionsTab sessions={sessions} setSessions={setSessions} profile={profile} workoutLogs={workoutLogs} t={t} />}
        {tab === "track" && <TrackTab sessions={sessions} setSessions={setSessions} workoutLogs={workoutLogs} setWorkoutLogs={setWorkoutLogs} t={t} />}
        {tab === "stats" && <StatsTab workoutLogs={workoutLogs} setWorkoutLogs={setWorkoutLogs} sessions={sessions} setSessions={setSessions} t={t} />}
        {tab === "nutrition" && <NutritionTab nutritionLogs={nutritionLogs} setNutritionLogs={setNutritionLogs} profile={profile} workoutLogs={workoutLogs} t={t} />}
        {tab === "photos" && <PhotosTab photos={photos} setPhotos={setPhotos} t={t} />}
        {tab === "ai" && <AICoachTab profile={profile} sessions={sessions} workoutLogs={workoutLogs} nutritionLogs={nutritionLogs} photos={photos} setSessions={setSessions} t={t} />}
      </div>

      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: "#0d0d18", borderTop: "1px solid #1a1a24", display: "flex", paddingTop: 6, paddingLeft: 4, paddingRight: 4, paddingBottom: "calc(12px + env(safe-area-inset-bottom, 0px))", zIndex: 100 }}>
        {tabs.map(tb => (
          <button key={tb.id} onClick={() => setTab(tb.id)} style={{ flex: 1, background: "none", border: "none", padding: "8px 2px", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, color: tab === tb.id ? "#e63c2f" : "#444", transition: "color 0.15s", minHeight: 48 }}>
            <Icon name={tb.icon} size={20} />
            <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: 0.5 }}>{tb.label}</span>
          </button>
        ))}
      </div>

      {showProfileSetup && <ProfileModal profile={profile} setProfile={setProfile} onClose={() => setShowProfileSetup(false)} t={t} />}

      {/* Auto-suggest loading indicator */}
      {autoSuggestLoading && (
        <div style={{ position: "fixed", top: 60, left: "50%", transform: "translateX(-50%)", background: "#0c1520", border: "2px solid #e63c2f44", borderRadius: 12, padding: "10px 18px", zIndex: 150, display: "flex", alignItems: "center", gap: 8, maxWidth: 380 }}>
          <span className="pulse" style={{ color: "#e63c2f", fontSize: 13, fontWeight: 700 }}>🤖 {t.analyzing}</span>
        </div>
      )}

      {/* Auto-suggest banner */}
      {showAutoSuggest && autoSuggestData && !autoSuggestLoading && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.95)", zIndex: 250, display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "18px 18px 10px", borderBottom: "1px solid #1a1a24", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: 18 }}>⚡ {t.autoSuggestTitle}</div>
              <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>{t.autoSuggestDesc}</div>
            </div>
            <button onClick={() => { setShowAutoSuggest(false); setAutoSuggestData(null); }} style={{ background: "none", border: "none", color: "#666" }}><Icon name="close" /></button>
          </div>
          <div style={{ flex: 1, overflow: "auto", padding: 18 }}>
            {autoSuggestData.changes.map((c, i) => (
              <div key={c.id} style={{ background: "#111", border: `2px solid ${c.accepted === true ? "#4ade80" : c.accepted === false ? "#333" : "#2a2a3a"}`, borderRadius: 13, padding: 14, marginBottom: 12, opacity: c.accepted === false ? 0.45 : 1, transition: "all 0.2s" }}>
                <div style={{ fontSize: 10, color: "#e63c2f", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 3 }}>
                  {c.sessionName} · {c.priority === "high" ? `🔴 ${t.highPriority}` : `🟡 ${t.recommended}`}
                </div>
                <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 8 }}>{c.exName}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, background: "#0a0a0f", borderRadius: 8, padding: "8px 12px" }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 9, color: "#555", textTransform: "uppercase", letterSpacing: 1 }}>{t.currentWeight} {fieldLabel(c.field)}</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: "#666" }}>{c.oldVal}{fieldUnit(c.field)}</div>
                  </div>
                  <div style={{ fontSize: 18, color: "#e63c2f" }}>→</div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 9, color: "#4ade80", textTransform: "uppercase", letterSpacing: 1 }}>{t.newWeight} {fieldLabel(c.field)}</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: "#4ade80" }}>{c.newVal}{fieldUnit(c.field)}</div>
                  </div>
                </div>
                <div style={{ fontSize: 12, color: "#888", marginBottom: 12, lineHeight: 1.6 }}>💡 {c.reason}</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <button onClick={() => setAutoSuggestData(d => ({ ...d, changes: d.changes.map((x, j) => j === i ? { ...x, accepted: false } : x) }))}
                    className="gym-btn" style={{ background: c.accepted === false ? "#2a1a1a" : "#111", border: `1px solid ${c.accepted === false ? "#e63c2f44" : "#252535"}`, borderRadius: 8, padding: "10px", color: c.accepted === false ? "#e63c2f" : "#555", fontWeight: 700, fontSize: 13, minHeight: 44 }}>
                    ✕ {t.reject}
                  </button>
                  <button onClick={() => setAutoSuggestData(d => ({ ...d, changes: d.changes.map((x, j) => j === i ? { ...x, accepted: true } : x) }))}
                    className="gym-btn" style={{ background: c.accepted === true ? "#4ade8022" : "#111", border: `1px solid ${c.accepted === true ? "#4ade8066" : "#252535"}`, borderRadius: 8, padding: "10px", color: c.accepted === true ? "#4ade80" : "#888", fontWeight: 700, fontSize: 13, minHeight: 44 }}>
                    ✓ {t.accept}
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding: "12px 18px 20px", borderTop: "1px solid #1a1a24" }}>
            <div style={{ fontSize: 11, color: "#555", textAlign: "center", marginBottom: 10 }}>
              {autoSuggestData.changes.filter(c => c.accepted === true).length} {t.accepted} · {autoSuggestData.changes.filter(c => c.accepted === false).length} {t.rejected}
            </div>
            <button onClick={applyAutoSuggest} className="gym-btn" style={{ width: "100%", background: "#e63c2f", border: "none", borderRadius: 12, padding: "14px", fontWeight: 800, fontSize: 15, color: "#fff", minHeight: 52 }}>
              {t.applyChanges} ({autoSuggestData.changes.filter(c => c.accepted === true).length})
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function calcProtein(weight, goal) {
  if (!weight || isNaN(weight)) return null;
  const w = parseFloat(weight);
  const multipliers = { muscle_gain: 2.2, strength: 2.0, fat_loss: 2.4, endurance: 1.6, maintenance: 1.8 };
  return Math.round(w * (multipliers[goal] || 1.8));
}

function ProfileModal({ profile, setProfile, onClose, t }) {
  const [form, setForm] = useState(profile);

  const updateField = (field, val) => {
    const updated = { ...form, [field]: val };
    if (field === "weight" || field === "goal") {
      const rec = calcProtein(field === "weight" ? val : form.weight, field === "goal" ? val : form.goal);
      if (rec) updated.proteinTarget = rec;
    }
    setForm(updated);
  };

  const recommended = calcProtein(form.weight, form.goal);
  const doSave = () => { setProfile(form); onClose(); };
  const curT = T[form.language || "en"] || T.en;
  const goalLabels = { muscle_gain: curT.muscleGain, fat_loss: curT.fatLoss, strength: curT.strength, endurance: curT.endurance, maintenance: curT.maintenance };

  const inp = (field, label, type = "text") => (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 10, letterSpacing: 2, color: "#e63c2f", marginBottom: 5, fontWeight: 700, textTransform: "uppercase" }}>{label}</div>
      <input value={form[field] || ""} onChange={e => updateField(field, e.target.value)} type={type}
        style={{ width: "100%", background: "#111", border: "1px solid #2a2a3a", borderRadius: 10, padding: "12px 14px", color: "#e8e4dc", fontSize: 15, minHeight: 48 }} />
    </div>
  );
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", zIndex: 200, display: "flex", alignItems: "flex-end" }}>
      <div style={{ background: "#0f0f1a", borderRadius: "18px 18px 0 0", padding: 22, width: "100%", maxHeight: "90vh", overflow: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ fontWeight: 800, fontSize: 19 }}>{curT.yourProfile}</div>
          <button onClick={onClose} className="gym-btn" style={{ background: "#1a1a24", border: "none", borderRadius: 10, padding: 10, color: "#888", minWidth: 40, minHeight: 40 }}><Icon name="close" /></button>
        </div>

        {/* Language Selector */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 10, letterSpacing: 2, color: "#e63c2f", marginBottom: 5, fontWeight: 700, textTransform: "uppercase" }}>{curT.language}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[["en", "🇬🇧  English"], ["fr", "🇫🇷  Français"]].map(([code, label]) => (
              <button key={code} onClick={() => setForm(f => ({ ...f, language: code }))}
                className="gym-btn"
                style={{ background: form.language === code ? "#e63c2f" : "#111", border: `2px solid ${form.language === code ? "#e63c2f" : "#2a2a3a"}`, borderRadius: 10, padding: "12px", color: form.language === code ? "#fff" : "#888", fontWeight: 700, fontSize: 14, minHeight: 48, transition: "all 0.15s" }}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {inp("name", curT.name)}
        {inp("weight", curT.weight, "number")}
        {inp("height", curT.height, "number")}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 10, letterSpacing: 2, color: "#e63c2f", marginBottom: 5, fontWeight: 700, textTransform: "uppercase" }}>{curT.goal}</div>
          <select value={form.goal} onChange={e => updateField("goal", e.target.value)} style={{ width: "100%", background: "#111", border: "1px solid #2a2a3a", borderRadius: 10, padding: "12px 14px", color: "#e8e4dc", fontSize: 15, minHeight: 48 }}>
            {Object.entries(goalLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
          {[["daysPerWeek", curT.gymDays], ["minutesPerSession", curT.minSession]].map(([f, l]) => (
            <div key={f}>
              <div style={{ fontSize: 10, letterSpacing: 2, color: "#e63c2f", marginBottom: 5, fontWeight: 700, textTransform: "uppercase" }}>{l}</div>
              <input type="number" value={form[f]} onChange={e => updateField(f, +e.target.value)} style={{ width: "100%", background: "#111", border: "1px solid #2a2a3a", borderRadius: 10, padding: "12px 14px", color: "#e8e4dc", fontSize: 15, minHeight: 48 }} />
            </div>
          ))}
        </div>
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
            <div style={{ fontSize: 10, letterSpacing: 2, color: "#e63c2f", fontWeight: 700, textTransform: "uppercase" }}>{curT.proteinTarget}</div>
            {recommended && <div style={{ fontSize: 10, color: "#4ade80", fontWeight: 700 }}>✦ {curT.autoCalc}</div>}
          </div>
          <input type="number" value={form.proteinTarget || ""} onChange={e => setForm({ ...form, proteinTarget: +e.target.value })}
            style={{ width: "100%", background: "#111", border: "1px solid #2a2a3a", borderRadius: 10, padding: "12px 14px", color: "#e8e4dc", fontSize: 15, minHeight: 48 }} />
          {recommended && (
            <div style={{ marginTop: 6, background: "#4ade801a", border: "1px solid #4ade8033", borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "#4ade80" }}>
              {curT.based} {form.weight}kg × {form.goal === "muscle_gain" ? "2.2" : form.goal === "fat_loss" ? "2.4" : form.goal === "strength" ? "2.0" : form.goal === "endurance" ? "1.6" : "1.8"}g/kg {curT.forGoal} {goalLabels[form.goal] || form.goal} = <strong>{recommended}g{curT.perDay}</strong>. {curT.override}
            </div>
          )}
        </div>

        <button onClick={doSave} className="gym-btn" style={{ width: "100%", background: "#e63c2f", border: "none", borderRadius: 12, padding: "14px", fontWeight: 800, fontSize: 16, color: "#fff", marginTop: 6, minHeight: 52 }}>{curT.saveProfile}</button>
      </div>
    </div>
  );
}

function SessionsTab({ sessions, setSessions, profile, workoutLogs, t }) {
  const [showCreate, setShowCreate] = useState(false);
  const [editSession, setEditSession] = useState(null);
  const [showAlts, setShowAlts] = useState(null);
  const [altResults, setAltResults] = useState(""); const [altLoading, setAltLoading] = useState(false);
  const [showDemo, setShowDemo] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const getAlternatives = async (exercise) => {
    setAltLoading(true); setAltResults("");
    try {
      const res = await callAI([{ role: "user", content: `Give 4 alternatives for "${exercise.name}" (targets: ${exercise.muscles?.join(", ")}). For each briefly explain why it's a good substitute.` }], "You are a knowledgeable fitness coach. Be concise and practical.", 1000);
      setAltResults(res);
    } catch (e) { setAltResults("Error: " + (e.message || "Could not load alternatives.")); }
    setAltLoading(false);
  };

  const getSessionMuscles = (s) => [...new Set((s.exercises || []).flatMap(e => e.muscles || []))];

  return (
    <div style={{ padding: 18 }} className="slide-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 800 }}>{t.trainingSessions}</div>
          <div style={{ color: "#555", fontSize: 12, marginTop: 2 }}>{profile.daysPerWeek}×/{t.gymDays?.split("/")[0] || "week"} · {profile.minutesPerSession} min</div>
        </div>
        <button onClick={() => setShowCreate(true)} className="gym-btn" style={{ background: "#e63c2f", border: "none", borderRadius: 11, padding: "10px 16px", color: "#fff", fontWeight: 700, display: "flex", alignItems: "center", gap: 5, fontSize: 14, minHeight: 44 }}>
          <Icon name="plus" size={15} /> {t.newSession}
        </button>
      </div>

      {sessions.length === 0 ? (
        <div style={{ textAlign: "center", padding: "50px 20px", color: "#444" }}>
          <div style={{ fontSize: 44, marginBottom: 10 }}>🏋️</div>
          <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>{t.noSessions}</div>
          <div style={{ fontSize: 13 }}>{t.createOrAsk}</div>
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
                  <div style={{ color: "#e63c2f", fontSize: 11, fontWeight: 600, letterSpacing: 1 }}>{session.exercises?.length || 0} {t.exercises?.toUpperCase()}</div>
                  {lastLog && <div style={{ color: "#444", fontSize: 11, marginTop: 2 }}>{t.lastLog}: {new Date(lastLog.date).toLocaleDateString()}</div>}
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={() => setEditSession({ ...session, idx })} style={{ background: "#1a1a24", border: "1px solid #252535", borderRadius: 7, padding: "5px 9px", color: "#888", fontSize: 12 }}>{t.edit}</button>
                  <button onClick={() => setSessions(s => s.filter((_, i) => i !== idx))} style={{ background: "none", border: "1px solid #252535", borderRadius: 7, padding: "5px 7px", color: "#444" }}><Icon name="trash" size={13} /></button>
                </div>
              </div>
              <div style={{ background: "#0d0d18", borderRadius: 10, padding: "10px 12px", marginBottom: 10, display: "flex", alignItems: "center", gap: 10 }}>
                <MuscleMap muscles={muscles} size={88} />
                <div>
                  <div style={{ fontSize: 9, letterSpacing: 2, color: "#e63c2f", fontWeight: 700, textTransform: "uppercase", marginBottom: 6 }}>{t.muscleToday}</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {muscles.map(m => (
                      <span key={m} style={{ background: "#e63c2f1a", border: "1px solid #e63c2f33", borderRadius: 5, padding: "2px 7px", fontSize: 10, color: "#e63c2f", fontWeight: 600, textTransform: "capitalize" }}>{m}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <button onClick={() => setExpandedId(open ? null : session.id)} style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center", background: "none", border: "none", borderTop: "1px solid #1a1a24", padding: "9px 14px", color: "#555", fontSize: 12 }}>
              <span>{open ? t.hideExercises : t.showExercises}</span>
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
                        <Icon name="info" size={12} /> {t.how}
                      </button>
                      <button onClick={() => { setShowAlts({ exercise: ex }); getAlternatives(ex); }} style={{ background: "#1a1a24", border: "1px solid #252535", borderRadius: 7, padding: "4px 8px", color: "#666", fontSize: 11, display: "flex", alignItems: "center", gap: 3 }}>
                        <Icon name="swap" size={12} /> {t.alt}
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
        <SessionEditor initial={editSession} onSave={s => { if (editSession) setSessions(p => p.map((x, i) => i === editSession.idx ? s : x)); else setSessions(p => [...p, { ...s, id: Date.now() }]); setShowCreate(false); setEditSession(null); }} onClose={() => { setShowCreate(false); setEditSession(null); }} t={t} />
      )}

      {showAlts && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", zIndex: 200, display: "flex", alignItems: "flex-end" }}>
          <div style={{ background: "#0f0f1a", borderRadius: "18px 18px 0 0", padding: 22, width: "100%", maxHeight: "75vh", overflow: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
              <div style={{ fontWeight: 800, fontSize: 17 }}>{t.alternativesFor} {showAlts.exercise?.name}</div>
              <button onClick={() => setShowAlts(null)} style={{ background: "none", border: "none", color: "#666" }}><Icon name="close" /></button>
            </div>
            {altLoading ? <div className="pulse" style={{ color: "#e63c2f", fontWeight: 700 }}>{t.findingAlts}</div>
              : <div style={{ whiteSpace: "pre-wrap", fontSize: 14, lineHeight: 1.7, color: "#bbb" }}>{altResults}</div>}
          </div>
        </div>
      )}

      {showDemo && <ExerciseDemo exercise={showDemo} onClose={() => setShowDemo(null)} t={t} />}
    </div>
  );
}

function SessionEditor({ initial, onSave, onClose, t: tt }) {
  const t = tt || T.en;
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
          <div style={{ fontWeight: 800, fontSize: 19 }}>{initial ? t.editSession : t.newSessionTitle}</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#666" }}><Icon name="close" /></button>
        </div>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 10, letterSpacing: 2, color: "#e63c2f", marginBottom: 4, fontWeight: 700, textTransform: "uppercase" }}>{t.sessionName}</div>
          <input value={name} onChange={e => setName(e.target.value)} placeholder={t.egSessionName} style={{ width: "100%", background: "#111", border: "1px solid #2a2a3a", borderRadius: 8, padding: "9px 12px", color: "#e8e4dc", fontSize: 14 }} />
        </div>
        {exercises.length > 0 && (
          <div style={{ background: "#111", border: "1px solid #1a1a24", borderRadius: 12, padding: "10px 12px", marginBottom: 14, display: "flex", alignItems: "center", gap: 10 }}>
            <MuscleMap muscles={muscles} size={80} />
            <div>
              <div style={{ fontSize: 9, letterSpacing: 2, color: "#e63c2f", fontWeight: 700, textTransform: "uppercase", marginBottom: 5 }}>{t.sessionMuscles}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {muscles.map(m => <span key={m} style={{ background: "#e63c2f1a", borderRadius: 4, padding: "2px 6px", fontSize: 10, color: "#e63c2f", fontWeight: 600, textTransform: "capitalize" }}>{m}</span>)}
              </div>
            </div>
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div style={{ fontSize: 10, letterSpacing: 2, color: "#e63c2f", fontWeight: 700, textTransform: "uppercase" }}>{t.exercisesLabel}</div>
          <button onClick={() => setShowPicker(true)} style={{ background: "#e63c2f1a", border: "1px solid #e63c2f33", borderRadius: 7, padding: "4px 10px", color: "#e63c2f", fontSize: 12, fontWeight: 700 }}>+ {t.addExercise}</button>
        </div>
        {exercises.map((ex, idx) => (
          <div key={idx} style={{ background: "#111", border: "1px solid #1a1a24", borderRadius: 10, padding: 11, marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7, alignItems: "center" }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{ex.name}</div>
              <div style={{ display: "flex", gap: 5 }}>
                <button onClick={() => setShowDemo(ex)} style={{ background: "#1a1a24", border: "1px solid #252535", borderRadius: 6, padding: "3px 7px", color: "#e63c2f", fontSize: 11 }}>{t.howBtn}</button>
                <button onClick={() => removeEx(idx)} style={{ background: "none", border: "none", color: "#444" }}><Icon name="trash" size={13} /></button>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 7 }}>
              {["sets", "reps", "weight"].map(f => (
                <div key={f}>
                  <div style={{ fontSize: 9, color: "#555", marginBottom: 2, textTransform: "uppercase", letterSpacing: 1 }}>{f === "weight" ? t.kg : f === "sets" ? t.sets : t.reps}</div>
                  <input value={ex[f] || ""} onChange={e => updateEx(idx, f, e.target.value)} placeholder={f === "weight" ? "BW" : ""}
                    style={{ width: "100%", background: "#0a0a0f", border: "1px solid #2a2a3a", borderRadius: 5, padding: "5px 7px", color: "#e8e4dc", fontSize: 13 }} />
                </div>
              ))}
            </div>
          </div>
        ))}
        <button onClick={() => name && onSave({ id: initial?.id || Date.now(), name, exercises })} className="gym-btn" style={{ width: "100%", background: "#e63c2f", border: "none", borderRadius: 12, padding: "13px", fontWeight: 800, fontSize: 15, color: "#fff", marginTop: 4, minHeight: 48 }}>{t.saveSession}</button>
        {showPicker && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.96)", zIndex: 300, overflow: "auto", padding: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
              <div style={{ fontWeight: 800, fontSize: 17 }}>{t.addExerciseTitle}</div>
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
                    <button onClick={() => setShowDemo(ex)} style={{ background: "#1a1a24", border: "none", borderLeft: "1px solid #1a1a24", padding: "0 11px", color: "#e63c2f", fontSize: 11, fontWeight: 700 }}>{t.howBtn}</button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
        {showDemo && <ExerciseDemo exercise={showDemo} onClose={() => setShowDemo(null)} t={t} />}
      </div>
    </div>
  );
}

// Per-exercise tracking field config: what the "weight" column means and its label
const EX_FIELD_CONFIG = {
  // Cardio / machines with power or distance
  "Rowing Machine":      { label: "Watts",    placeholder: "watts",   unit: "W" },
  "Battle Ropes":        { label: "Duration", placeholder: "secs",    unit: "s" },
  "Burpees":             { label: "Duration", placeholder: "secs",    unit: "s" },
  "Box Jumps":           { label: "Height",   placeholder: "cm",      unit: "cm" },
  "Mountain Climbers":   { label: "Duration", placeholder: "secs",    unit: "s" },
  // Bodyweight — track added weight or just BW
  "Pull-ups":            { label: "Added kg", placeholder: "BW",      unit: "kg", bodyweight: true },
  "Chin-ups":            { label: "Added kg", placeholder: "BW",      unit: "kg", bodyweight: true },
  "Wide Grip Pull-ups":  { label: "Added kg", placeholder: "BW",      unit: "kg", bodyweight: true },
  "Push-ups":            { label: "Added kg", placeholder: "BW",      unit: "kg", bodyweight: true },
  "Wide Push-ups":       { label: "Added kg", placeholder: "BW",      unit: "kg", bodyweight: true },
  "Diamond Push-ups":    { label: "Added kg", placeholder: "BW",      unit: "kg", bodyweight: true },
  "Dips":                { label: "Added kg", placeholder: "BW",      unit: "kg", bodyweight: true },
  "Tricep Dips":         { label: "Added kg", placeholder: "BW",      unit: "kg", bodyweight: true },
  "Hyperextensions":     { label: "Added kg", placeholder: "BW",      unit: "kg", bodyweight: true },
  "Plank":               { label: "Duration", placeholder: "secs",    unit: "s" },
  "Side Plank":          { label: "Duration", placeholder: "secs",    unit: "s" },
  "Crunches":            { label: "Duration", placeholder: "secs",    unit: "s" },
  "Hanging Leg Raises":  { label: "Added kg", placeholder: "BW",      unit: "kg", bodyweight: true },
  "Leg Raises":          { label: "Added kg", placeholder: "BW",      unit: "kg", bodyweight: true },
  "Russian Twists":      { label: "Weight",   placeholder: "kg",      unit: "kg" },
  "Ab Wheel Rollout":    { label: "Added kg", placeholder: "BW",      unit: "kg", bodyweight: true },
  "V-ups":               { label: "Added kg", placeholder: "BW",      unit: "kg", bodyweight: true },
  "Flutter Kicks":       { label: "Duration", placeholder: "secs",    unit: "s" },
  "Wall Sit":            { label: "Duration", placeholder: "secs",    unit: "s" },
  "Jump Squats":         { label: "Added kg", placeholder: "BW",      unit: "kg", bodyweight: true },
  // Kettlebell
  "Kettlebell Swing":    { label: "Weight",   placeholder: "kg",      unit: "kg" },
  // Default (barbell, dumbbell, machine, cable)
};

function getExFieldConfig(ex) {
  // Check explicit override first
  if (EX_FIELD_CONFIG[ex.name]) return EX_FIELD_CONFIG[ex.name];
  // Infer from equipment
  if (ex.equipment === "bodyweight") return { label: "Added kg", placeholder: "BW", unit: "kg", bodyweight: true };
  return { label: "Weight", placeholder: "kg", unit: "kg" };
}

function TrackTab({ sessions, setSessions, workoutLogs, setWorkoutLogs, t }) {
  const [sel, setSel] = useState(null);
  const [sessionExercises, setSessionExercises] = useState([]);
  const [logData, setLogData] = useState({});
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState(false);
  const [showDemo, setShowDemo] = useState(null);

  // Get last logged data for an exercise: weight + reps per set
  const getLastLoggedData = (ex, numSets) => {
    for (let i = workoutLogs.length - 1; i >= 0; i--) {
      const log = workoutLogs[i];
      const found = log.exercises?.find(e => e.name === ex.name);
      if (found && found.sets && found.sets.length > 0) {
        return found.sets.map(s => ({
          weight: (s.weight && s.weight.toString().trim() !== "") ? s.weight.toString() : "",
          reps: (s.reps && s.reps.toString().trim() !== "") ? s.reps.toString() : "",
        }));
      }
    }
    return null;
  };

  const initLog = s => {
    const exs = s.exercises || [];
    const d = {};
    exs.forEach((ex, i) => {
      const numSets = +ex.sets || 3;
      const lastData = getLastLoggedData(ex, numSets);

      if (lastData) {
        // Pre-fill from last logged session (weight + reps per set)
        d[i] = Array.from({ length: numSets }, (_, si) => {
          const prev = lastData[si] || lastData[lastData.length - 1] || {};
          return { weight: prev.weight || "", reps: prev.reps || "", done: false };
        });
      } else {
        // Fall back to program weight, use program reps as placeholder
        const progWeight = (ex.weight && ex.weight.toString().trim() !== "") ? ex.weight.toString() : "";
        d[i] = Array.from({ length: numSets }, () => ({ weight: progWeight, reps: "", done: false }));
      }
    });
    setLogData(d); setSel(s); setSessionExercises(exs); setSaved(false); setNotes("");
  };

  // When user changes a weight in any set, propagate to all sets of that exercise (UX convenience)
  // and write the new value back to the program session for future pre-fill
  const handleWeightChange = (ei, si, val) => {
    setLogData(d => ({
      ...d,
      [ei]: d[ei].map((s, idx) => idx === si ? { ...s, weight: val } : s),
    }));
    // Write back to session program so next time it's pre-filled
    const ex = sessionExercises[ei];
    if (ex && sel) {
      setSessions(prev => prev.map(sess => {
        if (sess.id !== sel.id) return sess;
        const newExs = (sess.exercises || []).map((e, idx) =>
          idx === ei ? { ...e, weight: val } : e
        );
        return { ...sess, exercises: newExs };
      }));
    }
  };

  const saveLog = () => {
    setWorkoutLogs(p => [...p, {
      id: Date.now(), date: new Date().toISOString(),
      sessionId: sel.id, sessionName: sel.name,
      exercises: sessionExercises.map((ex, i) => ({ ...ex, sets: logData[i] })), notes
    }]);
    setSaved(true);
  };

  if (!sel) return (
    <div style={{ padding: 18 }} className="slide-in">
      <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 5 }}>{t.logWorkout}</div>
      <div style={{ color: "#555", fontSize: 13, marginBottom: 18 }}>{t.selectSession}</div>
      {sessions.length === 0
        ? <div style={{ textAlign: "center", padding: 40, color: "#555", fontSize: 14 }}>{t.createFirst}</div>
        : sessions.map(s => (
          <button key={s.id} onClick={() => initLog(s)} className="gym-btn" style={{ display: "flex", width: "100%", background: "#111", border: "1px solid #1a1a24", borderRadius: 13, padding: "16px 14px", marginBottom: 10, alignItems: "center", justifyContent: "space-between", color: "#e8e4dc", minHeight: 64 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, textAlign: "left" }}>{s.name}</div>
              <div style={{ color: "#555", fontSize: 12 }}>{s.exercises?.length} {t.exercises}</div>
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
          <div style={{ color: "#555", fontSize: 12 }}>{new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}</div>
        </div>
      </div>
      {saved ? (
        <div style={{ textAlign: "center", padding: 48 }}>
          <div style={{ fontSize: 52 }}>🔥</div>
          <div style={{ fontSize: 22, fontWeight: 800, marginTop: 12 }}>{t.sessionLogged}</div>
          <div style={{ color: "#555", fontSize: 13, marginTop: 6 }}>{t.weightsSaved}</div>
          <button onClick={() => setSel(null)} className="gym-btn" style={{ marginTop: 20, background: "#e63c2f", border: "none", borderRadius: 12, padding: "12px 28px", color: "#fff", fontWeight: 700, minHeight: 48 }}>{t.done}</button>
        </div>
      ) : (
        <>
          {sessionExercises.map((ex, ei) => {
            const sets = logData[ei] || [];
            const fieldCfg = getExFieldConfig(ex);
            const isBodyweight = !!fieldCfg.bodyweight;
            const isDuration = fieldCfg.unit === "s";

            return (
              <div key={ei} style={{ background: "#111", border: "1px solid #1a1a24", borderRadius: 13, padding: 13, marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{ex.name}</div>
                    {/* Equipment badge */}
                    <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
                      <span style={{ fontSize: 9, background: "#1a1a24", borderRadius: 4, padding: "1px 6px", color: "#555", textTransform: "uppercase", letterSpacing: 1 }}>{ex.equipment}</span>
                      {isBodyweight && <span style={{ fontSize: 9, background: "#4ade801a", border: "1px solid #4ade8033", borderRadius: 4, padding: "1px 6px", color: "#4ade80", fontWeight: 700 }}>{t.bodyweight}</span>}
                      {isDuration && <span style={{ fontSize: 9, background: "#f5a6231a", border: "1px solid #f5a62333", borderRadius: 4, padding: "1px 6px", color: "#f5a623", fontWeight: 700 }}>{t.timed}</span>}
                    </div>
                  </div>
                  <button onClick={() => setShowDemo(ex)} style={{ background: "#1a1a24", border: "1px solid #252535", borderRadius: 7, padding: "4px 9px", color: "#e63c2f", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", gap: 3 }}>
                    <Icon name="info" size={12} /> {t.howTo}
                  </button>
                </div>

                {/* Column headers — dynamic label */}
                <div style={{ display: "grid", gridTemplateColumns: "28px 1fr 1fr 44px", gap: 6, marginBottom: 6, marginTop: 8 }}>
                  {["#", fieldCfg.label, isDuration ? "Rounds" : t.reps || "Reps", "✓"].map(h => (
                    <div key={h} style={{ fontSize: 9, color: "#444", textTransform: "uppercase", letterSpacing: 1 }}>{h}</div>
                  ))}
                </div>

                {sets.map((set, si) => (
                  <div key={si} style={{ display: "grid", gridTemplateColumns: "28px 1fr 1fr 44px", gap: 6, marginBottom: 6, alignItems: "center" }}>
                    <div style={{ color: "#444", fontSize: 13, fontWeight: 600 }}>{si + 1}</div>
                    <input
                      value={set.weight}
                      onChange={e => handleWeightChange(ei, si, e.target.value)}
                      placeholder={fieldCfg.placeholder}
                      inputMode="decimal"
                      style={{
                        background: "#0a0a0f",
                        border: `1px solid ${set.weight ? "#3a3a4a" : "#2a2a3a"}`,
                        borderRadius: 8, padding: "10px 10px",
                        color: "#e8e4dc", fontSize: 16, width: "100%", minHeight: 44,
                      }}
                    />
                    <input
                      value={set.reps}
                      onChange={e => setLogData(d => ({ ...d, [ei]: d[ei].map((s, i) => i === si ? { ...s, reps: e.target.value } : s) }))}
                      placeholder={ex.reps || (isDuration ? "rounds" : "reps")}
                      inputMode="numeric"
                      style={{ background: "#0a0a0f", border: "1px solid #2a2a3a", borderRadius: 8, padding: "10px 10px", color: "#e8e4dc", fontSize: 16, width: "100%", minHeight: 44 }}
                    />
                    <button
                      onClick={() => setLogData(d => ({ ...d, [ei]: d[ei].map((s, i) => i === si ? { ...s, done: !s.done } : s) }))}
                      className="gym-btn"
                      style={{ background: set.done ? "#e63c2f" : "#1a1a24", border: `2px solid ${set.done ? "#e63c2f" : "#252535"}`, borderRadius: 8, padding: 8, color: set.done ? "#fff" : "#444", display: "flex", alignItems: "center", justifyContent: "center", minWidth: 44, minHeight: 44, transition: "all 0.15s" }}
                    >
                      <Icon name="check" size={18} />
                    </button>
                  </div>
                ))}

                {/* Apply first set's value to all sets if they differ */}
                {sets.length > 1 && sets[0].weight && !sets.every(s => s.weight === sets[0].weight) && (
                  <button
                    onClick={() => {
                      const v = sets[0].weight;
                      setLogData(d => ({ ...d, [ei]: d[ei].map(s => ({ ...s, weight: v })) }));
                      handleWeightChange(ei, 0, v);
                    }}
                    className="gym-btn"
                    style={{ marginTop: 6, width: "100%", background: "#e63c2f18", border: "1px solid #e63c2f44", borderRadius: 8, padding: "10px 10px", color: "#e63c2f", fontSize: 12, fontWeight: 700, minHeight: 40 }}
                  >
                    {t.applyToAll} ({sets[0].weight}{fieldCfg.unit === "kg" ? "kg" : fieldCfg.unit})
                  </button>
                )}
              </div>
            );
          })}
          <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder={t.sessionNotes} style={{ width: "100%", background: "#111", border: "1px solid #1a1a24", borderRadius: 10, padding: "12px 14px", color: "#e8e4dc", fontSize: 14, resize: "none", height: 72, marginBottom: 14 }} />
          <button onClick={saveLog} className="gym-btn" style={{ width: "100%", background: "#e63c2f", border: "none", borderRadius: 12, padding: "14px", fontWeight: 800, fontSize: 16, color: "#fff", minHeight: 52 }}>💪 {t.completeSession}</button>
        </>
      )}
      {showDemo && <ExerciseDemo exercise={showDemo} onClose={() => setShowDemo(null)} t={t} />}
    </div>
  );
}

function StatsTab({ workoutLogs, setWorkoutLogs, sessions, setSessions, t }) {
  const [selEx, setSelEx] = useState(null);
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [pendingChanges, setPendingChanges] = useState([]);
  const [showChanges, setShowChanges] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

  const total = workoutLogs.length;
  const week = workoutLogs.filter(l => new Date(l.date) > new Date(Date.now() - 7 * 864e5)).length;
  const month = workoutLogs.filter(l => new Date(l.date) > new Date(Date.now() - 30 * 864e5)).length;

  const exProgress = {};
  workoutLogs.forEach(log => {
    log.exercises?.forEach(ex => {
      if (!exProgress[ex.name]) exProgress[ex.name] = [];
      const maxW = Math.max(...(ex.sets || []).map(s => +s.weight || 0));
      if (maxW > 0) exProgress[ex.name].push({ date: log.date, weight: maxW });
    });
  });
  const exNames = Object.keys(exProgress).filter(k => exProgress[k].length > 1);
  const deleteLog = id => { setWorkoutLogs(p => p.filter(l => l.id !== id)); if (selectedLog?.id === id) setSelectedLog(null); };

  const hasEnoughData = workoutLogs.length >= 3 && exNames.length >= 2;

  // ─── Log Detail View ───────────────────────────────────────────────
  if (selectedLog) {
    const log = selectedLog;
    const totalSets = log.exercises?.reduce((s, ex) => s + (ex.sets?.filter(st => st.done)?.length || 0), 0) || 0;
    const totalVolume = log.exercises?.reduce((s, ex) => s + (ex.sets || []).reduce((ss, st) => ss + ((+st.weight || 0) * (+st.reps || 0)), 0), 0) || 0;

    return (
      <div style={{ padding: 18 }} className="slide-in">
        <button onClick={() => setSelectedLog(null)} className="gym-btn" style={{ background: "#1a1a24", border: "none", borderRadius: 10, padding: "10px 16px", color: "#e8e4dc", fontWeight: 700, fontSize: 13, marginBottom: 16, display: "flex", alignItems: "center", gap: 6, minHeight: 44 }}>
          ← {t.backToStats}
        </button>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 22, fontWeight: 800 }}>{log.sessionName}</div>
          <div style={{ color: "#e63c2f", fontSize: 12, fontWeight: 600, marginTop: 4 }}>
            {new Date(log.date).toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}
          </div>
        </div>

        {/* Summary cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 20 }}>
          <div style={{ background: "#111", border: "1px solid #1a1a24", borderRadius: 12, padding: "14px 8px", textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#e63c2f" }}>{log.exercises?.length || 0}</div>
            <div style={{ fontSize: 9, color: "#555", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>{t.exercises}</div>
          </div>
          <div style={{ background: "#111", border: "1px solid #1a1a24", borderRadius: 12, padding: "14px 8px", textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#e63c2f" }}>{totalSets}</div>
            <div style={{ fontSize: 9, color: "#555", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>{t.setsCompleted}</div>
          </div>
          <div style={{ background: "#111", border: "1px solid #1a1a24", borderRadius: 12, padding: "14px 8px", textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#e63c2f" }}>{totalVolume > 0 ? `${(totalVolume/1000).toFixed(1)}t` : "—"}</div>
            <div style={{ fontSize: 9, color: "#555", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>{t.volume}</div>
          </div>
        </div>

        {/* Exercise breakdown */}
        {log.exercises?.map((ex, ei) => {
          const fieldCfg = getExFieldConfig(ex);
          const completedSets = (ex.sets || []).filter(s => s.done);
          return (
            <div key={ei} style={{ background: "#111", border: "1px solid #1a1a24", borderRadius: 14, padding: 16, marginBottom: 12, overflow: "hidden" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{ex.name}</div>
                  <div style={{ display: "flex", gap: 5, marginTop: 3 }}>
                    <span style={{ fontSize: 10, background: "#1a1a24", borderRadius: 4, padding: "2px 7px", color: "#555", textTransform: "uppercase", letterSpacing: 1 }}>{ex.equipment}</span>
                    {ex.muscles?.map(m => (
                      <span key={m} style={{ fontSize: 10, background: "#e63c2f1a", borderRadius: 4, padding: "2px 7px", color: "#e63c2f", fontWeight: 600, textTransform: "capitalize" }}>{m}</span>
                    ))}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 11, color: "#4ade80", fontWeight: 700 }}>{completedSets.length}/{(ex.sets || []).length}</div>
                  <div style={{ fontSize: 9, color: "#555" }}>{t.sets}</div>
                </div>
              </div>

              {/* Sets table */}
              <div style={{ background: "#0a0a0f", borderRadius: 10, overflow: "hidden" }}>
                <div style={{ display: "grid", gridTemplateColumns: "36px 1fr 1fr 40px", gap: 0, padding: "8px 10px", borderBottom: "1px solid #1a1a24" }}>
                  {["#", fieldCfg.label, t.reps, "✓"].map(h => (
                    <div key={h} style={{ fontSize: 9, color: "#555", textTransform: "uppercase", letterSpacing: 1, fontWeight: 700 }}>{h}</div>
                  ))}
                </div>
                {(ex.sets || []).map((set, si) => (
                  <div key={si} style={{ display: "grid", gridTemplateColumns: "36px 1fr 1fr 40px", gap: 0, padding: "10px 10px", borderBottom: si < (ex.sets || []).length - 1 ? "1px solid #111" : "none", background: set.done ? "#e63c2f08" : "transparent" }}>
                    <div style={{ color: "#555", fontSize: 13, fontWeight: 600 }}>{si + 1}</div>
                    <div style={{ color: "#e8e4dc", fontSize: 14, fontWeight: 600 }}>{set.weight || "—"}{set.weight ? (fieldCfg.unit || "") : ""}</div>
                    <div style={{ color: "#e8e4dc", fontSize: 14, fontWeight: 600 }}>{set.reps || "—"}</div>
                    <div style={{ color: set.done ? "#4ade80" : "#333", fontSize: 14, fontWeight: 700 }}>{set.done ? "✓" : "—"}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Notes */}
        {log.notes && (
          <div style={{ background: "#111", border: "1px solid #1a1a24", borderRadius: 14, padding: 16, marginBottom: 12 }}>
            <div style={{ fontSize: 10, letterSpacing: 2, color: "#e63c2f", fontWeight: 700, textTransform: "uppercase", marginBottom: 8 }}>{t.notesLabel}</div>
            <div style={{ fontSize: 14, color: "#bbb", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{log.notes}</div>
          </div>
        )}

        <button onClick={() => deleteLog(log.id)} className="gym-btn" style={{ width: "100%", background: "#1a1a24", border: "1px solid #e63c2f33", borderRadius: 12, padding: "13px", fontWeight: 700, fontSize: 13, color: "#e63c2f", marginTop: 6, minHeight: 48 }}>
          <Icon name="trash" size={14} /> <span style={{ marginLeft: 6 }}>{t.deleteLog}</span>
        </button>
      </div>
    );
  }

  const generateSuggestions = async () => {
    setLoadingSuggestions(true);
    try {
      // Build progress summary per exercise
      const progressSummary = exNames.map(name => {
        const data = exProgress[name].sort((a, b) => new Date(a.date) - new Date(b.date));
        const trend = data[data.length - 1].weight - data[0].weight;
        const sessions_count = data.length;
        return { name, startWeight: data[0].weight, currentWeight: data[data.length - 1].weight, trend, sessions: sessions_count };
      });

      const sessionsSummary = sessions.map(s => ({
        id: s.id, name: s.name,
        exercises: s.exercises?.map((e, i) => ({ idx: i, name: e.name, sets: e.sets, reps: e.reps, weight: e.weight }))
      }));

      const prompt = `You are an expert personal trainer. Based on this progress data, suggest specific changes to the training program.

WORKOUT HISTORY (${workoutLogs.length} sessions over time):
${JSON.stringify(progressSummary, null, 2)}

CURRENT PROGRAM:
${JSON.stringify(sessionsSummary, null, 2)}

Generate specific, actionable upgrade suggestions as a JSON array. Each suggestion must be one of:
- Weight increase: if an exercise has been progressing well (3+ sessions, consistent gains)
- Volume increase: add sets or adjust reps if plateau detected
- Note: only suggest changes where there's clear data to support it

Return ONLY a JSON array like:
[
  {
    "sessionId": <number>,
    "exIdx": <number>,
    "field": "weight" | "sets" | "reps",
    "newVal": "<new value as string>",
    "reason": "<1 sentence why, referencing actual numbers>",
    "priority": "high" | "medium"
  }
]

Be conservative — only suggest weight increases of 2.5-5kg, only when there are 3+ sessions showing consistent performance at current weight. Return empty array [] if no clear upgrades are warranted yet.`;

      const response = await callAI([{ role: "user", content: prompt }], "Return ONLY valid JSON. No markdown, no explanation.", 1200);
      let parsed = [];
      try { parsed = JSON.parse(response.replace(/```json|```/g, "").trim()); } catch {}

      if (Array.isArray(parsed) && parsed.length > 0) {
        // Enrich with current values for display
        const enriched = parsed.map((s, i) => {
          const session = sessions.find(x => x.id === s.sessionId);
          const ex = session?.exercises?.[s.exIdx];
          return { ...s, id: i, sessionName: session?.name || "Unknown", exName: ex?.name || "Unknown", oldVal: ex?.[s.field] || "—", accepted: null };
        }).filter(s => s.exName !== "Unknown");
        setPendingChanges(enriched);
        setShowChanges(true);
      } else {
        setAiSuggestions("no_changes");
      }
    } catch (e) {
      setAiSuggestions("error");
    }
    setLoadingSuggestions(false);
  };

  const applyAccepted = () => {
    const accepted = pendingChanges.filter(c => c.accepted === true);
    if (accepted.length === 0) { setShowChanges(false); setPendingChanges([]); return; }

    setSessions(prev => prev.map(session => {
      const changes = accepted.filter(c => c.sessionId === session.id);
      if (changes.length === 0) return session;
      const newExercises = [...(session.exercises || [])];
      changes.forEach(c => {
        if (newExercises[c.exIdx]) {
          newExercises[c.exIdx] = { ...newExercises[c.exIdx], [c.field]: c.newVal };
        }
      });
      return { ...session, exercises: newExercises };
    }));

    setShowChanges(false);
    setPendingChanges([]);
    setAiSuggestions("applied");
  };

  const fieldLabel = f => f === "weight" ? t.kg : f === "sets" ? t.sets : t.reps;
  const fieldUnit = f => f === "weight" ? "kg" : "";

  return (
    <div style={{ padding: 18 }} className="slide-in">
      <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 18 }}>{t.progressStats}</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 9, marginBottom: 22 }}>
        {[[t.total, total], [t.thisWeek, week], [t.thisMonth, month]].map(([label, val]) => (
          <div key={label} style={{ background: "#111", border: "1px solid #1a1a24", borderRadius: 13, padding: "14px 8px", textAlign: "center" }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: "#e63c2f" }}>{val}</div>
            <div style={{ fontSize: 9, color: "#555", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>{label}</div>
          </div>
        ))}
      </div>

      {/* AI Suggestions Panel */}
      {hasEnoughData && (
        <div style={{ background: "#0c1520", border: "2px solid #e63c2f33", borderRadius: 14, padding: 16, marginBottom: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#e8e4dc" }}>🤖 {t.aiOptimizer}</div>
              <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>{t.analyzeDesc}</div>
            </div>
            {aiSuggestions === "applied" && <div style={{ fontSize: 11, color: "#4ade80", fontWeight: 700 }}>✓ {t.applied}</div>}
          </div>
          {aiSuggestions === "no_changes" && (
            <div style={{ fontSize: 12, color: "#666", marginBottom: 10 }}>{t.keepTraining}</div>
          )}
          {aiSuggestions === "applied" && (
            <div style={{ fontSize: 12, color: "#4ade80", marginBottom: 10 }}>{t.changesApplied}</div>
          )}
          <button
            onClick={generateSuggestions}
            disabled={loadingSuggestions}
            className="gym-btn"
            style={{ width: "100%", background: loadingSuggestions ? "#111" : "#e63c2f", border: "none", borderRadius: 10, padding: "12px", fontWeight: 800, fontSize: 13, color: "#fff", opacity: loadingSuggestions ? 0.6 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, minHeight: 48 }}
          >
            {loadingSuggestions ? <><span className="pulse">⚡ {t.analyzing}</span></> : `⚡ ${t.analyzeSuggest}`}
          </button>
        </div>
      )}

      {workoutLogs.length === 0 ? <div style={{ textAlign: "center", padding: 40, color: "#555" }}>{t.logToSee}</div> : (
        <>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, color: "#e63c2f", textTransform: "uppercase", marginBottom: 10 }}>{t.weightProgress}</div>
          {exNames.length === 0 ? <div style={{ color: "#555", fontSize: 13, marginBottom: 20 }}>{t.need2Sessions}</div> : (
            <>
              <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 14 }}>
                {exNames.map(name => (
                  <button key={name} onClick={() => setSelEx(name === selEx ? null : name)} className="gym-btn" style={{ background: selEx === name ? "#e63c2f" : "#1a1a24", border: `1px solid ${selEx === name ? "#e63c2f" : "#2a2a3a"}`, borderRadius: 8, padding: "8px 14px", color: selEx === name ? "#fff" : "#888", fontSize: 12, fontWeight: 600, minHeight: 40 }}>
                    {name}
                  </button>
                ))}
              </div>
              {selEx && exProgress[selEx] && <MiniChart data={exProgress[selEx]} name={selEx} t={t} />}
            </>
          )}
          <div style={{ marginTop: 22, fontSize: 12, fontWeight: 700, letterSpacing: 2, color: "#e63c2f", textTransform: "uppercase", marginBottom: 12 }}>{t.recentSessions}</div>
          {[...workoutLogs].reverse().map(log => {
            const completedSets = log.exercises?.reduce((s, ex) => s + (ex.sets?.filter(st => st.done)?.length || 0), 0) || 0;
            const totalSets = log.exercises?.reduce((s, ex) => s + (ex.sets?.length || 0), 0) || 0;
            return (
              <button key={log.id} onClick={() => setSelectedLog(log)} className="gym-btn" style={{ width: "100%", background: "#111", border: "1px solid #1a1a24", borderRadius: 13, padding: "14px 16px", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center", color: "#e8e4dc", minHeight: 64, textAlign: "left" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{log.sessionName}</div>
                  <div style={{ color: "#555", fontSize: 12, marginTop: 3 }}>
                    {new Date(log.date).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })} · {log.exercises?.length || 0} {t.exercises} · {completedSets}/{totalSets} {t.sets}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <button onClick={(e) => { e.stopPropagation(); deleteLog(log.id); }} style={{ background: "none", border: "none", color: "#333", padding: 6 }}><Icon name="trash" size={14} /></button>
                  <span style={{ color: "#444" }}><Icon name="arrow" size={16} /></span>
                </div>
              </button>
            );
          })}
        </>
      )}

      {/* Changes Review Modal */}
      {showChanges && pendingChanges.length > 0 && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.95)", zIndex: 200, display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "18px 18px 10px", borderBottom: "1px solid #1a1a24", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: 18 }}>⚡ {t.suggestedUpgrades}</div>
              <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>{t.acceptReject}</div>
            </div>
            <button onClick={() => setShowChanges(false)} style={{ background: "none", border: "none", color: "#666" }}><Icon name="close" /></button>
          </div>
          <div style={{ flex: 1, overflow: "auto", padding: 18 }}>
            {pendingChanges.map((c, i) => (
              <div key={c.id} style={{ background: "#111", border: `2px solid ${c.accepted === true ? "#4ade80" : c.accepted === false ? "#333" : "#2a2a3a"}`, borderRadius: 13, padding: 14, marginBottom: 12, opacity: c.accepted === false ? 0.45 : 1, transition: "all 0.2s" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 10, color: "#e63c2f", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 3 }}>
                      {c.sessionName} · {c.priority === "high" ? `🔴 ${t.highPriority}` : `🟡 ${t.recommended}`}
                    </div>
                    <div style={{ fontWeight: 800, fontSize: 15 }}>{c.exName}</div>
                  </div>
                </div>
                {/* Change preview */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, background: "#0a0a0f", borderRadius: 8, padding: "8px 12px" }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 9, color: "#555", textTransform: "uppercase", letterSpacing: 1 }}>{t.currentWeight} {fieldLabel(c.field)}</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: "#666" }}>{c.oldVal}{fieldUnit(c.field)}</div>
                  </div>
                  <div style={{ fontSize: 18, color: "#e63c2f" }}>→</div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 9, color: "#4ade80", textTransform: "uppercase", letterSpacing: 1 }}>{t.newWeight} {fieldLabel(c.field)}</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: "#4ade80" }}>{c.newVal}{fieldUnit(c.field)}</div>
                  </div>
                </div>
                <div style={{ fontSize: 12, color: "#888", marginBottom: 12, lineHeight: 1.6 }}>💡 {c.reason}</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <button
                    onClick={() => setPendingChanges(p => p.map((x, j) => j === i ? { ...x, accepted: false } : x))}
                    className="gym-btn"
                    style={{ background: c.accepted === false ? "#2a1a1a" : "#111", border: `1px solid ${c.accepted === false ? "#e63c2f44" : "#252535"}`, borderRadius: 8, padding: "10px", color: c.accepted === false ? "#e63c2f" : "#555", fontWeight: 700, fontSize: 13, minHeight: 44 }}
                  >✕ {t.reject}</button>
                  <button
                    onClick={() => setPendingChanges(p => p.map((x, j) => j === i ? { ...x, accepted: true } : x))}
                    className="gym-btn"
                    style={{ background: c.accepted === true ? "#4ade8022" : "#111", border: `1px solid ${c.accepted === true ? "#4ade8066" : "#252535"}`, borderRadius: 8, padding: "10px", color: c.accepted === true ? "#4ade80" : "#888", fontWeight: 700, fontSize: 13, minHeight: 44 }}
                  >✓ {t.accept}</button>
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding: "12px 18px 20px", borderTop: "1px solid #1a1a24" }}>
            <div style={{ fontSize: 11, color: "#555", textAlign: "center", marginBottom: 10 }}>
              {pendingChanges.filter(c => c.accepted === true).length} {t.accepted} · {pendingChanges.filter(c => c.accepted === false).length} {t.rejected} · {pendingChanges.filter(c => c.accepted === null).length} {t.undecided}
            </div>
            <button onClick={applyAccepted} className="gym-btn" style={{ width: "100%", background: "#e63c2f", border: "none", borderRadius: 12, padding: "14px", fontWeight: 800, fontSize: 15, color: "#fff", minHeight: 52 }}>
              {t.applyChanges} ({pendingChanges.filter(c => c.accepted === true).length})
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function MiniChart({ data, name, t }) {
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

function SwipeableFoodCard({ item, onDelete }) {
  const [offset, setOffset] = useState(0);
  const [swiping, setSwiping] = useState(false);
  const startX = useRef(null);

  const onTouchStart = e => { startX.current = e.touches[0].clientX; setSwiping(true); };
  const onTouchMove = e => {
    if (startX.current === null) return;
    const dx = e.touches[0].clientX - startX.current;
    if (dx < 0) setOffset(Math.max(dx, -100));
  };
  const onTouchEnd = () => {
    if (offset < -70) onDelete();
    else setOffset(0);
    setSwiping(false); startX.current = null;
  };

  return (
    <div style={{ position: "relative", marginBottom: 7, borderRadius: 9, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "#e63c2f", display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 16, borderRadius: 9 }}>
        <Icon name="trash" size={16} />
      </div>
      <div
        onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
        style={{ background: "#111", border: "1px solid #1a1a24", borderRadius: 9, padding: "9px 13px", display: "flex", justifyContent: "space-between", alignItems: "center", transform: `translateX(${offset}px)`, transition: swiping ? "none" : "transform 0.25s ease", userSelect: "none" }}
      >
        <div>
          <div style={{ fontWeight: 600, fontSize: 14 }}>{item.name}</div>
          {item.calories > 0 && <div style={{ fontSize: 11, color: "#555", marginTop: 1 }}>{item.calories} kcal</div>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ color: "#e63c2f", fontWeight: 700, fontSize: 14 }}>{item.protein}g</div>
          <button onClick={onDelete} style={{ background: "none", border: "none", color: "#333", padding: 2 }}><Icon name="trash" size={13} /></button>
        </div>
      </div>
    </div>
  );
}

function NutritionTab({ nutritionLogs, setNutritionLogs, profile, workoutLogs, t }) {
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
  const deleteFood = id => setNutritionLogs(p => p.filter(l => l.id !== id));

  return (
    <div style={{ padding: 18 }} className="slide-in">
      <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 5 }}>{t.nutritionTitle}</div>
      <div style={{ color: "#555", fontSize: 12, marginBottom: 16 }}>{today}</div>
      <div style={{ background: "#111", border: "1px solid #1a1a24", borderRadius: 18, padding: 20, marginBottom: 14, textAlign: "center" }}>
        <svg width="130" height="130" viewBox="0 0 130 130">
          <circle cx="65" cy="65" r="52" fill="none" stroke="#1a1a24" strokeWidth="11"/>
          <circle cx="65" cy="65" r="52" fill="none" stroke="#e63c2f" strokeWidth="11" strokeDasharray={`${2*Math.PI*52}`} strokeDashoffset={`${2*Math.PI*52*(1-pct/100)}`} strokeLinecap="round" transform="rotate(-90 65 65)" style={{ transition: "stroke-dashoffset 0.5s ease" }}/>
          <text x="65" y="60" textAnchor="middle" fill="#e8e4dc" fontSize="26" fontWeight="800" fontFamily="Syne">{totalProtein}</text>
          <text x="65" y="78" textAnchor="middle" fill="#555" fontSize="12" fontFamily="Syne">/ {target}g protein</text>
        </svg>
        <div style={{ display: "flex", justifyContent: "center", gap: 22, marginTop: 4 }}>
          <div><div style={{ color: "#e63c2f", fontWeight: 800, fontSize: 18 }}>{Math.max(0, target - totalProtein)}g</div><div style={{ color: "#555", fontSize: 11 }}>{t.remaining}</div></div>
          <div><div style={{ color: "#f5a623", fontWeight: 800, fontSize: 18 }}>{totalCals}</div><div style={{ color: "#555", fontSize: 11 }}>{t.calories}</div></div>
        </div>
        {todayWorkout && <div style={{ marginTop: 10, background: "#e63c2f1a", border: "1px solid #e63c2f33", borderRadius: 7, padding: "7px 11px", fontSize: 12, color: "#e63c2f", fontWeight: 600 }}>🏋️ {t.workoutDay}</div>}
      </div>
      <button onClick={() => setShowAdd(true)} className="gym-btn" style={{ width: "100%", background: "#e63c2f1a", border: "1px solid #e63c2f33", borderRadius: 11, padding: "12px", color: "#e63c2f", fontWeight: 700, marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, minHeight: 48 }}>
        <Icon name="plus" size={15} /> {t.logFood}
      </button>
      {todayLogs.length === 0
        ? <div style={{ color: "#555", fontSize: 13 }}>{t.nothingLogged}</div>
        : <>
          <div style={{ fontSize: 11, color: "#444", marginBottom: 8 }}>{t.swipeToRemove}</div>
          {todayLogs.map(l => (
            <SwipeableFoodCard key={l.id} item={l} onDelete={() => deleteFood(l.id)} />
          ))}
        </>
      }
      {showAdd && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 200, display: "flex", alignItems: "flex-end" }}>
          <div style={{ background: "#0f0f1a", borderRadius: "18px 18px 0 0", padding: 20, width: "100%", maxHeight: "85vh", overflow: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <div style={{ fontWeight: 800, fontSize: 18 }}>{t.addFood}</div>
              <button onClick={() => setShowAdd(false)} style={{ background: "none", border: "none", color: "#666" }}><Icon name="close" /></button>
            </div>
            <div style={{ fontSize: 10, letterSpacing: 2, color: "#555", textTransform: "uppercase", marginBottom: 9 }}>{t.quickAdd}</div>
            {COMMON_FOODS.map(f => (
              <button key={f.name} onClick={() => addFood(f)} style={{ display: "flex", width: "100%", justifyContent: "space-between", background: "#111", border: "1px solid #1a1a24", borderRadius: 9, padding: "9px 13px", marginBottom: 5, color: "#e8e4dc", alignItems: "center" }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{f.name}</div>
                <div style={{ color: "#e63c2f", fontWeight: 700 }}>{f.protein}g</div>
              </button>
            ))}
            <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid #1a1a24" }}>
              <div style={{ fontSize: 10, letterSpacing: 2, color: "#555", textTransform: "uppercase", marginBottom: 10 }}>{t.custom}</div>
              {["name", "protein", "calories"].map(f => (
                <input key={f} value={custom[f]} onChange={e => setCustom(c => ({ ...c, [f]: e.target.value }))} placeholder={f === "name" ? t.foodName : f === "protein" ? t.proteinG : t.caloriesLabel} type={f === "name" ? "text" : "number"}
                  style={{ display: "block", width: "100%", background: "#111", border: "1px solid #2a2a3a", borderRadius: 7, padding: "9px 11px", color: "#e8e4dc", fontSize: 13, marginBottom: 7 }} />
              ))}
              <button onClick={() => custom.name && custom.protein && addFood({ name: custom.name, protein: +custom.protein, calories: +custom.calories || 0 })} style={{ width: "100%", background: "#e63c2f", border: "none", borderRadius: 9, padding: 11, color: "#fff", fontWeight: 700 }}>{t.addFood}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PhotosTab({ photos, setPhotos, t }) {
  const [analysis, setAnalysis] = useState(""); const [analyzing, setAnalyzing] = useState(false); const [selPhoto, setSelPhoto] = useState(null);
  const fileRef = useRef();
  const handleUpload = e => { const file = e.target.files[0]; if (!file) return; const r = new FileReader(); r.onload = ev => setPhotos(p => [...p, { id: Date.now(), date: new Date().toISOString(), dataUrl: ev.target.result }]); r.readAsDataURL(file); };
  const analyzePhoto = async photo => {
    setAnalyzing(true); setAnalysis(""); setSelPhoto(photo);
    try {
      const base64 = photo.dataUrl.split(",")[1], mediaType = photo.dataUrl.split(";")[0].split(":")[1];
      const result = await callAIVision(base64, mediaType, "Analyze this gym progress photo. Comment on visible muscle development, posture, strong areas, areas needing work, and give specific workout recommendations. Be encouraging but honest.");
      setAnalysis(result);
    } catch (e) { setAnalysis("Error: " + (e.message || "Analysis failed.")); }
    setAnalyzing(false);
  };
  return (
    <div style={{ padding: 18 }} className="slide-in">
      <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 5 }}>{t.progressPhotos}</div>
      <div style={{ color: "#555", fontSize: 12, marginBottom: 16 }}>{t.trackVisual}</div>
      <button onClick={() => fileRef.current.click()} className="gym-btn" style={{ width: "100%", background: "#111", border: "2px dashed #252535", borderRadius: 13, padding: 22, color: "#555", fontWeight: 700, marginBottom: 18, display: "flex", flexDirection: "column", alignItems: "center", gap: 7, minHeight: 90 }}>
        <Icon name="camera" size={30} /><span>{t.uploadPhoto}</span><span style={{ fontSize: 11, fontWeight: 400 }}>{t.tapToChoose}</span>
      </button>
      <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} style={{ display: "none" }} />
      {photos.length === 0 ? <div style={{ textAlign: "center", color: "#555", fontSize: 13 }}>{t.noPhotos}</div> : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[...photos].reverse().map(photo => (
            <div key={photo.id} style={{ borderRadius: 11, overflow: "hidden", position: "relative", aspectRatio: "3/4", cursor: "pointer" }} onClick={() => analyzePhoto(photo)}>
              <img src={photo.dataUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 55%)", display: "flex", alignItems: "flex-end", padding: 9 }}>
                <div><div style={{ fontSize: 10, color: "#bbb" }}>{new Date(photo.date).toLocaleDateString()}</div><div style={{ fontSize: 11, color: "#e63c2f", fontWeight: 700 }}>{t.tapAnalyze}</div></div>
              </div>
              <button onClick={e => { e.stopPropagation(); setPhotos(p => p.filter(x => x.id !== photo.id)); }} style={{ position: "absolute", top: 7, right: 7, background: "rgba(0,0,0,0.6)", border: "none", borderRadius: 5, padding: 4, color: "#fff" }}><Icon name="trash" size={13} /></button>
            </div>
          ))}
        </div>
      )}
      {(analyzing || analysis) && selPhoto && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.95)", zIndex: 200, overflow: "auto", padding: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
            <div style={{ fontWeight: 800, fontSize: 17 }}>{t.aiAnalysis}</div>
            <button onClick={() => { setAnalysis(""); setSelPhoto(null); }} style={{ background: "none", border: "none", color: "#666" }}><Icon name="close" /></button>
          </div>
          <img src={selPhoto.dataUrl} alt="" style={{ width: "100%", borderRadius: 11, marginBottom: 14, maxHeight: 260, objectFit: "cover" }} />
          {analyzing ? <div className="pulse" style={{ color: "#e63c2f", fontWeight: 700 }}>🔍 {t.analyzingPhoto}</div>
            : <div style={{ whiteSpace: "pre-wrap", fontSize: 14, lineHeight: 1.8, color: "#ccc", background: "#111", borderRadius: 12, padding: 14 }}>{analysis}</div>}
        </div>
      )}
    </div>
  );
}

function AICoachTab({ profile, sessions, workoutLogs, nutritionLogs, photos, setSessions, t }) {
  const [messages, setMessages] = useState([{ role: "assistant", content: t.coachIntro, hasPlan: false }]);
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
          callAI([{ role: "user", content: `${text}\n\nContext: ${ctx()}\n\nGenerate a training program as JSON array. ONLY JSON, no text. Each session: {"id":number,"name":"string","exercises":[{"name":"string","muscles":["string"],"equipment":"string","sets":number,"reps":"string","weight":"string","wgerId":number}]}.` }], "Return ONLY a valid JSON array of training sessions. No markdown, no explanation.", 1800),
          callAI([...messages.map(m => ({ role: m.role, content: m.content })), userMsg, { role: "user", content: "In 2-3 sentences, explain the training plan you created — the structure, why you chose it for this user's goals, and what to expect." }], `You are a personal AI fitness coach. Context: ${ctx()}`, 1000)
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
        const reply = await callAI([...messages.map(m => ({ role: m.role, content: m.content })), userMsg].slice(1), `You are a personal AI fitness coach. Context: ${ctx()}\nBe specific, encouraging, and reference their actual data when helpful.`, 1000);
        setMessages(p => [...p, { role: "assistant", content: reply }]);
      }
    } catch (e) { setMessages(p => [...p, { role: "assistant", content: `${t.connectionError}\n\n${e.message || ""}` }]); }
    setLoading(false);
  };

  const acceptPlan = () => {
    setSessions(pendingPlan);
    setPendingPlan(null);
    setMessages(p => [...p, { role: "assistant", content: `✅ ${t.planLive} 💪` }]);
  };

  const quickPrompts = [t.prompt1, t.prompt2, t.prompt3, t.prompt4];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0 }} className="slide-in">
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
                <PlanPreview plan={pendingPlan} setPlan={setPendingPlan} onAccept={acceptPlan} onDiscard={() => setPendingPlan(null)} t={t} />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex" }}>
            <div style={{ background: "#111", border: "1px solid #1a1a24", borderRadius: "16px 16px 16px 4px", padding: "9px 13px" }}>
              <div className="pulse" style={{ color: "#e63c2f", fontSize: 14 }}>{t.thinking}</div>
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
          placeholder={t.askCoach} style={{ flex: 1, background: "#111", border: "1px solid #2a2a3a", borderRadius: 11, padding: "10px 14px", color: "#e8e4dc", fontSize: 15, outline: "none", minHeight: 44 }} />
        <button onClick={() => send()} disabled={loading || !input.trim()} className="gym-btn" style={{ background: "#e63c2f", border: "none", borderRadius: 11, padding: "10px 16px", color: "#fff", opacity: loading || !input.trim() ? 0.4 : 1, minWidth: 48, minHeight: 44 }}>
          <Icon name="send" size={15} />
        </button>
      </div>
    </div>
  );
}

function PlanPreview({ plan, setPlan, onAccept, onDiscard, t: tt }) {
  const t = tt || T.en;
  const [expanded, setExpanded] = useState(0);
  const [showDemo, setShowDemo] = useState(null);
  const updateEx = (si, ei, f, v) => setPlan(p => p.map((s, i) => i !== si ? s : { ...s, exercises: s.exercises.map((e, j) => j !== ei ? e : { ...e, [f]: v }) }));
  const removeEx = (si, ei) => setPlan(p => p.map((s, i) => i !== si ? s : { ...s, exercises: s.exercises.filter((_, j) => j !== ei) }));

  return (
    <div style={{ background: "#0c1520", border: "2px solid #e63c2f33", borderRadius: 14, overflow: "hidden" }}>
      <div style={{ background: "#e63c2f12", padding: "11px 14px", borderBottom: "1px solid #e63c2f22" }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: "#e63c2f", letterSpacing: 1, textTransform: "uppercase" }}>📋 {t.suggestedPlan} — {plan.length} {t.sessions}</div>
        <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>{t.reviewEdit}</div>
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
                  <div style={{ color: "#e63c2f", fontSize: 10, fontWeight: 600, letterSpacing: 1 }}>{session.exercises?.length} {t.exercises?.toUpperCase()}</div>
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
                        <button onClick={() => removeEx(si, ei)} style={{ background: "none", border: "none", color: "#333" }}><Icon name="trash" size={12} /></button>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 5 }}>
                        {["sets", "reps", "weight"].map(f => (
                          <div key={f}>
                            <div style={{ fontSize: 9, color: "#444", marginBottom: 2, textTransform: "uppercase", letterSpacing: 1 }}>{f === "weight" ? t.kg : f === "sets" ? t.sets : t.reps}</div>
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
          <button onClick={onDiscard} style={{ background: "none", border: "1px solid #252535", borderRadius: 9, padding: 11, color: "#555", fontWeight: 700 }}>{t.discard}</button>
          <button onClick={onAccept} style={{ background: "#e63c2f", border: "none", borderRadius: 9, padding: 11, color: "#fff", fontWeight: 800 }}>✓ {t.acceptPlan}</button>
        </div>
      </div>
      {showDemo && <ExerciseDemo exercise={showDemo} onClose={() => setShowDemo(null)} t={t} />}
    </div>
  );
}
