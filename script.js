// ================= PERIOD HISTORY =================

// Period history is loaded from MySQL
let periodHistory = [];

function loadPeriodsFromDatabase() {
    fetch("get_periods.php")
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log("Periods loaded from database:", data);

            if (data.length > 0) {
                // Map dates and sort descending so latest date is always index 0
                periodHistory = data.map(function(period) {
                    return period.period_date;
                }).sort(function(a, b) {
                    return new Date(b) - new Date(a);
                });

                calculatePeriod();
                updateDashboard();
            }
        })
        .catch(function(error) {
            console.error("Could not load periods:", error);
        });
}

function addPeriod() {

    let date = document.getElementById("periodDate").value;
    let message = document.getElementById("periodMessage");

    if (date === "") {
        if (message) {
            message.innerText = "Please select a period date.";
            message.className = "form-message error";
        }
        return;
    }

    if (!periodHistory.includes(date)) {
        periodHistory.unshift(date);
    }

    // Save period to MySQL database
    fetch("save_period.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: "period_date=" + encodeURIComponent(date)
    })
    .then(function(response) {
        return response.text();
    })
    .then(function(data) {
        console.log(data);

        if (data === "Period saved successfully.") {
            if (message) {
                message.innerText = "Period saved successfully!";
                message.className = "form-message success";
            }
        } else {
            if (message) {
                message.innerText = data;
                message.className = "form-message error";
            }
        }
    })
    .catch(function(error) {
        console.error(error);
        if (message) {
            message.innerText = "Could not connect to the database.";
            message.className = "form-message error";
        }
    });

    // Calculate prediction using this entered date
    calculatePeriod();
    updateDashboard();

    // Clear input
    document.getElementById("periodDate").value = "";
}


// ================= PERIOD PREDICTION & UPDATES =================

function calculatePeriod() {

    // Get the latest period entered by the user
    let latestDate = periodHistory[0];

    if (!latestDate) {
        return;
    }

    // Create date safely
    let lastDate = new Date(latestDate + "T00:00:00");

    // Actual period starts on entered date
    actualPeriodDate = new Date(lastDate);

    // Prediction = entered date + 28 days
    let predictedDate = new Date(lastDate);
    predictedDate.setDate(predictedDate.getDate() + 28);

    predictedPeriodDate = new Date(predictedDate);

    // Show the month containing the entered period
    currentMonth = lastDate.getMonth();
    currentYear = lastDate.getFullYear();

    displayCalendar();
}


// TEACHER REQUIREMENT: Allow user to update actual period start date
function updateActualPeriod() {
    let updateInput = document.getElementById("updatePeriodDate");
    let message = document.getElementById("periodMessage");

    if (!updateInput || updateInput.value === "") {
        if (message) {
            message.innerText = "Please select your new actual period date.";
            message.className = "form-message error";
        }
        return;
    }

    let newDate = updateInput.value;

    // Update the latest period date at the top of history
    if (periodHistory.length > 0) {
        periodHistory[0] = newDate;
    } else {
        periodHistory.unshift(newDate);
    }

    // Save updated date to MySQL database
    fetch("save_period.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: "period_date=" + encodeURIComponent(newDate)
    })
    .then(function(response) {
        return response.text();
    })
    .then(function(data) {
        console.log(data);

        if (data === "Period saved successfully.") {
            if (message) {
                message.innerText = "Actual period updated & next period recalculated!";
                message.className = "form-message success";
            }
        } else {
            if (message) {
                message.innerText = data;
                message.className = "form-message error";
            }
        }
    })
    .catch(function(error) {
        console.error(error);
        if (message) {
            message.innerText = "Could not connect to database, updated locally.";
            message.className = "form-message success";
        }
    });

    // Recalculate prediction (+28 days) and refresh views
    calculatePeriod();
    updateDashboard();

    // Clear input
    updateInput.value = "";
}


// ================= SYMPTOMS =================
let symptoms = [];

