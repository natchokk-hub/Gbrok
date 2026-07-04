// ==========================
// GBLOK APP CORE
// ==========================

const splashScreen = document.getElementById("splashScreen");
const app = document.getElementById("app");
const loadingBar = document.getElementById("loadingBar");

const navButtons = document.querySelectorAll(".nav-btn");
const pages = document.querySelectorAll(".page");

// ==========================
// STORAGE
// ==========================

const STORAGE_KEY = "gblok_data";

const defaultData = {

    mediaEscolar: 0,
    tarefasPendentes: 0,
    economiaAtual: 0,
    metasAtivas: 0,

    createdAt: Date.now()

};

function loadData() {

    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(defaultData)
        );

        return defaultData;
    }

    try {

        return JSON.parse(saved);

    } catch {

        return defaultData;
    }

}

function saveData(data) {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(data)
    );

}

// ==========================
// APP DATA
// ==========================

let appData = loadData();

// ==========================
// RENDER
// ==========================

function renderDashboard() {

    const media = document.getElementById("mediaEscolar");
    const tarefas = document.getElementById("tarefasPendentes");
    const economia = document.getElementById("economiaAtual");
    const metas = document.getElementById("metasAtivas");

    if (media)
        media.textContent =
            Number(appData.mediaEscolar).toFixed(1);

    if (tarefas)
        tarefas.textContent =
            appData.tarefasPendentes;

    if (economia)
        economia.textContent =
            `R$${appData.economiaAtual}`;

    if (metas)
        metas.textContent =
            appData.metasAtivas;

}

// ==========================
// SPLASH
// ==========================

function startSplash() {

    let progress = 0;

    const interval = setInterval(() => {

        progress += Math.random() * 12;

        if (progress > 100) {
            progress = 100;
        }

        loadingBar.style.width =
            progress + "%";

        if (progress >= 100) {

            clearInterval(interval);

            setTimeout(() => {

                splashScreen.style.opacity = "0";

                splashScreen.style.transition =
                    "all .7s ease";

                setTimeout(() => {

                    splashScreen.remove();

                    app.classList.remove("hidden");

                    app.style.opacity = "1";

                }, 700);

            }, 500);

        }

    }, 120);

}

// ==========================
// NAVIGATION
// ==========================

function openPage(pageId) {

    pages.forEach(page => {

        page.classList.remove("active");

    });

    navButtons.forEach(button => {

        button.classList.remove("active");

    });

    const page =
        document.getElementById(pageId);

    if (page)
        page.classList.add("active");

    const selected =
        document.querySelector(
            `[data-page="${pageId}"]`
        );

    if (selected)
        selected.classList.add("active");

    localStorage.setItem(
        "gblok_last_page",
        pageId
    );

}

navButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            const page =
                button.dataset.page;

            vibrate(10);

            openPage(page);

        }
    );

});

// ==========================
// RESTORE PAGE
// ==========================

function restoreLastPage() {

    const lastPage =
        localStorage.getItem(
            "gblok_last_page"
        );

    if (!lastPage)
        return;

    openPage(lastPage);

}

// ==========================
// VIBRATION
// ==========================

function vibrate(ms = 15) {

    if ("vibrate" in navigator) {

        navigator.vibrate(ms);

    }

}

// ==========================
// APP STATE
// ==========================

function initializeApp() {

    renderDashboard();

    restoreLastPage();

}

// ==========================
// APP OPEN EFFECT
// ==========================

window.addEventListener(
    "load",
    () => {

        initializeApp();

        startSplash();

    }
);

// ==========================
// SERVICE WORKER
// ==========================

if ("serviceWorker" in navigator) {

    window.addEventListener(
        "load",
        () => {

            navigator.serviceWorker
                .register("./sw.js")
                .catch(() => {});

        }
    );

}

// ==========================
// DEBUG
// ==========================

window.gblok = {

    data: appData,

    save() {

        saveData(appData);

    },

    reset() {

        localStorage.removeItem(
            STORAGE_KEY
        );

        location.reload();

    }

};
