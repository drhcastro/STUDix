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
                const platelets = parseInt(document.getElementById('platelets').value) || 0;
                const ast = parseInt(document.getElementById('ast').value) || 0;
                const ldh = parseInt(document.getElementById('ldh').value) || 0;
                const resultsDiv = document.getElementById('hellp-results');
                let mississippiClass = "No clasifica o datos insuficientes.";
                if (ldh >= 600) {
                    if (platelets <= 50000 && ast >= 70) mississippiClass = "Clase I (Severo)";
                    else if (platelets > 50000 && platelets <= 100000 && ast >= 70) mississippiClass = "Clase II (Moderado)";
                }
                let tennesseeClass = "No cumple criterios para HELLP Completo.";
                 if (platelets <= 100000 && ast >= 70 && ldh >= 600) {
                    tennesseeClass = "Síndrome de HELLP Completo.";
                }
                resultsDiv.innerHTML = `<p><strong>Clasificación de Mississippi:</strong> ${mississippiClass}</p><p><strong>Criterios de Tennessee:</strong> ${tennesseeClass}</p>`;
                resultsDiv.classList.remove('hidden');
            });
        }

        // Lógica RESTAURADA para la Clase Magistral Interactiva (Tarjetas)
        const labTabButtons = document.querySelectorAll('.lab-tab-btn');
        if(labTabButtons.length > 0) {
            const labContentPanes = document.querySelectorAll('.lab-content-pane');
            labTabButtons.forEach(button => {
                button.addEventListener('click', () => {
                    labTabButtons.forEach(btn => btn.classList.remove('lab-tab-active'));
                    button.classList.add('lab-tab-active');
                    const targetId = button.dataset.target;
                    labContentPanes.forEach(pane => {
                        pane.classList.toggle('hidden', pane.id !== targetId);
                    });
                });
            });
        }

        // Lógica CORREGIDA para la Tabla de Diagnóstico Diferencial
        const diffBtns = document.querySelectorAll('.diff-btn');
        if (diffBtns.length > 0) {
            diffBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const table = document.getElementById('diff-table');
                    table.querySelectorAll('td, th').forEach(cell => cell.classList.remove('highlight-col'));
                    
                    const colsToHighlight = btn.dataset.col.split(',');
                    
                    colsToHighlight.forEach(colIndexStr => {
                        const colIndex = parseInt(colIndexStr);
                        // nth-child es 1-indexado, y la primera columna de datos (HELLP) es la 2da en el DOM
                        table.querySelectorAll(`tr td:nth-child(${colIndex + 1}), tr th:nth-child(${colIndex + 1})`).forEach(cell => {
                            cell.classList.add('highlight-col');
                        });
                    });
                });
            });
        }

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
    }

    async function init() {
        await loadCourseData();
        selectHellpBtn.addEventListener('click', () => showCourse('hellp'));
        backToHomeBtn.addEventListener('click', showHome);
    }

    init();
});
