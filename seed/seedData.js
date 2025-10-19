
require('dotenv').config();
const mongoose = require('mongoose');
const Formation = require('../models/Formation');
const User = require('../models/User');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

const formations = [
  {
    formationId: 'solidworks-3d',
    name: 'SOLIDWORKS 3D CAD',
    formationRef: 'SW-3D-001',
    software: 'SOLIDWORKS',
    prerequisites: 'Connaissance de base en dessin technique et utilisation d\'un ordinateur',
    objectives: 'Maîtriser les fonctionnalités de base de SOLIDWORKS pour la conception 3D',
    competencies: 'Création de pièces 3D, assemblages, mises en plan',
    schedule: [
      {
        day: 'J1',
        content: 'Introduction à SOLIDWORKS - Interface et navigation',
        methods: 'Présentation théorique, démonstrations pratiques',
        theoryHours: '3',
        practiceHours: '3'
      },
      {
        day: 'J2',
        content: 'Fonctions de base 3D - Extrusion, révolution',
        methods: 'Exercices pratiques, projets individuels',
        theoryHours: '2',
        practiceHours: '4'
      },
      {
        day: 'J3',
        content: 'Assemblages et mise en plan',
        methods: 'Projet final, évaluation pratique',
        theoryHours: '2',
        practiceHours: '4'
      }
    ]
  },
  {
    formationId: 'abaqus-basics',
    name: 'ABAQUS CAE Fundamentals',
    formationRef: 'ABQ-FUN-001',
    software: 'ABAQUS',
    prerequisites: 'Connaissances en mécanique des milieux continus',
    objectives: 'Maîtriser les bases d\'ABAQUS pour l\'analyse par éléments finis',
    competencies: 'Modélisation FEA, analyse statique et dynamique',
    schedule: [
      {
        day: 'J1',
        content: 'Introduction à ABAQUS/CAE',
        methods: 'Présentation logiciel, tutoriels guidés',
        theoryHours: '3',
        practiceHours: '3'
      },
      {
        day: 'J2',
        content: 'Propriétés matériaux et maillage',
        methods: 'Exercices de maillage, études de convergence',
        theoryHours: '3',
        practiceHours: '3'
      }
    ]
  },
  {
    formationId: 'mastercam-mill',
    name: 'MasterCAM Mill Basics',
    formationRef: 'MCM-MIL-001',
    software: 'MasterCAM',
    prerequisites: 'Connaissance en usinage conventionnel',
    objectives: 'Programmer des opérations de fraisage avec MasterCAM',
    competencies: 'Programmation CN, parcours d\'outils',
    schedule: [
      {
        day: 'J1',
        content: 'Interface MasterCAM - Géométrie 2D/3D',
        methods: 'Navigation logiciel, création géométrique',
        theoryHours: '3',
        practiceHours: '3'
      },
      {
        day: 'J2',
        content: 'Parcours d\'outils 2D',
        methods: 'Programmation guidée, simulations',
        theoryHours: '2',
        practiceHours: '4'
      }
    ]
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing formations
    await Formation.deleteMany({});
    console.log('🗑️  Cleared existing formations');

    // Insert seed data
    await Formation.insertMany(formations);
    console.log('✅ Seed formations added');

    // Create admin user if doesn't exist
    const adminExists = await User.findOne({ email: 'admin@abbk.com' });
    if (!adminExists) {
      const admin = new User({
        name: 'Admin ABBK',
        email: 'admin@abbk.com',
        password: 'admin123',
        role: 'admin'
      });
      await admin.save();
      console.log('✅ Admin user created (email: admin@abbk.com, password: admin123)');
    }

    console.log('🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedDatabase();