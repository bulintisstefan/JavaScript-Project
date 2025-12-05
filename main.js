const booksUrl = 'http://localhost:3000/books';
const gamesUrl = 'http://localhost:3000/games';

const payload = {
  books: [
    { id: 1, title: "Carrie" },
    { id: 2, title: "Salem's Lot" },
    { id: 3, title: "The Shining" },
    { id: 4, title: "Rage" },
    { id: 5, title: "The Stand" },
    { id: 6, title: "The Long Walk" },
    { id: 7, title: "The Dead Zone" }
  ],
  games: [
    { id: 1370228 }, { id: 1268338 }, { id: 1377630 }, { id: 104935 }, { id: 1354215 }, { id: 1487544 },
    { id: 1403470 }, { id: 906298 }, { id: 1475352 }, { id: 97611 }, { id: 311163 }, { id: 455590 },
    { id: 219685 }, { id: 416986 }, { id: 622478 }, { id: 905563 }, { id: 324183 }, { id: 622511 },
    { id: 442240 }, { id: 1013856 }, { id: 74021 }, { id: 622428 }, { id: 434940 }, { id: 85098 },
    { id: 238482 }, { id: 124199 }, { id: 346723 }, { id: 15174 }, { id: 199447 }, { id: 127011 },
    { id: 431985 }, { id: 19463 }, { id: 1247759 }, { id: 663491 }, { id: 284530 }, { id: 1144678 },
    { id: 293973 }, { id: 939536 }, { id: 1172723 }, { id: 1110300 }, { id: 1176072 }, { id: 26131 },
    { id: 1354805 }, { id: 1174199 }
  ]
};

document.addEventListener('DOMContentLoaded', () => {
  const booksTotal = payload.books?.length ?? 0;
  const gamesTotal = payload.games?.length ?? 0;

  const booksCountEl = document.getElementById('books-count');
  const gamesCountEl = document.getElementById('games-count');
  const countsEl = document.getElementById('counts');

  if (booksCountEl) booksCountEl.textContent = `${booksTotal} titluri`;
  if (gamesCountEl) gamesCountEl.textContent = `${gamesTotal} jocuri`;
  if (countsEl) countsEl.textContent = `Books: ${booksTotal} · Games: ${gamesTotal}`;

  for (const el of document.querySelectorAll('.card')) {
    el.addEventListener('click', () => window.location.href = el.dataset.href);
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        window.location.href = el.dataset.href;
      }
    });
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `rotateX(${y * -4}deg) rotateY(${x * 6}deg) translateY(-6px) scale(1.01)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  }
});
