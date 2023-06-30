document.addEventListener("DOMContentLoaded", function() {
    const quoteList = document.getElementById('quote-list');
    const newQuoteForm = document.getElementById('new-quote-form');
  
    // Fetch quotes and likes
    Promise.all([
      fetch('http://localhost:3000/quotes?_embed=likes').then(response => response.json()),
      fetch('http://localhost:3000/likes').then(response => response.json())
    ])
      .then(([quotes, likes]) => {
        // Merge quotes and likes data
        const mergedQuotes = quotes.map(quote => {
          const quoteLikes = likes.filter(like => like.quoteId === quote.id);
          return { ...quote, likes: quoteLikes };
        });
  
        // Render quotes
        mergedQuotes.forEach(quote => {
          renderQuote(quote);
        });
      })
      .catch(error => {
        console.error('Error:', error);
      });
  
    // Add event listener for new quote form submission
    newQuoteForm.addEventListener('submit', function(event) {
      event.preventDefault();
      const newQuoteInput = document.getElementById('new-quote');
      const newAuthorInput = document.getElementById('author');
  
      const quoteData = {
        quote: newQuoteInput.value,
        author: newAuthorInput.value
      };
  
      createQuote(quoteData);
  
      newQuoteInput.value = '';
      newAuthorInput.value = '';
    });
  
    function renderQuote(quote) {
      const quoteCard = document.createElement('li');
      quoteCard.classList.add('quote-card');
      quoteCard.setAttribute('data-quote-id', quote.id);
  
      const blockquote = document.createElement('blockquote');
      blockquote.classList.add('blockquote');
  
      const quoteText = document.createElement('p');
      quoteText.classList.add('mb-0');
      quoteText.textContent = quote.quote;
  
      const author = document.createElement('footer');
      author.classList.add('blockquote-footer');
      author.textContent = quote.author;
  
      const likeButton = document.createElement('button');
      likeButton.classList.add('btn-success');
      likeButton.textContent = 'Likes: ';
      const likeCount = document.createElement('span');
      likeCount.textContent = quote.likes.length;
      likeButton.appendChild(likeCount);
  
      const deleteButton = document.createElement('button');
      deleteButton.classList.add('btn-danger');
      deleteButton.textContent = 'Delete';
  
      // Add event listener for like button
      likeButton.addEventListener('click', () => {
        createLike(quote.id);
      });
  
      // Add event listener for delete button
      deleteButton.addEventListener('click', () => {
        deleteQuote(quote.id, quoteCard);
      });
  
      // Append elements to quote card
      blockquote.appendChild(quoteText);
      blockquote.appendChild(author);
      blockquote.appendChild(document.createElement('br'));
      blockquote.appendChild(likeButton);
      blockquote.appendChild(deleteButton);
  
      quoteCard.appendChild(blockquote);
      quoteList.appendChild(quoteCard);
    }
  
    function createQuote(quoteData) {
      fetch('http://localhost:3000/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(quoteData)
      })
        .then(response => response.json())
        .then(quote => {
          renderQuote(quote);
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  
    function deleteQuote(quoteId, quoteCard) {
      fetch(`http://localhost:3000/quotes/${quoteId}`, {
        method: 'DELETE'
      })
        .then(() => {
          quoteCard.remove();
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  
    function createLike(quoteId) {
      const likeData = {
        quoteId: quoteId
      };
  
      fetch('http://localhost:3000/likes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(likeData)
      })
        .then(response => response.json())
        .then(like => {
          const likeButton = document.querySelector(`li[data-quote-id="${quoteId}"] .btn-success`);
          const likeCount = likeButton.querySelector('span');
          likeCount.textContent = parseInt(likeCount.textContent) + 1;
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  });
  