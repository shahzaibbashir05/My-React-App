import React, { useEffect, useState } from 'react';

const VotingWidget = () => {
  const apiUrl = 'https://my.beastscan.com/test-kit';




  
  const [cards, setCards] = useState();
  const [votesData, setVotesData] = useState({}); 
  const [editingIndex, setEditingIndex] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [draggingIndex, setDraggingIndex] = useState(null);


  useEffect(  )

  useEffect(() => {
    fetch(apiUrl)
      .then(res => res.json())
      .then(data => {
        const formattedCards = data.map(card => ({
          id: card.id,
          title: card.title || 'No title',
          description: card.description || 'No description',
          image: card.image || 'https://via.placeholder.com/300',
          buttonLabel: card.buttonLabel || 'Visit',
          buttonLink: card.buttonLink || '#',
        }));

        const formattedVotes = {};
        data.forEach(card => {
          formattedVotes[card.id] = typeof card.votes === 'number' ? card.votes : 0;
        });

        setCards(formattedCards);
        setVotesData(formattedVotes);
      })
      .catch(console.error);
  }, []);

  const vote = async (index, change) => {
    const card = cards[index];
    const currentVotes = votesData[card.id] || 0;
    const newVotes = currentVotes + change;

    setVotesData(prev => ({
      ...prev,
      [card.id]: newVotes
    }));

    try {
      await fetch(`${apiUrl}/${card.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ votes: newVotes }),
      });
    } catch (error) {
      console.error('Error sending vote to server:', error);
    }
  };

  const openEditModal = (index) => {
    setEditingIndex(index);
    setEditTitle(cards[index].title);
    setEditDescription(cards[index].description);
  };

  const saveEdit = () => {
    const updated = [...cards];
    updated[editingIndex].title = editTitle;
    updated[editingIndex].description = editDescription;
    setCards(updated);
    setEditingIndex(null);
  };

  const resetAll = () => {
    const resetVotes = {};
    cards.forEach(card => {
      resetVotes[card.id] = 0;
    });
    setVotesData(resetVotes);
  };

  const sortByVotes = () => {
    const sorted = [...cards].sort((a, b) => (votesData[b.id] || 0) - (votesData[a.id] || 0));
    setCards(sorted);
  };

  const handleDragStart = (index) => {
    setDraggingIndex(index);
  };

  const handleDrop = (index) => {
    if (draggingIndex === null) return;
    const updated = [...cards];
    const [moved] = updated.splice(draggingIndex, 1);
    updated.splice(index, 0, moved);
    setCards(updated);
    setDraggingIndex(null);
  };

  return (
    <div>
      <h1>Voting Widget</h1>
      <div id="controls">
        <button onClick={resetAll}>Reset All</button>
        <button onClick={sortByVotes}>Sort by Votes</button>
      </div>

      <div id="card-container">
        {cards.map((card, index) => (
          <div
            key={card.id}
            className="card"
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(index)}
          >
            <h3>{card.title}</h3>
            <img src={card.image} alt={card.title} />
            <p>{card.description}</p>
            <div className="card-buttons">
              <button onClick={() => vote(index, 1)}>👍</button>
              <span className="vote-count">{votesData[card.id] || 0}</span>
              <button onClick={() => vote(index, -1)}>👎</button>
            </div>
            <a href={card.buttonLink} target="_blank" rel="noopener noreferrer">
              <button>{card.buttonLabel}</button>
            </a>
            <button className="edit-btn" onClick={() => openEditModal(index)}>Edit</button>
          </div>
        ))}
      </div>

      {editingIndex !== null && (
        <>
          <div id="overlay" onClick={() => setEditingIndex(null)} />
          <div id="modal">
            <h3>Edit Card</h3>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Title"
            /><br /><br />
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Description"
            /><br /><br />
            <button onClick={saveEdit}>Save</button>
            <button onClick={() => setEditingIndex(null)}>Cancel</button>
          </div>
        </>
      )}
    </div>
  );
};

export default VotingWidget;
