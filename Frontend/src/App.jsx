import { useEffect, useState } from 'react';

function App() {
  const [wiadomosc, setWiadomosc] = useState('Ładowanie...');

  useEffect(() => {
    // Zmienna środowiskowa - na produkcji Azure przyjmie URL Twojego backendu
    const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
    
    fetch(apiUrl + '/')
      .then((response) => response.text()) // Zgodnie z index.js odsyłasz czysty tekst 'API MotoSync working!'
      .then((data) => {
        setWiadomosc(data);
      })
      .catch((error) => {
        console.error('Błąd połączenia z backendem:', error);
        setWiadomosc('Nie udało się połączyć z API');
      });
  }, []);

  return (
    <div>
      <h1>Test połączenia Frontend - Backend</h1>
      <p>Odpowiedź z API Node.js: <strong>{wiadomosc}</strong></p>
    </div>
  );
}

export default App;
