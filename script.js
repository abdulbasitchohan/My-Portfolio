const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resize();

const mouse = {
    x: null,
    y: null
};

window.addEventListener("mousemove", e => {
    mouse.x = e.x;
    mouse.y = e.y;
});

window.addEventListener("mouseout", () => {
    mouse.x = null;
    mouse.y = null;
});

let particles = [];
const COUNT = 250;

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.8;
        this.speedY = (Math.random() - 0.5) * 0.8;
        this.depth = Math.random() * 2 + 0.5;
        this.color = `rgba(255, 255, 255, 0.8)`;
    }

    update() {
        this.x += this.speedX * this.depth;
        this.y += this.speedY * this.depth;

        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;

        // Parallax
        if (mouse.x && mouse.y) {
            this.x += (mouse.x - canvas.width / 2) * 0.00005 * this.depth;
            this.y += (mouse.y - canvas.height / 2) * 0.00005 * this.depth;
        }
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size * this.depth, 0, Math.PI * 2);
        ctx.fill();
    }
}

function init() {
    particles = [];
    for (let i = 0; i < COUNT; i++) {
        particles.push(new Particle());
    }
}

function connect() {
    for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
            const dx = particles[a].x - particles[b].x;
            const dy = particles[a].y - particles[b].y;
            const dist = dx * dx + dy * dy;

            if (dist < 100 * 100) {
                ctx.strokeStyle = "transparent";
                ctx.lineWidth = 0.6;
                ctx.beginPath();
                ctx.moveTo(particles[a].x, particles[a].y);
                ctx.lineTo(particles[b].x, particles[b].y);
                ctx.stroke();
            }
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
        p.update();
        p.draw();
    });

    connect();
    requestAnimationFrame(animate);
}

init();
animate();

window.addEventListener("resize", () => {
    resize();
    init();
});



const textElement = document.getElementById("text");

const words = [
    "Frontend Developer",
    "UI / UX Designer",
    "JavaScript Enthusiast",
    "Creative Coder"
];

let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

const typingSpeed = 80;
const deletingSpeed = 50;
const delayBetweenWords = 1200;

function typeEffect() {
    const currentWord = words[wordIndex];

    if (!isDeleting) {
        textElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;

        if (charIndex === currentWord.length) {
            setTimeout(() => isDeleting = true, delayBetweenWords);
        }
    } else {
        textElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
        }
    }

    setTimeout(typeEffect, isDeleting ? deletingSpeed : typingSpeed);
}

typeEffect();
