// Registra o plugin de Scroll (necessário para a seção do YouTube na Home).
// Protegido: sobre.html, contato.html e videos.html não carregam o ScrollTrigger
// (só a Home usa a animação de scroll), então sem essa proteção o script inteiro
// quebrava antes de chegar na lógica do menu de três pontinhos.
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. Lógica do Menu de Três Pontinhos (não depende do GSAP)
    const dotsBtn = document.querySelector('.dots-btn');
    const dropdownMenu = document.querySelector('.dropdown-menu');

    if (dotsBtn && dropdownMenu) {
        dotsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdownMenu.classList.toggle('active');
        });

        // Fecha o menu se clicar em qualquer lugar fora dele
        document.addEventListener('click', (e) => {
            if (!dropdownMenu.contains(e.target) && !dotsBtn.contains(e.target)) {
                dropdownMenu.classList.remove('active');
            }
        });
    }

    // 1b. Animação de entrada leve para elementos com a classe .reveal
    // (usada em sobre.html, contato.html e videos.html — não depende do GSAP/ScrollTrigger)
    const revealEls = document.querySelectorAll('.reveal');
    if (revealEls.length) {
        if (typeof IntersectionObserver !== 'undefined') {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

            revealEls.forEach((el) => observer.observe(el));

            // Rede de segurança: garante que nada fique invisível
            // (ex.: dispositivos muito lentos, leitores de tela, ferramentas de captura).
            setTimeout(() => {
                revealEls.forEach((el) => el.classList.add('is-visible'));
            }, 2500);
        } else {
            revealEls.forEach((el) => el.classList.add('is-visible'));
        }
    }

    // 1c. Formulário de orçamento (contato.html) — monta a mensagem e abre no WhatsApp
    const formOrcamento = document.getElementById('form-orcamento');
    if (formOrcamento) {
        formOrcamento.addEventListener('submit', (e) => {
            e.preventDefault();

            const nome = document.getElementById('nome').value.trim();
            const data = document.getElementById('data-evento').value;
            const cidade = document.getElementById('cidade').value.trim();
            const formato = document.getElementById('formato').value;
            const mensagem = document.getElementById('mensagem').value.trim();

            let dataFormatada = '';
            if (data) {
                const [ano, mes, dia] = data.split('-');
                dataFormatada = `${dia}/${mes}/${ano}`;
            }

            let texto = `Olá! Meu nome é ${nome || '(não informado)'} e gostaria de um orçamento para meu casamento.`;
            if (dataFormatada) texto += `\nData: ${dataFormatada}`;
            if (cidade) texto += `\nCidade/local: ${cidade}`;
            if (formato) texto += `\nFormato desejado: ${formato}`;
            if (mensagem) texto += `\nMensagem: ${mensagem}`;

            const url = `https://wa.me/5511972045559?text=${encodeURIComponent(texto)}`;
            window.open(url, '_blank', 'noopener');
        });
    }

    // As animações abaixo só rodam se o GSAP tiver carregado nesta página
    if (typeof gsap === 'undefined') return;

    // 2. Animação de entrada na Capa (Hero Section)
    if (document.querySelector('.hero-content h1')) {
        gsap.from(".hero-content h1", {
            y: 50,
            opacity: 0,
            duration: 1.5,
            ease: "power3.out",
            delay: 0.2
        });

        gsap.from(".hero-content p", {
            y: 30,
            opacity: 0,
            duration: 1.5,
            ease: "power3.out",
            delay: 0.5 
        });

        gsap.from(".btn-agenda", {
            y: 20,
            opacity: 0,
            duration: 1,
            ease: "power2.out",
            delay: 0.8
        });
    }

    // 3. Animação de Scroll na Seção de Vídeos do YouTube (só roda se o ScrollTrigger existir)
    if (document.querySelector('.videos-section') && typeof ScrollTrigger !== 'undefined') {
        // Anima o título
        gsap.from(".videos-section h2", {
            scrollTrigger: {
                trigger: ".videos-section",
                start: "top 80%" // Inicia quando o topo da seção chega em 80% da tela
            },
            y: 40,
            opacity: 0,
            duration: 1
        });

        // Anima os vídeos aparecendo em sequência
        gsap.from(".videos-grid iframe", {
            scrollTrigger: {
                trigger: ".videos-grid",
                start: "top 85%"
            },
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.3 // Cria o efeito de "um por um"
        });
    }
});
