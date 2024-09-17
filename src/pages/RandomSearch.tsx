import { IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React, { useState, useEffect } from 'react';

/**
 * Die Komponente RandomSearch zeigt einen zufälligen Film nach Genre an.
 *
 * @return {*} 
 */
const RandomSearch: React.FC = () => {
    const [randomMovie, setRandomMovie] = useState<string>('');

    useEffect(() => {
        const fetchRandomMovie = async () => {
            try {
                const response = await fetch('https://api.example.com/random-movie');
                const data = await response.json();
                setRandomMovie(data.title);
            } catch (error) {
                console.error('Error fetching random movie:', error);
            }
        };

        fetchRandomMovie();
    }, []);

    return (
        <IonPage>
            <IonHeader>
        <IonToolbar>
          <IonTitle>Random</IonTitle>
        </IonToolbar>
      </IonHeader>
        </IonPage>
    );
};

export default RandomSearch;