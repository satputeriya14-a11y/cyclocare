// ================= PERIOD HISTORY (LOCAL STORAGE) =================

let periodHistory = JSON.parse(localStorage.getItem("periodHistory")) || [];

function loadPeriodsFromDatabase() {
    console.log("Periods loaded from local storage:", periodHistory);
    if (periodHistory.length > 0) {
        calculatePeriod();
        updateDashboard();
    }
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
        periodHistory.sort(function(a, b) {
            return new Date(b) - new Date(a);
        });
        localStorage.setItem("periodHistory", JSON.stringify(periodHistory));
    }

    if (message) {
        message.innerText = "Period saved successfully!";
        message.className = "form-message success";
    }

    calculatePeriod();
    updateDashboard();
    document.getElementById("periodDate").value = "";
}


// ================= PERIOD PREDICTION & UPDATES =================

let predictedPeriodDate = null;
let actualPeriodDate = null;

function calculatePeriod() {
    let latestDate = periodHistory[0];

    if (!latestDate) {
        return;
    }

    let lastDate = new Date(latestDate + "T00:00:00");

    actualPeriodDate = new Date(lastDate);

    let predictedDate = new Date(lastDate);
    predictedDate.setDate(predictedDate.getDate() + 28);

    predictedPeriodDate = new Date(predictedDate);

    currentMonth = lastDate.getMonth();
    currentYear = lastDate.getFullYear();

    displayCalendar();
}

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

    if (periodHistory.length > 0) {
        periodHistory[0] = newDate;
    } else {
        periodHistory.unshift(newDate);
    }

    localStorage.setItem("periodHistory", JSON.stringify(periodHistory));

    if (message) {
        message.innerText = "Actual period updated & next period recalculated!";
        message.className = "form-message success";
    }

    calculatePeriod();
    updateDashboard();
    updateInput.value = "";
}


// ================= SYMPTOMS =================

let symptoms = JSON.parse(localStorage.getItem("symptoms")) || [];

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

    let todayStr = new Date().toISOString().split('T')[0];
    symptoms.unshift({ symptom: symptom, symptom_date: todayStr });
    localStorage.setItem("symptoms", JSON.stringify(symptoms));

    displaySymptoms();
    symptomInput.value = "";

    if (message) {
        message.innerText = "Symptom saved successfully!";
        message.className = "form-message success";
    }
    updateDashboard();
}

function displaySymptoms() {
    let list = document.getElementById("symptomList");
    if (!list) return;

    list.innerHTML = "";
    let dashboardSymptom = document.getElementById("dashboardSymptom");

    if (dashboardSymptom && symptoms.length > 0) {
        dashboardSymptom.innerText = symptoms[0].symptom;
    }

    symptoms.forEach(function(item) {
        let li = document.createElement("li");
        li.innerText = item.symptom + " - " + item.symptom_date;
        list.appendChild(li);
    });
}


// ================= CALENDAR =================

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

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
        if (message) {
            message.innerText = "Please enter medication, date, and time.";
            message.className = "form-message error";
        }
        return;
    }

    let time = hour + ":" + minute + " " + ampm;

    reminders.unshift({ medication: medication, reminder_date: date, reminder_time: time });
    localStorage.setItem("reminders", JSON.stringify(reminders));

    displayReminders();
    medicationElement.value = "";
    dateElement.value = "";
    hourElement.value = "";
    minuteElement.value = "";
    ampmElement.value = "";

    if (message) {
        message.innerText = "Reminder saved successfully.";
        message.className = "form-message success";
    }
    updateDashboard();
}

function displayReminders() {
    let list = document.getElementById("reminderList");
    if (!list) return;

    list.innerHTML = "";
    reminders.forEach(function(reminder) {
        let item = document.createElement("li");
        item.innerText = reminder.medication + " - " + reminder.reminder_date + " at " + reminder.reminder_time;
        list.appendChild(item);
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
        if (reminders.length === 0) {
            nextReminderElement.innerText = "No reminders scheduled";
        } else {
            let nextReminder = reminders[0];
            nextReminderElement.innerText = nextReminder.medication + " - " + nextReminder.reminder_date + " at " + nextReminder.reminder_time;
        }
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

if (document.getElementById("reminderList")) {
    displayReminders();
}

updateDashboard();

let welcomeMessage = document.getElementById("welcomeMessage");
if (welcomeMessage) {
    let savedName = localStorage.getItem("userName");
    welcomeMessage.innerText = savedName ? "Hello, " + savedName + "! 🌸" : "Hello! 🌸";
}