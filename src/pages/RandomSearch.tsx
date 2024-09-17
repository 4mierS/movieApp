import React, { useState, useEffect } from 'react';

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
        <div>
            <h1>Random Movie</h1>
            <p>{randomMovie}</p>
        </div>
    );
};

export default RandomSearch;