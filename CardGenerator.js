import axios from 'axios';

class CardGenerator {
  constructor() {
    this.$cardContainer = document.querySelector('.card-container');
    this.$allCards = undefined;

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle('show', entry.isIntersecting);
          if (entry.isIntersecting) {
            this.observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 1,
        rootMargin: '150px',
      }
    );
    this.loadNewCards();
  }

  cacheDOMElements() {
    this.$allCards = document.querySelectorAll('.card');
  }

  loadNewCards() {
    for (let index = 0; index < 6; index++) {
      axios.get('https://dog.ceo/api/breeds/image/random').then((r) => {
        const card = document.createElement('div');
        card.classList.add('card');

        const imageElement = document.createElement('img');
        imageElement.classList.add('forza-img');

        imageElement.setAttribute('src', r.data.message);
        card.appendChild(imageElement);
        this.observer.observe(card);
        this.$cardContainer.append(card);
        this.cacheDOMElements();
        if (this.$allCards.length % 6 === 0) this.lastFunc();
      });
    }
  }

  lastFunc() {
    this.$allCards.forEach((card, idx) => {
      this.observer.observe(card);
    });

    const lastCardObserver = new IntersectionObserver((entries) => {
      const $lastCard = entries[0];
      if (!$lastCard.isIntersecting) return;
      this.loadNewCards();
      lastCardObserver.unobserve($lastCard.target);
    });

    lastCardObserver.observe(document.querySelector('.card:last-child'));
  }
}

export default CardGenerator;
