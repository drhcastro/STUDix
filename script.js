document.addEventListener('DOMContentLoaded', () => {
    const homeScreen = document.getElementById('home-screen');
    const courseContainer = document.getElementById('course-container');
    const selectHellpBtn = document.getElementById('select-hellp');
    const backToHomeBtn = document.getElementById('back-to-home');
    const courseTitleEl = document.getElementById('course-title');
    const courseContent = document.getElementById('course-content');
    const subNavContainer = document.getElementById('sub-nav-container');
    
    let courseData = null;
    let currentCourseKey = '';
    let currentModuleIndex = 0;

    async function loadCourseData() {
        try {
            const response = await fetch('course-data.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            courseData = await response.json();
        } catch (error) {
            console.error("Error al cargar los datos del curso:", error);
            courseContent.innerHTML = "<p class='text-red-500'>Error: No se pudo cargar el contenido del curso.</p>";
        }
    }

    function showCourse(courseKey) {
        if (!courseData || !courseData[courseKey]) return;
        currentCourseKey = courseKey;
        homeScreen.classList.add('hidden');
        courseContainer.classList.remove('hidden');
        const data = courseData[currentCourseKey];
        courseTitleEl.textContent = data.title;
        currentModuleIndex = 0;
        renderSubNav(data);
        renderModule(data);
    }

    function showHome() {
        homeScreen.classList.remove('hidden');
        courseContainer.classList.add('hidden');
    }

    function renderSubNav(data) {
        let subNavHtml = '<div class="flex flex-wrap gap-2">';
        data.modules.forEach((module, index) => {
            const isActive = index === currentModuleIndex;
            subNavHtml += `<button class="sub-tab-button px-3 py-2 text-xs sm:text-sm rounded-md transition-colors duration-200 ${isActive ? 'sub-tab-active' : 'sub-tab-inactive'}" data-index="${index}">Módulo ${index + 1}</button>`;
        });
        subNavHtml += '</div>';
        subNavContainer.innerHTML = subNavHtml;

        document.querySelectorAll('.sub-tab-button').forEach(button => {
            button.addEventListener('click', (e) => {
                currentModuleIndex = parseInt(e.target.dataset.index);
                renderModule(data);
                renderSubNav(data);
            });
        });
    }

    function renderModule(data) {
        const moduleData = data.modules[currentModuleIndex];
        courseContent.innerHTML = `<div class="bg-white p-6 sm:p-8 rounded-lg shadow-lg module-content">${moduleData.content}</div>`;
        attachModuleEventListeners();
    }

    function attachModuleEventListeners() {
        const calculateHellpBtn = document.getElementById('calculate-hellp-btn');
        if (calculateHellpBtn) {
            calculateHellpBtn.addEventListener('click', () => {
                // Lógica de la calculadora HELLP
            });
        }

        const labTabButtons = document.querySelectorAll('.lab-tab-btn');
        if(labTabButtons.length > 0) {
            // Lógica de las pestañas de laboratorio
        }

        const diffBtns = document.querySelectorAll('.diff-btn');
        if (diffBtns.length > 0) {
            diffBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const table = document.getElementById('diff-table');
                    table.querySelectorAll('td, th').forEach(cell => cell.classList.remove('highlight-col'));
                    const colsToHighlight = btn.dataset.col.split(',');
                    colsToHighlight.forEach(colIndexStr => {
                        const colIndex = parseInt(colIndexStr);
                        table.querySelectorAll(`tr td:nth-child(${colIndex}), tr th:nth-child(${colIndex})`).forEach(cell => {
                            cell.classList.add('highlight-col');
                        });
                    });
                });
            });
        }
        
        // Lógica para la calculadora de crisis hipertensiva
        const calculateHtnBtn = document.getElementById('calculate-htn-btn');
        if (calculateHtnBtn) {
            calculateHtnBtn.addEventListener('click', () => {
                const pas = parseInt(document.getElementById('pas-input').value) || 0;
                const pad = parseInt(document.getElementById('pad-input').value) || 0;
                const contra = document.querySelector('input[name="labetalol-contra"]:checked').value;
                const resultsDiv = document.getElementById('htn-results');
                let recommendation = "PA no en rango de crisis hipertensiva.";
                if (pas >= 160 || pad >= 110) {
                    if (contra === 'no') {
                        recommendation = "<strong>Recomendación:</strong> Administrar <strong>Labetalol 20 mg IV</strong> en 2 minutos. Reevaluar PA en 10 minutos.";
                    } else {
                        recommendation = "<strong>Recomendación:</strong> Labetalol contraindicado. Administrar <strong>Hidralazina 5-10 mg IV</strong> en 2 minutos y reevaluar en 20 min, O <strong>Nifedipino 10-20 mg VO</strong> y reevaluar en 20 min.";
                    }
                }
                resultsDiv.innerHTML = `<p>${recommendation}</p>`;
                resultsDiv.classList.remove('hidden');
            });
        }

        // Lógica para las ventanas modales
        const hepaticModal = document.getElementById('hepatic-complication-modal');
        const openHepaticBtn = document.getElementById('hepatic-complication-btn');
        const closeHepaticBtn = document.getElementById('close-hepatic-modal-btn');
        if(hepaticModal && openHepaticBtn && closeHepaticBtn) {
            openHepaticBtn.addEventListener('click', () => hepaticModal.classList.remove('hidden'));
            closeHepaticBtn.addEventListener('click', () => hepaticModal.classList.add('hidden'));
            hepaticModal.addEventListener('click', (e) => { if (e.target === hepaticModal) hepaticModal.classList.add('hidden'); });
        }

        const adamts13Modal = document.getElementById('adamts13-modal');
        const openAdamts13Btn = document.getElementById('adamts13-modal-btn');
        const closeAdamts13Btn = document.getElementById('close-adamts13-modal-btn');
        if(adamts13Modal && openAdamts13Btn && closeAdamts13Btn) {
            openAdamts13Btn.addEventListener('click', () => adamts13Modal.classList.remove('hidden'));
            closeAdamts13Btn.addEventListener('click', () => adamts13Modal.classList.add('hidden'));
            adamts13Modal.addEventListener('click', (e) => { if (e.target === adamts13Modal) adamts13Modal.classList.add('hidden'); });
        }
        
        const steroidsModal = document.getElementById('steroids-modal');
        const openSteroidsBtn = document.getElementById('steroids-modal-btn');
        const closeSteroidsBtn = document.getElementById('close-steroids-modal-btn');
        if(steroidsModal && openSteroidsBtn && closeSteroidsBtn) {
            openSteroidsBtn.addEventListener('click', () => steroidsModal.classList.remove('hidden'));
            closeSteroidsBtn.addEventListener('click', () => steroidsModal.classList.add('hidden'));
            steroidsModal.addEventListener('click', (e) => { if (e.target === steroidsModal) steroidsModal.classList.add('hidden'); });
        }
    }

    async function init() {
        await loadCourseData();
        selectHellpBtn.addEventListener('click', () => showCourse('hellp'));
        backToHomeBtn.addEventListener('click', showHome);
    }

    init();
});
