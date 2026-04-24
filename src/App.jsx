import { useState, useEffect, useRef } from "react";

const STORAGE_KEYS = {
  profile: "gym_profile",
  sessions: "gym_sessions",
  workoutLogs: "gym_workout_logs",
  nutritionLogs: "gym_nutrition_logs",
  photos: "gym_photos",
  customExercises: "gym_custom_exercises",
  bodyWeightLogs: "gym_bodyweight",
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
    compareProgress: "Analyze Progress", comparingProgress: "Comparing photos…", progressComparison: "Progress Comparison", pickBothPhotos: "Pick both photos to compare",
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
    startWorkout: "Start Workout", workoutTimer: "Workout Timer", restTimer: "Rest Timer",
    restComplete: "Rest complete! Next set 💪", startRest: "Start Rest",
    skipRest: "Skip Rest", gymTime: "Gym Time", sessionSummary: "Session Summary",
    coachTakeaway: "Coach's Take", coachAnalyzing: "Coach is reviewing your session…", coachRetry: "Retry analysis",
    totalTime: "Total Time", setsLogged: "Sets Logged", avgRest: "Avg Rest",
    viewSummary: "View Summary", closeSummary: "Done",
    replacePlan: "Replace current sessions", addToPlan: "Add to sessions",
    aiSuggestPrompt: "What would you like to do with this plan?",
    createExercise: "Create Exercise", customExercises: "My Exercises",
    exerciseName: "Exercise Name", muscleGroup: "Muscle Group", equipment2: "Equipment",
    noCustomExercises: "No custom exercises yet",
    editLog: "Edit Log", addExerciseToLog: "Add Exercise", saveLog: "Save Changes",
    replaceExercise: "Replace",
    photoAnalysis: "Analysis", noAnalysisYet: "Tap to analyze with AI",
    restSeconds: "Rest (sec)",
    copySession: "Duplicate", hyroxTemplate: "Hyrox Sim",
    filterAll: "All Time", filterWeek: "This Week", filterMonth: "This Month",
    undoDelete: "Undo", pace: "Pace", carbsG: "Carbs (g)", fatG: "Fat (g)",
    prompt5: "Build me a Hyrox competition prep plan",
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
    compareProgress: "Analyser les progrès", comparingProgress: "Comparaison en cours…", progressComparison: "Comparaison de progrès", pickBothPhotos: "Choisissez deux photos à comparer",
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
    startWorkout: "Démarrer", workoutTimer: "Chrono séance", restTimer: "Temps de repos",
    restComplete: "Repos terminé ! Prochaine série 💪", startRest: "Début repos",
    skipRest: "Passer", gymTime: "Temps en salle", sessionSummary: "Résumé",
    coachTakeaway: "Avis du coach", coachAnalyzing: "Le coach analyse votre séance…", coachRetry: "Relancer l'analyse",
    totalTime: "Durée totale", setsLogged: "Séries", avgRest: "Repos moy.",
    viewSummary: "Voir résumé", closeSummary: "Terminer",
    replacePlan: "Remplacer les séances", addToPlan: "Ajouter aux séances",
    aiSuggestPrompt: "Que souhaitez-vous faire avec ce plan ?",
    createExercise: "Créer exercice", customExercises: "Mes exercices",
    exerciseName: "Nom de l'exercice", muscleGroup: "Groupe musculaire", equipment2: "Équipement",
    noCustomExercises: "Aucun exercice personnalisé",
    editLog: "Modifier", addExerciseToLog: "Ajouter exercice", saveLog: "Sauvegarder",
    replaceExercise: "Remplacer",
    photoAnalysis: "Analyse", noAnalysisYet: "Appuyer pour analyser",
    restSeconds: "Repos (sec)",
    copySession: "Dupliquer", hyroxTemplate: "Sim Hyrox",
    filterAll: "Tout", filterWeek: "Semaine", filterMonth: "Ce mois",
    undoDelete: "Annuler", pace: "Allure", carbsG: "Glucides (g)", fatG: "Lipides (g)",
    prompt5: "Crée un programme de préparation Hyrox",
  },
};

function useT(profile) {
  return T[profile?.language || "en"] || T.en;
}

const GIF_BASE = "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises";

const IMAGE_MAP = {
  "Bench Press": "Barbell_Bench_Press_-_Medium_Grip",
  "Incline Bench Press": "Barbell_Incline_Bench_Press_-_Medium_Grip",
  "Dumbbell Bench Press": "Dumbbell_Bench_Press",
  "Dumbbell Flyes": "Dumbbell_Flyes",
  "Push-ups": "Pushups",
  "Cable Crossover": "Cable_Crossover",
  "Dips": "Dips_-_Chest_Version",
  "Pull-ups": "Pullups",
  "Barbell Row": "Bent_Over_Barbell_Row",
  "Lat Pulldown": "Wide-Grip_Lat_Pulldown",
  "Seated Cable Row": "Seated_Cable_Rows",
  "Deadlift": "Barbell_Deadlift",
  "Dumbbell Row": "One-Arm_Dumbbell_Row",
  "Hyperextensions": "Hyperextensions_Back_Extensions",
  "Overhead Press": "Standing_Military_Press",
  "Dumbbell Shoulder Press": "Dumbbell_Shoulder_Press",
  "Arnold Press": "Arnold_Dumbbell_Press",
  "Lateral Raises": "Side_Lateral_Raise",
  "Face Pulls": "Face_Pull",
  "Reverse Flyes": "Seated_Bent-Over_Rear_Delt_Raise",
  "Squat": "Barbell_Full_Squat",
  "Romanian Deadlift": "Romanian_Deadlift_With_Dumbbells",
  "Leg Press": "Leg_Press",
  "Bulgarian Split Squat": "Single_Leg_Squat",
  "Lunges": "Dumbbell_Lunges",
  "Leg Curl": "Seated_Leg_Curl",
  "Leg Extension": "Leg_Extensions",
  "Hip Thrust": "Barbell_Hip_Thrust",
  "Calf Raises": "Standing_Calf_Raises",
  "Barbell Curl": "Barbell_Curl",
  "Dumbbell Curl": "Dumbbell_Bicep_Curl",
  "Hammer Curl": "Hammer_Curls",
  "Preacher Curl": "Preacher_Curl_-_With_Barbell",
  "Cable Curl": "Cable_Hammer_Curls_-_Rope_Attachment",
  "Skull Crushers": "Lying_Triceps_Press",
  "Tricep Pushdown": "Triceps_Pushdown",
  "Overhead Tricep Extension": "Standing_Dumbbell_Triceps_Extension",
  "Diamond Push-ups": "Pushups_Close_Triceps_Version",
  "Close-grip Bench Press": "Close-Grip_Barbell_Bench_Press",
  "Plank": "Plank",
  "Crunches": "Crunches",
  "Hanging Leg Raises": "Hanging_Leg_Raise",
  "Russian Twists": "Russian_Twist",
  "Ab Wheel Rollout": "Ab_Roller",
  "Mountain Climbers": "Mountain_Climbers",
  "Burpees": "Burpee",
  "Box Jumps": "Front_Box_Jump",
  "Kettlebell Swing": "One-Arm_Kettlebell_Swings",
  "Battle Ropes": "Battling_Ropes",
};

// Exercise list for AI prompts — ONLY these exercises exist in the app
const AVAILABLE_EXERCISES = `CHEST: Bench Press (barbell), Incline Bench Press (barbell), Dumbbell Bench Press (dumbbell), Dumbbell Flyes (dumbbell), Push-ups (bodyweight), Cable Crossover (cable), Dips (bodyweight)
BACK: Pull-ups (bodyweight), Barbell Row (barbell), Lat Pulldown (machine), Seated Cable Row (cable), Deadlift (barbell), Dumbbell Row (dumbbell), Hyperextensions (bodyweight)
SHOULDERS: Overhead Press (barbell), Dumbbell Shoulder Press (dumbbell), Arnold Press (dumbbell), Lateral Raises (dumbbell), Face Pulls (cable), Reverse Flyes (dumbbell)
LEGS: Squat (barbell), Romanian Deadlift (barbell), Leg Press (machine), Bulgarian Split Squat (dumbbell), Lunges (dumbbell), Leg Curl (machine), Leg Extension (machine), Hip Thrust (barbell), Calf Raises (machine)
BICEPS: Barbell Curl (barbell), Dumbbell Curl (dumbbell), Hammer Curl (dumbbell), Preacher Curl (barbell), Cable Curl (cable)
TRICEPS: Skull Crushers (barbell), Tricep Pushdown (cable), Overhead Tricep Extension (dumbbell), Diamond Push-ups (bodyweight), Close-grip Bench Press (barbell)
CORE: Plank (bodyweight), Crunches (bodyweight), Hanging Leg Raises (bodyweight), Russian Twists (bodyweight), Ab Wheel Rollout (bodyweight), Mountain Climbers (bodyweight)
CARDIO: Burpees (bodyweight), Box Jumps (bodyweight), Kettlebell Swing (dumbbell), Battle Ropes (bodyweight), Jump Rope (bodyweight), Skillrow (machine), Rowing Machine (machine), Assault Bike (machine), Sled Push (bodyweight), Farmer's Walk (dumbbell), Stairmaster (machine)
HYROX: SkiErg (machine), Sled Pull (bodyweight), Burpee Broad Jumps (bodyweight), Sandbag Lunges (bodyweight), Wall Balls (bodyweight), Running (bodyweight)`;

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
  "Skillrow": "Sit tall with core braced. Drive through legs first, then lean back slightly and pull handle to lower chest. Return in reverse order — arms, body, legs. Keep chain level and maintain rhythm.",
  "Rowing Machine": "Push with legs first, lean back slightly, then pull handle to lower ribs. Return arms first, hinge forward, then bend knees. Keep a steady rhythm and don't grip too tight.",
  "Assault Bike": "Keep core tight, push and pull with arms while driving legs. For intervals, go all-out then recover. For steady state, maintain a pace you can hold. Keep seat height so leg is slightly bent at bottom.",
  "Jump Rope": "Stay on balls of feet, jump just high enough to clear the rope. Keep elbows close to body, turn rope with wrists not arms. Land softly with slight knee bend.",
  "Sled Push": "Grip handles at chest or waist height. Drive through legs, keeping arms extended and back flat. Take short, powerful steps. Stay low — the lower your body angle, the more leg drive you get.",
  "Farmer's Walk": "Pick up heavy dumbbells or kettlebells at your sides. Stand tall, shoulders back and down. Walk with short, quick steps. Squeeze the handles hard and keep core braced throughout.",
  "Stairmaster": "Stand tall, don't lean on the handrails. Drive through the full foot, not just toes. Keep a steady pace. For more glute activation, take bigger steps and lean slightly forward.",
  "SkiErg": "Stand facing the machine, feet hip-width. Grip both handles overhead and pull down explosively, hinging at the hips as you drive the handles to your thighs. Extend back up with control. Drive with the lats — this is not just an arm movement. Keep core braced throughout.",
  "Sled Pull": "Face away from the sled, rope between legs. Hinge at hips, grip rope with both hands, and pull hand-over-hand in a powerful rowing motion. Step back one pace per pull to maintain tension. Keep a low athletic stance and drive through the legs to assist each pull.",
  "Burpee Broad Jumps": "From standing, drop hands to floor, jump feet back to plank, perform a full push-up, jump feet forward, then explode into a broad jump forward — landing softly with bent knees. Immediately flow into the next rep. Keep reps rhythmic and maintain consistent jump distance.",
  "Sandbag Lunges": "Hold sandbag on one shoulder or in a bear hug. Take a long stride forward, lower back knee toward floor, then drive through front heel to stand and step through. Alternate legs each rep. Keep torso tall — resist the bag pulling you to one side.",
  "Wall Balls": "Hold medicine ball at chest, feet shoulder-width. Squat to parallel depth, then drive up explosively, pressing the ball upward to hit the target (10ft mark). Catch the ball on the way down, absorb with a squat, and flow directly into the next rep. Keep your elbows up during the catch.",
  "Running": "Maintain an upright posture, slight forward lean from the ankles (not the waist). Arms swing front to back at 90°, not across the body. Land with foot under your centre of mass. For Hyrox, pace conservatively — you have 8 runs of 1km, each followed by a functional station.",
};

const MUSCLE_ID_MAP = {
  chest: [4], "upper chest": [4], pecs: [4],
  lats: [12], "mid-back": [9], rhomboids: [9], "entire back": [12, 9, 8],
  shoulders: [2], "all delts": [2], "side delts": [2], "front delts": [2], "rear delts": [13],
  biceps: [1], brachialis: [1],
  triceps: [5],
  quads: [10], glutes: [8], hamstrings: [11], calves: [7],
  abs: [6], core: [6], "lower abs": [6], obliques: [14],
  forearms: [1], traps: [2], back: [12, 9], legs: [10, 11, 8],
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
    { name: "Jump Rope", muscles: ["calves", "shoulders", "core"], equipment: "bodyweight", wgerId: 0, gifId: "" },
    { name: "Skillrow", muscles: ["back", "legs", "core", "shoulders"], equipment: "machine", wgerId: 0, gifId: "" },
    { name: "Rowing Machine", muscles: ["back", "legs", "core"], equipment: "machine", wgerId: 0, gifId: "" },
    { name: "Assault Bike", muscles: ["quads", "hamstrings", "shoulders", "core"], equipment: "machine", wgerId: 0, gifId: "" },
    { name: "Sled Push", muscles: ["quads", "glutes", "core"], equipment: "bodyweight", wgerId: 0, gifId: "" },
    { name: "Farmer's Walk", muscles: ["forearms", "traps", "core"], equipment: "dumbbell", wgerId: 0, gifId: "" },
    { name: "Stairmaster", muscles: ["quads", "glutes", "calves"], equipment: "machine", wgerId: 0, gifId: "" },
  ],
  hyrox: [
    { name: "SkiErg", muscles: ["back", "shoulders", "core", "triceps"], equipment: "machine", wgerId: 0, gifId: "" },
    { name: "Sled Pull", muscles: ["back", "glutes", "hamstrings", "core"], equipment: "bodyweight", wgerId: 0, gifId: "" },
    { name: "Burpee Broad Jumps", muscles: ["quads", "chest", "shoulders", "core"], equipment: "bodyweight", wgerId: 0, gifId: "" },
    { name: "Sandbag Lunges", muscles: ["quads", "glutes", "core"], equipment: "bodyweight", wgerId: 0, gifId: "" },
    { name: "Wall Balls", muscles: ["quads", "glutes", "shoulders", "core"], equipment: "bodyweight", wgerId: 0, gifId: "" },
    { name: "Running", muscles: ["quads", "glutes", "calves", "core"], equipment: "bodyweight", wgerId: 0, gifId: "" },
  ],
};

const COMMON_FOODS = [
  { name: "Chicken Breast (100g)", protein: 31, calories: 165, carbs: 0,    fat: 3.6 },
  { name: "Egg (1 large)",         protein: 6,  calories: 78,  carbs: 0.6,  fat: 5   },
  { name: "Greek Yogurt (100g)",   protein: 10, calories: 59,  carbs: 3.6,  fat: 0.4 },
  { name: "Tuna (100g)",           protein: 28, calories: 132, carbs: 0,    fat: 1   },
  { name: "Whey Protein Shake",    protein: 25, calories: 130, carbs: 5,    fat: 2   },
  { name: "Ground Beef (100g)",    protein: 26, calories: 254, carbs: 0,    fat: 17  },
  { name: "Salmon (100g)",         protein: 25, calories: 208, carbs: 0,    fat: 13  },
  { name: "Cottage Cheese (100g)", protein: 11, calories: 98,  carbs: 3.4,  fat: 4.3 },
  { name: "Turkey Breast (100g)",  protein: 29, calories: 135, carbs: 0,    fat: 1   },
  { name: "Beef Steak (100g)",     protein: 27, calories: 271, carbs: 0,    fat: 19  },
  { name: "Shrimp (100g)",         protein: 24, calories: 99,  carbs: 0.2,  fat: 0.3 },
  { name: "Tofu (100g)",           protein: 8,  calories: 76,  carbs: 1.9,  fat: 4.8 },
  { name: "Lentils (100g cooked)", protein: 9,  calories: 116, carbs: 20,   fat: 0.4 },
  { name: "Oats (100g)",           protein: 13, calories: 389, carbs: 66,   fat: 7   },
  { name: "Rice (100g cooked)",    protein: 2.7,calories: 130, carbs: 28,   fat: 0.3 },
  { name: "Sweet Potato (100g)",   protein: 1.6,calories: 86,  carbs: 20,   fat: 0.1 },
  { name: "Pasta (100g cooked)",   protein: 5,  calories: 131, carbs: 25,   fat: 1.1 },
  { name: "Bread (1 slice)",       protein: 3.5,calories: 79,  carbs: 15,   fat: 1   },
  { name: "Banana (1 medium)",     protein: 1.3,calories: 105, carbs: 27,   fat: 0.4 },
  { name: "Almonds (30g)",         protein: 6,  calories: 174, carbs: 6,    fat: 15  },
  { name: "Peanut Butter (2 tbsp)",protein: 8,  calories: 188, carbs: 6,    fat: 16  },
  { name: "Milk (250ml)",          protein: 8,  calories: 122, carbs: 12,   fat: 4.8 },
  { name: "Quinoa (100g cooked)",  protein: 4.4,calories: 120, carbs: 21,   fat: 1.9 },
  { name: "Cheese (30g)",          protein: 7,  calories: 120, carbs: 0.5,  fat: 10  },
  { name: "Protein Bar",           protein: 20, calories: 220, carbs: 25,   fat: 7   },
];

async function callAI(messages, systemPrompt, maxTokens = 4000, temperature) {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, system: systemPrompt, maxTokens, temperature }),
  });
  const data = await response.json();
  // Store remaining requests for UI display
  if (data.remaining !== undefined) {
    try { localStorage.setItem("ai_remaining", data.remaining); } catch {}
  }
  if (!response.ok) {
    throw new Error(data.error || `API error ${response.status}`);
  }
  return data.text || "";
}

// Extract JSON array or object from text that may contain markdown or explanation
function extractJSON(text) {
  if (!text) return null;
  try { const d = JSON.parse(text.trim()); return d; } catch {}
  const stripped = text.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
  try { const d = JSON.parse(stripped); return d; } catch {}
  const arrMatch = text.match(/\[[\s\S]*\]/);
  if (arrMatch) { try { return JSON.parse(arrMatch[0]); } catch {} }
  const objMatch = text.match(/\{[\s\S]*\}/);
  if (objMatch) { try { return JSON.parse(objMatch[0]); } catch {} }
  return null;
}

// All known exercise names from EXERCISE_DB for matching
const KNOWN_EXERCISES = {};
Object.values(EXERCISE_DB).forEach(cat => {
  cat.forEach(ex => { KNOWN_EXERCISES[ex.name.toLowerCase()] = ex; });
});

// Fuzzy match an exercise name to a known exercise
function matchExercise(rawName) {
  if (!rawName) return null;
  const clean = rawName.replace(/^\*+|\*+$/g, "").replace(/\s+/g, " ").trim();
  const lower = clean.toLowerCase();
  // Exact match
  if (KNOWN_EXERCISES[lower]) return KNOWN_EXERCISES[lower];
  // Try without trailing s (e.g. "Dumbbell Curls" -> "Dumbbell Curl")
  if (KNOWN_EXERCISES[lower.replace(/s$/, "")]) return KNOWN_EXERCISES[lower.replace(/s$/, "")];
  // Try adding trailing s
  if (KNOWN_EXERCISES[lower + "s"]) return KNOWN_EXERCISES[lower + "s"];
  // Partial match — find first exercise whose name contains the input or vice versa
  for (const [key, ex] of Object.entries(KNOWN_EXERCISES)) {
    if (key.includes(lower) || lower.includes(key)) return ex;
  }
  // Word overlap match
  const words = lower.split(/\s+/);
  let bestMatch = null, bestScore = 0;
  for (const [key, ex] of Object.entries(KNOWN_EXERCISES)) {
    const exWords = key.split(/\s+/);
    const overlap = words.filter(w => exWords.includes(w)).length;
    if (overlap > bestScore) { bestScore = overlap; bestMatch = ex; }
  }
  if (bestScore >= 2) return bestMatch;
  return null;
}

