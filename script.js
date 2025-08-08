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
        // ... (La lógica para la calculadora de HELLP se mantiene igual)
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

        // Lógica para la Clase Magistral Interactiva (Tarjetas)
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

        // Lógica para la Tabla de Diagnóstico Diferencial
        const diffBtns = document.querySelectorAll('.diff-btn');
        if (diffBtns.length > 0) {
            diffBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const colIndex = parseInt(btn.dataset.col);
                    const table = document.getElementById('diff-table');
                    
                    table.querySelectorAll('td, th').forEach(cell => cell.classList.remove('highlight-col'));
                    // nth-child es 1-indexado, así que sumamos 1
                    table.querySelectorAll(`tr td:nth-child(${colIndex + 1}), tr th:nth-child(${colIndex + 1})`).forEach(cell => {
                        cell.classList.add('highlight-col');
                    });
                });
            });
        }

        // Lógica para la Ventana Modal de Signos de Alarma
        const modal = document.getElementById('hepatic-complication-modal');
        const openBtn = document.getElementById('hepatic-complication-btn');
        const closeBtn = document.getElementById('close-modal-btn');

        if(modal && openBtn && closeBtn) {
            openBtn.addEventListener('click', () => {
                modal.classList.remove('hidden');
            });
            closeBtn.addEventListener('click', () => {
                modal.classList.add('hidden');
            });
            // Cerrar al hacer clic fuera del contenido
            modal.addEventListener('click', (event) => {
                if (event.target === modal) {
                    modal.classList.add('hidden');
                }
            });
        }
    }

    async function init() {
        await loadCourseData();
        selectHellpBtn.addEventListener('click', () => showCourse('hellp'));
        backToHomeBtn.addEventListener('click', showHome);
    }

    init();
});
