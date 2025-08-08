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
    // --- CARGA DE DATOS ---
    async function loadCourseData() {
        try {
            const response = await fetch('course-data.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            courseData = await response.json();
        } catch (error) {
            console.error("Error al cargar los datos del curso:", error);
            courseContent.innerHTML = "<p class='text-red-500'>Error: No se pudo cargar el contenido del curso. Asegúrese de que el archivo 'course-data.json' exista y sea accesible.</p>";
        }
    }

    // --- NAVEGACIÓN PRINCIPAL ---
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

    // --- RENDERIZADO DE CONTENIDO ---
    function renderSubNav(data) {
        let subNavHtml = '<div class="flex flex-wrap gap-2">';
        const specialModuleTitles = ["Acciones Prioritarias", "Flujograma (MX)", "Referencias"];
        
        data.modules.forEach((module, index) => {
            const isActive = index === currentModuleIndex;
            let tabTitle = module.title;
            
            // Lógica corregida para nombrar los botones
            if (!specialModuleTitles.includes(tabTitle)) {
                // Filtramos solo los módulos principales para obtener el número correcto
                const mainModules = data.modules.filter(m => !specialModuleTitles.includes(m.title));
                const moduleNumber = mainModules.indexOf(module) + 1;
                if (moduleNumber > 0) {
                   tabTitle = `Módulo ${moduleNumber}`;
                }
            }

            subNavHtml += `<button class="sub-tab-button px-3 py-2 text-xs sm:text-sm rounded-md transition-colors duration-200 ${isActive ? 'sub-tab-active' : 'sub-tab-inactive'}" data-index="${index}">${tabTitle}</button>`;
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

    // --- MANEJO DE EVENTOS DE MÓDULOS ---
    function attachModuleEventListeners() {
        // Calculadora de Estadificación HELLP
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
        
        // Acordeón para Clase de Laboratorio
        const accordionButtons = document.querySelectorAll('.accordion-button');
        accordionButtons.forEach(button => {
            button.addEventListener('click', () => {
                button.classList.toggle('active');
                const content = button.nextElementSibling;
                if (content.style.maxHeight) {
                    content.style.maxHeight = null;
                } else {
                    content.style.maxHeight = content.scrollHeight + "px";
                }
            });
        });

        // Tabla Interactiva de Diagnóstico Diferencial
        const diffBtns = document.querySelectorAll('.diff-btn');
        if (diffBtns.length > 0) {
            diffBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const colIdentifier = btn.textContent.trim(); // "Hipoglucemia Severa", "Trombocitopenia Profunda", etc.
                    const table = document.getElementById('diff-table');
                    
                    let colIndex = -1;
                    if (colIdentifier.includes("Hipoglucemia")) colIndex = 2; // HGAE
                    if (colIdentifier.includes("Trombocitopenia")) colIndex = 3; // PTT
                    if (colIdentifier.includes("Renal")) colIndex = 4; // SHUa
                    if (colIdentifier.includes("ADAMTS13")) colIndex = 3; // PTT
                    
                    if (colIndex !== -1) {
                        table.querySelectorAll('td, th').forEach(cell => cell.classList.remove('highlight-col'));
                        table.querySelectorAll(`tr td:nth-child(${colIndex + 1}), tr th:nth-child(${colIndex + 1})`).forEach(cell => {
                            cell.classList.add('highlight-col');
                        });
                    }
                });
            });
        }
    }

    // --- INICIALIZACIÓN ---
    async function init() {
        await loadCourseData();
        selectHellpBtn.addEventListener('click', () => showCourse('hellp'));
        backToHomeBtn.addEventListener('click', showHome);
    }

    init();
});