// Parse a training plan from structured text into session objects
function parsePlanFromText(text) {
  if (!text) return [];
  const sessions = [];
  const parts = text.split(/SESSION:\s*/i);
  for (let i = 1; i < parts.length; i++) {
    const block = parts[i].trim();
    const lines = block.split("\n").map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) continue;
    const sessionName = lines[0].replace(/^\*+|\*+$/g, "").replace(/^#+\s*/, "").trim();
    const exercises = [];
    for (let j = 1; j < lines.length; j++) {
      const line = lines[j].replace(/^[-•*]\s*/, "").trim();
      if (!line || /^SESSION/i.test(line)) break;
      // Try pipe format: Name | equipment | muscles | 3x10 | 60kg
      const pipeParts = line.split("|").map(s => s.trim());
      if (pipeParts.length >= 4) {
        const rawName = pipeParts[0].replace(/^\*+|\*+$/g, "").trim();
        const setsReps = pipeParts[3] || "3x10";
        const weightStr = pipeParts[4] || "0";
        const srMatch = setsReps.match(/(\d+)\s*[x×]\s*([\d-]+)/i);
        const sets = srMatch ? parseInt(srMatch[1]) : 3;
        const reps = srMatch ? srMatch[2] : "10";
        const weight = weightStr.replace(/kg/gi, "").trim() || "0";
        // Match to known exercise
        const known = matchExercise(rawName);
        if (known) {
          exercises.push({ ...known, sets, reps, weight });
        } else {
          const equipment = (pipeParts[1] || "barbell").toLowerCase().trim();
          const muscles = (pipeParts[2] || "").split(",").map(m => m.trim().toLowerCase()).filter(Boolean);
          exercises.push({ name: rawName, muscles: muscles.length > 0 ? muscles : ["other"], equipment: equipment || "barbell", sets, reps, weight });
        }
      } else {
        // Fallback: try "Exercise Name - 3x10 @ 60kg"
        const fallback = line.match(/^(.+?)[\s-]+(\d+)\s*[x×]\s*([\d-]+)(?:\s*[@at]*\s*([\d.]+)\s*kg?)?/i);
        if (fallback) {
          const known = matchExercise(fallback[1]);
          exercises.push({
            ...(known || { name: fallback[1].trim(), muscles: ["other"], equipment: "barbell" }),
            sets: parseInt(fallback[2]), reps: fallback[3], weight: fallback[4] || "0"
          });
        }
      }
    }
    if (exercises.length > 0) {
      sessions.push({ name: sessionName, exercises });
    }
  }
  return sessions;
}

async function callAIVision(base64, mediaType, prompt) {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image: base64, mediaType, prompt }),
  });
  const data = await response.json();
  if (data.remaining !== undefined) {
    try { localStorage.setItem("ai_remaining", data.remaining); } catch {}
  }
  if (!response.ok) {
    throw new Error(data.error || `API error ${response.status}`);
  }
  return data.text || "";
}

// Multi-image variant — used for before/after comparisons.
// `images` is [{ dataUrl }]; this splits each into base64 + mediaType for the server.
async function callAIVisionMulti(images, prompt) {
  const payload = images.map((img) => {
    const data = img.dataUrl.split(",")[1];
    const mediaType = img.dataUrl.split(";")[0].split(":")[1];
    return { data, mediaType };
  });
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ images: payload, prompt }),
  });
  const data = await response.json();
  if (data.remaining !== undefined) {
    try { localStorage.setItem("ai_remaining", data.remaining); } catch {}
  }
  if (!response.ok) {
    throw new Error(data.error || `API error ${response.status}`);
  }
  return data.text || "";
}

// Downscale an uploaded image to a sane max dimension and re-encode as JPEG.
// Keeps vision API payloads under the 4MB server cap and prevents localStorage blow-ups.
function downscaleImage(file, maxDim = 1280, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.onload = (ev) => {
      const img = new Image();
      img.onerror = () => reject(new Error("Could not decode image"));
      img.onload = () => {
        let { width, height } = img;
        const scale = Math.min(1, maxDim / Math.max(width, height));
        width = Math.round(width * scale);
        height = Math.round(height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        try {
          const dataUrl = canvas.toDataURL("image/jpeg", quality);
          resolve(dataUrl);
        } catch (e) {
          reject(e);
        }
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  });
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
  const imageId = IMAGE_MAP[exercise.name];
  const imgUrl = imageId ? `${GIF_BASE}/${imageId}/0.jpg` : null;
  const img2Url = imageId ? `${GIF_BASE}/${imageId}/1.jpg` : null;
  const tip = EXERCISE_TIPS[exercise.name] || `Keep full control through every rep. Focus tension on the target muscles (${exercise.muscles?.join(", ")}). Avoid momentum.`;

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "#0a0a0f", zIndex: 400, display: "flex", flexDirection: "column", maxWidth: 480, margin: "0 auto" }}>
      <div style={{ paddingTop: "max(18px, env(safe-area-inset-top, 18px))", paddingBottom: 14, paddingLeft: 20, paddingRight: 20, display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid #1a1a24", flexShrink: 0, background: "#0a0a0f" }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 20, fontWeight: 800, lineHeight: 1.2 }}>{exercise.name}</div>
          <div style={{ color: "#e63c2f", fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginTop: 4 }}>
            {exercise.equipment} · {exercise.muscles?.join(", ")}
          </div>
        </div>
        <button onClick={onClose} className="gym-btn" style={{ background: "#1a1a24", border: "1px solid #2a2a3a", borderRadius: 10, padding: 10, color: "#aaa", flexShrink: 0, marginLeft: 12, minWidth: 44, minHeight: 44 }}>
          <Icon name="close" size={20} />
        </button>
      </div>
      <div style={{ flex: 1, overflow: "auto", WebkitOverflowScrolling: "touch", padding: "16px 18px 32px" }}>
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
            <div style={{ fontSize: 44, marginBottom: 10 }}>
              {exercise.equipment === "machine" ? "🖥️" : exercise.muscles?.includes("core") ? "🔥" : exercise.equipment === "bodyweight" ? "💪" : "🏋️"}
            </div>
            <div style={{ color: "#777", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>{t.noImage}</div>
            <div style={{ color: "#444", fontSize: 11, lineHeight: 1.6 }}>
              {exercise.equipment === "machine" ? "Demonstration images aren't available for this machine exercise." : "No image available for this exercise."}
            </div>
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
  const [customExercises, setCustomExercises] = useState(() => load(STORAGE_KEYS.customExercises, []));
  const [bodyWeightLogs, setBodyWeightLogs] = useState(() => load(STORAGE_KEYS.bodyWeightLogs, []));
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
  useEffect(() => { save(STORAGE_KEYS.customExercises, customExercises); }, [customExercises]);
  useEffect(() => { save(STORAGE_KEYS.bodyWeightLogs, bodyWeightLogs); }, [bodyWeightLogs]);

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

      const response = await callAI([{ role: "user", content: prompt }], "You are a JSON generator. Output ONLY a valid JSON array. No markdown, no explanation, no text outside the array.", 4000, 0.1);
      const parsed = extractJSON(response);

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
          if (!newExercises[c.exIdx]) return;
          if (c.field === "replace") {
            const found = KNOWN_EXERCISES[c.newVal.toLowerCase()];
            newExercises[c.exIdx] = {
              ...newExercises[c.exIdx],
              name: found ? found.name : c.newVal,
              ...(found ? { muscles: found.muscles, equipment: found.equipment } : {}),
            };
          } else {
            newExercises[c.exIdx] = { ...newExercises[c.exIdx], [c.field]: c.newVal };
          }
        });
        return { ...session, exercises: newExercises };
      }));
      const weightChanges = accepted.filter(c => c.field === "weight");
      if (weightChanges.length > 0) {
        setWorkoutLogs(prev => {
          const updated = prev.map(log => ({ ...log, exercises: log.exercises ? [...log.exercises] : [] }));
          weightChanges.forEach(c => {
            for (let i = updated.length - 1; i >= 0; i--) {
              const exIdx = updated[i].exercises.findIndex(e => e.name === c.exName);
              if (exIdx !== -1) {
                updated[i] = {
                  ...updated[i],
                  exercises: updated[i].exercises.map((ex, ei) =>
                    ei === exIdx ? { ...ex, sets: (ex.sets || []).map(s => ({ ...s, weight: c.newVal })) } : ex
                  ),
                };
                break;
              }
            }
          });
          return updated;
        });
      }
    }
    setShowAutoSuggest(false);
    setAutoSuggestData(null);
  };

  const fieldLabel = f => f === "weight" ? t.kg : f === "sets" ? t.sets : f === "replace" ? "Exercise" : t.reps;
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
        .sticky-top { position: -webkit-sticky; position: sticky; }
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

      <div data-tab-scroll="true" style={{ flex: 1, minHeight: 0, overflow: "auto", overscrollBehavior: "contain", WebkitOverflowScrolling: "touch", paddingBottom: "calc(80px + env(safe-area-inset-bottom, 0px))" }}>
        {tab === "sessions" && <SessionsTab sessions={sessions} setSessions={setSessions} profile={profile} workoutLogs={workoutLogs} customExercises={customExercises} setCustomExercises={setCustomExercises} t={t} />}
        {tab === "track" && <TrackTab sessions={sessions} setSessions={setSessions} workoutLogs={workoutLogs} setWorkoutLogs={setWorkoutLogs} customExercises={customExercises} t={t} />}
        {tab === "stats" && <StatsTab workoutLogs={workoutLogs} setWorkoutLogs={setWorkoutLogs} sessions={sessions} setSessions={setSessions} customExercises={customExercises} profile={profile} bodyWeightLogs={bodyWeightLogs} setBodyWeightLogs={setBodyWeightLogs} t={t} />}
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
      <div style={{ background: "#0f0f1a", borderRadius: "18px 18px 0 0", paddingTop: 22, paddingLeft: 22, paddingRight: 22, paddingBottom: "calc(22px + env(safe-area-inset-bottom, 0px))", width: "100%", maxHeight: "90vh", overflow: "auto", WebkitOverflowScrolling: "touch" }}>
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

function SessionsTab({ sessions, setSessions, profile, workoutLogs, customExercises, setCustomExercises, t }) {
  const [showCreate, setShowCreate] = useState(false);
  const [editSession, setEditSession] = useState(null);
  const [showAlts, setShowAlts] = useState(null);
  const [altResults, setAltResults] = useState(""); const [altLoading, setAltLoading] = useState(false);
  const [showDemo, setShowDemo] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const getAlternatives = async (exercise) => {
    setAltLoading(true); setAltResults("");
    try {
      const res = await callAI([{ role: "user", content: `Give 4 alternatives for "${exercise.name}" (targets: ${exercise.muscles?.join(", ")}). For each briefly explain why it's a good substitute.` }], "You are a knowledgeable fitness coach. Be concise and practical.", 2000);
      setAltResults(res);
    } catch (e) { setAltResults("Error: " + (e.message || "Could not load alternatives.")); }
    setAltLoading(false);
  };

  const getSessionMuscles = (s) => [...new Set((s.exercises || []).flatMap(e => e.muscles || []))];

  return (
    <div style={{ padding: 18 }} className="slide-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: 20, fontWeight: 800 }}>{t.trainingSessions}</div>
          <div style={{ color: "#555", fontSize: 12, marginTop: 2 }}>{profile.daysPerWeek}×/{t.gymDays?.split("/")[0] || "week"} · {profile.minutesPerSession} min</div>
        </div>
        <div style={{ display: "flex", gap: 7, flexShrink: 0 }}>
          <button onClick={() => setShowCreate(true)} className="gym-btn" style={{ background: "#e63c2f", border: "none", borderRadius: 11, padding: "10px 16px", color: "#fff", fontWeight: 700, display: "flex", alignItems: "center", gap: 5, fontSize: 14, minHeight: 44 }}>
            <Icon name="plus" size={15} /> {t.newSession}
          </button>
        </div>
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
                <div style={{ display: "flex", gap: 5 }}>
                  <button onClick={() => setEditSession({ ...session, idx })} style={{ background: "#1a1a24", border: "1px solid #252535", borderRadius: 7, padding: "5px 10px", color: "#888", fontSize: 12 }}>{t.edit}</button>
                  <button onClick={() => setSessions(s => s.filter((_, i) => i !== idx))} style={{ background: "none", border: "1px solid #252535", borderRadius: 7, padding: "5px 7px", color: "#444" }}><Icon name="trash" size={13} /></button>
                </div>
              </div>
            </div>
            <button onClick={() => setExpandedId(open ? null : session.id)} style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center", background: "none", border: "none", borderTop: "1px solid #1a1a24", padding: "9px 14px", color: "#555", fontSize: 12 }}>
              <span>{open ? t.hideExercises : t.showExercises}</span>
              <span style={{ transform: open ? "rotate(90deg)" : "rotate(0)", transition: "0.2s" }}><Icon name="arrow" size={14} /></span>
            </button>
            {open && (
              <div style={{ padding: "4px 14px 14px" }}>
                {/* Muscle map — only visible when expanded */}
                <div style={{ background: "#0d0d18", borderRadius: 10, padding: "10px 12px", marginBottom: 10, display: "flex", alignItems: "center", gap: 10 }}>
                  <MuscleMap muscles={muscles} size={80} />
                  <div>
                    <div style={{ fontSize: 9, letterSpacing: 2, color: "#e63c2f", fontWeight: 700, textTransform: "uppercase", marginBottom: 6 }}>{t.muscleToday}</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                      {muscles.map(m => (
                        <span key={m} style={{ background: "#e63c2f1a", border: "1px solid #e63c2f33", borderRadius: 5, padding: "2px 7px", fontSize: 10, color: "#e63c2f", fontWeight: 600, textTransform: "capitalize" }}>{m}</span>
                      ))}
                    </div>
                  </div>
                </div>
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
        <SessionEditor initial={editSession} onSave={s => { if (editSession) setSessions(p => p.map((x, i) => i === editSession.idx ? s : x)); else setSessions(p => [...p, { ...s, id: Date.now() }]); setShowCreate(false); setEditSession(null); }} onClose={() => { setShowCreate(false); setEditSession(null); }} customExercises={customExercises} setCustomExercises={setCustomExercises} t={t} />
      )}

      {showAlts && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", zIndex: 200, display: "flex", alignItems: "flex-end" }}>
          <div style={{ background: "#0f0f1a", borderRadius: "18px 18px 0 0", paddingTop: 22, paddingLeft: 22, paddingRight: 22, paddingBottom: "calc(22px + env(safe-area-inset-bottom, 0px))", width: "100%", maxHeight: "75vh", overflow: "auto", WebkitOverflowScrolling: "touch" }}>
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

function CreateExerciseModal({ onSave, onClose, t }) {
  const [form, setForm] = useState({ name: "", muscles: "", equipment: "barbell" });
  const muscleOptions = ["chest", "back", "shoulders", "biceps", "triceps", "quads", "hamstrings", "glutes", "calves", "core", "abs"];
  const equipOptions = ["barbell", "dumbbell", "cable", "machine", "bodyweight", "kettlebell", "other"];
  const valid = form.name.trim() && form.muscles.trim();
  const handleSave = () => {
    if (!valid) return;
    onSave({
      id: Date.now(), name: form.name.trim(), isCustom: true,
      muscles: form.muscles.split(",").map(m => m.trim().toLowerCase()).filter(Boolean),
      equipment: form.equipment,
    });
  };
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.93)", zIndex: 500, display: "flex", alignItems: "flex-end" }}>
      <div style={{ background: "#0f0f1a", borderRadius: "18px 18px 0 0", padding: "22px 22px calc(22px + env(safe-area-inset-bottom, 0px))", width: "100%", maxHeight: "80vh", overflow: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ fontWeight: 800, fontSize: 18 }}>✏️ {t.createExercise}</div>
          <button onClick={onClose} className="gym-btn" style={{ background: "#1a1a24", border: "none", borderRadius: 10, padding: 10, color: "#888", minWidth: 40, minHeight: 40 }}><Icon name="close" /></button>
        </div>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 10, color: "#e63c2f", fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 5 }}>{t.exerciseName}</div>
          <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Cable Lateral Raise..." autoFocus
            style={{ width: "100%", background: "#111", border: "1px solid #2a2a3a", borderRadius: 10, padding: "12px 14px", color: "#e8e4dc", fontSize: 15, minHeight: 48 }} />
        </div>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 10, color: "#e63c2f", fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 5 }}>{t.muscleGroup}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
            {muscleOptions.map(m => {
              const selected = form.muscles.split(",").map(x => x.trim().toLowerCase()).includes(m);
              return (
                <button key={m} onClick={() => {
                  const arr = form.muscles.split(",").map(x => x.trim().toLowerCase()).filter(Boolean);
                  const next = selected ? arr.filter(x => x !== m) : [...arr, m];
                  setForm(f => ({ ...f, muscles: next.join(", ") }));
                }} style={{ background: selected ? "#e63c2f" : "#111", border: `1px solid ${selected ? "#e63c2f" : "#2a2a3a"}`, borderRadius: 8, padding: "6px 12px", color: selected ? "#fff" : "#888", fontSize: 12, fontWeight: 600 }}>
                  {m}
                </button>
              );
            })}
          </div>
          <input value={form.muscles} onChange={e => setForm(f => ({ ...f, muscles: e.target.value }))} placeholder="or type: chest, triceps..."
            style={{ width: "100%", background: "#111", border: "1px solid #2a2a3a", borderRadius: 10, padding: "10px 14px", color: "#e8e4dc", fontSize: 14 }} />
        </div>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 10, color: "#e63c2f", fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 5 }}>{t.equipment2 || "Equipment"}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {equipOptions.map(eq => (
              <button key={eq} onClick={() => setForm(f => ({ ...f, equipment: eq }))} style={{ background: form.equipment === eq ? "#e63c2f" : "#111", border: `1px solid ${form.equipment === eq ? "#e63c2f" : "#2a2a3a"}`, borderRadius: 8, padding: "6px 12px", color: form.equipment === eq ? "#fff" : "#888", fontSize: 12, fontWeight: 600 }}>
                {eq}
              </button>
            ))}
          </div>
        </div>
        <button onClick={handleSave} disabled={!valid} className="gym-btn" style={{ width: "100%", background: valid ? "#e63c2f" : "#333", border: "none", borderRadius: 12, padding: "14px", fontWeight: 800, fontSize: 16, color: "#fff", minHeight: 52, opacity: valid ? 1 : 0.5 }}>
          + {t.createExercise}
        </button>
      </div>
    </div>
  );
}

function ExercisePickerModal({ mode, replaceIdx, customExercises, onAdd, onReplace, onClose, t }) {
  const [search, setSearch] = useState("");
  const [showDemo, setShowDemo] = useState(null);
  const searchLower = search.toLowerCase().trim();
  const allCustom = customExercises || [];

  const filteredDB = {};
  Object.entries(EXERCISE_DB).forEach(([cat, exs]) => {
    const filtered = searchLower ? exs.filter(ex =>
      ex.name.toLowerCase().includes(searchLower) ||
      ex.muscles?.some(m => m.toLowerCase().includes(searchLower)) ||
      ex.equipment?.toLowerCase().includes(searchLower)
    ) : exs;
    if (filtered.length > 0) filteredDB[cat] = filtered;
  });

  const filteredCustom = searchLower
    ? allCustom.filter(ex => ex.name.toLowerCase().includes(searchLower) || ex.muscles?.some(m => m.toLowerCase().includes(searchLower)))
    : allCustom;

  const handleSelect = (ex) => {
    if (mode === "replace") onReplace(ex);
    else { onAdd(ex); onClose(); }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "#0a0a0f", zIndex: 400, display: "flex", flexDirection: "column" }}>
      <div style={{ flexShrink: 0, paddingTop: "max(16px, env(safe-area-inset-top, 16px))", paddingBottom: 12, paddingLeft: 20, paddingRight: 20, borderBottom: "1px solid #1a1a24", background: "#0a0a0f" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontWeight: 800, fontSize: 17 }}>{mode === "replace" ? t.replaceExercise : t.addExerciseToLog}</div>
          <button onClick={onClose} className="gym-btn" style={{ background: "#1a1a24", border: "none", borderRadius: 10, padding: 10, color: "#888", minWidth: 40, minHeight: 40, flexShrink: 0 }}><Icon name="close" /></button>
        </div>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search exercises..." autoFocus
          style={{ width: "100%", background: "#111", border: "1px solid #2a2a3a", borderRadius: 10, padding: "12px 14px", color: "#e8e4dc", fontSize: 15, minHeight: 48, outline: "none" }} />
      </div>
      <div style={{ flex: 1, minHeight: 0, overflow: "auto", padding: "12px 18px", WebkitOverflowScrolling: "touch" }}>
        {filteredCustom.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 10, letterSpacing: 2, color: "#e63c2f", fontWeight: 700, textTransform: "uppercase", marginBottom: 7 }}>⭐ {t.customExercises}</div>
            {filteredCustom.map(ex => (
              <div key={ex.id || ex.name} style={{ display: "flex", background: "#111", border: "1px solid #1a1a24", borderRadius: 10, marginBottom: 6, overflow: "hidden" }}>
                <button onClick={() => handleSelect(ex)} style={{ flex: 1, textAlign: "left", background: "none", border: "none", padding: "12px 14px", color: "#e8e4dc", minHeight: 48 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{ex.name}</div>
                  <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>{ex.equipment} · {ex.muscles?.join(", ")}</div>
                </button>
              </div>
            ))}
          </div>
        )}
        {Object.entries(filteredDB).map(([cat, exs]) => (
          <div key={cat} style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 10, letterSpacing: 2, color: "#e63c2f", fontWeight: 700, textTransform: "uppercase", marginBottom: 7 }}>{cat}</div>
            {exs.map(ex => (
              <div key={ex.name} style={{ display: "flex", background: "#111", border: "1px solid #1a1a24", borderRadius: 10, marginBottom: 6, overflow: "hidden" }}>
                <button onClick={() => handleSelect(ex)} style={{ flex: 1, textAlign: "left", background: "none", border: "none", padding: "12px 14px", color: "#e8e4dc", minHeight: 48 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{ex.name}</div>
                  <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>{ex.equipment} · {ex.muscles?.join(", ")}</div>
                </button>
                <button onClick={() => setShowDemo(ex)} style={{ background: "#1a1a24", border: "none", borderLeft: "1px solid #1a1a24", padding: "0 14px", color: "#e63c2f", fontSize: 12, fontWeight: 700 }}>{t.howBtn}</button>
              </div>
            ))}
          </div>
        ))}
        <div style={{ height: 40 }} />
      </div>
      {showDemo && <ExerciseDemo exercise={showDemo} onClose={() => setShowDemo(null)} t={t} />}
    </div>
  );
}

