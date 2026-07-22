// galeria.js — Lee fotos.txt y genera la galería

document.addEventListener('DOMContentLoaded', async () => {
    const contenedor = document.getElementById('galeria-contenedor');
    const estado = document.getElementById('galeria-estado');

    try {
        // Fetch del archivo de configuración
        const respuesta = await fetch('fotos.txt');
        
        if (!respuesta.ok) {
            throw new Error(`No se pudo cargar fotos.txt (${respuesta.status})`);
        }

        const texto = await respuesta.text();
        const lineas = texto
            .split('\n')
            .map(l => l.trim())
            .filter(l => l.length > 0 && !l.startsWith('#'));

        if (lineas.length === 0) {
            estado.textContent = 'No hay fotos cargadas todavía.';
            return;
        }

        // Limpiar estado de carga
        estado.remove();

        // Crear el grid
        const grid = document.createElement('div');
        grid.className = 'galeria-grid';

        lineas.forEach((linea, index) => {
            const partes = linea.split('|').map(p => p.trim());
            const url = partes[0];
            const descripcion = partes[1] || 'Sin descripción';
            const fecha = partes[2] || '';

            // Validar que la URL parezca una imagen
            if (!url.match(/^https?:\/\/.+/i)) {
                console.warn(`Línea ${index + 1} ignorada — URL inválida:`, url);
                return;
            }

            const tarjeta = document.createElement('div');
            tarjeta.className = 'tarjeta-foto';

            tarjeta.innerHTML = `
                <img src="${url}" 
                     alt="${descripcion}" 
                     loading="lazy"
                     onerror="this.parentElement.style.display='none'; console.warn('No se pudo cargar:', '${url}')">
                <div class="tarjeta-info">
                    ${fecha ? `<span class="fecha">${fecha}</span>` : ''}
                    <p class="descripcion">${descripcion}</p>
                </div>
            `;

            grid.appendChild(tarjeta);
        });

        contenedor.appendChild(grid);

    } catch (error) {
        console.error('Error cargando la galería:', error);
        estado.textContent = 'Error al cargar las fotos. Revisá que fotos.txt exista en el repositorio.';
        estado.style.color = '#a44';
    }
});