function addSymptom() {
    let symptomInput = document.getElementById("symptom");
    let message = document.getElementById("symptomMessage");

    if (!symptomInput) {
        console.error("Symptom input not found.");
        return;
    }

    let symptom = symptomInput.value.trim();

    if (symptom === "") {
        if (message) {
            message.innerText = "Please enter a symptom.";
            message.className = "form-message error";
        }
        return;
    }

    // Save symptom to MySQL database
    fetch("save_symptom.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: "symptom=" + encodeURIComponent(symptom)
    })
    .then(function(response) {
        return response.text();
    })
    .then(function(data) {
        console.log(data);

        if (data === "Symptom saved successfully.") {
            symptoms.push(symptom);
            localStorage.setItem("symptoms", JSON.stringify(symptoms));
            displaySymptoms();
            symptomInput.value = "";

            if (message) {
                message.innerText = "Symptom saved successfully!";
                message.className = "form-message success";
            }
            updateDashboard();
        } else {
            if (message) {
                message.innerText = data;
                message.className = "form-message error";
            }
        }
    })
    .catch(function(error) {
        console.error(error);
        if (message) {
            message.innerText = "Could not connect to the database.";
            message.className = "form-message error";
        }
    });
}

// Display saved symptoms
function displaySymptoms() {
    let list = document.getElementById("symptomList");
    if (!list) return;

    fetch("get_symptoms.php")
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            list.innerHTML = "";
            let dashboardSymptom = document.getElementById("dashboardSymptom");

            if (dashboardSymptom && data.length > 0) {
                dashboardSymptom.innerText = data[0].symptom;
            }

            data.forEach(function(symptom) {
                let item = document.createElement("li");
                item.innerText = symptom.symptom + " - " + symptom.symptom_date;
                list.appendChild(item);
            });
        })
        .catch(function(error) {
            console.error(error);
            list.innerHTML = "<li>Could not load symptoms.</li>";
        });
}


// ================= CALENDAR =================

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let predictedPeriodDate = null;
let actualPeriodDate = null;

function displayCalendar() {
    let calendarDays = document.getElementById("calendarDays");
    let monthYear = document.getElementById("monthYear");

    if (!calendarDays || !monthYear) return;

    let firstDay = new Date(currentYear, currentMonth, 1).getDay();
    let totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();
    let monthName = new Date(currentYear, currentMonth).toLocaleString("default", { month: "long" });

    monthYear.innerText = monthName + " " + currentYear;
    calendarDays.innerHTML = "";

    for (let i = 0; i < firstDay; i++) {
        let emptyDay = document.createElement("div");
        calendarDays.appendChild(emptyDay);
    }

    for (let day = 1; day <= totalDays; day++) {
        let dayBox = document.createElement("div");
        dayBox.innerText = day;
        dayBox.classList.add("calendar-day");

        let today = new Date();
        let isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();

        if (predictedPeriodDate) {
            let predictedStartDate = new Date(predictedPeriodDate);
            predictedStartDate.setHours(0, 0, 0, 0);

            let predictedEndDate = new Date(predictedStartDate);
            predictedEndDate.setDate(predictedEndDate.getDate() + 4);

            let currentDate = new Date(currentYear, currentMonth, day);
            currentDate.setHours(0, 0, 0, 0);

            if (currentDate >= predictedStartDate && currentDate <= predictedEndDate) {
                dayBox.classList.add("predicted");
            }
        }

        if (actualPeriodDate) {
            let actualStartDate = new Date(actualPeriodDate);
            actualStartDate.setHours(0, 0, 0, 0);

            let actualEndDate = new Date(actualStartDate);
            actualEndDate.setDate(actualEndDate.getDate() + 4);

            let currentDate = new Date(currentYear, currentMonth, day);
            currentDate.setHours(0, 0, 0, 0);

            if (currentDate >= actualStartDate && currentDate <= actualEndDate) {
                dayBox.classList.remove("predicted");
                dayBox.classList.add("actual");
            }
        }

        if (isToday) {
            dayBox.classList.remove("actual");
            dayBox.classList.remove("predicted");
            dayBox.classList.add("today");
        }

        calendarDays.appendChild(dayBox);
    }
}

function previousMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    displayCalendar();
}

function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    displayCalendar();
}


// ================= REMINDERS =================

let reminders = JSON.parse(localStorage.getItem("reminders")) || [];

