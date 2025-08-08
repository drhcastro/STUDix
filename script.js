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
            courseContent.innerHTML = "<p class='text-red-500'>Error: No se pudo cargar el contenido del curso. Asegúrese de que el archivo 'course-data.json' sea válido y accesible.</p>";
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
            
            // Lógica para nombrar los botones de los módulos principales
            if (!specialModuleTitles.includes(tabTitle)) {
                const mainModules = data.modules.filter(m => !specialModuleTitles.includes(m.title));
                const moduleNumber = mainModules.findIndex(m => m.id === module.id) + 1;
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
            calculateHellpBtn.
