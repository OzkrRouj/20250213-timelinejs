document.addEventListener('DOMContentLoaded', () => {
    // Cargar datos del JSON
    fetch('data/timeline-data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            // Inicializar timeline con los datos cargados
            const timeline = new TL.Timeline('timeline-embed', data, {
                timenav_height: 150,
                start_at_slide: 0
            });

            // Función para asignar clases personalizadas a los marcadores
            const assignCustomClasses = () => {
                setTimeout(() => {
                    // Selecciona todos los contenedores de marcadores de tiempo
                    const timemarkers = document.querySelectorAll('.tl-timemarker-content-container');
                    // Itera sobre los eventos del JSON para asignar clases
                    data.events.forEach(event => {
                        const groupName = event.group.toLowerCase().replace(/\s+/g, '-'); // Convierte el nombre del grupo a formato de clase
                        // Encuentra el marcador correspondiente al evento
                        timemarkers.forEach(marker => {
                            const markerText = marker.textContent.trim().toLowerCase(); // Normaliza el texto del marcador
                            const headline = event.text.headline.toLowerCase(); // Normaliza el headline del evento
                            // Compara si el texto del marcador incluye el headline del evento
                            if (markerText.includes(headline)) {
                                // Agrega una clase personalizada al marcador basada en el grupo
                                marker.classList.add(`tl-group-${groupName}`);
                            }
                        });
                    });
                }, 100); // Ajusta el tiempo si es necesario
            };

            // Asignar clases personalizadas inicialmente
            assignCustomClasses();

            // Control del modo oscuro
            const darkModeToggle = document.getElementById('darkModeToggle');
            const darkModeStyleSheet = document.getElementById('darkModeStyleSheet');
            const icon = darkModeToggle.querySelector('i'); // Selecciona el ícono

            const toggleDarkMode = (enable) => {
                if (enable) {
                    darkModeStyleSheet.disabled = false;
                    document.body.classList.add('dark-mode');
                    localStorage.setItem('darkMode', 'enabled');
                    icon.classList.remove('fa-sun'); // Cambia el ícono a luna
                    icon.classList.add('fa-moon');
                } else {
                    darkModeStyleSheet.disabled = true;
                    document.body.classList.remove('dark-mode');
                    localStorage.setItem('darkMode', 'disabled');
                    icon.classList.remove('fa-moon'); // Cambia el ícono a sol
                    icon.classList.add('fa-sun');
                }
                timeline.updateDisplay(); // Actualiza la visualización de TimelineJS
                assignCustomClasses(); // Reaplica las clases personalizadas
            };

            darkModeToggle.addEventListener('click', () => {
                toggleDarkMode(darkModeStyleSheet.disabled);
            });

            // Carga inicial
            const isDarkModeEnabled = localStorage.getItem('darkMode') === 'enabled';
            toggleDarkMode(isDarkModeEnabled); // Aplica el estado guardado

            // Asignar funcionalidades a los botones de TimelineJS
            document.querySelectorAll('.tl-menubar-button').forEach(button => {
                button.addEventListener('click', () => {
                    const action = button.getAttribute('aria-label').toLowerCase();
                    switch (action) {
                        case 'zoom in':
                            timeline.zoomIn();
                            break;
                        case 'zoom out':
                            timeline.zoomOut();
                            break;
                        case 'go to the last slide':
                            timeline.goToEnd();
                            break;
                        case 'return to title':
                            timeline.goToStart();
                            break;
                        default:
                            console.warn(`Acción desconocida: ${action}`);
                    }
                    // Reaplicar clases personalizadas después de la acción
                    assignCustomClasses();
                });
            });

            // Observar cambios en la timeline para reaplicar clases
            const observer = new MutationObserver(() => {
                assignCustomClasses();
            });

            // Observar el contenedor principal de la timeline
            const timelineContainer = document.querySelector('#timeline-embed');
            if (timelineContainer) {
                observer.observe(timelineContainer, { childList: true, subtree: true });
            }
        })
        .catch(error => {
            console.error('Error cargando los datos:', error);
            alert(`Hubo un error al cargar los datos: ${error.message}`);
        });
});