function addReminder() {
    let medicationElement = document.getElementById("medication");
    let dateElement = document.getElementById("reminderDate");
    let hourElement = document.getElementById("reminderHour");
    let minuteElement = document.getElementById("reminderMinute");
    let ampmElement = document.getElementById("reminderAmPm");
    let message = document.getElementById("reminderMessage");

    if (!medicationElement || !dateElement || !hourElement || !minuteElement || !ampmElement) return;

    let medication = medicationElement.value.trim();
    let date = dateElement.value;
    let hour = hourElement.value;
    let minute = minuteElement.value;
    let ampm = ampmElement.value;

    if (medication === "" || date === "" || hour === "" || minute === "" || ampm === "") {
        message.innerText = "Please enter medication, date, and time.";
        message.className = "form-message error";
        return;
    }

    let time = hour + ":" + minute + " " + ampm;

    fetch("save_reminder.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: "medication=" + encodeURIComponent(medication) + "&reminder_date=" + encodeURIComponent(date) + "&reminder_time=" + encodeURIComponent(time)
    })
    .then(function(response) {
        return response.text();
    })
    .then(function(data) {
        if (data === "Reminder saved successfully.") {
            reminders.push({ medication: medication, date: date, time: time });
            displayReminders();
            medicationElement.value = "";
            dateElement.value = "";
            hourElement.value = "";
            minuteElement.value = "";
            ampmElement.value = "";
            message.innerText = "Reminder saved successfully.";
            message.className = "form-message success";
            updateDashboard();
        } else {
            message.innerText = data;
            message.className = "form-message error";
        }
    })
    .catch(function(error) {
        console.error(error);
        message.innerText = "Could not connect to the database.";
        message.className = "form-message error";
    });
}

function displayReminders() {
    let list = document.getElementById("reminderList");
    if (!list) return;

    fetch("get_reminders.php")
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            list.innerHTML = "";
            data.forEach(function(reminder) {
                let item = document.createElement("li");
                item.innerText = reminder.medication + " - " + reminder.reminder_date + " at " + reminder.reminder_time;
                list.appendChild(item);
            });
        })
        .catch(function(error) {
            console.error(error);
            list.innerHTML = "<li>Could not load reminders.</li>";
        });
}


// ================= DASHBOARD =================

function updateDashboard() {
    let lastPeriodElement = document.getElementById("dashboardLastPeriod");
    let nextPeriodElement = document.getElementById("dashboardNextPeriod");
    let nextReminderElement = document.getElementById("dashboardReminder");

    if (lastPeriodElement) {
        if (periodHistory.length > 0) {
            lastPeriodElement.innerText = periodHistory[0];
        } else {
            lastPeriodElement.innerText = "No period recorded";
        }
    }

    if (nextPeriodElement) {
        if (periodHistory.length > 0) {
            let nextDate = new Date(periodHistory[0] + "T00:00:00");
            nextDate.setDate(nextDate.getDate() + 28);
            nextPeriodElement.innerText = nextDate.toLocaleDateString();
        } else {
            nextPeriodElement.innerText = "No prediction available";
        }
    }

    if (nextReminderElement) {
        fetch("get_reminders.php")
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                if (data.length === 0) {
                    nextReminderElement.innerText = "No reminders scheduled";
                    return;
                }
                let nextReminder = data[0];
                nextReminderElement.innerText = nextReminder.medication + " - " + nextReminder.reminder_date + " at " + nextReminder.reminder_time;
            })
            .catch(function(error) {
                console.error(error);
                nextReminderElement.innerText = "No reminders scheduled";
            });
    }
}


// ================= INITIALIZE =================

loadPeriodsFromDatabase();

if (document.getElementById("symptomList")) {
    displaySymptoms();
}

if (document.getElementById("calendarDays")) {
    displayCalendar();
}

updateDashboard();

fetch("get_user.php")
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        let welcomeMessage = document.getElementById("welcomeMessage");
        if (welcomeMessage && data.name !== "") {
            welcomeMessage.innerText = "Hello, " + data.name + "! 🌸";
        }
    })
    .catch(function(error) {
        console.error("Could not load user name:", error);
    });