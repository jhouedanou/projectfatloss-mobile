document.addEventListener('DOMContentLoaded', () => {
    const workoutPlan = {
        "JOUR 1: PUSH (PECTORAUX, ÉPAULES, TRICEPS)": [
            { name: "Développé haltères", series: "4 × 12-15", equipment: "Haltères 15 kg", caloriesPerSet: [10, 12], totalSets: 4 },
            { name: "Élévations latérales", series: "4 × 12", equipment: "Haltères 10 kg", caloriesPerSet: [6, 8], totalSets: 4 },
            { name: "Développé incliné haltères", series: "3 × 12", equipment: "Haltères 15 kg", caloriesPerSet: [10, 12], totalSets: 3 },
            { name: "Élévations frontales", series: "3 × 12", equipment: "Haltères 10 kg", caloriesPerSet: [6, 8], totalSets: 3 },
            { name: "Extensions triceps", series: "3 × 15", equipment: "Haltère 15 kg", caloriesPerSet: [7, 9], totalSets: 3 },
            { name: "Dips lestés", series: "3 × max", equipment: "Gilet lesté 10 kg", caloriesPerSet: [9, 12], totalSets: 3 },
            { name: "Crunchs lestés", series: "3 × 25", equipment: "Haltère 10 kg", caloriesPerSet: [8, 10], totalSets: 3 },
            { name: "Planche lestée", series: "3 × 30-60 sec", equipment: "Gilet lesté 10 kg", caloriesPerSet: [10, 15], totalSets: 3 },
        ],
        "JOUR 2: PULL (DOS, BICEPS)": [
            { name: "Rowing haltères un bras", series: "4 × 12", equipment: "Haltère 15 kg", caloriesPerSet: [8, 10], totalSets: 4 },
            { name: "Rowing barre", series: "4 × 10-12", equipment: "Barre 30 kg", caloriesPerSet: [10, 13], totalSets: 4 },
            { name: "Rowing haltères deux bras", series: "3 × 12", equipment: "Haltères 10 kg", caloriesPerSet: [8, 10], totalSets: 3 },
            { name: "Curl biceps haltères", series: "3 × 12", equipment: "Haltères 15 kg", caloriesPerSet: [6, 8], totalSets: 3 },
            { name: "Curl marteau", series: "3 × 12", equipment: "Haltères 15 kg", caloriesPerSet: [6, 8], totalSets: 3 },
            { name: "Shrugs", series: "3 × 15", equipment: "Haltères 15 kg ou barre 30 kg", caloriesPerSet: [5, 7], totalSets: 3 },
            { name: "Mountain climbers lestés", series: "3 × 30 sec", equipment: "Gilet lesté 10 kg", caloriesPerSet: [12, 15], totalSets: 3 },
            { name: "Russian twists", series: "3 × 20", equipment: "Haltère 10 kg", caloriesPerSet: [8, 10], totalSets: 3 },
        ],
        "JOUR 3: LEGS (JAMBES, FESSIERS)": [
            { name: "Squats", series: "4 × 15", equipment: "Barre 30 kg", caloriesPerSet: [12, 15], totalSets: 4 },
            { name: "Fentes avant alternées", series: "4 × 12/jambe", equipment: "Haltères 15 kg", caloriesPerSet: [14, 18], totalSets: 4 },
            { name: "Soulevé de terre roumain", series: "3 × 12", equipment: "Barre 30 kg", caloriesPerSet: [12, 15], totalSets: 3 },
            { name: "Step-ups", series: "3 × 15/jambe", equipment: "Haltères 10 kg", caloriesPerSet: [13, 16], totalSets: 3 },
            { name: "Hip thrust", series: "3 × 15", equipment: "Barre 30 kg", caloriesPerSet: [10, 13], totalSets: 3 },
            { name: "Mollets debout", series: "4 × 20", equipment: "Haltères 15 kg", caloriesPerSet: [5, 7], totalSets: 4 },
            { name: "Crunchs inversés lestés", series: "3 × 15", equipment: "Gilet lesté 10 kg", caloriesPerSet: [8, 10], totalSets: 3 },
            { name: "Relevé de jambes", series: "3 × 15", equipment: "Lestage aux chevilles (optionnel)", caloriesPerSet: [6, 8], totalSets: 3 },
        ],
        "JOUR 4: PUSH (VARIATION)": [
            { name: "Pompes lestées", series: "4 × max", equipment: "Gilet lesté 10 kg", caloriesPerSet: [10, 15], totalSets: 4 },
            { name: "Développé Arnold", series: "4 × 12", equipment: "Haltères 10 kg", caloriesPerSet: [8, 10], totalSets: 4 },
            { name: "Écartés haltères", series: "3 × 15", equipment: "Haltères 10 kg", caloriesPerSet: [7, 9], totalSets: 3 },
            { name: "Élévations latérales inclinées", series: "3 × 12", equipment: "Haltères 10 kg", caloriesPerSet: [6, 8], totalSets: 3 },
            { name: "Extensions triceps au-dessus", series: "3 × 15", equipment: "Haltère 15 kg", caloriesPerSet: [7, 9], totalSets: 3 },
            { name: "Barre au front", series: "3 × 15", equipment: "Barre 30 kg", caloriesPerSet: [8, 10], totalSets: 3 },
            { name: "Crunchs obliques", series: "3 × 25", equipment: "Haltère 10 kg", caloriesPerSet: [8, 10], totalSets: 3 },
            { name: "Hollow hold", series: "3 × 30 sec", equipment: "Gilet lesté 10 kg", caloriesPerSet: [10, 12], totalSets: 3 },
        ],
        "JOUR 5: PULL (VARIATION)": [
            { name: "Soulevé de terre", series: "4 × 10", equipment: "Barre 30 kg", caloriesPerSet: [13, 17], totalSets: 4 },
            { name: "Pull-over avec haltère", series: "3 × 15", equipment: "Haltère 15 kg", caloriesPerSet: [8, 10], totalSets: 3 },
            { name: "Good morning", series: "3 × 15", equipment: "Barre 30 kg", caloriesPerSet: [10, 12], totalSets: 3 },
            { name: "Curl concentré", series: "3 × 12", equipment: "Haltère 15 kg", caloriesPerSet: [5, 7], totalSets: 3 },
            { name: "Curl 21s", series: "3 séries", equipment: "Barre 30 kg", caloriesPerSet: [12, 15], totalSets: 3 },
            { name: "Reverse fly", series: "3 × 15", equipment: "Haltères 10 kg", caloriesPerSet: [7, 9], totalSets: 3 },
            { name: "Planche latérale", series: "3 × 30 sec/côté", equipment: "Gilet lesté 10 kg", caloriesPerSet: [8, 10], totalSets: 3 },
            { name: "Bicycle crunch", series: "3 × 20", equipment: "Lesté (optionnel)", caloriesPerSet: [9, 11], totalSets: 3 },
        ],
        "JOUR 6: LEGS (VARIATION)": [
            { name: "Squats sumo", series: "4 × 15", equipment: "Barre 30 kg", caloriesPerSet: [13, 16], totalSets: 4 },
            { name: "Fentes latérales", series: "3 × 12/côté", equipment: "Haltères 15 kg", caloriesPerSet: [12, 15], totalSets: 3 },
            { name: "Pont fessier lesté", series: "4 × 15", equipment: "Barre 30 kg", caloriesPerSet: [9, 11], totalSets: 4 },
            { name: "Extensions de hanche", series: "3 × 15/jambe", equipment: "Haltère 10 kg", caloriesPerSet: [8, 10], totalSets: 3 },
            { name: "Squats bulgares", series: "3 × 12/jambe", equipment: "Haltères 10 kg", caloriesPerSet: [13, 16], totalSets: 3 },
            { name: "Mollets assis", series: "4 × 20", equipment: "Barre 30 kg", caloriesPerSet: [5, 7], totalSets: 4 },
            { name: "Crunchs lestés", series: "3 × 25", equipment: "Haltère 10 kg", caloriesPerSet: [8, 10], totalSets: 3 },
            { name: "Dead bug", series: "3 × 10/côté", equipment: "Lesté avec haltère 10 kg", caloriesPerSet: [7, 9], totalSets: 3 },
        ],
        "JOUR 7: CARDIO & RÉCUPÉRATION": [
            { name: "Vélo", series: "30-45 min à intensité modérée", equipment: "Gilet lesté 10 kg (optionnel)", caloriesPerSet: [250, 400], totalSets: 1 }, // Special case for cardio
            { name: "Cardio au choix", series: "20-30 min", equipment: "Gilet lesté 10 kg (optionnel)", caloriesPerSet: [150, 250], totalSets: 1 }, // Special case for cardio
            { name: "Étirements complets", series: "15-20 min", equipment: "Aucun", caloriesPerSet: [60, 80], totalSets: 1 },
            { name: "Mobilité articulaire", series: "10 min", equipment: "Aucun", caloriesPerSet: [30, 40], totalSets: 1 },
        ]
    };

    const workoutPlanContainer = document.getElementById('workout-plan');
    const dailySummaryContainer = document.getElementById('daily-summary');
    const totalDailyCaloriesDisplay = document.getElementById('total-daily-calories');
    const congratsMessageDisplay = document.getElementById('congrats-message');

    let dailyCalories = {}; // Object to store calories for each day
    let completedExercisesToday = 0;
    let exercisesInCurrentDay = 0;

    function renderWorkoutPlan() {
        for (const day in workoutPlan) {
            if (workoutPlan.hasOwnProperty(day)) {
                dailyCalories[day] = 0; // Initialize daily calories

                const dayCard = document.createElement('div');
                dayCard.classList.add('day-card');
                dayCard.setAttribute('data-day', day);

                const dayTitle = document.createElement('h2');
                dayTitle.textContent = day;
                dayCard.appendChild(dayTitle);

                const exercises = workoutPlan[day];
                exercisesInCurrentDay = exercises.length; // Set for the current day being rendered

                exercises.forEach((exercise, index) => {
                    const exerciseDiv = document.createElement('div');
                    exerciseDiv.classList.add('exercise');
                    exerciseDiv.setAttribute('data-exercise-index', index.toString());

                    const exerciseInfo = document.createElement('div');
                    exerciseInfo.classList.add('exercise-info');
                    exerciseInfo.innerHTML = `
                        <h3>${exercise.name}</h3>
                        <p>Séries × Répétitions: ${exercise.series}</p>
                        <p>Équipement: ${exercise.equipment}</p>
                    `;

                    const exerciseActions = document.createElement('div');
                    exerciseActions.classList.add('exercise-actions');

                    const completeButton = document.createElement('button');
                    completeButton.textContent = 'Marquer comme fait';
                    completeButton.addEventListener('click', () => markExerciseComplete(day, exercise, completeButton, caloriesDisplay));

                    const caloriesDisplay = document.createElement('p');
                    caloriesDisplay.classList.add('calories-display');
                    caloriesDisplay.style.display = 'none'; // Hidden initially

                    exerciseActions.appendChild(completeButton);
                    exerciseActions.appendChild(caloriesDisplay);
                    exerciseDiv.appendChild(exerciseInfo);
                    exerciseDiv.appendChild(exerciseActions);
                    dayCard.appendChild(exerciseDiv);
                });
                workoutPlanContainer.appendChild(dayCard);
            }
        }
    }

    function markExerciseComplete(day, exercise, button, caloriesElement) {
        if (button.classList.contains('completed')) return; // Already completed

        const caloriesBurnedThisExercise = Math.round((exercise.caloriesPerSet[0] + exercise.caloriesPerSet[1]) / 2 * exercise.totalSets);
        dailyCalories[day] += caloriesBurnedThisExercise;

        caloriesElement.textContent = `+ ${caloriesBurnedThisExercise} cal`;
        caloriesElement.style.display = 'block';

        button.textContent = 'Fait!';
        button.classList.add('completed');
        button.disabled = true;

        // Recalculate total daily calories for the summary
        let totalCaloriesForDay = 0;
        const currentDayCard = document.querySelector(`.day-card[data-day="${day}"]`);
        const exercisesInThisDay = workoutPlan[day].length;
        let completedInThisDay = 0;

        workoutPlan[day].forEach((ex, idx) => {
            const exDiv = currentDayCard.querySelector(`.exercise[data-exercise-index="${idx}"]`);
            const btn = exDiv.querySelector('button');
            if (btn.classList.contains('completed')) {
                completedInThisDay++;
                // Sum up calories based on the displayed animated text if available
                const calDisplay = exDiv.querySelector('.calories-display');
                if (calDisplay && calDisplay.textContent) {
                    totalCaloriesForDay += parseInt(calDisplay.textContent.replace('+ ', '').replace(' cal', ''));
                }
            }
        });

        totalDailyCaloriesDisplay.textContent = totalCaloriesForDay;

        if (completedInThisDay === exercisesInThisDay) {
            dailySummaryContainer.style.display = 'block';
            totalDailyCaloriesDisplay.textContent = totalCaloriesForDay; 
            congratsMessageDisplay.textContent = `Félicitations ! Vous avez terminé tous les exercices pour ${day} et brûlé ${totalCaloriesForDay} calories !`;
        } else {
            // If not all exercises for the day are done, ensure the summary is for the current ongoing day
            // This logic might need refinement if users can jump between days
            dailySummaryContainer.style.display = 'block'; // Show progress
            congratsMessageDisplay.textContent = ''; // Clear congrats if not all done
        }
    }

    renderWorkoutPlan();
});
