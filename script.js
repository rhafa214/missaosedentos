document.addEventListener('DOMContentLoaded', () => {
    
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
            carrossel.scrollLeft += carrossel.offsetWidth;
        });
        prevBtn.addEventListener('click', () => {
            carrossel.scrollLeft -= carrossel.offsetWidth;
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
                modalFoto.style.display = 'flex';
                imgModal.src = foto.src;
                document.body.style.overflow = 'hidden';
            });
        });

        btnFecharLightbox.addEventListener('click', () => {
            modalFoto.style.display = 'none';
            document.body.style.overflow = 'auto';
        });

        modalFoto.addEventListener('click', (e) => {
            if (e.target === modalFoto) {
                modalFoto.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }

    // --- 4. BARRA DE PROGRESSO ANIMADA ---
    const barraProgresso = document.querySelector('.progresso-atual');
    const textoPorcentagem = document.querySelector('.porcentagem');

    if (barraProgresso && textoPorcentagem) {
        const animarBarra = (entradas, observador) => {
            entradas.forEach(entrada => {
                if (entrada.isIntersecting) {
                    const alvo = entrada.target.getAttribute('data-width');
                    entrada.target.style.width = alvo + '%';
                    
                    let contagem = 0;
                    const intervalo = setInterval(() => {
                        if (contagem >= alvo) {
                            clearInterval(intervalo);
                        } else {
                            contagem++;
                            textoPorcentagem.innerText = contagem + '%';
                        }
                    }, 20);
                    observador.unobserve(entrada.target);
                }
            });
        };

        const observador = new IntersectionObserver(animarBarra, { threshold: 0.5 });
        observador.observe(barraProgresso);
    }
});
document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. MENU LATERAL ---
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

    // --- 2. CARROSSEL DNJ ---
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

    // --- 3. LIGHTBOX (AMPLIAR FOTOS) ---
    const modal = document.getElementById('modal-foto');
    const imgModal = document.getElementById('img-modal');
    const btnFechar = document.getElementById('fechar-lightbox');
    const fotos = document.querySelectorAll('.foto-slide img');

    if (modal && imgModal) {
        fotos.forEach(foto => {
            foto.addEventListener('click', () => {
                imgModal.src = foto.src;
                modal.style.display = 'flex';
                setTimeout(() => modal.classList.add('aberto'), 10);
                document.body.style.overflow = 'hidden';
            });
        });

        const fecharTudo = () => {
            modal.classList.remove('aberto');
            setTimeout(() => modal.style.display = 'none', 300);
            document.body.style.overflow = 'auto';
        };

        btnFechar.addEventListener('click', fecharTudo);
        modal.addEventListener('click', (e) => { if(e.target === modal) fecharTudo(); });
    }

    // --- 4. ANIMAÇÕES DE ENTRADA (SCROLL REVEAL) ---
    // Adicione a classe 'revelar' nas tags do HTML que você quer que animem
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

    // --- 5. BARRA DE PROGRESSO (Página Patrocínio) ---
    const barra = document.querySelector('.progresso-atual');
    const texto = document.querySelector('.porcentagem');

    if (barra && texto) {
        const barraObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const alvo = entry.target.getAttribute('data-width');
                    entry.target.style.width = alvo + '%';
                    
                    let atual = 0;
                    const contador = setInterval(() => {
                        if (atual >= alvo) {
                            texto.innerText = alvo + '%';
                            clearInterval(contador);
                        } else {
                            atual++;
                            texto.innerText = atual + '%';
                        }
                    }, 25);
                    barraObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        barraObserver.observe(barra);
    }
});
document.addEventListener('DOMContentLoaded', () => {
    const listaAgenda = document.getElementById('lista-agenda');
    const btnCarregar = document.getElementById('btn-carregar-agenda');
    const sessaoAgenda = document.getElementById('agenda'); 
    
    if (listaAgenda && btnCarregar) {
        const cards = Array.from(listaAgenda.getElementsByClassName('card-evento'));
        const totalItens = cards.length;
        let itensVisiveis = 3;

        const atualizarAgenda = () => {
            cards.forEach((card, index) => {
                if (index < itensVisiveis) {
                    card.classList.add('show');
                } else {
                    card.classList.remove('show');
                }
            });

            // Lógica do Texto do Botão
            if (totalItens <= 3) {
                btnCarregar.style.display = 'none';
            } else if (itensVisiveis >= totalItens) {
                btnCarregar.innerText = "VER MENOS";
            } else {
                btnCarregar.innerText = "VER MAIS MISSÕES";
            }
        };

        atualizarAgenda();

        btnCarregar.addEventListener('click', () => {
            if (itensVisiveis < totalItens) {
                itensVisiveis += 3;
                atualizarAgenda();
            } else {
                itensVisiveis = 3;
                atualizarAgenda();
                // Scroll suave para não perder a referência
                window.scrollTo({
                    top: sessaoAgenda.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    }
});