const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Team = require('./models/Team');

const TEAMS_SEED = [
  {
    name: "University of Ilinois at Urbana Champaign",
    short_name: "UIUC",
    rivalries: [],
    conference: "BIG 10",
    primary_color: "#FF5F05",
    total_likes: 2000,
    organic_likes: 0,
    boosted_likes: 2000
  },
  {
    name: "University of Alabama",
    short_name: "BAMA",
    mascot: "Crimson Tide",
    conference: "SEC",
    primary_color: "#9E1B32",
    secondary_color: "#FFFFFF",
    total_likes: 7120, // 3800 + 3320
    organic_likes: 3800,
    boosted_likes: 3320
  },
  {
    name: "University of Georgia",
    short_name: "UGA",
    mascot: "Bulldogs",
    rivalries: [],
    conference: "SEC",
    primary_color: "#BA0C2F",
    secondary_color: "#000000",
    total_likes: 7290,
    organic_likes: 3200,
    boosted_likes: 4090
  },
  {
    name: "University of Texas",
    short_name: "TEX",
    mascot: "Longhorns",
    conference: "SEC",
    primary_color: "#BF5700",
    secondary_color: "#FFFFFF",
    total_likes: 3650,
    organic_likes: 2900,
    boosted_likes: 750
  },
  {
    name: "Ohio State University",
    short_name: "OSU",
    mascot: "Buckeyes",
    conference: "BIG 10",
    primary_color: "#BB0000",
    secondary_color: "#666666",
    total_likes: 4100,
    organic_likes: 3500,
    boosted_likes: 600
  },
  {
    name: "University of Michigan",
    short_name: "MICH",
    mascot: "Wolverines",
    conference: "BIG 10",
    primary_color: "#00274C",
    secondary_color: "#FFCB05",
    total_likes: 3780,
    organic_likes: 3100,
    boosted_likes: 680
  },
  {
    name: "Penn State University",
    short_name: "PSU",
    mascot: "Nittany Lions",
    conference: "BIG 10",
    primary_color: "#041E42",
    secondary_color: "#FFFFFF",
    total_likes: 2890,
    organic_likes: 2400,
    boosted_likes: 490
  },
  {
    name: "University of Oklahoma",
    short_name: "OU",
    mascot: "Sooners",
    conference: "SEC",
    primary_color: "#841617",
    secondary_color: "#FDF9D8",
    total_likes: 2950,
    organic_likes: 2500,
    boosted_likes: 450
  },
  {
    name: "Texas Tech University",
    short_name: "TTU",
    mascot: "Red Raiders",
    conference: "BIG 12",
    primary_color: "#CC0000",
    secondary_color: "#000000",
    total_likes: 2100,
    organic_likes: 1800,
    boosted_likes: 300
  },
  {
    name: "University of Kansas",
    short_name: "KU",
    mascot: "Jayhawks",
    conference: "BIG 12",
    primary_color: "#0051BA",
    secondary_color: "#E8000D",
    total_likes: 1950,
    organic_likes: 1600,
    boosted_likes: 350
  },
  {
    name: "Baylor University",
    short_name: "BU",
    mascot: "Bears",
    conference: "BIG 12",
    primary_color: "#154734",
    secondary_color: "#FFB81C",
    total_likes: 1820,
    organic_likes: 1500,
    boosted_likes: 320
  },
  {
    name: "LSU",
    short_name: "LSU",
    mascot: "Tigers",
    conference: "SEC",
    primary_color: "#461D7C",
    secondary_color: "#FDD023",
    total_likes: 3200,
    organic_likes: 2700,
    boosted_likes: 500
  },
  {
    name: "University of Wisconsin",
    short_name: "WIS",
    mascot: "Badgers",
    conference: "BIG 10",
    primary_color: "#C5050C",
    secondary_color: "#FFFFFF",
    total_likes: 0,
    organic_likes: 0,
    boosted_likes: 0
  }
];

dotenv.config();

const seedDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/bfbr';
    await mongoose.connect(uri);
    
    console.log('Clearing existing teams...');
    await Team.deleteMany({});
    
    console.log('Seeding teams...');
    await Team.insertMany(TEAMS_SEED);
    
    console.log('Seeding completed perfectly!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedDB();
