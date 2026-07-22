// galeria.js — Lee fotos.txt y genera la galería con lightbox

document.addEventListener('DOMContentLoaded', async () => {
    const contenedor = document.getElementById('galeria-contenedor');
    const estado = document.getElementById('galeria-estado');

    // Crear el overlay del lightbox (oculto por defecto)
    const lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.innerHTML = `
        <span class="lightbox-cerrar">&times;</span>
        <img src="" alt="" id="lightbox-img">
        <p id="lightbox-caption"></p>
    `;
    document.body.appendChild(lightbox);

    // Cerrar lightbox al hacer click en la X, en el fondo, o con Escape
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox-cerrar')) {
            lightbox.classList.remove('activo');
            document.body.style.overflow = '';
        }
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            lightbox.classList.remove('activo');
            document.body.style.overflow = '';
        }
    });

    try {
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

        estado.remove();

        const grid = document.createElement('div');
        grid.className = 'galeria-grid';

        lineas.forEach((linea, index) => {
            const partes = linea.split('|').map(p => p.trim());
            const url = partes[0];
            const descripcion = partes[1] || 'Sin descripción';
            const fecha = partes[2] || '';

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

            // Al hacer click en la tarjeta, abrir lightbox
            tarjeta.addEventListener('click', () => {
                const img = document.getElementById('lightbox-img');
                const caption = document.getElementById('lightbox-caption');
                img.src = url;
                img.alt = descripcion;
                caption.textContent = descripcion + (fecha ? ` — ${fecha}` : '');
                lightbox.classList.add('activo');
                document.body.style.overflow = 'hidden'; // Evitar scroll de fondo
            });

            grid.appendChild(tarjeta);
        });

        contenedor.appendChild(grid);

    } catch (error) {
        console.error('Error cargando la galería:', error);
        estado.textContent = 'Error al cargar las fotos. Revisá que fotos.txt exista en el repositorio.';
        estado.style.color = '#a44';
    }
});
