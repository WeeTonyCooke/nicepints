export const pubs = [
    {
      id: 'pub_1',
      name: 'The Long Hall',
      city: 'Dublin',
      latitude: 53.3414,
      longitude: -6.2655
    },
    {
      id: 'pub_2',
      name: 'Mulligans',
      city: 'Dublin',
      latitude: 53.3458,
      longitude: -6.2555
    }
  ];
  
  export const pints = [
    {
      id: 'pint_1',
      photo_url: 'https://images.unsplash.com/photo-1572455044327-7348c1be7267?auto=format&fit=crop&w=800&q=80',
      score: 9.1,
      caption: 'Creamy domed head. Perfect temperature.',
      pub_id: 'pub_1',
      user: 'TonyCooke',
      created_at: '2023-10-25T14:48:00.000Z'
    },
    {
      id: 'pint_2',
      photo_url: 'https://images.unsplash.com/photo-1614315585093-333e60126a11?auto=format&fit=crop&w=800&q=80',
      score: 8.5,
      caption: 'Solid pint, good atmosphere.',
      pub_id: 'pub_2',
      user: 'GuinnessFan99',
      created_at: '2023-10-26T18:30:00.000Z'
    },
    {
      id: 'pint_3',
      photo_url: 'https://images.unsplash.com/photo-1563514995960-934c9c7f66de?auto=format&fit=crop&w=800&q=80',
      score: 7.0,
      caption: 'A bit too cold, but poured well.',
      pub_id: null, // Skipped pub
      user: 'MysteryDrinker',
      created_at: '2023-10-27T20:15:00.000Z'
    }
  ];