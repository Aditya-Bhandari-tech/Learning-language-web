// Comprehensive language lessons data
export const lessonsData = {
  Spanish: {
    beginner: [
      {
        id: 'spanish-basic-greetings',
        title: 'Basic Greetings',
        description: 'Learn essential Spanish greetings and introductions',
        level: 'Beginner',
        duration: 15,
        lessons: 5,
        completed: 0,
        type: 'vocabulary',
        difficulty: 1,
        image: '👋',
        topics: ['Greetings', 'Introductions', 'Politeness'],
        content: [
          {
            type: 'vocabulary',
            words: [
              { word: 'Hola', translation: 'Hello', pronunciation: 'OH-lah' },
              { word: 'Buenos días', translation: 'Good morning', pronunciation: 'BWEH-nohs DEE-ahs' },
              { word: 'Buenas tardes', translation: 'Good afternoon', pronunciation: 'BWEH-nahs TAHR-dehs' },
              { word: 'Buenas noches', translation: 'Good night', pronunciation: 'BWEH-nahs NOH-chehs' },
              { word: '¿Cómo estás?', translation: 'How are you?', pronunciation: 'KOH-moh ehs-TAHS' },
              { word: 'Bien, gracias', translation: 'Fine, thank you', pronunciation: 'bee-EHN, GRAH-see-ahs' },
              { word: 'Mucho gusto', translation: 'Nice to meet you', pronunciation: 'MOO-choh GOOS-toh' },
              { word: 'Adiós', translation: 'Goodbye', pronunciation: 'ah-dee-OHS' }
            ]
          }
        ]
      },
      {
        id: 'spanish-numbers',
        title: 'Numbers 1-20',
        description: 'Master Spanish numbers from 1 to 20',
        level: 'Beginner',
        duration: 20,
        lessons: 4,
        completed: 0,
        type: 'vocabulary',
        difficulty: 1,
        image: '🔢',
        topics: ['Numbers', 'Counting'],
        content: [
          {
            type: 'vocabulary',
            words: [
              { word: 'Uno', translation: 'One', pronunciation: 'OO-noh' },
              { word: 'Dos', translation: 'Two', pronunciation: 'dohs' },
              { word: 'Tres', translation: 'Three', pronunciation: 'trehs' },
              { word: 'Cuatro', translation: 'Four', pronunciation: 'KWAH-troh' },
              { word: 'Cinco', translation: 'Five', pronunciation: 'SEEN-koh' },
              { word: 'Seis', translation: 'Six', pronunciation: 'seys' },
              { word: 'Siete', translation: 'Seven', pronunciation: 'see-EH-teh' },
              { word: 'Ocho', translation: 'Eight', pronunciation: 'OH-choh' },
              { word: 'Nueve', translation: 'Nine', pronunciation: 'NWEH-beh' },
              { word: 'Diez', translation: 'Ten', pronunciation: 'dee-EHS' }
            ]
          }
        ]
      },
      {
        id: 'spanish-colors',
        title: 'Colors',
        description: 'Learn Spanish colors and basic descriptions',
        level: 'Beginner',
        duration: 15,
        lessons: 3,
        completed: 0,
        type: 'vocabulary',
        difficulty: 1,
        image: '🎨',
        topics: ['Colors', 'Descriptions'],
        content: [
          {
            type: 'vocabulary',
            words: [
              { word: 'Rojo', translation: 'Red', pronunciation: 'ROH-hoh' },
              { word: 'Azul', translation: 'Blue', pronunciation: 'ah-SOOL' },
              { word: 'Verde', translation: 'Green', pronunciation: 'BEHR-deh' },
              { word: 'Amarillo', translation: 'Yellow', pronunciation: 'ah-mah-REE-yoh' },
              { word: 'Negro', translation: 'Black', pronunciation: 'NEH-groh' },
              { word: 'Blanco', translation: 'White', pronunciation: 'BLAHN-koh' },
              { word: 'Gris', translation: 'Gray', pronunciation: 'grees' },
              { word: 'Marrón', translation: 'Brown', pronunciation: 'mah-RROHN' }
            ]
          }
        ]
      }
    ],
    intermediate: [
      {
        id: 'spanish-family',
        title: 'Family Members',
        description: 'Learn vocabulary for family relationships',
        level: 'Intermediate',
        duration: 25,
        lessons: 6,
        completed: 0,
        type: 'vocabulary',
        difficulty: 2,
        image: '👨‍👩‍👧‍👦',
        topics: ['Family', 'Relationships'],
        content: [
          {
            type: 'vocabulary',
            words: [
              { word: 'Familia', translation: 'Family', pronunciation: 'fah-MEE-lee-ah' },
              { word: 'Padre', translation: 'Father', pronunciation: 'PAH-dreh' },
              { word: 'Madre', translation: 'Mother', pronunciation: 'MAH-dreh' },
              { word: 'Hermano', translation: 'Brother', pronunciation: 'ehr-MAH-noh' },
              { word: 'Hermana', translation: 'Sister', pronunciation: 'ehr-MAH-nah' },
              { word: 'Abuelo', translation: 'Grandfather', pronunciation: 'ah-BWEH-loh' },
              { word: 'Abuela', translation: 'Grandmother', pronunciation: 'ah-BWEH-lah' },
              { word: 'Tío', translation: 'Uncle', pronunciation: 'TEE-oh' },
              { word: 'Tía', translation: 'Aunt', pronunciation: 'TEE-ah' }
            ]
          }
        ]
      }
    ]
  },
  French: {
    beginner: [
      {
        id: 'french-basic-greetings',
        title: 'Basic Greetings',
        description: 'Learn essential French greetings and introductions',
        level: 'Beginner',
        duration: 15,
        lessons: 5,
        completed: 0,
        type: 'vocabulary',
        difficulty: 1,
        image: '👋',
        topics: ['Greetings', 'Introductions', 'Politeness'],
        content: [
          {
            type: 'vocabulary',
            words: [
              { word: 'Bonjour', translation: 'Hello/Good morning', pronunciation: 'bohn-ZHOOR' },
              { word: 'Bonsoir', translation: 'Good evening', pronunciation: 'bohn-SWAHR' },
              { word: 'Salut', translation: 'Hi/Bye', pronunciation: 'sah-LOO' },
              { word: 'Au revoir', translation: 'Goodbye', pronunciation: 'oh ruh-VWAHR' },
              { word: 'Comment allez-vous?', translation: 'How are you?', pronunciation: 'koh-MAHN tah-lay-VOO' },
              { word: 'Je vais bien', translation: 'I am fine', pronunciation: 'zhuh vay bee-AHN' },
              { word: 'Enchanté', translation: 'Nice to meet you', pronunciation: 'ahn-shahn-TAY' },
              { word: 'Merci', translation: 'Thank you', pronunciation: 'mehr-SEE' }
            ]
          }
        ]
      },
      {
        id: 'french-numbers',
        title: 'Numbers 1-20',
        description: 'Master French numbers from 1 to 20',
        level: 'Beginner',
        duration: 20,
        lessons: 4,
        completed: 0,
        type: 'vocabulary',
        difficulty: 1,
        image: '🔢',
        topics: ['Numbers', 'Counting'],
        content: [
          {
            type: 'vocabulary',
            words: [
              { word: 'Un', translation: 'One', pronunciation: 'uhn' },
              { word: 'Deux', translation: 'Two', pronunciation: 'duh' },
              { word: 'Trois', translation: 'Three', pronunciation: 'twah' },
              { word: 'Quatre', translation: 'Four', pronunciation: 'KAHT-ruh' },
              { word: 'Cinq', translation: 'Five', pronunciation: 'sank' },
              { word: 'Six', translation: 'Six', pronunciation: 'sees' },
              { word: 'Sept', translation: 'Seven', pronunciation: 'set' },
              { word: 'Huit', translation: 'Eight', pronunciation: 'weet' },
              { word: 'Neuf', translation: 'Nine', pronunciation: 'nuhf' },
              { word: 'Dix', translation: 'Ten', pronunciation: 'dees' }
            ]
          }
        ]
      }
    ],
    intermediate: [
      {
        id: 'french-food',
        title: 'Food & Dining',
        description: 'Learn vocabulary for food, restaurants, and dining',
        level: 'Intermediate',
        duration: 25,
        lessons: 6,
        completed: 0,
        type: 'vocabulary',
        difficulty: 2,
        image: '🍽️',
        topics: ['Food', 'Restaurants', 'Dining'],
        content: [
          {
            type: 'vocabulary',
            words: [
              { word: 'Restaurant', translation: 'Restaurant', pronunciation: 'rehs-toh-RAHN' },
              { word: 'Menu', translation: 'Menu', pronunciation: 'muh-NOO' },
              { word: 'Pain', translation: 'Bread', pronunciation: 'pahn' },
              { word: 'Fromage', translation: 'Cheese', pronunciation: 'froh-MAHZH' },
              { word: 'Vin', translation: 'Wine', pronunciation: 'vahn' },
              { word: 'Eau', translation: 'Water', pronunciation: 'oh' },
              { word: 'Café', translation: 'Coffee', pronunciation: 'kah-FAY' },
              { word: 'Délicieux', translation: 'Delicious', pronunciation: 'day-lee-SYUH' }
            ]
          }
        ]
      }
    ]
  },
  German: {
    beginner: [
      {
        id: 'german-basic-greetings',
        title: 'Basic Greetings',
        description: 'Learn essential German greetings and introductions',
        level: 'Beginner',
        duration: 15,
        lessons: 5,
        completed: 0,
        type: 'vocabulary',
        difficulty: 1,
        image: '👋',
        topics: ['Greetings', 'Introductions', 'Politeness'],
        content: [
          {
            type: 'vocabulary',
            words: [
              { word: 'Hallo', translation: 'Hello', pronunciation: 'HAH-loh' },
              { word: 'Guten Morgen', translation: 'Good morning', pronunciation: 'GOO-ten MOR-gen' },
              { word: 'Guten Tag', translation: 'Good day', pronunciation: 'GOO-ten TAHK' },
              { word: 'Guten Abend', translation: 'Good evening', pronunciation: 'GOO-ten AH-bent' },
              { word: 'Auf Wiedersehen', translation: 'Goodbye', pronunciation: 'owf VEE-der-zayn' },
              { word: 'Wie geht es Ihnen?', translation: 'How are you?', pronunciation: 'vee gayt es EE-nen' },
              { word: 'Es geht mir gut', translation: 'I am fine', pronunciation: 'es gayt meer goot' },
              { word: 'Danke', translation: 'Thank you', pronunciation: 'DAHN-kuh' }
            ]
          }
        ]
      }
    ]
  }
};

// Helper function to get lessons by language and level
export const getLessonsByLanguage = (language, level = 'all') => {
  if (!lessonsData[language]) return [];
  
  if (level === 'all') {
    return [
      ...(lessonsData[language].beginner || []),
      ...(lessonsData[language].intermediate || []),
      ...(lessonsData[language].advanced || [])
    ];
  }
  
  return lessonsData[language][level] || [];
};

// Helper function to get all available languages
export const getAvailableLanguages = () => {
  return Object.keys(lessonsData);
};

// Helper function to get lesson by ID
export const getLessonById = (lessonId) => {
  for (const language in lessonsData) {
    for (const level in lessonsData[language]) {
      const lesson = lessonsData[language][level].find(l => l.id === lessonId);
      if (lesson) return lesson;
    }
  }
  return null;
};