function SessionEditor({ initial, onSave, onClose, customExercises, setCustomExercises, t: tt }) {
  const t = tt || T.en;
  const [name, setName] = useState(initial?.name || "");
  const [exercises, setExercises] = useState(initial?.exercises || []);
  const [showPicker, setShowPicker] = useState(false);
  const [showDemo, setShowDemo] = useState(null);
  const [search, setSearch] = useState("");
  const [showCreateEx, setShowCreateEx] = useState(false);

  const addEx = ex => { setExercises(p => [...p, { ...ex, sets: 3, reps: "8-12", weight: "", restSeconds: "90" }]); setShowPicker(false); setSearch(""); };
  const updateEx = (idx, f, v) => setExercises(p => p.map((e, i) => i === idx ? { ...e, [f]: v } : e));
  const removeEx = idx => setExercises(p => p.filter((_, i) => i !== idx));
  const moveEx = (idx, dir) => setExercises(p => {
    const arr = [...p];
    const swap = idx + dir;
    if (swap < 0 || swap >= arr.length) return arr;
    [arr[idx], arr[swap]] = [arr[swap], arr[idx]];
    return arr;
  });
  const muscles = [...new Set(exercises.flatMap(e => e.muscles || []))];

  const filteredDB = {};
  const searchLower = search.toLowerCase().trim();
  Object.entries(EXERCISE_DB).forEach(([cat, exs]) => {
    const filtered = searchLower ? exs.filter(ex =>
      ex.name.toLowerCase().includes(searchLower) ||
      ex.muscles?.some(m => m.toLowerCase().includes(searchLower)) ||
      ex.equipment?.toLowerCase().includes(searchLower) ||
      cat.toLowerCase().includes(searchLower)
    ) : exs;
    if (filtered.length > 0) filteredDB[cat] = filtered;
  });

  const allCustom = customExercises || [];
  const filteredCustom = searchLower ? allCustom.filter(ex => ex.name.toLowerCase().includes(searchLower) || ex.muscles?.some(m => m.toLowerCase().includes(searchLower))) : allCustom;

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "#0a0a0f", zIndex: 200, display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ flexShrink: 0, paddingTop: "max(16px, env(safe-area-inset-top, 16px))", paddingBottom: 16, paddingLeft: 20, paddingRight: 20, borderBottom: "1px solid #1a1a24", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#0a0a0f" }}>
        <div style={{ fontWeight: 800, fontSize: 19 }}>{initial ? t.editSession : t.newSessionTitle}</div>
        <button onClick={onClose} className="gym-btn" style={{ background: "#1a1a24", border: "none", borderRadius: 10, padding: 10, color: "#888", minWidth: 40, minHeight: 40, flexShrink: 0 }}><Icon name="close" /></button>
      </div>

      <div style={{ flex: 1, overflow: "auto", WebkitOverflowScrolling: "touch" }}>
        <div style={{ padding: "16px 20px" }}>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 10, letterSpacing: 2, color: "#e63c2f", marginBottom: 4, fontWeight: 700, textTransform: "uppercase" }}>{t.sessionName}</div>
          <input value={name} onChange={e => setName(e.target.value)} placeholder={t.egSessionName} style={{ width: "100%", background: "#111", border: "1px solid #2a2a3a", borderRadius: 10, padding: "12px 14px", color: "#e8e4dc", fontSize: 15, minHeight: 48 }} />
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
          <button onClick={() => setShowPicker(true)} className="gym-btn" style={{ background: "#e63c2f1a", border: "1px solid #e63c2f33", borderRadius: 8, padding: "6px 14px", color: "#e63c2f", fontSize: 13, fontWeight: 700, minHeight: 36 }}>+ {t.addExercise}</button>
        </div>
        {exercises.map((ex, idx) => (
          <div key={idx} style={{ background: "#111", border: "1px solid #1a1a24", borderRadius: 12, padding: 12, marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7, alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 2, flexShrink: 0 }}>
                  <button onClick={() => moveEx(idx, -1)} disabled={idx === 0} style={{ background: "none", border: "none", color: idx === 0 ? "#333" : "#666", padding: "1px 4px", fontSize: 10, lineHeight: 1 }}>▲</button>
                  <button onClick={() => moveEx(idx, 1)} disabled={idx === exercises.length - 1} style={{ background: "none", border: "none", color: idx === exercises.length - 1 ? "#333" : "#666", padding: "1px 4px", fontSize: 10, lineHeight: 1 }}>▼</button>
                </div>
                <div style={{ fontWeight: 700, fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ex.name}</div>
              </div>
              <div style={{ display: "flex", gap: 5, flexShrink: 0 }}>
                {!ex.isCustom && <button onClick={() => setShowDemo(ex)} style={{ background: "#1a1a24", border: "1px solid #252535", borderRadius: 6, padding: "4px 8px", color: "#e63c2f", fontSize: 11 }}>{t.howBtn}</button>}
                <button onClick={() => removeEx(idx)} style={{ background: "none", border: "none", color: "#444", padding: 4 }}><Icon name="trash" size={14} /></button>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 7 }}>
              {["sets", "reps", "weight", "restSeconds"].map(f => (
                <div key={f}>
                  <div style={{ fontSize: 9, color: "#555", marginBottom: 2, textTransform: "uppercase", letterSpacing: 1 }}>
                    {f === "weight" ? t.kg : f === "sets" ? t.sets : f === "reps" ? t.reps : "Rest(s)"}
                  </div>
                  <input value={ex[f] || ""} onChange={e => updateEx(idx, f, e.target.value)} placeholder={f === "weight" ? "BW" : f === "restSeconds" ? "90" : ""}
                    style={{ width: "100%", background: "#0a0a0f", border: "1px solid #2a2a3a", borderRadius: 6, padding: "8px 6px", color: "#e8e4dc", fontSize: 13 }} />
                </div>
              ))}
            </div>
          </div>
        ))}

        <button onClick={() => name && onSave({ id: initial?.id || Date.now(), name, exercises })} className="gym-btn" style={{ width: "100%", background: name ? "#e63c2f" : "#333", border: "none", borderRadius: 12, padding: "14px", fontWeight: 800, fontSize: 16, color: "#fff", minHeight: 52, opacity: name ? 1 : 0.5, marginTop: 8 }}>{t.saveSession}</button>
        <div style={{ height: 80 }} />
        </div>
      </div>

      {/* Exercise picker — fullscreen with search */}
      {showPicker && (
        <div style={{ position: "fixed", inset: 0, background: "#0a0a0f", zIndex: 300, display: "flex", flexDirection: "column" }}>
          <div style={{ flexShrink: 0, paddingTop: "max(16px, env(safe-area-inset-top, 16px))", paddingBottom: 12, paddingLeft: 20, paddingRight: 20, borderBottom: "1px solid #1a1a24", background: "#0a0a0f" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ fontWeight: 800, fontSize: 17 }}>{t.addExerciseTitle}</div>
              <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                <button onClick={() => setShowCreateEx(true)} className="gym-btn" style={{ background: "#e63c2f1a", border: "1px solid #e63c2f33", borderRadius: 8, padding: "8px 12px", color: "#e63c2f", fontSize: 12, fontWeight: 700, minHeight: 36 }}>+ {t.createExercise}</button>
                <button onClick={() => { setShowPicker(false); setSearch(""); }} className="gym-btn" style={{ background: "#1a1a24", border: "none", borderRadius: 10, padding: 10, color: "#888", minWidth: 40, minHeight: 40 }}><Icon name="close" /></button>
              </div>
            </div>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search exercises, muscles, equipment..." autoFocus
              style={{ width: "100%", background: "#111", border: "1px solid #2a2a3a", borderRadius: 10, padding: "12px 14px", color: "#e8e4dc", fontSize: 15, minHeight: 48, outline: "none" }} />
          </div>
          <div style={{ flex: 1, minHeight: 0, overflow: "auto", padding: "12px 18px", WebkitOverflowScrolling: "touch" }}>
            {/* Custom exercises section */}
            {filteredCustom.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 10, letterSpacing: 2, color: "#e63c2f", fontWeight: 700, textTransform: "uppercase", marginBottom: 7 }}>⭐ {t.customExercises}</div>
                {filteredCustom.map(ex => (
                  <div key={ex.id} style={{ display: "flex", background: "#111", border: "1px solid #1a1a24", borderRadius: 10, marginBottom: 6, overflow: "hidden" }}>
                    <button onClick={() => addEx(ex)} style={{ flex: 1, textAlign: "left", background: "none", border: "none", padding: "12px 14px", color: "#e8e4dc", minHeight: 48 }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{ex.name}</div>
                      <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>{ex.equipment} · {ex.muscles?.join(", ")}</div>
                    </button>
                    <button onClick={() => setCustomExercises && setCustomExercises(p => p.filter(e => e.id !== ex.id))} style={{ background: "#1a1a24", border: "none", borderLeft: "1px solid #1a1a24", padding: "0 12px", color: "#444" }}><Icon name="trash" size={13} /></button>
                  </div>
                ))}
              </div>
            )}
            {Object.keys(filteredDB).length === 0 && filteredCustom.length === 0 ? (
              <div style={{ textAlign: "center", padding: 40, color: "#555", fontSize: 14 }}>No exercises match "{search}"</div>
            ) : (
              Object.entries(filteredDB).map(([cat, exs]) => (
                <div key={cat} style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 10, letterSpacing: 2, color: "#e63c2f", fontWeight: 700, textTransform: "uppercase", marginBottom: 7 }}>{cat}</div>
                  {exs.map(ex => (
                    <div key={ex.name} style={{ display: "flex", background: "#111", border: "1px solid #1a1a24", borderRadius: 10, marginBottom: 6, overflow: "hidden" }}>
                      <button onClick={() => addEx(ex)} style={{ flex: 1, textAlign: "left", background: "none", border: "none", padding: "12px 14px", color: "#e8e4dc", minHeight: 48 }}>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{ex.name}</div>
                        <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>{ex.equipment} · {ex.muscles?.join(", ")}</div>
                      </button>
                      <button onClick={() => setShowDemo(ex)} style={{ background: "#1a1a24", border: "none", borderLeft: "1px solid #1a1a24", padding: "0 14px", color: "#e63c2f", fontSize: 12, fontWeight: 700 }}>{t.howBtn}</button>
                    </div>
                  ))}
                </div>
              ))
            )}
            <div style={{ height: 40 }} />
          </div>
        </div>
      )}
      {showDemo && <ExerciseDemo exercise={showDemo} onClose={() => setShowDemo(null)} t={t} />}
      {showCreateEx && (
        <CreateExerciseModal
          onSave={ex => { setCustomExercises && setCustomExercises(p => [...p, ex]); addEx(ex); setShowCreateEx(false); }}
          onClose={() => setShowCreateEx(false)}
          t={t}
        />
      )}
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
  // New cardio exercises
  "Jump Rope":           { label: "Duration", placeholder: "secs",    unit: "s" },
  "Skillrow":            { label: "Distance", placeholder: "m",      unit: "m",  unit2: "Time", placeholder2: "secs", isDual: true },
  "Rowing Machine":      { label: "Distance", placeholder: "m",      unit: "m",  unit2: "Time", placeholder2: "secs", isDual: true },
  "Assault Bike":        { label: "Calories", placeholder: "cals",    unit: "cal" },
  "Sled Push":           { label: "Weight",   placeholder: "kg",      unit: "kg" },
  "Farmer's Walk":       { label: "Weight",   placeholder: "kg",      unit: "kg" },
  "Stairmaster":         { label: "Duration", placeholder: "secs",    unit: "s" },
  // Hyrox stations
  "SkiErg":              { label: "Distance", placeholder: "m",       unit: "m",  unit2: "Time", placeholder2: "secs", isDual: true },
  "Sled Pull":           { label: "Weight",   placeholder: "kg",      unit: "kg" },
  "Burpee Broad Jumps":  { label: "Distance", placeholder: "m",       unit: "m" },
  "Sandbag Lunges":      { label: "Weight",   placeholder: "kg",      unit: "kg" },
  "Wall Balls":          { label: "Weight",   placeholder: "kg",      unit: "kg" },
  "Running":             { label: "Distance", placeholder: "m",       unit: "m",  unit2: "Time", placeholder2: "secs", isDual: true },
  // Default (barbell, dumbbell, machine, cable)
};

function getExFieldConfig(ex) {
  // Check explicit override first
  if (EX_FIELD_CONFIG[ex.name]) return EX_FIELD_CONFIG[ex.name];
  // Infer from equipment
  if (ex.equipment === "bodyweight") return { label: "Added kg", placeholder: "BW", unit: "kg", bodyweight: true };
  return { label: "Weight", placeholder: "kg", unit: "kg" };
}

