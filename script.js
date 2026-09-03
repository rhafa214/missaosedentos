document.addEventListener('DOMContentLoaded', () => {
    
    // --- 0. CONTADOR REGRESSIVO DO PRÓXIMO LANÇAMENTO (MODO EXPECTATIVA DISCRETO) ---
    const elementoDias = document.getElementById('tempo-dias');
    const elementoHoras = document.getElementById('tempo-horas');
    const elementoMinutos = document.getElementById('tempo-minutos');
    const elementoSegundos = document.getElementById('tempo-segundos');

    if (elementoDias && elementoHoras && elementoMinutos) {
        // Data alvo do próximo lançamento (18 de Setembro de 2026 às 00:00 Horário de Brasília)
        const dataAlvo = new Date("2026-09-18T00:00:00-03:00").getTime();

        function atualizarContador() {
            const agora = new Date().getTime();
            const diferenca = dataAlvo - agora;

            if (diferenca <= 0) {
                elementoDias.textContent = "00";
                elementoHoras.textContent = "00";
                elementoMinutos.textContent = "00";
                if (elementoSegundos) elementoSegundos.textContent = "00";
                const chamada = document.querySelector('.teaser-chamada-txt');
                if (chamada) chamada.textContent = "Lançamento Disponível";
                return;
            }

            const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));
            const horas = Math.floor((diferenca % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutos = Math.floor((diferenca % (1000 * 60 * 60)) / (1000 * 60));
            const segundos = Math.floor((diferenca % (1000 * 60)) / 1000);

            elementoDias.textContent = String(dias).padStart(2, '0');
            elementoHoras.textContent = String(horas).padStart(2, '0');
            elementoMinutos.textContent = String(minutos).padStart(2, '0');
            if (elementoSegundos) elementoSegundos.textContent = String(segundos).padStart(2, '0');
        }

        atualizarContador();
        setInterval(atualizarContador, 1000);
    }

    // --- 1. LÓGICA DO MENU LATERAL ---
    const menuOverlay = document.getElementById('menu-overlay');
    const btnOpen = document.getElementById('open-menu');
    const btnClose = document.getElementById('close-menu');
    const menuLinks = document.querySelectorAll('.menu-link');

    if (btnOpen && menuOverlay) {
        btnOpen.addEventListener('click', () => {
            menuOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        btnClose.addEventListener('click', () => {
            menuOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        });

        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuOverlay.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });
    }

    // --- 2. CARROSSEL EVENTOS (DNJ) ---
    const carrossel = document.getElementById('carrossel');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (carrossel && nextBtn && prevBtn) {
        nextBtn.addEventListener('click', () => {
            carrossel.scrollLeft += carrossel.offsetWidth / 2;
        });
        prevBtn.addEventListener('click', () => {
            carrossel.scrollLeft -= carrossel.offsetWidth / 2;
        });
    }

    // --- 3. LIGHTBOX (EXPANDIR FOTOS) ---
    const modalFoto = document.getElementById('modal-foto');
    const imgModal = document.getElementById('img-modal');
    const btnFecharLightbox = document.getElementById('fechar-lightbox');
    const fotosCarrossel = document.querySelectorAll('.foto-slide img');

    if (modalFoto && imgModal) {
        fotosCarrossel.forEach(foto => {
            foto.addEventListener('click', () => {
                imgModal.src = foto.src;
                modalFoto.style.display = 'flex';
                setTimeout(() => modalFoto.classList.add('aberto'), 10);
                document.body.style.overflow = 'hidden';
            });
        });

        const fecharTudo = () => {
            modalFoto.classList.remove('aberto');
            setTimeout(() => modalFoto.style.display = 'none', 300);
            document.body.style.overflow = 'auto';
        };

        if (btnFecharLightbox) {
            btnFecharLightbox.addEventListener('click', fecharTudo);
        }
        
        modalFoto.addEventListener('click', (e) => {
            if (e.target === modalFoto) {
                fecharTudo();
            }
        });
    }

    // --- 4. ANIMAÇÕES DE ENTRADA (SCROLL REVEAL) ---
    const secoesParaAnimar = document.querySelectorAll('section, .card-musica-pro, .card-agenda');
    secoesParaAnimar.forEach(s => s.classList.add('revelar'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('ativo');
            }
        });
    }, { threshold: 0.1 });

    secoesParaAnimar.forEach(secao => observer.observe(secao));

    // --- 5. BARRA DE PROGRESSO ANIMADA (Página Patrocínio) ---
    const barraProgresso = document.querySelector('.progresso-atual');
    const textoPorcentagem = document.querySelector('.porcentagem');

    if (barraProgresso && textoPorcentagem) {
        const barraObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const alvo = entry.target.getAttribute('data-width');
                    entry.target.style.width = alvo + '%';
                    
                    let atual = 0;
                    const contador = setInterval(() => {
                        if (atual >= alvo) {
                            textoPorcentagem.innerText = alvo + '%';
                            clearInterval(contador);
                        } else {
                            atual++;
                            textoPorcentagem.innerText = atual + '%';
                        }
                    }, 25);
                    barraObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        barraObserver.observe(barraProgresso);
    }
    
    // --- 6. AGENDA DE MISSÕES DO GOOGLE SHEETS ---
    const URL_PLANILHA = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRzZveDQvFHn857898t5alXAoKjdDuqRn6jvBsCiZ8X1QIGF3yIb7ebtVws8gkyHaSd-2ORtrbstc8-/pub?output=csv";

    const listaAgenda = document.getElementById('lista-agenda');
    const btnCarregar = document.getElementById('btn-carregar-agenda');
    
    if (listaAgenda && btnCarregar) {
        let eventosFuturos = [];
        let itensVisiveis = 3;

        fetch(URL_PLANILHA)
            .then(res => res.text())
            .then(data => {
                const linhas = data.split('\n').slice(1); 
                const hoje = new Date();
                hoje.setHours(0, 0, 0, 0);

                eventosFuturos = [];

                linhas.forEach(linha => {
                    const col = linha.split(',');
                    if (col.length < 6) return;

                    const dataEvento = new Date(col[0].trim() + "T00:00:00");

                    if (dataEvento >= hoje) {
                        eventosFuturos.push({
                            dataStr: col[0].trim(),
                            titulo: col[1].trim(),
                            local: col[2].trim(),
                            cidade: col[3].trim(),
                            dia: col[4].trim(),
                            mes: col[5].trim()
                        });
                    }
                });

                eventosFuturos.sort((a, b) => new Date(a.dataStr) - new Date(b.dataStr));
                renderizarAgenda();
            })
            .catch(err => {
                listaAgenda.innerHTML = "<p>Erro ao carregar agenda.</p>";
                console.error(err);
            });

        function renderizarAgenda() {
            listaAgenda.innerHTML = ""; 
            
            if (eventosFuturos.length === 0) {
                listaAgenda.innerHTML = "<p style='color:#aaa; padding: 20px;'>Nenhuma missão agendada no momento.</p>";
                btnCarregar.style.display = 'none';
                return;
            }

            eventosFuturos.forEach((ev, index) => {
                const card = document.createElement('div');
                card.className = 'card-evento';
                
                if (index < itensVisiveis) {
                    card.classList.add('show');
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
                
                card.innerHTML = `
                    <div class="data-evento">
                        <span class="dia">${ev.dia}</span>
                        <span class="mes">${ev.mes}</span>
                    </div>
                    <div class="info-evento">
                        <h3>${ev.titulo}</h3>
                        <p><i class="fas fa-church"></i> ${ev.local}</p>
                        <p><i class="fas fa-map-marker-alt"></i> ${ev.cidade}</p>
                    </div>
                    <div class="status-evento"><span class="badge-agenda">CONFIRMADO</span></div>
                `;
                listaAgenda.appendChild(card);
            });

            if (eventosFuturos.length > 3) {
                btnCarregar.style.display = 'inline-block';
                btnCarregar.innerText = itensVisiveis >= eventosFuturos.length ? "VER MENOS" : "VER MAIS MISSÕES";
            } else {
                btnCarregar.style.display = 'none';
            }
        }

        btnCarregar.addEventListener('click', () => {
            if (itensVisiveis < eventosFuturos.length) {
                itensVisiveis += 3;
            } else {
                itensVisiveis = 3;
                window.scrollTo({ top: document.getElementById('agenda').offsetTop - 50, behavior: 'smooth' });
            }
            renderizarAgenda();
        });
    }
});