function RestBanner({ seconds, onDone, onSkip, t }) {
  const [remaining, setRemaining] = useState(seconds);
  useEffect(() => {
    const id = setInterval(() => {
      setRemaining(r => {
        if (r <= 1) {
          clearInterval(id);
          if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate([100, 60, 100]);
          onDone();
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);
  const pct = remaining / seconds;
  return (
    <div style={{ background: "#111", border: "1px solid #e63c2f33", borderRadius: 10, padding: "9px 13px", marginBottom: 12, display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ fontSize: 9, color: "#e63c2f", fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", flexShrink: 0 }}>{t.restTimer}</div>
      <div style={{ flex: 1, height: 4, background: "#1a1a24", borderRadius: 2, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct * 100}%`, background: "#e63c2f", borderRadius: 2, transition: "width 0.9s linear" }} />
      </div>
      <div style={{ fontSize: 17, fontWeight: 800, color: "#e8e4dc", fontVariantNumeric: "tabular-nums", flexShrink: 0, minWidth: 34, textAlign: "right" }}>{remaining}s</div>
      <button onClick={onSkip} style={{ background: "#1a1a24", border: "1px solid #2a2a3a", borderRadius: 6, padding: "5px 11px", color: "#555", fontWeight: 700, fontSize: 11, flexShrink: 0, minHeight: 30 }}>✕</button>
    </div>
  );
}

function ExerciseTimer({ onComplete }) {
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef(null);

  const start = () => { setRunning(true); setSeconds(0); };
  const stop = () => { setRunning(false); clearInterval(intervalRef.current); onComplete(seconds); };

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  if (!running) return (
    <button onClick={start} style={{ background: "#e63c2f1a", border: "1px solid #e63c2f33", borderRadius: 6, padding: "4px 8px", color: "#e63c2f", fontSize: 10, fontWeight: 700, whiteSpace: "nowrap" }}>⏱ Start</button>
  );

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      <span style={{ color: "#e63c2f", fontSize: 14, fontWeight: 800, fontVariantNumeric: "tabular-nums", minWidth: 28 }}>{seconds}s</span>
      <button onClick={stop} style={{ background: "#e63c2f", border: "none", borderRadius: 6, padding: "4px 8px", color: "#fff", fontSize: 10, fontWeight: 700 }}>Stop</button>
    </div>
  );
}

function TrackTab({ sessions, setSessions, workoutLogs, setWorkoutLogs, customExercises, t }) {
  const [sel, setSel] = useState(null);
  const [sessionExercises, setSessionExercises] = useState([]);
  const [logData, setLogData] = useState({});
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState(false);
  const [pendingDraft, setPendingDraft] = useState(null); // { session, draft }
  const [showDemo, setShowDemo] = useState(null);
  const [started, setStarted] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [restTimer, setRestTimer] = useState(null); // { seconds }
  const [restLog, setRestLog] = useState([]); // completed rest durations
  const [showRpeFor, setShowRpeFor] = useState({}); // { [ei]: bool }
  const [rpeData, setRpeData] = useState({});       // { [ei]: { [si]: 1-10 } }
  const [timedSet, setTimedSet] = useState(null);   // { ei, si, totalSecs, remaining, elapsed }
  const [autoComplete, setAutoComplete] = useState(null); // { ei, si } — fires handleSetDone after timer
  const timedExRef = useRef(null);
  const [showAddExercise, setShowAddExercise] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [savedLog, setSavedLog] = useState(null);
  const [aiSummary, setAiSummary] = useState(null);
  const [aiSummaryLoading, setAiSummaryLoading] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (started && startTime) {
      timerRef.current = setInterval(() => setElapsed(Math.floor((Date.now() - startTime) / 1000)), 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [started, startTime]);

  const fmtTime = s => `${String(Math.floor(s/3600)).padStart(2,"0")}:${String(Math.floor((s%3600)/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  // Fire handleSetDone outside of state updater (avoids closure issues)
  useEffect(() => {
    if (autoComplete) { handleSetDone(autoComplete.ei, autoComplete.si); setAutoComplete(null); }
  }, [autoComplete]);

  const startExTimer = (ei, si) => {
    const entered = parseInt(logData[ei]?.[si]?.weight);
    const totalSecs = entered > 0 ? entered : null; // null = stopwatch mode
    clearInterval(timedExRef.current);
    setTimedSet({ ei, si, totalSecs, remaining: totalSecs ?? 0, elapsed: 0 });
    timedExRef.current = setInterval(() => {
      setTimedSet(prev => {
        if (!prev) return null;
        if (prev.totalSecs !== null) {
          const next = prev.remaining - 1;
          if (next <= 0) {
            clearInterval(timedExRef.current);
            if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate([150, 80, 150]);
            setAutoComplete({ ei: prev.ei, si: prev.si });
            return null;
          }
          return { ...prev, remaining: next };
        }
        return { ...prev, elapsed: prev.elapsed + 1 };
      });
    }, 1000);
  };

  const stopExTimer = () => {
    clearInterval(timedExRef.current);
    if (timedSet && timedSet.totalSecs === null) {
      // Stopwatch mode: fill in elapsed duration
      handleWeightChange(timedSet.ei, timedSet.si, String(timedSet.elapsed));
    }
    setTimedSet(null);
  };

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

  const resumeDraft = (s, draft) => {
    const exs = draft.sessionExercises || s.exercises || [];
    setLogData(draft.logData); setSel(s); setSessionExercises(exs);
    setSaved(false); setNotes(draft.notes || "");
    // Restore timer state. If the session was running, recompute elapsed from the wall-clock
    // startTime so the timer picks up where it left off instead of restarting at zero.
    const wasStarted = !!draft.started && !!draft.startTime;
    setStarted(wasStarted);
    setStartTime(wasStarted ? draft.startTime : null);
    setElapsed(wasStarted ? Math.floor((Date.now() - draft.startTime) / 1000) : (draft.elapsed || 0));
    setRpeData(draft.rpeData || {});
    setRestLog([]); setShowSummary(false); setSavedLog(null);
    setPendingDraft(null);
  };

  const initLog = s => {
    const exs = s.exercises || [];
    // Check for an in-progress draft — show non-blocking banner instead of confirm()
    const draftKey = `log_draft_${s.id}`;
    try {
      const raw = sessionStorage.getItem(draftKey);
      if (raw) {
        const draft = JSON.parse(raw);
        setPendingDraft({ session: s, draft });
        return;
      }
    } catch (_) {}
    const d = {};
    exs.forEach((ex, i) => {
      const numSets = +ex.sets || 3;
      const lastData = getLastLoggedData(ex, numSets);
      if (lastData) {
        d[i] = Array.from({ length: numSets }, (_, si) => {
          const prev = lastData[si] || lastData[lastData.length - 1] || {};
          return { weight: prev.weight || "", reps: prev.reps || "", done: false };
        });
      } else {
        const progWeight = (ex.weight && ex.weight.toString().trim() !== "") ? ex.weight.toString() : "";
        d[i] = Array.from({ length: numSets }, () => ({ weight: progWeight, reps: "", done: false }));
      }
    });
    setLogData(d); setSel(s); setSessionExercises(exs); setSaved(false); setNotes(""); setStarted(false); setElapsed(0); setRestLog([]); setShowSummary(false); setSavedLog(null);
  };

  const handleWeightChange = (ei, si, val) => {
    setLogData(d => ({ ...d, [ei]: d[ei].map((s, idx) => idx === si ? { ...s, weight: val } : s) }));
    const ex = sessionExercises[ei];
    if (ex && sel) {
      setSessions(prev => prev.map(sess => {
        if (sess.id !== sel.id) return sess;
        return { ...sess, exercises: (sess.exercises || []).map((e, idx) => idx === ei ? { ...e, weight: val } : e) };
      }));
    }
  };

  // Auto-save draft to sessionStorage whenever logData or notes change.
  // Persist timer state (started + startTime) and rpeData so resuming a session
  // after a tab switch or app close continues the clock instead of restarting it.
  useEffect(() => {
    if (!sel || saved) return;
    try {
      sessionStorage.setItem(`log_draft_${sel.id}`, JSON.stringify({
        logData, notes, elapsed, started, startTime, rpeData, sessionExercises,
      }));
    } catch (_) {}
  }, [logData, notes, elapsed, sel, saved, started, startTime, rpeData, sessionExercises]);

  const handleSetDone = (ei, si) => {
    setLogData(d => ({ ...d, [ei]: d[ei].map((s, i) => i === si ? { ...s, done: !s.done } : s) }));
    const ex = sessionExercises[ei];
    const wasNotDone = !(logData[ei]?.[si]?.done);
    if (wasNotDone && started) {
      const restSecs = ex.restSeconds ? parseInt(ex.restSeconds) : 90;
      setRestTimer({ seconds: restSecs });
    }
  };

  const addExerciseToSession = (ex) => {
    const numSets = +ex.sets || 3;
    const newIdx = sessionExercises.length;
    setSessionExercises(p => [...p, ex]);
    const lastData = getLastLoggedData(ex, numSets);
    const newSets = lastData
      ? Array.from({ length: numSets }, (_, si) => { const prev = lastData[si] || lastData[lastData.length-1] || {}; return { weight: prev.weight||"", reps: prev.reps||"", done: false }; })
      : Array.from({ length: numSets }, () => ({ weight: ex.weight||"", reps: "", done: false }));
    setLogData(d => ({ ...d, [newIdx]: newSets }));
    setShowAddExercise(false);
  };

  const replaceExercise = (ei, newEx) => {
    const numSets = sessionExercises[ei] ? +sessionExercises[ei].sets || 3 : 3;
    setSessionExercises(p => p.map((e, i) => i === ei ? { ...newEx, sets: e.sets, reps: e.reps, restSeconds: e.restSeconds } : e));
    const lastData = getLastLoggedData(newEx, numSets);
    const newSets = lastData
      ? Array.from({ length: numSets }, (_, si) => { const prev = lastData[si] || lastData[lastData.length-1] || {}; return { weight: prev.weight||"", reps: prev.reps||"", done: false }; })
      : Array.from({ length: numSets }, () => ({ weight: newEx.weight||"", reps: "", done: false }));
    setLogData(d => ({ ...d, [ei]: newSets }));
  };

  const saveLog = () => {
    const logEntry = {
      id: Date.now(), date: new Date().toISOString(),
      sessionId: sel.id, sessionName: sel.name,
      exercises: sessionExercises.map((ex, i) => ({ ...ex, sets: logData[i] })),
      notes, durationSeconds: elapsed,
    };
    setWorkoutLogs(p => [...p, logEntry]);
    try { sessionStorage.removeItem(`log_draft_${sel.id}`); } catch (_) {}
    setSavedLog(logEntry);
    setSaved(true);
    clearInterval(timerRef.current);
    setShowSummary(true);
    generateAISummary(logEntry);
  };

  // Look up the most recent previous log of the same session to compare against.
  const getPreviousSessionLog = (sessionId, excludeId) => {
    for (let i = workoutLogs.length - 1; i >= 0; i--) {
      const l = workoutLogs[i];
      if (l.id !== excludeId && l.sessionId === sessionId) return l;
    }
    return null;
  };

  const generateAISummary = async (log) => {
    setAiSummaryLoading(true);
    setAiSummary(null);
    try {
      const exBreakdown = (log.exercises || []).map((ex, ei) => {
        const rpe = rpeData[ei] || {};
        const sets = (ex.sets || []).map((s, si) => ({
          weight: s.weight || null,
          reps: s.reps || null,
          rpe: rpe[si] || null,
          done: !!s.done,
        }));
        return { name: ex.name, equipment: ex.equipment, sets };
      });
      const prev = getPreviousSessionLog(log.sessionId, log.id);
      const prevSummary = prev ? prev.exercises?.map(ex => ({
        name: ex.name,
        sets: (ex.sets || []).filter(s => s.done).map(s => ({ weight: s.weight, reps: s.reps })),
      })) : null;

      const prompt = `The athlete just finished a session. Give a brief, direct assessment in 3-5 sentences. Cover: (1) what went well with specific numbers, (2) one concrete thing to adjust next session based on RPE/volume, (3) whether they should progress, hold, or deload a specific lift. No generic praise, no bullet lists, no markdown headers — just tight coaching prose.

THIS SESSION:
Name: ${log.sessionName}
Duration: ${Math.round((log.durationSeconds || 0) / 60)} min
Exercises:
${JSON.stringify(exBreakdown, null, 2)}

${prevSummary ? `PREVIOUS ${log.sessionName} SESSION (for progression comparison):
${JSON.stringify(prevSummary, null, 2)}` : "No prior log of this session — this is the baseline."}`;

      const text = await callAI(
        [{ role: "user", content: prompt }],
        "You are an elite, direct strength coach talking to an athlete in second person. Be specific with weights, reps, and RPE. Keep it under 120 words.",
        500,
        0.7,
      );
      setAiSummary(text.trim());
    } catch (e) {
      setAiSummary({ error: true, message: e.message || "Could not generate summary" });
    } finally {
      setAiSummaryLoading(false);
    }
  };

  // ─── Session select screen ───────────────────────────────────────────
  if (!sel) return (
    <div style={{ padding: 18 }} className="slide-in">
      <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 5 }}>{t.logWorkout}</div>
      <div style={{ color: "#555", fontSize: 13, marginBottom: 18 }}>{t.selectSession}</div>
      {/* Draft recovery banner */}
      {pendingDraft && (
        <div style={{ background: "#0c1a0c", border: "1px solid #4ade8044", borderRadius: 13, padding: "14px 16px", marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#4ade80", marginBottom: 6 }}>⚡ Unfinished session found</div>
          <div style={{ fontSize: 12, color: "#888", marginBottom: 12 }}>{pendingDraft.session.name} — continue where you left off?</div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => resumeDraft(pendingDraft.session, pendingDraft.draft)} className="gym-btn"
              style={{ flex: 1, background: "#4ade801a", border: "1px solid #4ade8044", borderRadius: 10, padding: "10px", color: "#4ade80", fontWeight: 800, fontSize: 13, minHeight: 44 }}>
              Continue
            </button>
            <button onClick={() => { try { sessionStorage.removeItem(`log_draft_${pendingDraft.session.id}`); } catch(_){} setPendingDraft(null); }} className="gym-btn"
              style={{ flex: 1, background: "#1a1a24", border: "1px solid #252535", borderRadius: 10, padding: "10px", color: "#555", fontWeight: 700, fontSize: 13, minHeight: 44 }}>
              Start fresh
            </button>
          </div>
        </div>
      )}
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

  // ─── Session summary ─────────────────────────────────────────────────
  if (showSummary && savedLog) {
    const totalSets = savedLog.exercises?.reduce((s, ex) => s + (ex.sets?.filter(st => st.done)?.length || 0), 0) || 0;
    const totalVolume = savedLog.exercises?.reduce((s, ex) => s + (ex.sets || []).reduce((ss, st) => ss + ((+st.weight||0) * (+st.reps||0)), 0), 0) || 0;
    const avgRestSec = restLog.length > 0 ? Math.round(restLog.reduce((a, b) => a + b, 0) / restLog.length) : null;
    return (
      <div style={{ padding: 18 }} className="slide-in">
        <div style={{ textAlign: "center", paddingTop: 20, paddingBottom: 16 }}>
          <div style={{ fontSize: 54 }}>🔥</div>
          <div style={{ fontSize: 22, fontWeight: 800, marginTop: 10 }}>{t.sessionLogged}</div>
          <div style={{ color: "#555", fontSize: 13, marginTop: 4 }}>{savedLog.sessionName}</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 18 }}>
          {[
            [fmtTime(elapsed), t.totalTime, "⏱"],
            [totalSets, t.setsCompleted, "✅"],
            [totalVolume > 0 ? `${(totalVolume/1000).toFixed(1)}t` : "—", t.volume, "💪"],
            [avgRestSec ? `${avgRestSec}s` : "—", t.avgRest, "⏸"],
          ].map(([val, label, icon]) => (
            <div key={label} style={{ background: "#111", border: "1px solid #1a1a24", borderRadius: 13, padding: "18px 12px", textAlign: "center" }}>
              <div style={{ fontSize: 11, marginBottom: 4 }}>{icon}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#e63c2f" }}>{val}</div>
              <div style={{ fontSize: 9, color: "#555", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>
        <div style={{ background: "#111", border: "1px solid #1a1a24", borderRadius: 13, padding: "14px 16px", marginBottom: 16 }}>
          {savedLog.exercises?.map((ex, ei) => {
            const doneSets = (ex.sets || []).filter(s => s.done);
            return (
              <div key={ei} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingVertical: 6, borderBottom: ei < savedLog.exercises.length-1 ? "1px solid #1a1a24" : "none", paddingTop: 6, paddingBottom: 6 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{ex.name}</div>
                <div style={{ color: doneSets.length > 0 ? "#4ade80" : "#555", fontSize: 13, fontWeight: 700 }}>{doneSets.length} {t.sets}</div>
              </div>
            );
          })}
        </div>
        {/* AI coach takeaway */}
        <div style={{ background: "#111", border: "1px solid #e63c2f33", borderRadius: 13, padding: "14px 16px", marginBottom: 16 }}>
          <div style={{ fontSize: 10, letterSpacing: 2, color: "#e63c2f", fontWeight: 700, textTransform: "uppercase", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
            <span>🧠</span><span>{t.coachTakeaway}</span>
          </div>
          {aiSummaryLoading && (
            <div style={{ fontSize: 13, color: "#888", fontStyle: "italic" }}>{t.coachAnalyzing}</div>
          )}
          {!aiSummaryLoading && aiSummary && typeof aiSummary === "string" && (
            <div style={{ fontSize: 14, color: "#e8e4dc", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{aiSummary}</div>
          )}
          {!aiSummaryLoading && aiSummary && aiSummary.error && (
            <div>
              <div style={{ fontSize: 13, color: "#888", marginBottom: 10 }}>{aiSummary.message}</div>
              <button onClick={() => generateAISummary(savedLog)} className="gym-btn"
                style={{ background: "#1a1a24", border: "1px solid #e63c2f33", borderRadius: 10, padding: "8px 12px", color: "#e63c2f", fontWeight: 700, fontSize: 12, minHeight: 36 }}>
                {t.coachRetry}
              </button>
            </div>
          )}
        </div>
        <button onClick={() => setSel(null)} className="gym-btn" style={{ width: "100%", background: "#e63c2f", border: "none", borderRadius: 12, padding: "14px", fontWeight: 800, fontSize: 16, color: "#fff", minHeight: 52 }}>{t.closeSummary}</button>
      </div>
    );
  }

  // ─── Logging screen ──────────────────────────────────────────────────
  return (
    <div className="slide-in">
      {/* ── Sticky header: timer + rest banner always visible while scrolling ── */}
      <div className="sticky-top" style={{
        top: 0, zIndex: 20, background: "#0a0a0f",
        paddingTop: 16, paddingLeft: 18, paddingRight: 18,
        paddingBottom: started ? 12 : 16,
        borderBottom: "1px solid #111",
      }}>
        {/* Row: back ← · session name · timer chip */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: (restTimer && started) ? 10 : 0 }}>
          <button onClick={() => { if (started && !saved) { if (!window.confirm("Quit session?")) return; } clearInterval(timerRef.current); setSel(null); }} style={{ background: "#1a1a24", border: "none", borderRadius: 7, padding: "5px 9px", color: "#888" }}>←</button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 19, fontWeight: 800, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{sel.name}</div>
            <div style={{ color: "#555", fontSize: 12 }}>{new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}</div>
          </div>
          {/* Compact timer chip inline with header */}
          <div style={{ flexShrink: 0, background: started ? "#e63c2f12" : "#111", border: `1px solid ${started ? "#e63c2f33" : "#1a1a24"}`, borderRadius: 10, padding: "6px 12px", textAlign: "center", transition: "all 0.4s" }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: started ? "#e63c2f" : "#444", fontVariantNumeric: "tabular-nums", letterSpacing: 1 }}>{fmtTime(elapsed)}</div>
            <div style={{ fontSize: 8, color: started ? "#e63c2f88" : "#444", letterSpacing: 1.5, textTransform: "uppercase" }}>{started ? t.gymTime : t.startWorkout}</div>
          </div>
        </div>
        {/* Rest banner lives here — scrolls with sticky header, never disappears */}
        {restTimer && started && (
          <RestBanner seconds={restTimer.seconds} t={t}
            onDone={() => { setRestLog(r => [...r, restTimer.seconds]); setRestTimer(null); }}
            onSkip={() => { setRestLog(r => [...r, 0]); setRestTimer(null); }} />
        )}
      </div>

      {/* ── Scrollable body ── */}
      <div style={{ padding: "14px 18px 18px" }}>
      {/* Start button */}
      {!started && (
        <button onClick={() => { setStarted(true); setStartTime(Date.now()); }} className="gym-btn" style={{ width: "100%", background: "#e63c2f", border: "none", borderRadius: 12, padding: "14px", fontWeight: 800, fontSize: 16, color: "#fff", minHeight: 52, marginBottom: 18, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          ▶ {t.startWorkout}
        </button>
      )}

      {sessionExercises.map((ex, ei) => {
        const sets = logData[ei] || [];
        const fieldCfg = getExFieldConfig(ex);
        const isBodyweight = !!fieldCfg.bodyweight;
        const isDuration = fieldCfg.unit === "s";
        return (
          <div key={ei} style={{ background: "#111", border: "1px solid #1a1a24", borderRadius: 13, padding: 13, marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{ex.name}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 3 }}>
                  <span style={{ fontSize: 10, color: "#444", textTransform: "capitalize" }}>{ex.equipment}</span>
                  {isBodyweight && <span style={{ fontSize: 9, color: "#4ade80", fontWeight: 700 }}>· BW</span>}
                  {isDuration && <span style={{ fontSize: 9, color: "#f5a623", fontWeight: 700 }}>· TIMED</span>}
                  {ex.restSeconds && <span style={{ fontSize: 10, color: "#444" }}>· ⏱ {ex.restSeconds}s rest</span>}
                </div>
              </div>
              <div style={{ display: "flex", gap: 5 }}>
                {isDuration && started && (
                  <button onClick={() => { const si = sets.findIndex(s => !s.done); startExTimer(ei, si >= 0 ? si : 0); }}
                    style={{ background: timedSet?.ei === ei ? "#f5a6231a" : "#1a1a24", border: `1px solid ${timedSet?.ei === ei ? "#f5a62366" : "#252535"}`, borderRadius: 7, padding: "4px 10px", color: "#f5a623", fontSize: 15, fontWeight: 700, lineHeight: 1 }}>▶</button>
                )}
                <button onClick={() => setShowRpeFor(p => ({ ...p, [ei]: !p[ei] }))}
                  style={{ background: showRpeFor[ei] ? "#e63c2f1a" : "#1a1a24", border: `1px solid ${showRpeFor[ei] ? "#e63c2f44" : "#252535"}`, borderRadius: 7, padding: "4px 9px", color: showRpeFor[ei] ? "#e63c2f" : "#555", fontSize: 10, fontWeight: 700, letterSpacing: 0.5 }}>RPE</button>
                <button onClick={() => setShowDemo(ex)} style={{ background: "#1a1a24", border: "1px solid #252535", borderRadius: 7, padding: "4px 9px", color: "#e63c2f", fontSize: 11, fontWeight: 700 }}><Icon name="info" size={11} /></button>
                <button onClick={() => setShowAddExercise({ mode: "replace", idx: ei })} style={{ background: "#1a1a24", border: "1px solid #252535", borderRadius: 7, padding: "4px 9px", color: "#888", fontSize: 11, fontWeight: 700 }}><Icon name="swap" size={11} /></button>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "28px 1fr 1fr 44px", gap: 6, marginBottom: 6, marginTop: 8 }}>
              {["#", fieldCfg.label, fieldCfg.isDual ? (fieldCfg.unit2 || "secs") : isDuration ? "Rounds" : t.reps || "Reps", "✓"].map(h => (
                <div key={h} style={{ fontSize: 9, color: "#444", textTransform: "uppercase", letterSpacing: 1 }}>{h}</div>
              ))}
            </div>
            {sets.map((set, si) => (
              <div key={si}>
                {timedSet?.ei === ei && timedSet?.si === si ? (
                  /* ── Active exercise countdown / stopwatch ── */
                  <div style={{ background: "#e63c2f0a", border: "1px solid #e63c2f33", borderRadius: 10, padding: "10px 12px", marginBottom: showRpeFor[ei] ? 4 : 6, display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ color: "#444", fontSize: 13, fontWeight: 600, flexShrink: 0, width: 20 }}>{si + 1}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ height: 3, background: "#1a1a24", borderRadius: 2, marginBottom: 6, overflow: "hidden" }}>
                        {timedSet.totalSecs
                          ? <div style={{ height: "100%", width: `${(timedSet.remaining / timedSet.totalSecs) * 100}%`, background: "#e63c2f", borderRadius: 2, transition: "width 0.9s linear" }} />
                          : <div style={{ height: "100%", width: "100%", background: "#e63c2f44", borderRadius: 2 }} />}
                      </div>
                      <div style={{ fontSize: 26, fontWeight: 800, color: "#e63c2f", fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
                        {timedSet.totalSecs ? `${timedSet.remaining}s` : `${timedSet.elapsed}s`}
                      </div>
                      {timedSet.totalSecs && <div style={{ fontSize: 9, color: "#e63c2f66", textTransform: "uppercase", letterSpacing: 1, marginTop: 2 }}>of {timedSet.totalSecs}s</div>}
                    </div>
                    <button onClick={stopExTimer} className="gym-btn"
                      style={{ background: "#1a1a24", border: "1px solid #2a2a3a", borderRadius: 8, padding: 8, color: "#888", minWidth: 44, minHeight: 44, fontSize: 16 }}>■</button>
                  </div>
                ) : (
                  /* ── Normal set row ── */
                  <div style={{ display: "grid", gridTemplateColumns: "28px 1fr 1fr 44px", gap: 6, marginBottom: showRpeFor[ei] ? 4 : 6, alignItems: "center" }}>
                    <div style={{ color: "#444", fontSize: 13, fontWeight: 600 }}>{si + 1}</div>
                    <input value={set.weight} onChange={e => handleWeightChange(ei, si, e.target.value)} placeholder={fieldCfg.placeholder} inputMode="decimal"
                      style={{ background: "#0a0a0f", border: `1px solid ${set.weight ? "#3a3a4a" : "#2a2a3a"}`, borderRadius: 8, padding: "10px 10px", color: "#e8e4dc", fontSize: 16, width: "100%", minHeight: 44 }} />
                    <input value={set.reps} onChange={e => setLogData(d => ({ ...d, [ei]: d[ei].map((s, i) => i === si ? { ...s, reps: e.target.value } : s) }))} placeholder={fieldCfg.isDual ? (fieldCfg.placeholder2 || "secs") : ex.reps || (isDuration ? "rounds" : "reps")} inputMode="numeric"
                      style={{ background: "#0a0a0f", border: "1px solid #2a2a3a", borderRadius: 8, padding: "10px 10px", color: "#e8e4dc", fontSize: 16, width: "100%", minHeight: 44 }} />
                    <button onClick={() => handleSetDone(ei, si)} className="gym-btn"
                      style={{ background: set.done ? "#e63c2f" : "#1a1a24", border: `2px solid ${set.done ? "#e63c2f" : "#252535"}`, borderRadius: 8, padding: 8, color: set.done ? "#fff" : "#444", display: "flex", alignItems: "center", justifyContent: "center", minWidth: 44, minHeight: 44, transition: "all 0.15s" }}>
                      <Icon name="check" size={18} />
                    </button>
                  </div>
                )}
                {showRpeFor[ei] && (
                  <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 6, paddingLeft: 34 }}>
                    <span style={{ fontSize: 9, color: "#444", textTransform: "uppercase", letterSpacing: 1, flexShrink: 0 }}>{t.showRpe || "RPE"}</span>
                    {[6, 7, 8, 9, 10].map(v => {
                      const sel = rpeData[ei]?.[si] === v;
                      const colors = { 6: "#4ade80", 7: "#a3e635", 8: "#f5a623", 9: "#f97316", 10: "#e63c2f" };
                      return (
                        <button key={v} onClick={() => setRpeData(d => ({ ...d, [ei]: { ...(d[ei] || {}), [si]: sel ? undefined : v } }))}
                          style={{ background: sel ? `${colors[v]}22` : "#1a1a24", border: `1px solid ${sel ? colors[v] : "#2a2a3a"}`, borderRadius: 5, width: 30, height: 26, fontSize: 11, color: sel ? colors[v] : "#555", fontWeight: 800, flexShrink: 0 }}>
                          {v}
                        </button>
                      );
                    })}
                    {rpeData[ei]?.[si] && <span style={{ fontSize: 10, color: "#888", marginLeft: 2 }}>{["Easy","Mod","Hard","V.Hard","Max"][rpeData[ei][si]-6]}</span>}
                  </div>
                )}
              </div>
            ))}
            {sets.length > 1 && sets[0].weight && !sets.every(s => s.weight === sets[0].weight) && (
              <button onClick={() => { const v = sets[0].weight; setLogData(d => ({ ...d, [ei]: d[ei].map(s => ({ ...s, weight: v })) })); handleWeightChange(ei, 0, v); }}
                className="gym-btn" style={{ marginTop: 6, width: "100%", background: "#e63c2f18", border: "1px solid #e63c2f44", borderRadius: 8, padding: "10px 10px", color: "#e63c2f", fontSize: 12, fontWeight: 700, minHeight: 40 }}>
                {t.applyToAll} ({sets[0].weight}{fieldCfg.unit === "kg" ? "kg" : fieldCfg.unit})
              </button>
            )}
          </div>
        );
      })}

      {/* Add exercise to current workout */}
      {started && (
        <button onClick={() => setShowAddExercise({ mode: "add" })} className="gym-btn" style={{ width: "100%", background: "#1a1a24", border: "1px dashed #2a2a3a", borderRadius: 12, padding: "12px", fontWeight: 700, fontSize: 14, color: "#555", marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, minHeight: 48 }}>
          <Icon name="plus" size={15} /> {t.addExerciseToLog}
        </button>
      )}

      <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder={t.sessionNotes} style={{ width: "100%", background: "#111", border: "1px solid #1a1a24", borderRadius: 10, padding: "12px 14px", color: "#e8e4dc", fontSize: 14, resize: "none", height: 72, marginBottom: 14 }} />
      <button onClick={saveLog} disabled={!started} className="gym-btn" style={{ width: "100%", background: started ? "#e63c2f" : "#333", border: "none", borderRadius: 12, padding: "14px", fontWeight: 800, fontSize: 16, color: "#fff", minHeight: 52, opacity: started ? 1 : 0.5 }}>💪 {t.completeSession}</button>
      <div style={{ height: 20 }} />
      </div>{/* end scrollable body */}

      {showAddExercise && (
        <ExercisePickerModal
          mode={showAddExercise.mode}
          replaceIdx={showAddExercise.idx}
          customExercises={customExercises || []}
          onAdd={ex => addExerciseToSession({ ...ex, sets: ex.sets || 3, reps: ex.reps || "10", weight: ex.weight || "" })}
          onReplace={(ex) => { replaceExercise(showAddExercise.idx, ex); setShowAddExercise(false); }}
          onClose={() => setShowAddExercise(false)}
          t={t}
        />
      )}
      {showDemo && <ExerciseDemo exercise={showDemo} onClose={() => setShowDemo(null)} t={t} />}
    </div>
  );
}

function StatsTab({ workoutLogs, setWorkoutLogs, sessions, setSessions, customExercises, profile, bodyWeightLogs, setBodyWeightLogs, t }) {
  const [selEx, setSelEx] = useState(null);
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [pendingChanges, setPendingChanges] = useState([]);
  const [showChanges, setShowChanges] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [editingLog, setEditingLog] = useState(false);
  const [editLogData, setEditLogData] = useState(null);
  const [showAddToLog, setShowAddToLog] = useState(false);
  const [logFilter, setLogFilter] = useState("all");
  const [pendingLogDelete, setPendingLogDelete] = useState(null);
  const [showBwInput, setShowBwInput] = useState(false);
  const [bwInput, setBwInput] = useState("");

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
  const deleteLog = id => {
    const item = workoutLogs.find(l => l.id === id);
    if (!item) return;
    setWorkoutLogs(p => p.filter(l => l.id !== id));
    if (selectedLog?.id === id) setSelectedLog(null);
    if (pendingLogDelete?.timer) clearTimeout(pendingLogDelete.timer);
    const timer = setTimeout(() => setPendingLogDelete(null), 4000);
    setPendingLogDelete({ item, timer });
  };
  const undoDeleteLog = () => {
    if (!pendingLogDelete) return;
    clearTimeout(pendingLogDelete.timer);
    setWorkoutLogs(p => [...p, pendingLogDelete.item].sort((a, b) => new Date(a.date) - new Date(b.date)));
    setPendingLogDelete(null);
  };

  const startEditLog = (log) => {
    const d = {};
    (log.exercises || []).forEach((ex, i) => { d[i] = (ex.sets || []).map(s => ({ ...s })); });
    setEditLogData({ exercises: [...log.exercises], sets: d, notes: log.notes || "" });
    setEditingLog(true);
  };

  const saveEditLog = () => {
    const updated = {
      ...selectedLog,
      exercises: editLogData.exercises.map((ex, i) => ({ ...ex, sets: editLogData.sets[i] || [] })),
      notes: editLogData.notes,
    };
    setWorkoutLogs(p => p.map(l => l.id === updated.id ? updated : l));
    setSelectedLog(updated);
    setEditingLog(false);
    setEditLogData(null);
  };

  // ─── Log Detail View ───────────────────────────────────────────────
  if (selectedLog) {
    const log = selectedLog;
    const totalSets = log.exercises?.reduce((s, ex) => s + (ex.sets?.filter(st => st.done)?.length || 0), 0) || 0;
    const totalVolume = log.exercises?.reduce((s, ex) => s + (ex.sets || []).reduce((ss, st) => ss + ((+st.weight || 0) * (+st.reps || 0)), 0), 0) || 0;
    const durationSecs = log.durationSeconds;

    if (editingLog && editLogData) {
      return (
        <div className="slide-in" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "#0a0a0f", zIndex: 40, display: "flex", flexDirection: "column" }}>
          <div style={{
            paddingTop: "max(16px, env(safe-area-inset-top, 16px))", paddingLeft: 18, paddingRight: 18, paddingBottom: 14,
            background: "#0a0a0f", borderBottom: "1px solid #111",
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <button onClick={() => { setEditingLog(false); setEditLogData(null); }} className="gym-btn" style={{ background: "#1a1a24", border: "none", borderRadius: 10, padding: "10px 14px", color: "#e8e4dc", fontWeight: 700, fontSize: 13, minHeight: 44 }}>←</button>
            <div style={{ fontSize: 18, fontWeight: 800, flex: 1 }}>{t.editLog}</div>
            <button onClick={saveEditLog} className="gym-btn" style={{ background: "#e63c2f", border: "none", borderRadius: 10, padding: "10px 14px", color: "#fff", fontWeight: 800, fontSize: 13, minHeight: 44 }}>{t.saveLog}</button>
          </div>
          <div style={{ flex: 1, minHeight: 0, overflow: "auto", WebkitOverflowScrolling: "touch", padding: "14px 18px calc(24px + env(safe-area-inset-bottom, 0px))" }}>
          {editLogData.exercises.map((ex, ei) => {
            const fieldCfg = getExFieldConfig(ex);
            return (
              <div key={ei} style={{ background: "#111", border: "1px solid #1a1a24", borderRadius: 13, padding: 13, marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{ex.name}</div>
                  <button onClick={() => {
                    const newExs = editLogData.exercises.filter((_, i) => i !== ei);
                    const newSets = {};
                    newExs.forEach((_, ni) => { newSets[ni] = editLogData.sets[ni < ei ? ni : ni + 1] || []; });
                    setEditLogData(d => ({ ...d, exercises: newExs, sets: newSets }));
                  }} style={{ background: "none", border: "none", color: "#444" }}><Icon name="trash" size={14} /></button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "28px 1fr 1fr 44px", gap: 6, marginBottom: 6 }}>
                  {["#", fieldCfg.label, t.reps, "✓"].map(h => (
                    <div key={h} style={{ fontSize: 9, color: "#444", textTransform: "uppercase", letterSpacing: 1 }}>{h}</div>
                  ))}
                </div>
                {(editLogData.sets[ei] || []).map((set, si) => (
                  <div key={si} style={{ display: "grid", gridTemplateColumns: "28px 1fr 1fr 44px", gap: 6, marginBottom: 6, alignItems: "center" }}>
                    <div style={{ color: "#444", fontSize: 13 }}>{si + 1}</div>
                    <input value={set.weight || ""} onChange={e => setEditLogData(d => ({ ...d, sets: { ...d.sets, [ei]: d.sets[ei].map((s, i) => i === si ? { ...s, weight: e.target.value } : s) } }))}
                      placeholder={fieldCfg.placeholder} inputMode="decimal"
                      style={{ background: "#0a0a0f", border: "1px solid #2a2a3a", borderRadius: 8, padding: "10px", color: "#e8e4dc", fontSize: 15, width: "100%", minHeight: 44 }} />
                    <input value={set.reps || ""} onChange={e => setEditLogData(d => ({ ...d, sets: { ...d.sets, [ei]: d.sets[ei].map((s, i) => i === si ? { ...s, reps: e.target.value } : s) } }))}
                      inputMode="numeric"
                      style={{ background: "#0a0a0f", border: "1px solid #2a2a3a", borderRadius: 8, padding: "10px", color: "#e8e4dc", fontSize: 15, width: "100%", minHeight: 44 }} />
                    <button onClick={() => setEditLogData(d => ({ ...d, sets: { ...d.sets, [ei]: d.sets[ei].map((s, i) => i === si ? { ...s, done: !s.done } : s) } }))}
                      className="gym-btn" style={{ background: set.done ? "#e63c2f" : "#1a1a24", border: `2px solid ${set.done ? "#e63c2f" : "#252535"}`, borderRadius: 8, padding: 8, color: set.done ? "#fff" : "#444", minWidth: 44, minHeight: 44 }}>
                      <Icon name="check" size={16} />
                    </button>
                  </div>
                ))}
                <button onClick={() => setEditLogData(d => ({ ...d, sets: { ...d.sets, [ei]: [...(d.sets[ei] || []), { weight: "", reps: "", done: false }] } }))}
                  style={{ width: "100%", background: "none", border: "1px dashed #2a2a3a", borderRadius: 8, padding: "8px", color: "#555", fontSize: 12, marginTop: 4 }}>+ {t.sets}</button>
              </div>
            );
          })}
          <button onClick={() => setShowAddToLog(true)} className="gym-btn" style={{ width: "100%", background: "#1a1a24", border: "1px dashed #2a2a3a", borderRadius: 12, padding: "12px", fontWeight: 700, fontSize: 14, color: "#555", marginBottom: 12, minHeight: 48, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <Icon name="plus" size={15} /> {t.addExerciseToLog}
          </button>
          <textarea value={editLogData.notes} onChange={e => setEditLogData(d => ({ ...d, notes: e.target.value }))} placeholder={t.sessionNotes}
            style={{ width: "100%", background: "#111", border: "1px solid #1a1a24", borderRadius: 10, padding: "12px 14px", color: "#e8e4dc", fontSize: 14, resize: "none", height: 72 }} />
          {showAddToLog && (
            <ExercisePickerModal mode="add" customExercises={customExercises || []}
              onAdd={ex => {
                const newIdx = editLogData.exercises.length;
                const newEx = { ...ex, sets: ex.sets || 3, reps: ex.reps || "10" };
                setEditLogData(d => ({
                  ...d,
                  exercises: [...d.exercises, newEx],
                  sets: { ...d.sets, [newIdx]: Array.from({ length: +ex.sets || 3 }, () => ({ weight: "", reps: "", done: false })) }
                }));
                setShowAddToLog(false);
              }}
              onReplace={() => {}} onClose={() => setShowAddToLog(false)} t={t} />
          )}
          </div>
        </div>
      );
    }

    return (
      <div className="slide-in" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "#0a0a0f", zIndex: 40, display: "flex", flexDirection: "column" }}>
        <div style={{
          paddingTop: "max(16px, env(safe-area-inset-top, 16px))", paddingLeft: 18, paddingRight: 18, paddingBottom: 14,
          background: "#0a0a0f", borderBottom: "1px solid #111",
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <button onClick={() => setSelectedLog(null)} className="gym-btn" style={{ background: "#1a1a24", border: "none", borderRadius: 10, padding: "10px 14px", color: "#e8e4dc", fontWeight: 700, fontSize: 13, minHeight: 44 }}>
            ← {t.backToStats}
          </button>
          <button onClick={() => startEditLog(log)} className="gym-btn" style={{ background: "#1a1a24", border: "1px solid #2a2a3a", borderRadius: 10, padding: "10px 14px", color: "#888", fontWeight: 700, fontSize: 13, minHeight: 44, marginLeft: "auto" }}>
            ✏️ {t.editLog}
          </button>
        </div>
        <div style={{ flex: 1, minHeight: 0, overflow: "auto", WebkitOverflowScrolling: "touch", padding: "16px 18px calc(24px + env(safe-area-inset-bottom, 0px))" }}>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 22, fontWeight: 800 }}>{log.sessionName}</div>
          <div style={{ color: "#e63c2f", fontSize: 12, fontWeight: 600, marginTop: 4 }}>
            {new Date(log.date).toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: durationSecs ? "1fr 1fr 1fr 1fr" : "1fr 1fr 1fr", gap: 8, marginBottom: 20 }}>
          {[
            [log.exercises?.length || 0, t.exercises],
            [totalSets, t.setsCompleted],
            [totalVolume > 0 ? `${(totalVolume/1000).toFixed(1)}t` : "—", t.volume],
            ...(durationSecs ? [[`${Math.floor(durationSecs/60)}m`, t.totalTime]] : []),
          ].map(([val, label]) => (
            <div key={label} style={{ background: "#111", border: "1px solid #1a1a24", borderRadius: 12, padding: "14px 8px", textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#e63c2f" }}>{val}</div>
              <div style={{ fontSize: 9, color: "#555", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>{label}</div>
            </div>
          ))}
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
                <div style={{ display: "grid", gridTemplateColumns: fieldCfg.isDual ? "36px 1fr 1fr 60px 40px" : "36px 1fr 1fr 40px", gap: 0, padding: "8px 10px", borderBottom: "1px solid #1a1a24" }}>
                  {(fieldCfg.isDual ? ["#", fieldCfg.label, fieldCfg.unit2 || "secs", t.pace || "Pace", "✓"] : ["#", fieldCfg.label, t.reps, "✓"]).map(h => (
                    <div key={h} style={{ fontSize: 9, color: "#555", textTransform: "uppercase", letterSpacing: 1, fontWeight: 700 }}>{h}</div>
                  ))}
                </div>
                {(ex.sets || []).map((set, si) => {
                  const distM = parseFloat(set.weight);
                  const timeSecs = parseFloat(set.reps);
                  const paceStr = fieldCfg.isDual && distM > 0 && timeSecs > 0
                    ? (() => { const secPer1k = (timeSecs / distM) * 1000; const m = Math.floor(secPer1k / 60); const s = Math.round(secPer1k % 60); return `${m}:${String(s).padStart(2,"0")}/km`; })()
                    : null;
                  return (
                    <div key={si} style={{ display: "grid", gridTemplateColumns: fieldCfg.isDual ? "36px 1fr 1fr 60px 40px" : "36px 1fr 1fr 40px", gap: 0, padding: "10px 10px", borderBottom: si < (ex.sets || []).length - 1 ? "1px solid #111" : "none", background: set.done ? "#e63c2f08" : "transparent" }}>
                      <div style={{ color: "#555", fontSize: 13, fontWeight: 600 }}>{si + 1}</div>
                      <div style={{ color: "#e8e4dc", fontSize: 14, fontWeight: 600 }}>{set.weight || "—"}{set.weight ? (fieldCfg.unit || "") : ""}</div>
                      <div style={{ color: "#e8e4dc", fontSize: 14, fontWeight: 600 }}>{set.reps || "—"}</div>
                      {fieldCfg.isDual && <div style={{ color: "#60a5fa", fontSize: 12, fontWeight: 700 }}>{paceStr || "—"}</div>}
                      <div style={{ color: set.done ? "#4ade80" : "#333", fontSize: 14, fontWeight: 700 }}>{set.done ? "✓" : "—"}</div>
                    </div>
                  );
                })}
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
      </div>
    );
  }

  const generateSuggestions = async () => {
    setLoadingSuggestions(true);
    try {
      const goalLabels = { muscle_gain: "Muscle Gain", fat_loss: "Fat Loss", strength: "Strength", endurance: "Endurance", maintenance: "Maintenance" };
      const goalLabel = goalLabels[profile?.goal] || profile?.goal || "General Fitness";

      // Per-exercise trend sorted by date
      const progressSummary = exNames.map(name => {
        const data = exProgress[name].slice().sort((a, b) => new Date(a.date) - new Date(b.date));
        const trend = data[data.length - 1].weight - data[0].weight;
        const lastFour = data.slice(-4);
        const plateau = lastFour.length >= 3 && lastFour.every(d => d.weight === lastFour[0].weight);
        return { name, startWeight: data[0].weight, currentWeight: data[data.length - 1].weight, totalGain: trend, sessions: data.length, plateau, recentWeights: lastFour.map(d => ({ date: d.date.slice(0, 10), weight: d.weight })) };
      });

      // Last 8 full session logs for context
      const recentLogs = workoutLogs.slice(-8).map(log => ({
        date: log.date.slice(0, 10),
        session: log.sessionName,
        exercises: (log.exercises || []).map(ex => ({
          name: ex.name,
          sets: (ex.sets || []).filter(s => s.done).map(s => ({ weight: s.weight, reps: s.reps })),
        })).filter(ex => ex.sets.length > 0),
      }));

      const sessionsSummary = sessions.map(s => ({
        id: s.id, name: s.name,
        exercises: s.exercises?.map((e, i) => ({ idx: i, name: e.name, sets: e.sets, reps: e.reps, weight: e.weight, equipment: e.equipment }))
      }));

      const prompt = `You are an elite personal trainer analyzing a client's real training data. Be direct, specific, and evidence-based.

CLIENT PROFILE:
- Goal: ${goalLabel}
- Training frequency: ${profile?.daysPerWeek || "?"} days/week, ${profile?.minutesPerSession || "?"} min/session
- Body weight: ${profile?.weight || "unknown"}kg

RECENT SESSIONS (last ${recentLogs.length}):
${JSON.stringify(recentLogs, null, 2)}

EXERCISE PROGRESS TRENDS:
${JSON.stringify(progressSummary, null, 2)}

CURRENT PROGRAM:
${JSON.stringify(sessionsSummary, null, 2)}

TASK: Analyze whether this client is on track for their goal (${goalLabel}), then generate specific upgrade suggestions.

Consider:
1. Is the client progressing on key lifts? (weight going up over sessions)
2. Which exercises are plateauing (same weight 3+ sessions)?
3. Is the exercise selection optimal for "${goalLabel}"? Would replacing any exercise yield better results?
4. Is volume (sets × reps) appropriate for the goal?

Return ONLY a JSON array of suggestions. Each item must be one of these types:

Weight/volume change:
{ "sessionId": <number>, "exIdx": <number>, "field": "weight" | "sets" | "reps", "newVal": "<value as string>", "reason": "<specific reason citing actual data and goal alignment>", "priority": "high" | "medium" }

Exercise replacement (when a better option exists for the goal):
{ "sessionId": <number>, "exIdx": <number>, "field": "replace", "newVal": "<exact exercise name from list below>", "reason": "<why this exercise is better for ${goalLabel} based on their current plateau/progress>", "priority": "high" | "medium" }

AVAILABLE EXERCISES FOR REPLACEMENT:
${AVAILABLE_EXERCISES}

Rules:
- Only suggest weight increase of 2.5–5kg if 3+ sessions show consistent performance at current weight
- Suggest exercise replacement if: (a) stalled for 4+ sessions AND (b) a clearly superior option exists for the goal
- For muscle_gain: favour compound lifts with 3–4 sets, 8–12 reps
- For strength: favour compound lifts with 3–5 sets, 3–6 reps, bigger weight jumps
- For fat_loss: favour higher reps, supersets, add cardio/conditioning exercises
- For endurance: favour higher reps, conditioning, circuit-friendly exercises
- If progress is genuinely good, return fewer or zero suggestions
- Return [] if no clear upgrades are warranted

Return ONLY a valid JSON array. No markdown, no commentary.`;

      const response = await callAI([{ role: "user", content: prompt }], "You are a JSON generator. Output ONLY a valid JSON array. No markdown, no explanation.", 6000, 0.2);
      const parsed = extractJSON(response);

      if (Array.isArray(parsed) && parsed.length > 0) {
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
        if (!newExercises[c.exIdx]) return;
        if (c.field === "replace") {
          const found = KNOWN_EXERCISES[c.newVal.toLowerCase()];
          newExercises[c.exIdx] = {
            ...newExercises[c.exIdx],
            name: found ? found.name : c.newVal,
            ...(found ? { muscles: found.muscles, equipment: found.equipment } : {}),
          };
        } else {
          newExercises[c.exIdx] = { ...newExercises[c.exIdx], [c.field]: c.newVal };
        }
      });
      return { ...session, exercises: newExercises };
    }));

    // Update most recent log entry for each weight change so next session pre-fills correctly
    const weightChanges = accepted.filter(c => c.field === "weight");
    if (weightChanges.length > 0) {
      setWorkoutLogs(prev => {
        const updated = prev.map(log => ({ ...log, exercises: log.exercises ? [...log.exercises] : [] }));
        weightChanges.forEach(c => {
          for (let i = updated.length - 1; i >= 0; i--) {
            const exIdx = updated[i].exercises.findIndex(e => e.name === c.exName);
            if (exIdx !== -1) {
              updated[i] = {
                ...updated[i],
                exercises: updated[i].exercises.map((ex, ei) =>
                  ei === exIdx ? { ...ex, sets: (ex.sets || []).map(s => ({ ...s, weight: c.newVal })) } : ex
                ),
              };
              break;
            }
          }
        });
        return updated;
      });
    }

    setShowChanges(false);
    setPendingChanges([]);
    setAiSuggestions("applied");
  };

  const fieldLabel = f => f === "weight" ? t.kg : f === "sets" ? t.sets : f === "replace" ? "Exercise" : t.reps;
  const fieldUnit = f => f === "weight" ? "kg" : "";
  const hasEnoughData = workoutLogs.length >= 3 && exNames.length >= 2;

  // Deload detection: 4+ consecutive weeks with 3+ sessions/week
  const deloadWarning = (() => {
    if (workoutLogs.length < 12) return false;
    const weekBuckets = {};
    workoutLogs.forEach(l => {
      const d = new Date(l.date);
      const week = `${d.getFullYear()}-${Math.floor((d - new Date(d.getFullYear(), 0, 1)) / 6048e5)}`;
      weekBuckets[week] = (weekBuckets[week] || 0) + 1;
    });
    const weeks = Object.values(weekBuckets).slice(-6);
    const busyWeeks = weeks.filter(c => c >= 3).length;
    return busyWeeks >= 4;
  })();

  const todayBw = bodyWeightLogs.find(l => new Date(l.date).toDateString() === new Date().toDateString());
  const logBodyWeight = () => {
    const val = parseFloat(bwInput);
    if (!val || val < 20 || val > 500) return;
    const today = new Date().toDateString();
    setBodyWeightLogs(prev => {
      const filtered = prev.filter(l => new Date(l.date).toDateString() !== today);
      return [...filtered, { date: new Date().toISOString(), weight: val }].sort((a, b) => new Date(a.date) - new Date(b.date));
    });
    setBwInput("");
    setShowBwInput(false);
  };

  return (
    <div style={{ padding: 18 }} className="slide-in">
      <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 18 }}>{t.progressStats}</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 9, marginBottom: 22 }}>
        {[[t.total, total], [t.thisWeek, week], [t.thisMonth, month]].map(([label, val]) => (
          <div key={label} style={{ background: "#111", border: "1px solid #1a1a24", borderRadius: 13, padding: "14px 8px", textAlign: "center" }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: val > 0 ? "#e63c2f" : "#2a2a3a" }}>{val > 0 ? val : "—"}</div>
            <div style={{ fontSize: 9, color: "#555", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Deload warning */}
      {deloadWarning && (
        <div style={{ background: "#1a0f00", border: "1px solid #f5a62344", borderRadius: 14, padding: "14px 16px", marginBottom: 16 }}>
          <div style={{ fontSize: 10, letterSpacing: 2, color: "#f5a623", fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>⚠️ Deload Week Recommended</div>
          <div style={{ fontSize: 13, color: "#ccc", lineHeight: 1.6 }}>You've been training hard for 4+ consecutive weeks. A deload week (50% weight, same sets) will help your body recover and come back stronger.</div>
        </div>
      )}

      {/* Body Weight Tracker */}
      {(() => {
        const bwData = bodyWeightLogs.slice(-12);
        const bwMin = bwData.length > 0 ? Math.min(...bwData.map(l => l.weight)) : 0;
        const bwMax = bwData.length > 0 ? Math.max(...bwData.map(l => l.weight)) : 0;
        const bwRange = bwMax - bwMin || 1;
        const bwFirst = bwData[0]?.weight;
        const bwLast = bwData[bwData.length - 1]?.weight;
        const bwDelta = bwData.length > 1 ? (bwLast - bwFirst).toFixed(1) : null;
        return (
          <div style={{ background: "#111", border: "1px solid #1a1a24", borderRadius: 14, padding: "14px 16px", marginBottom: 22 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: 10, letterSpacing: 2, color: "#e63c2f", fontWeight: 700, textTransform: "uppercase" }}>Body Weight</div>
                {bwLast && <div style={{ fontSize: 22, fontWeight: 800, marginTop: 2 }}>{bwLast} <span style={{ fontSize: 13, color: "#555" }}>kg</span></div>}
                {bwDelta !== null && <div style={{ fontSize: 11, color: +bwDelta < 0 ? "#4ade80" : +bwDelta > 0 ? "#f5a623" : "#555", fontWeight: 700 }}>{+bwDelta > 0 ? "+" : ""}{bwDelta} kg total</div>}
              </div>
              <button onClick={() => { setBwInput(todayBw ? String(todayBw.weight) : ""); setShowBwInput(s => !s); }} className="gym-btn"
                style={{ background: "#e63c2f1a", border: "1px solid #e63c2f33", borderRadius: 10, padding: "8px 14px", color: "#e63c2f", fontWeight: 700, fontSize: 13, minHeight: 40 }}>
                {todayBw ? "Update" : "+ Log"}
              </button>
            </div>
            {showBwInput && (
              <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                <input type="number" value={bwInput} onChange={e => setBwInput(e.target.value)} placeholder="e.g. 82.5" autoFocus
                  style={{ flex: 1, background: "#0a0a0f", border: "1px solid #2a2a3a", borderRadius: 10, padding: "10px 14px", color: "#e8e4dc", fontSize: 15, minHeight: 44 }} />
                <button onClick={logBodyWeight} className="gym-btn"
                  style={{ background: "#e63c2f", border: "none", borderRadius: 10, padding: "10px 18px", color: "#fff", fontWeight: 800, fontSize: 14, minHeight: 44 }}>Save</button>
              </div>
            )}
            {bwData.length > 1 ? (
              <div style={{ display: "flex", gap: 3, alignItems: "flex-end", height: 44 }}>
                {bwData.map((l, i) => {
                  const pct = (l.weight - bwMin) / bwRange;
                  const h = Math.max(4, Math.round(4 + pct * 40));
                  return (
                    <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                      <div style={{ width: "100%", background: "#e63c2f", borderRadius: 3, height: h, opacity: 0.5 + pct * 0.5 }} />
                      <div style={{ fontSize: 7, color: "#444" }}>{new Date(l.date).toLocaleDateString(undefined, { month: "numeric", day: "numeric" })}</div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ fontSize: 12, color: "#555", textAlign: "center", padding: "10px 0" }}>
                {bwData.length === 0 ? "Log your weight daily to track progress" : "Log one more entry to see your trend"}
              </div>
            )}
          </div>
        );
      })()}

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
          <div style={{ marginTop: 22, display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, color: "#e63c2f", textTransform: "uppercase" }}>{t.recentSessions}</div>
            <div style={{ display: "flex", gap: 5 }}>
              {[["all", t.filterAll], ["week", t.filterWeek], ["month", t.filterMonth]].map(([key, label]) => (
                <button key={key} onClick={() => setLogFilter(key)} style={{ background: logFilter === key ? "#e63c2f" : "#1a1a24", border: `1px solid ${logFilter === key ? "#e63c2f" : "#2a2a3a"}`, borderRadius: 7, padding: "5px 10px", color: logFilter === key ? "#fff" : "#555", fontSize: 11, fontWeight: 700 }}>{label}</button>
              ))}
            </div>
          </div>
          {[...workoutLogs].reverse().filter(log => {
            if (logFilter === "week") return new Date(log.date) > new Date(Date.now() - 7 * 864e5);
            if (logFilter === "month") return new Date(log.date) > new Date(Date.now() - 30 * 864e5);
            return true;
          }).map(log => {
            const completedSets = log.exercises?.reduce((s, ex) => s + (ex.sets?.filter(st => st.done)?.length || 0), 0) || 0;
            const totalSets = log.exercises?.reduce((s, ex) => s + (ex.sets?.length || 0), 0) || 0;
            return (
              <div key={log.id} role="button" tabIndex={0} onClick={() => setSelectedLog(log)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSelectedLog(log); } }}
                className="gym-btn" style={{ width: "100%", background: "#111", border: "1px solid #1a1a24", borderRadius: 13, padding: "14px 16px", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center", color: "#e8e4dc", minHeight: 64, textAlign: "left", cursor: "pointer" }}>
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
              </div>
            );
          })}
          {/* Undo toast */}
          {pendingLogDelete && (
            <div style={{ position: "fixed", bottom: "calc(80px + env(safe-area-inset-bottom, 0px))", left: "50%", transform: "translateX(-50%)", background: "#1a1a24", border: "1px solid #2a2a3a", borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", gap: 14, zIndex: 400, boxShadow: "0 4px 24px rgba(0,0,0,0.6)", whiteSpace: "nowrap" }}>
              <span style={{ fontSize: 13, color: "#888" }}>Log deleted</span>
              <button onClick={undoDeleteLog} style={{ background: "#e63c2f1a", border: "1px solid #e63c2f44", borderRadius: 8, padding: "6px 14px", color: "#e63c2f", fontWeight: 800, fontSize: 13 }}>{t.undoDelete}</button>
            </div>
          )}
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

function MacroBar({ protein, carbs, fat }) {
  const total = protein + carbs + fat;
  if (total === 0) return null;
  const pPct = (protein / total) * 100;
  const cPct = (carbs / total) * 100;
  const fPct = (fat / total) * 100;
  return (
    <div style={{ marginTop: 14 }}>
      <div style={{ display: "flex", borderRadius: 6, overflow: "hidden", height: 8, marginBottom: 6 }}>
        <div style={{ width: `${pPct}%`, background: "#e63c2f", transition: "width 0.5s" }} />
        <div style={{ width: `${cPct}%`, background: "#f5a623", transition: "width 0.5s" }} />
        <div style={{ width: `${fPct}%`, background: "#60a5fa", transition: "width 0.5s" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {[["Protein", protein, "#e63c2f"], ["Carbs", carbs, "#f5a623"], ["Fat", fat, "#60a5fa"]].map(([label, val, color]) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 7, height: 7, borderRadius: 2, background: color, flexShrink: 0 }} />
            <span style={{ fontSize: 10, color: "#555" }}>{label} <span style={{ color, fontWeight: 700 }}>{Math.round(val)}g</span></span>
          </div>
        ))}
      </div>
    </div>
  );
}

function WeeklyHeatmap({ nutritionLogs, target, calTarget }) {
  const [mode, setMode] = useState("protein"); // "protein" | "calories"
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d;
  });
  const isCalMode = mode === "calories";
  const barTarget = isCalMode ? (calTarget || 2000) : target;
  const barColor = isCalMode ? "#f5a623" : "#e63c2f";
  return (
    <div style={{ background: "#111", border: "1px solid #1a1a24", borderRadius: 13, padding: "12px 14px", marginTop: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ fontSize: 10, letterSpacing: 2, color: isCalMode ? "#f5a623" : "#e63c2f", fontWeight: 700, textTransform: "uppercase" }}>7-Day {isCalMode ? "Calories" : "Protein"}</div>
        <div style={{ display: "flex", gap: 5 }}>
          {[["protein", "Protein"], ["calories", "Calories"]].map(([key, label]) => (
            <button key={key} onClick={() => setMode(key)} style={{ background: mode === key ? (key === "calories" ? "#f5a6231a" : "#e63c2f1a") : "#1a1a24", border: `1px solid ${mode === key ? (key === "calories" ? "#f5a62344" : "#e63c2f44") : "#2a2a3a"}`, borderRadius: 6, padding: "3px 9px", color: mode === key ? (key === "calories" ? "#f5a623" : "#e63c2f") : "#555", fontSize: 10, fontWeight: 700 }}>{label}</button>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", gap: 5 }}>
        {days.map((d, i) => {
          const ds = d.toDateString();
          const dayLogs = nutritionLogs.filter(l => new Date(l.date).toDateString() === ds);
          const total = dayLogs.reduce((s, l) => s + (isCalMode ? (l.calories || 0) : (l.protein || 0)), 0);
          const pct = barTarget > 0 ? Math.min(1, total / barTarget) : 0;
          const isToday = ds === new Date().toDateString();
          const hasData = dayLogs.length > 0;
          const hit = total >= barTarget;
          return (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{ fontSize: 8, color: isToday ? "#e8e4dc" : "#444", fontWeight: isToday ? 700 : 400 }}>
                {d.toLocaleDateString(undefined, { weekday: "narrow" })}
              </div>
              <div style={{ width: "100%", height: 36, background: "#0a0a0f", borderRadius: 6, overflow: "hidden", display: "flex", alignItems: "flex-end", border: isToday ? `1px solid ${barColor}44` : "1px solid #1a1a24" }}>
                {hasData && (
                  <div style={{ width: "100%", height: `${Math.max(8, pct * 100)}%`, background: hit ? "#4ade80" : barColor, borderRadius: "4px 4px 0 0", transition: "height 0.4s" }} />
                )}
              </div>
              <div style={{ fontSize: 8, color: hasData ? (hit ? "#4ade80" : barColor) : "#333", fontWeight: 700 }}>
                {hasData ? (isCalMode ? `${total}` : `${total}g`) : "—"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AddFoodModal({ onAdd, onClose, t }) {
  const [search, setSearch] = useState("");
  const [custom, setCustom] = useState({ name: "", protein: "", calories: "", carbs: "", fat: "" });
  const [qty, setQty] = useState("1");
  const [selectedFood, setSelectedFood] = useState(null);
  const [tab, setTab] = useState("quick"); // "quick" | "custom"

  const searchLower = search.toLowerCase().trim();
  const filtered = searchLower
    ? COMMON_FOODS.filter(f => f.name.toLowerCase().includes(searchLower))
    : COMMON_FOODS;

  const handleSelectFood = (f) => { setSelectedFood(f); setQty("1"); };

  const handleAdd = () => {
    const q = Math.max(0.1, parseFloat(qty) || 1);
    if (selectedFood) {
      onAdd({
        name: q !== 1 ? `${selectedFood.name} ×${q}` : selectedFood.name,
        protein:  Math.round(selectedFood.protein  * q * 10) / 10,
        calories: Math.round(selectedFood.calories * q),
        carbs:    Math.round((selectedFood.carbs || 0) * q * 10) / 10,
        fat:      Math.round((selectedFood.fat   || 0) * q * 10) / 10,
      });
    }
  };

  const handleAddCustom = () => {
    if (!custom.name || !custom.protein) return;
    const q = Math.max(0.1, parseFloat(qty) || 1);
    onAdd({
      name: q !== 1 ? `${custom.name} ×${q}` : custom.name,
      protein:  Math.round(+custom.protein  * q * 10) / 10,
      calories: Math.round(+custom.calories * q),
      carbs:    Math.round(+custom.carbs    * q * 10) / 10,
      fat:      Math.round(+custom.fat      * q * 10) / 10,
    });
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 200, display: "flex", alignItems: "flex-end" }}>
      <div style={{ background: "#0f0f1a", borderRadius: "18px 18px 0 0", paddingTop: 20, paddingLeft: 20, paddingRight: 20, paddingBottom: "calc(20px + env(safe-area-inset-bottom, 0px))", width: "100%", maxHeight: "88vh", overflow: "auto", WebkitOverflowScrolling: "touch" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ fontWeight: 800, fontSize: 18 }}>{t.addFood}</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#666" }}><Icon name="close" /></button>
        </div>

        {/* Tabs */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 14 }}>
          {[["quick", t.quickAdd], ["custom", t.custom]].map(([id, label]) => (
            <button key={id} onClick={() => { setTab(id); setSelectedFood(null); }}
              style={{ background: tab === id ? "#e63c2f" : "#111", border: `1px solid ${tab === id ? "#e63c2f" : "#2a2a3a"}`, borderRadius: 9, padding: "10px", fontWeight: 700, fontSize: 13, color: tab === id ? "#fff" : "#666" }}>
              {label}
            </button>
          ))}
        </div>

        {tab === "quick" && !selectedFood && (
          <>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search foods..."
              style={{ width: "100%", background: "#111", border: "1px solid #2a2a3a", borderRadius: 10, padding: "11px 14px", color: "#e8e4dc", fontSize: 15, marginBottom: 10, outline: "none" }} />
            {filtered.map(f => (
              <button key={f.name} onClick={() => handleSelectFood(f)}
                style={{ display: "flex", width: "100%", justifyContent: "space-between", background: "#111", border: "1px solid #1a1a24", borderRadius: 9, padding: "10px 13px", marginBottom: 5, color: "#e8e4dc", alignItems: "center" }}>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{f.name}</div>
                  <div style={{ fontSize: 10, color: "#555", marginTop: 2 }}>
                    {f.calories} kcal · <span style={{ color: "#e63c2f" }}>{f.protein}g P</span>
                    {f.carbs ? ` · ${f.carbs}g C` : ""}{f.fat ? ` · ${f.fat}g F` : ""}
                  </div>
                </div>
                <span style={{ color: "#444", fontSize: 18 }}>›</span>
              </button>
            ))}
          </>
        )}

        {tab === "quick" && selectedFood && (
          <>
            <button onClick={() => setSelectedFood(null)} style={{ background: "none", border: "none", color: "#e63c2f", fontSize: 13, fontWeight: 700, marginBottom: 12, padding: 0 }}>← Back</button>
            <div style={{ background: "#111", border: "1px solid #1a1a24", borderRadius: 12, padding: "14px 16px", marginBottom: 14 }}>
              <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 4 }}>{selectedFood.name}</div>
              <div style={{ fontSize: 11, color: "#555" }}>Per serving · {selectedFood.calories} kcal · {selectedFood.protein}g protein</div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 10, letterSpacing: 2, color: "#e63c2f", fontWeight: 700, textTransform: "uppercase", marginBottom: 6 }}>Quantity / Servings</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <button onClick={() => setQty(q => String(Math.max(0.5, parseFloat(q || 1) - 0.5)))}
                  style={{ background: "#1a1a24", border: "1px solid #2a2a3a", borderRadius: 8, width: 44, height: 44, color: "#e8e4dc", fontSize: 20, fontWeight: 700, flexShrink: 0 }}>−</button>
                <input value={qty} onChange={e => setQty(e.target.value)} inputMode="decimal"
                  style={{ flex: 1, background: "#111", border: "1px solid #2a2a3a", borderRadius: 9, padding: "10px", color: "#e8e4dc", fontSize: 20, fontWeight: 800, textAlign: "center", minHeight: 44 }} />
                <button onClick={() => setQty(q => String(parseFloat(q || 1) + 0.5))}
                  style={{ background: "#1a1a24", border: "1px solid #2a2a3a", borderRadius: 8, width: 44, height: 44, color: "#e8e4dc", fontSize: 20, fontWeight: 700, flexShrink: 0 }}>+</button>
              </div>
            </div>

            {/* Preview scaled macros */}
            {(() => {
              const q = Math.max(0.1, parseFloat(qty) || 1);
              const p = Math.round(selectedFood.protein * q * 10) / 10;
              const cal = Math.round(selectedFood.calories * q);
              const c = Math.round((selectedFood.carbs || 0) * q * 10) / 10;
              const f = Math.round((selectedFood.fat || 0) * q * 10) / 10;
              return (
                <div style={{ background: "#0a0a0f", border: "1px solid #1a1a24", borderRadius: 10, padding: "12px 14px", marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-around", marginBottom: 8 }}>
                    {[["Protein", p + "g", "#e63c2f"], ["Calories", cal + "", "#f5a623"], ["Carbs", c + "g", "#f5a623"], ["Fat", f + "g", "#60a5fa"]].map(([label, val, color]) => (
                      <div key={label} style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 16, fontWeight: 800, color }}>{val}</div>
                        <div style={{ fontSize: 9, color: "#555", textTransform: "uppercase", letterSpacing: 1 }}>{label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
            <button onClick={handleAdd} className="gym-btn"
              style={{ width: "100%", background: "#e63c2f", border: "none", borderRadius: 11, padding: "14px", fontWeight: 800, fontSize: 15, color: "#fff", minHeight: 52 }}>
              + {t.addFood}
            </button>
          </>
        )}

        {tab === "custom" && (
          <>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 10, letterSpacing: 2, color: "#e63c2f", fontWeight: 700, textTransform: "uppercase", marginBottom: 6 }}>Quantity / Servings</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <button onClick={() => setQty(q => String(Math.max(0.5, parseFloat(q || 1) - 0.5)))}
                  style={{ background: "#1a1a24", border: "1px solid #2a2a3a", borderRadius: 8, width: 44, height: 44, color: "#e8e4dc", fontSize: 20, fontWeight: 700, flexShrink: 0 }}>−</button>
                <input value={qty} onChange={e => setQty(e.target.value)} inputMode="decimal"
                  style={{ flex: 1, background: "#111", border: "1px solid #2a2a3a", borderRadius: 9, padding: "10px", color: "#e8e4dc", fontSize: 20, fontWeight: 800, textAlign: "center", minHeight: 44 }} />
                <button onClick={() => setQty(q => String(parseFloat(q || 1) + 0.5))}
                  style={{ background: "#1a1a24", border: "1px solid #2a2a3a", borderRadius: 8, width: 44, height: 44, color: "#e8e4dc", fontSize: 20, fontWeight: 700, flexShrink: 0 }}>+</button>
              </div>
            </div>
            {[["name", t.foodName, "text"], ["protein", t.proteinG, "decimal"], ["calories", t.caloriesLabel, "decimal"], ["carbs", t.carbsG, "decimal"], ["fat", t.fatG, "decimal"]].map(([f, label, mode]) => (
              <div key={f} style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 10, color: "#555", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>{label}</div>
                <input value={custom[f]} onChange={e => setCustom(c => ({ ...c, [f]: e.target.value }))}
                  inputMode={mode} type={mode === "text" ? "text" : "number"}
                  style={{ width: "100%", background: "#111", border: "1px solid #2a2a3a", borderRadius: 9, padding: "11px 13px", color: "#e8e4dc", fontSize: 15, minHeight: 44 }} />
              </div>
            ))}
            <button onClick={handleAddCustom} disabled={!custom.name || !custom.protein} className="gym-btn"
              style={{ width: "100%", background: custom.name && custom.protein ? "#e63c2f" : "#333", border: "none", borderRadius: 11, padding: "14px", fontWeight: 800, fontSize: 15, color: "#fff", minHeight: 52, marginTop: 6, opacity: custom.name && custom.protein ? 1 : 0.5 }}>
              + {t.addFood}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function NutritionTab({ nutritionLogs, setNutritionLogs, profile, workoutLogs, t }) {
  const today = new Date().toDateString();
  const todayLogs = nutritionLogs.filter(l => new Date(l.date).toDateString() === today);
  const totalProtein  = todayLogs.reduce((s, l) => s + (l.protein  || 0), 0);
  const totalCals     = todayLogs.reduce((s, l) => s + (l.calories || 0), 0);
  const totalCarbs    = todayLogs.reduce((s, l) => s + (l.carbs    || 0), 0);
  const totalFat      = todayLogs.reduce((s, l) => s + (l.fat      || 0), 0);
  const [showAdd, setShowAdd] = useState(false);
  const target = profile.proteinTarget || 150;
  const calTarget = Math.round((target * 4) + (totalCarbs * 4) + (totalFat * 9)) || 2000; // rough estimate
  const proteinPct = Math.min(100, (totalProtein / target) * 100);
  const calPct     = Math.min(100, (totalCals / calTarget) * 100);
  const todayWorkout = workoutLogs.find(l => new Date(l.date).toDateString() === today);

  const [pendingFoodDelete, setPendingFoodDelete] = useState(null);

  const addFood = f => {
    setNutritionLogs(p => [...p, { ...f, date: new Date().toISOString(), id: Date.now() }]);
    setShowAdd(false);
  };
  const deleteFood = id => {
    const item = nutritionLogs.find(l => l.id === id);
    if (!item) return;
    setNutritionLogs(p => p.filter(l => l.id !== id));
    if (pendingFoodDelete?.timer) clearTimeout(pendingFoodDelete.timer);
    const timer = setTimeout(() => setPendingFoodDelete(null), 4000);
    setPendingFoodDelete({ item, timer });
  };
  const undoDeleteFood = () => {
    if (!pendingFoodDelete) return;
    clearTimeout(pendingFoodDelete.timer);
    setNutritionLogs(p => [...p, pendingFoodDelete.item].sort((a, b) => new Date(a.date) - new Date(b.date)));
    setPendingFoodDelete(null);
  };

  // Group today's logs into meal buckets by hour
  const mealBuckets = { Morning: [], Afternoon: [], Evening: [] };
  todayLogs.forEach(l => {
    const h = new Date(l.date).getHours();
    if (h < 12) mealBuckets.Morning.push(l);
    else if (h < 17) mealBuckets.Afternoon.push(l);
    else mealBuckets.Evening.push(l);
  });

  const Ring = ({ pct, color, value, label, sub, size = 100 }) => {
    const r = size * 0.38, circ = 2 * Math.PI * r, cx = size / 2, cy = size / 2;
    return (
      <div style={{ textAlign: "center" }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1a1a24" strokeWidth={size * 0.1} />
          <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={size * 0.1}
            strokeDasharray={circ} strokeDashoffset={circ * (1 - pct / 100)}
            strokeLinecap="round" transform={`rotate(-90 ${cx} ${cy})`}
            style={{ transition: "stroke-dashoffset 0.5s ease" }} />
          <text x={cx} y={cy - 4} textAnchor="middle" fill="#e8e4dc" fontSize={size * 0.18} fontWeight="800" fontFamily="Syne">{value}</text>
          <text x={cx} y={cy + size * 0.13} textAnchor="middle" fill="#555" fontSize={size * 0.1} fontFamily="Syne">{sub}</text>
        </svg>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#888", marginTop: 2 }}>{label}</div>
      </div>
    );
  };

  return (
    <div style={{ padding: 18 }} className="slide-in">
      <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 3 }}>{t.nutritionTitle}</div>
      <div style={{ color: "#555", fontSize: 12, marginBottom: 14 }}>
        {new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
      </div>

      {/* Dual rings + macro bar */}
      <div style={{ background: "#111", border: "1px solid #1a1a24", borderRadius: 18, padding: "18px 16px", marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", marginBottom: 12 }}>
          <Ring pct={proteinPct} color="#e63c2f" value={totalProtein + "g"} label="Protein" sub={`/ ${target}g`} size={110} />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 11, color: "#555", fontWeight: 700, marginBottom: 8 }}>remaining</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: Math.max(0, target - totalProtein) === 0 ? "#4ade80" : "#e63c2f" }}>
              {Math.max(0, target - totalProtein)}g
            </div>
            <div style={{ fontSize: 10, color: "#555", marginTop: 4 }}>protein left</div>
            {todayWorkout && <div style={{ marginTop: 8, background: "#e63c2f1a", border: "1px solid #e63c2f33", borderRadius: 6, padding: "4px 8px", fontSize: 10, color: "#e63c2f", fontWeight: 700 }}>🏋️ Training day</div>}
          </div>
          <Ring pct={calPct} color="#f5a623" value={totalCals} label="Calories" sub="kcal" size={110} />
        </div>
        <MacroBar protein={totalProtein} carbs={totalCarbs} fat={totalFat} />
      </div>

      {/* Log food button */}
      <button onClick={() => setShowAdd(true)} className="gym-btn"
        style={{ width: "100%", background: "#e63c2f1a", border: "1px solid #e63c2f33", borderRadius: 11, padding: "12px", color: "#e63c2f", fontWeight: 700, marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, minHeight: 48 }}>
        <Icon name="plus" size={15} /> {t.logFood}
      </button>

      {/* Meal buckets */}
      {todayLogs.length === 0 ? (
        <div style={{ color: "#555", fontSize: 13, textAlign: "center", padding: "20px 0" }}>{t.nothingLogged}</div>
      ) : (
        <>
          <div style={{ fontSize: 11, color: "#444", marginBottom: 10 }}>{t.swipeToRemove}</div>
          {Object.entries(mealBuckets).map(([meal, items]) => {
            if (items.length === 0) return null;
            const mealProtein = items.reduce((s, l) => s + (l.protein || 0), 0);
            return (
              <div key={meal} style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
                  <div style={{ fontSize: 10, letterSpacing: 2, color: "#e63c2f", fontWeight: 700, textTransform: "uppercase" }}>
                    {meal === "Morning" ? "🌅" : meal === "Afternoon" ? "☀️" : "🌙"} {meal}
                  </div>
                  <div style={{ fontSize: 11, color: "#e63c2f", fontWeight: 700 }}>{Math.round(mealProtein)}g protein</div>
                </div>
                {items.map(l => (
                  <SwipeableFoodCard key={l.id} item={l} onDelete={() => deleteFood(l.id)} />
                ))}
              </div>
            );
          })}
        </>
      )}

      {/* Weekly summary */}
      {(() => {
        const days7 = Array.from({ length: 7 }, (_, i) => {
          const d = new Date(); d.setDate(d.getDate() - i); return d.toDateString();
        });
        const weekDayLogs = days7.map(ds => nutritionLogs.filter(l => new Date(l.date).toDateString() === ds));
        const daysLogged = weekDayLogs.filter(dl => dl.length > 0).length;
        const avgProtein = daysLogged > 0 ? Math.round(weekDayLogs.reduce((s, dl) => s + dl.reduce((a, l) => a + (l.protein || 0), 0), 0) / daysLogged) : 0;
        const avgCals = daysLogged > 0 ? Math.round(weekDayLogs.reduce((s, dl) => s + dl.reduce((a, l) => a + (l.calories || 0), 0), 0) / daysLogged) : 0;
        const daysHitProtein = weekDayLogs.filter(dl => dl.reduce((s, l) => s + (l.protein || 0), 0) >= target).length;
        if (daysLogged === 0) return null;
        return (
          <div style={{ background: "#111", border: "1px solid #1a1a24", borderRadius: 14, padding: "14px 16px", marginBottom: 14, marginTop: 4 }}>
            <div style={{ fontSize: 10, letterSpacing: 2, color: "#e63c2f", fontWeight: 700, textTransform: "uppercase", marginBottom: 12 }}>This Week</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: avgProtein >= target ? "#4ade80" : "#e63c2f" }}>{avgProtein}g</div>
                <div style={{ fontSize: 9, color: "#555", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginTop: 3 }}>Avg Protein</div>
                <div style={{ fontSize: 10, color: "#444", marginTop: 2 }}>target {target}g</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#f5a623" }}>{avgCals}</div>
                <div style={{ fontSize: 9, color: "#555", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginTop: 3 }}>Avg Kcal</div>
                <div style={{ fontSize: 10, color: "#444", marginTop: 2 }}>{daysLogged} days tracked</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: daysHitProtein >= 5 ? "#4ade80" : daysHitProtein >= 3 ? "#f5a623" : "#e63c2f" }}>{daysHitProtein}/7</div>
                <div style={{ fontSize: 9, color: "#555", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginTop: 3 }}>Protein Goal</div>
                <div style={{ fontSize: 10, color: "#444", marginTop: 2 }}>days hit</div>
              </div>
            </div>
            {/* Mini 7-day protein bar chart */}
            <div style={{ display: "flex", gap: 4, alignItems: "flex-end", height: 36, marginTop: 14 }}>
              {[...days7].reverse().map((ds, i) => {
                const dl = nutritionLogs.filter(l => new Date(l.date).toDateString() === ds);
                const p = dl.reduce((s, l) => s + (l.protein || 0), 0);
                const pct = Math.min(1, p / target);
                const label = new Date(ds).toLocaleDateString(undefined, { weekday: "narrow" });
                return (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                    <div style={{ width: "100%", background: p >= target ? "#4ade8033" : "#1a1a24", borderRadius: 4, height: Math.max(3, Math.round(pct * 30)), border: p >= target ? "1px solid #4ade8066" : "none", alignSelf: "flex-end" }} />
                    <div style={{ fontSize: 8, color: "#444", letterSpacing: 0.5 }}>{label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}
      {/* Weekly heatmap */}
      <WeeklyHeatmap nutritionLogs={nutritionLogs} target={target} calTarget={calTarget} />
      {/* Food delete undo toast */}
      {pendingFoodDelete && (
        <div style={{ position: "fixed", bottom: "calc(80px + env(safe-area-inset-bottom, 0px))", left: "50%", transform: "translateX(-50%)", background: "#1a1a24", border: "1px solid #2a2a3a", borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", gap: 14, zIndex: 400, boxShadow: "0 4px 24px rgba(0,0,0,0.6)", whiteSpace: "nowrap" }}>
          <span style={{ fontSize: 13, color: "#888" }}>{pendingFoodDelete.item.name} removed</span>
          <button onClick={undoDeleteFood} style={{ background: "#e63c2f1a", border: "1px solid #e63c2f44", borderRadius: 8, padding: "6px 14px", color: "#e63c2f", fontWeight: 800, fontSize: 13 }}>{t.undoDelete}</button>
        </div>
      )}
      <div style={{ height: 20 }} />

      {showAdd && <AddFoodModal onAdd={addFood} onClose={() => setShowAdd(false)} t={t} />}
    </div>
  );
}

function MyExercisesTab({ customExercises, setCustomExercises, t }) {
  const [showCreate, setShowCreate] = useState(false);
  const [showDemo, setShowDemo] = useState(null);

  const muscleColors = {
    chest: "#e63c2f", back: "#e63c2f", shoulders: "#f5a623", biceps: "#4ade80",
    triceps: "#4ade80", quads: "#60a5fa", hamstrings: "#60a5fa", glutes: "#a78bfa",
    calves: "#60a5fa", core: "#f5a623", abs: "#f5a623", other: "#555",
  };

  return (
    <div style={{ padding: 18 }} className="slide-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 800 }}>{t.customExercises}</div>
          <div style={{ color: "#555", fontSize: 12, marginTop: 2 }}>
            {customExercises.length} exercise{customExercises.length !== 1 ? "s" : ""} created
          </div>
        </div>
        <button onClick={() => setShowCreate(true)} className="gym-btn"
          style={{ background: "#e63c2f", border: "none", borderRadius: 11, padding: "10px 16px", color: "#fff", fontWeight: 700, display: "flex", alignItems: "center", gap: 5, fontSize: 14, minHeight: 44 }}>
          <Icon name="plus" size={15} /> {t.createExercise}
        </button>
      </div>

      {/* Built-in exercise browser */}
      <div style={{ background: "#111", border: "1px solid #1a1a24", borderRadius: 14, padding: "12px 14px", marginBottom: 18 }}>
        <div style={{ fontSize: 10, letterSpacing: 2, color: "#e63c2f", fontWeight: 700, textTransform: "uppercase", marginBottom: 12 }}>Built-in Library</div>
        {Object.entries(EXERCISE_DB).map(([cat, exs]) => (
          <div key={cat} style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 10, color: "#555", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>{cat}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {exs.map(ex => (
                <button key={ex.name} onClick={() => setShowDemo(ex)}
                  style={{ background: "#0a0a0f", border: "1px solid #1a1a24", borderRadius: 8, padding: "5px 10px", color: "#bbb", fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}>
                  {IMAGE_MAP[ex.name] ? "📷" : "📋"} {ex.name}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Custom exercises */}
      <div style={{ fontSize: 10, letterSpacing: 2, color: "#e63c2f", fontWeight: 700, textTransform: "uppercase", marginBottom: 12 }}>My Custom Exercises</div>

      {customExercises.length === 0 ? (
        <div style={{ background: "#111", border: "1px dashed #252535", borderRadius: 14, padding: "36px 20px", textAlign: "center" }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>✏️</div>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{t.noCustomExercises}</div>
          <div style={{ color: "#555", fontSize: 13 }}>Tap "+ {t.createExercise}" to add your own movements</div>
        </div>
      ) : (
        customExercises.map(ex => (
          <div key={ex.id} style={{ background: "#111", border: "1px solid #1a1a24", borderRadius: 13, padding: "14px 16px", marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 6 }}>{ex.name}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 6 }}>
                  {ex.muscles?.map(m => (
                    <span key={m} style={{ background: `${muscleColors[m] || "#555"}22`, border: `1px solid ${muscleColors[m] || "#555"}44`, borderRadius: 5, padding: "2px 8px", fontSize: 10, color: muscleColors[m] || "#888", fontWeight: 700, textTransform: "capitalize" }}>{m}</span>
                  ))}
                </div>
                <span style={{ background: "#1a1a24", borderRadius: 5, padding: "2px 8px", fontSize: 10, color: "#555", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>{ex.equipment}</span>
              </div>
              <button onClick={() => setCustomExercises(p => p.filter(e => e.id !== ex.id))}
                style={{ background: "none", border: "none", color: "#333", padding: 6, marginLeft: 8 }}>
                <Icon name="trash" size={16} />
              </button>
            </div>
          </div>
        ))
      )}

      {showCreate && (
        <CreateExerciseModal
          onSave={ex => { setCustomExercises(p => [...p, ex]); setShowCreate(false); }}
          onClose={() => setShowCreate(false)}
          t={t}
        />
      )}
      {showDemo && <ExerciseDemo exercise={showDemo} onClose={() => setShowDemo(null)} t={t} />}
    </div>
  );
}

function PhotosTab({ photos, setPhotos, t }) {
  const [analyzing, setAnalyzing] = useState(false);
  const [selPhoto, setSelPhoto] = useState(null);
  const [compareMode, setCompareMode] = useState(false);
  const [compareA, setCompareA] = useState(null);
  const [compareB, setCompareB] = useState(null);
  const [compareAnalysis, setCompareAnalysis] = useState(null);
  const [compareLoading, setCompareLoading] = useState(false);
  const [compareError, setCompareError] = useState(null);
  const fileRef = useRef();

  // Reset comparison result when the user picks different photos or closes the modal.
  useEffect(() => {
    setCompareAnalysis(null);
    setCompareError(null);
  }, [compareA?.id, compareB?.id, compareMode]);

  const analyzeComparison = async () => {
    if (!compareA || !compareB) return;
    setCompareLoading(true);
    setCompareError(null);
    setCompareAnalysis(null);
    try {
      const days = Math.round((new Date(compareB.date) - new Date(compareA.date)) / 864e5);
      const prompt = `You are reviewing two progress photos taken ${days} days apart. The first image is "before", the second is "after". Give a direct, specific comparison in 4-6 sentences. Call out: visible changes in muscle size/definition, body composition shifts, posture, and one clear focus area going forward. Be honest — if changes are minimal, say so. No fluff, no hedging.`;
      const text = await callAIVisionMulti([compareA, compareB], prompt);
      setCompareAnalysis(text.trim());
    } catch (e) {
      setCompareError(e.message || "Comparison failed. Please try again.");
    }
    setCompareLoading(false);
  };

  const handleUpload = async e => {
    const file = e.target.files[0]; if (!file) return;
    e.target.value = "";
    try {
      const dataUrl = await downscaleImage(file, 1280, 0.82);
      setPhotos(p => [...p, { id: Date.now(), date: new Date().toISOString(), dataUrl, analyses: [] }]);
    } catch (err) {
      // Fallback: store original if canvas re-encode fails
      const r = new FileReader();
      r.onload = ev => setPhotos(p => [...p, { id: Date.now(), date: new Date().toISOString(), dataUrl: ev.target.result, analyses: [] }]);
      r.readAsDataURL(file);
    }
  };

  const analyzePhoto = async (photo) => {
    setAnalyzing(true);
    const updated = { ...photo };
    try {
      const base64 = photo.dataUrl.split(",")[1], mediaType = photo.dataUrl.split(";")[0].split(":")[1];
      const result = await callAIVision(base64, mediaType, "Analyze this gym progress photo in 3-4 sentences max. Note: visible muscle development, posture, strongest areas, one key area to improve, one specific recommendation. Be direct and concise.");
      const analysis = { date: new Date().toISOString(), text: result };
      updated.analyses = [...(photo.analyses || []), analysis];
      setPhotos(p => p.map(x => x.id === photo.id ? updated : x));
      setSelPhoto(updated);
    } catch (e) {
      setSelPhoto({ ...photo, _error: "Analysis failed. Please try again." });
    }
    setAnalyzing(false);
  };

  const openPhoto = (photo) => setSelPhoto(photo);

  return (
    <div style={{ padding: 18 }} className="slide-in">
      <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 5 }}>{t.progressPhotos}</div>
      <div style={{ color: "#555", fontSize: 12, marginBottom: 16 }}>{t.trackVisual}</div>
      <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
        <button onClick={() => fileRef.current.click()} className="gym-btn" style={{ flex: 1, background: "#111", border: "2px dashed #252535", borderRadius: 13, padding: 18, color: "#555", fontWeight: 700, display: "flex", flexDirection: "column", alignItems: "center", gap: 5, minHeight: 80 }}>
          <Icon name="camera" size={24} /><span style={{ fontSize: 13 }}>{t.uploadPhoto}</span>
        </button>
        {photos.length >= 2 && (
          <button onClick={() => { setCompareMode(true); setCompareA([...photos].reverse()[0]); setCompareB([...photos].reverse()[1]); }} className="gym-btn"
            style={{ background: "#1a1a24", border: "1px solid #2a2a3a", borderRadius: 13, padding: "18px 14px", color: "#888", fontWeight: 700, fontSize: 13, display: "flex", flexDirection: "column", alignItems: "center", gap: 5, minHeight: 80 }}>
            <span style={{ fontSize: 20 }}>⟺</span>
            <span>Compare</span>
          </button>
        )}
      </div>
      <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} style={{ display: "none" }} />
      {photos.length === 0 ? <div style={{ textAlign: "center", color: "#555", fontSize: 13 }}>{t.noPhotos}</div> : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[...photos].reverse().map(photo => {
            const latestAnalysis = (photo.analyses || []).slice(-1)[0];
            return (
              <div key={photo.id} style={{ borderRadius: 11, overflow: "hidden", position: "relative", aspectRatio: "3/4", cursor: "pointer" }} onClick={() => openPhoto(photo)}>
                <img src={photo.dataUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 50%)", display: "flex", alignItems: "flex-end", padding: 9 }}>
                  <div style={{ width: "100%" }}>
                    <div style={{ fontSize: 10, color: "#bbb" }}>{new Date(photo.date).toLocaleDateString()}</div>
                    {latestAnalysis
                      ? <div style={{ fontSize: 10, color: "#4ade80", fontWeight: 700 }}>✓ {t.photoAnalysis}</div>
                      : <div style={{ fontSize: 10, color: "#e63c2f", fontWeight: 700 }}>{t.noAnalysisYet}</div>}
                  </div>
                </div>
                <button onClick={e => { e.stopPropagation(); setPhotos(p => p.filter(x => x.id !== photo.id)); }} style={{ position: "absolute", top: 7, right: 7, background: "rgba(0,0,0,0.6)", border: "none", borderRadius: 5, padding: 4, color: "#fff" }}><Icon name="trash" size={13} /></button>
              </div>
            );
          })}
        </div>
      )}

      {/* Photo detail modal */}
      {selPhoto && (
        <div style={{ position: "fixed", inset: 0, background: "#0a0a0f", zIndex: 200, display: "flex", flexDirection: "column" }}>
          <div style={{ flexShrink: 0, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 18px", borderBottom: "1px solid #1a1a24" }}>
            <div style={{ fontWeight: 800, fontSize: 17 }}>{new Date(selPhoto.date).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}</div>
            <button onClick={() => setSelPhoto(null)} style={{ background: "none", border: "none", color: "#666" }}><Icon name="close" size={22} /></button>
          </div>
          <div style={{ flex: 1, overflow: "auto", padding: 16 }}>
            <img src={selPhoto.dataUrl} alt="" style={{ width: "100%", borderRadius: 13, marginBottom: 16, maxHeight: 300, objectFit: "cover" }} />

            {/* Analyze button */}
            <button onClick={() => analyzePhoto(selPhoto)} disabled={analyzing} className="gym-btn"
              style={{ width: "100%", background: analyzing ? "#111" : "#e63c2f1a", border: `1px solid ${analyzing ? "#1a1a24" : "#e63c2f44"}`, borderRadius: 11, padding: "12px", fontWeight: 700, fontSize: 14, color: analyzing ? "#555" : "#e63c2f", marginBottom: 16, minHeight: 48 }}>
              {analyzing ? <span className="pulse">🔍 {t.analyzingPhoto}</span> : `🔍 ${(selPhoto.analyses || []).length > 0 ? "Re-analyze" : t.tapAnalyze}`}
            </button>

            {/* Analysis history */}
            {(selPhoto.analyses || []).length > 0 && (
              <div>
                <div style={{ fontSize: 10, letterSpacing: 2, color: "#e63c2f", fontWeight: 700, textTransform: "uppercase", marginBottom: 10 }}>{t.aiAnalysis} · {selPhoto.analyses.length} {selPhoto.analyses.length === 1 ? "entry" : "entries"}</div>
                {[...(selPhoto.analyses || [])].reverse().map((a, i) => (
                  <div key={i} style={{ background: "#111", border: "1px solid #1a1a24", borderRadius: 12, padding: 14, marginBottom: 10 }}>
                    <div style={{ fontSize: 10, color: "#555", marginBottom: 8 }}>{new Date(a.date).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</div>
                    <div style={{ fontSize: 14, lineHeight: 1.75, color: "#ccc", whiteSpace: "pre-wrap" }}>{a.text}</div>
                  </div>
                ))}
              </div>
            )}
            {selPhoto._error && <div style={{ color: "#e63c2f", fontSize: 14 }}>{selPhoto._error}</div>}
          </div>
        </div>
      )}
      {/* Before/After comparison modal */}
      {compareMode && (
        <div style={{ position: "fixed", inset: 0, background: "#0a0a0f", zIndex: 200, display: "flex", flexDirection: "column" }}>
          <div style={{ flexShrink: 0, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 18px", borderBottom: "1px solid #1a1a24" }}>
            <div style={{ fontWeight: 800, fontSize: 17 }}>Before / After</div>
            <button onClick={() => setCompareMode(false)} style={{ background: "none", border: "none", color: "#666" }}><Icon name="close" size={22} /></button>
          </div>
          <div style={{ flex: 1, overflow: "auto", padding: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
              {[{ label: "Before", val: compareA, set: setCompareA }, { label: "After", val: compareB, set: setCompareB }].map(({ label, val, set }) => (
                <div key={label}>
                  <div style={{ fontSize: 9, letterSpacing: 2, color: "#e63c2f", fontWeight: 700, textTransform: "uppercase", marginBottom: 6, textAlign: "center" }}>{label}</div>
                  {val && <img src={val.dataUrl} alt="" style={{ width: "100%", borderRadius: 10, aspectRatio: "3/4", objectFit: "cover" }} />}
                  <div style={{ fontSize: 10, color: "#555", textAlign: "center", marginTop: 4 }}>{val ? new Date(val.date).toLocaleDateString() : "—"}</div>
                  <select value={val?.id || ""} onChange={e => set(photos.find(p => p.id === +e.target.value) || null)}
                    style={{ width: "100%", background: "#111", border: "1px solid #2a2a3a", borderRadius: 8, padding: "8px 10px", color: "#e8e4dc", fontSize: 12, marginTop: 6 }}>
                    <option value="">Select photo</option>
                    {[...photos].reverse().map(p => (
                      <option key={p.id} value={p.id}>{new Date(p.date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "2-digit" })}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
            {compareA && compareB ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ background: "#111", border: "1px solid #1a1a24", borderRadius: 12, padding: 12 }}>
                  <div style={{ fontSize: 10, color: "#555", textAlign: "center" }}>
                    {Math.round((new Date(compareB.date) - new Date(compareA.date)) / 864e5)} days between photos
                  </div>
                </div>
                <button onClick={analyzeComparison} disabled={compareLoading} className="gym-btn"
                  style={{ width: "100%", background: compareLoading ? "#111" : "#e63c2f1a", border: `1px solid ${compareLoading ? "#1a1a24" : "#e63c2f44"}`, borderRadius: 11, padding: "12px", fontWeight: 700, fontSize: 14, color: compareLoading ? "#555" : "#e63c2f", minHeight: 48 }}>
                  {compareLoading ? <span className="pulse">🔍 {t.comparingProgress}</span> : `🔍 ${t.compareProgress}`}
                </button>
                {compareError && (
                  <div style={{ background: "#e63c2f1a", border: "1px solid #e63c2f44", borderRadius: 11, padding: 12, color: "#e63c2f", fontSize: 13 }}>
                    {compareError}
                  </div>
                )}
                {compareAnalysis && (
                  <div style={{ background: "#111", border: "1px solid #1a1a24", borderRadius: 13, padding: 14 }}>
                    <div style={{ fontSize: 10, letterSpacing: 2, color: "#e63c2f", fontWeight: 700, textTransform: "uppercase", marginBottom: 10 }}>{t.progressComparison}</div>
                    <div style={{ fontSize: 13, color: "#e8e4dc", lineHeight: 1.55, whiteSpace: "pre-wrap" }}>{compareAnalysis}</div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ textAlign: "center", color: "#555", fontSize: 12, padding: 8 }}>{t.pickBothPhotos}</div>
            )}
          </div>
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
  const [planKey, setPlanKey] = useState(null);
  const [showPlanAction, setShowPlanAction] = useState(false);
  const [remaining, setRemaining] = useState(() => { try { const v = localStorage.getItem("ai_remaining"); return v !== null ? parseInt(v) : null; } catch { return null; } });
  const messagesRef = useRef();

  useEffect(() => { if (messagesRef.current) messagesRef.current.scrollTop = messagesRef.current.scrollHeight; }, [messages, pendingPlan]);
  // Sync remaining from localStorage (updated by callAI)
  useEffect(() => {
    const interval = setInterval(() => {
      try { const v = localStorage.getItem("ai_remaining"); if (v !== null) setRemaining(parseInt(v)); } catch {}
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const ctx = () => {
    const hyroxNames = new Set((EXERCISE_DB.hyrox || []).map(e => e.name));
    const hyroxSessions = sessions.filter(s => s.exercises?.some(e => hyroxNames.has(e.name)));
    const hyroxNote = hyroxSessions.length > 0 ? `\nUser has ${hyroxSessions.length} Hyrox session(s): ${hyroxSessions.map(s => s.name).join(", ")}` : "";
    return `Profile: ${JSON.stringify(profile)}\nSessions: ${JSON.stringify(sessions.map(s => ({ name: s.name, exercises: s.exercises?.map(e => e.name) })))}${hyroxNote}\nRecent workouts: ${JSON.stringify(workoutLogs.slice(-5).map(l => ({ date: l.date, session: l.sessionName })))}\nRecent nutrition: ${JSON.stringify(nutritionLogs.slice(-8).map(l => ({ name: l.name, protein: l.protein })))}`;
  };

  const UNIFIED_SYSTEM = `You are Iron Protocol's AI fitness coach. You ONLY answer questions about gym training, workout programming, exercise technique, nutrition, recovery, and body composition. If asked anything unrelated, reply: "I'm your Iron Protocol coach — I can only help with training, nutrition, and fitness goals."

When the user requests exercises, a workout, a session, or a training program — respond using EXACTLY this format:

SESSION: Push Day
- Bench Press | barbell | chest, triceps, shoulders | 4x8-10 | 60kg
- Overhead Press | barbell | shoulders, triceps | 3x10 | 40kg

Rules for workout responses:
1. Use ONLY exercises from the available list (exact spelling)
2. Every exercise line starts with "- " and uses " | " as separator
3. Sets×reps: "3x10" or "3x8-12"
4. Weight: number followed by "kg" (use 0kg for bodyweight)
5. Write 1-2 sentences of intro, then SESSION blocks — nothing after
6. Do NOT add bullet explanations, footnotes, or any text between/after sessions

HYROX COMPETITION KNOWLEDGE:
A Hyrox race consists of 8 x 1km runs alternating with 8 functional stations (in this exact order):
1. 1km Run → SkiErg 1000m
2. 1km Run → Sled Push 50m (men: +152kg / women: +102kg — adjust for training)
3. 1km Run → Sled Pull 50m (men: +103kg / women: +78kg)
4. 1km Run → Burpee Broad Jumps 80m
5. 1km Run → Rowing Machine 1000m
6. 1km Run → Farmer's Walk 200m (men: 2×24kg / women: 2×16kg)
7. 1km Run → Sandbag Lunges 100m (men: 20kg / women: 10kg)
8. 1km Run → Wall Balls 100 reps (men: 9kg to 10ft / women: 6kg to 9ft)
Total distance: ~10km running + all stations.
When building Hyrox prep plans, structure sessions around these stations and running capacity. Use Running for the run intervals. Good prep includes: aerobic base building, station-specific practice, lactate threshold running, and race-pace simulation blocks.

When the user asks a general question (technique, nutrition, recovery, advice): answer conversationally. Be specific, practical, and concise. No filler.`;

  const send = async (overrideInput) => {
    const text = overrideInput || input;
    if (!text.trim() || loading) return;
    const userMsg = { role: "user", content: text };
    setMessages(p => [...p, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const prompt = `${text}

${ctx()}

AVAILABLE EXERCISES — use ONLY these, spelled exactly as written:
${AVAILABLE_EXERCISES}`;

      const fullResponse = await callAI(
        [...messages.map(m => ({ role: m.role, content: m.content })), { role: "user", content: prompt }].slice(-6),
        UNIFIED_SYSTEM, 2000, 0.2
      );

      const parsed = parsePlanFromText(fullResponse);

      if (parsed.length > 0) {
        const key = Date.now();
        setMessages(p => [...p, { role: "assistant", content: fullResponse, hasPlan: true, planKey: key }]);
        setPendingPlan(parsed.map((s, i) => ({ ...s, id: key + i })));
        setPlanKey(key);
      } else if (/SESSION:/i.test(fullResponse)) {
        // AI attempted SESSION format but parsing failed — offer retry
        setMessages(p => [...p, { role: "assistant", content: fullResponse, hasPlan: false, needsRetry: true, retryText: text }]);
      } else {
        // Conversational response
        setMessages(p => [...p, { role: "assistant", content: fullResponse }]);
      }
    } catch (e) { setMessages(p => [...p, { role: "assistant", content: `${t.connectionError}\n\n${e.message || ""}` }]); }
    setLoading(false);
  };

  const retryAsPlan = async (originalText, msgIndex) => {
    setLoading(true);
    const ultraRetryPrompt = `Training plan request: "${originalText}"
User: ${JSON.stringify(profile)}
AVAILABLE EXERCISES — use ONLY these, exact spelling:
${AVAILABLE_EXERCISES}

OUTPUT ONLY the SESSION blocks below. No prose before or after. No markdown. No notes.

SESSION: [Session Name]
- [Exercise Name] | [equipment] | [muscles] | [sets]x[reps] | [weight]kg`;
    try {
      const response = await callAI(
        [{ role: "user", content: ultraRetryPrompt }],
        "You output ONLY training session blocks in SESSION: format. Nothing else — no intro, no notes, no markdown outside the format.",
        2000, 0.1
      );
      const parsed = parsePlanFromText(response);
      if (parsed.length > 0) {
        const key = Date.now();
        setMessages(p => p.map((m, i) => i === msgIndex ? { ...m, content: response, hasPlan: true, needsRetry: false, planKey: key } : m));
        setPendingPlan(parsed.map((s, i) => ({ ...s, id: key + i })));
        setPlanKey(key);
      } else {
        setMessages(p => p.map((m, i) => i === msgIndex ? { ...m, needsRetry: false } : m));
      }
    } catch (e) {
      setMessages(p => p.map((m, i) => i === msgIndex ? { ...m, needsRetry: false } : m));
    }
    setLoading(false);
  };

  const acceptPlan = () => setShowPlanAction(true);
  const confirmPlan = (replace) => {
    if (replace) setSessions(pendingPlan);
    else setSessions(p => [...p, ...pendingPlan.map(s => ({ ...s, id: Date.now() + Math.random() }))]);
    setPendingPlan(null);
    setPlanKey(null);
    setShowPlanAction(false);
    setMessages(p => [...p, { role: "assistant", content: `✅ ${t.planLive} 💪` }]);
  };

  const quickPrompts = [t.prompt1, t.prompt2, t.prompt3, t.prompt4, t.prompt5];

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
            {m.hasPlan && pendingPlan && m.planKey === planKey && (
              <div style={{ marginTop: 10 }}>
                <PlanPreview plan={pendingPlan} setPlan={setPendingPlan} onAccept={acceptPlan} onDiscard={() => { setPendingPlan(null); setPlanKey(null); }} t={t} />
              </div>
            )}
            {m.needsRetry && !loading && (
              <div style={{ marginTop: 6, display: "flex" }}>
                <button onClick={() => retryAsPlan(m.retryText, i)} className="gym-btn"
                  style={{ background: "#e63c2f1a", border: "1px solid #e63c2f44", borderRadius: 10, padding: "8px 14px", color: "#e63c2f", fontSize: 13, fontWeight: 700, minHeight: 36 }}>
                  ↺ Retry as structured plan
                </button>
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
      <div style={{ padding: "10px 14px 14px", borderTop: "1px solid #1a1a24" }}>
        {remaining !== null && (
          <div style={{ fontSize: 10, color: remaining <= 3 ? "#e63c2f" : "#444", textAlign: "center", marginBottom: 6, fontWeight: 600 }}>
            {remaining <= 0 ? "Daily limit reached — resets at midnight" : `${remaining} requests remaining today`}
          </div>
        )}
        <div style={{ display: "flex", gap: 7 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
          placeholder={t.askCoach} style={{ flex: 1, background: "#111", border: "1px solid #2a2a3a", borderRadius: 11, padding: "10px 14px", color: "#e8e4dc", fontSize: 15, outline: "none", minHeight: 44 }} />
        <button onClick={() => send()} disabled={loading || !input.trim() || remaining === 0} className="gym-btn" style={{ background: "#e63c2f", border: "none", borderRadius: 11, padding: "10px 16px", color: "#fff", opacity: loading || !input.trim() || remaining === 0 ? 0.4 : 1, minWidth: 48, minHeight: 44 }}>
          <Icon name="send" size={15} />
        </button>
        </div>
      </div>
      {showPlanAction && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 500, display: "flex", alignItems: "flex-end" }}>
          <div style={{ background: "#0f0f1a", borderRadius: "18px 18px 0 0", padding: "24px 22px calc(24px + env(safe-area-inset-bottom, 0px))", width: "100%" }}>
            <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 6 }}>📋 {t.aiSuggestPrompt}</div>
            <div style={{ color: "#555", fontSize: 13, marginBottom: 20 }}>{pendingPlan?.length} sessions suggested</div>
            <button onClick={() => confirmPlan(false)} className="gym-btn" style={{ width: "100%", background: "#e63c2f1a", border: "1px solid #e63c2f44", borderRadius: 12, padding: "14px", fontWeight: 800, fontSize: 15, color: "#e63c2f", minHeight: 52, marginBottom: 10 }}>
              ➕ {t.addToPlan}
            </button>
            <button onClick={() => confirmPlan(true)} className="gym-btn" style={{ width: "100%", background: "#e63c2f", border: "none", borderRadius: 12, padding: "14px", fontWeight: 800, fontSize: 15, color: "#fff", minHeight: 52, marginBottom: 10 }}>
              🔄 {t.replacePlan}
            </button>
            <button onClick={() => setShowPlanAction(false)} style={{ width: "100%", background: "none", border: "none", padding: "12px", color: "#444", fontSize: 14, fontWeight: 600 }}>{t.discard}</button>
          </div>
        </div>
      )}
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
