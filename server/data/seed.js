const mongoose = require('mongoose');
const dotenv = require('dotenv');

const Zone = require('../models/Zone');
const Pandal = require('../models/Pandal');
const Progress = require('../models/Progress');

dotenv.config({ path: ['.env.development.local', '.env'] });

const data = [
  {
    zone: 'Jodhpur Park',
    items: [
      { name: 'Taltala', maps: 'https://maps.apple/p/BC3SAzi_JGIYrc' },
      { name: 'Jodhpur Park', maps: 'https://share.google/B53vhiLhhbzMvqB9t' },
      { name: '95 Pally', maps: 'https://share.google/7IBsnG7oipUmKgnF7' },
    ],
  },

  {
    zone: 'Sarovar',
    items: [
      {
        name: 'Mudiali',
        maps: 'https://share.google/SNvPUA7LDIz9TiOjr',
        visited: true,
      },
      {
        name: 'Lake Youth Corner',
        maps: 'https://share.google/PO8ViidmUxLYgoiml',
        uncertain: true,
      },
      {
        name: 'Sibmandir',
        maps: 'https://share.google/ScW1l0Kb2hY0niaOn',
        visited: true,
      },
      {
        name: 'Pratapaditya Tricone Park',
        maps: 'https://share.google/0FOoSiTBcyziT2hA2',
        visited: true,
      },
      {
        name: 'Tarun Sangha (Sarovar)',
        maps: 'https://share.google/8QQlKrbliInZiafq3',
      },
      {
        name: 'Sevak Sangha',
        maps: 'https://share.google/8WNPwr2YbjRGZOXoN',
        uncertain: true,
      },
      {
        name: 'Bengal Cuited Dub',
        uncertain: true,
      },
    ],
  },

  {
    zone: 'Kalighat–Gariahat',
    items: [
      { name: 'Tridhara Sammilani (Deshopriya Park)' },
      { name: 'Badamtala Ashar Sangha', visited: true },
      {
        name: 'Kalighat Yaba Maity Durga Puja (near Hazra)',
        uncertain: true,
      },
      { name: 'Deshapriya Park' },
      { name: '66 Pally', visited: true },
      { name: 'Nepal Bhattacharya Street', visited: true },
      { name: '27 Pally Park' },
      { name: 'Ballygunge Cultural' },
      { name: 'Kalighat Mahashakti Durga Puja' },
      { name: 'Kalighat 64 Pally Durga Pujo' },
      { name: 'Sanghashree' },
      { name: 'Kalighat Sree Sangha' },
      { name: 'Maitri Sangha' },
      { name: 'Lake Sarbojanin' },
      { name: 'Adi Lake Palli Club' },
      { name: 'Sarat Bose Road Durga Puja' },
      { name: 'Nandalal Park Sarbojanin Durga Puja' },
      { name: 'Samaj Sebi Sangha', uncertain: true },
    ],
  },

  {
    zone: 'Salt Lake',
    items: [
      { name: 'Salt Lake AB Block' },
      { name: 'Salt Lake AD Block' },
      { name: 'Salt Lake AE Block' },
      { name: 'Salt Lake AK Block' },
      { name: 'Salt Lake EE Block' },
      { name: 'Salt Lake FD Block' },
      { name: 'Newtown Sarbojanin' },
    ],
  },

  {
    zone: 'Gariahat–Kasba',
    items: [
      { name: 'Ekdalia Evergreen' },
      { name: 'Hindustan Park' },
      { name: 'Singhi Park' },
      { name: 'Tarun Bindso Sarbojanin', uncertain: true },
      { name: 'Tarun Sangha (Kasba)' },
      { name: 'Gariahat Sarbojanin' },
      { name: 'Hindustan Tarun Sangha' },
      { name: 'Bosepukur Talbagan' },
      { name: 'Naba Udayan Sangha' },
      { name: 'Hindustan Club', uncertain: true },
    ],
  },

  {
    zone: 'Esplanade–Shyambazar',
    items: [
      { name: 'Lattu Babu Chhatu Babu Rajbari (GP)' },
      { name: 'Rani Rashmoni Bari' },
      { name: 'Jorasanko Thakurbari (GP)' },
      { name: 'Charbagan Sarbojanin (MG Road)' },
      {
        name: 'Ahiritola Jubak Brinda Sarbojanin',
        visited: true,
      },
      {
        name: 'Shobhabazar Benatola Sarbojanin',
        visited: true,
      },
      { name: 'Nimtala Sarbojanin' },
      { name: 'Shobhabazar Rajbari' },
      { name: 'Basubati Rajbari (Bagbazar)' },
      {
        name: 'Nalin Sarkar Street (near Hatibagan)',
        visited: true,
      },
      { name: 'Nabin Pally', visited: true },
      { name: 'Sikdar Bagan', visited: true },
      { name: 'Hatibagan Sarbojanin', visited: true },
      { name: 'Kashi Bose Lane', visited: true },
      { name: 'Beniatola', visited: true },
      { name: 'Ahiritola Sarbojanin', uncertain: true },
    ],
  },

  {
    zone: 'Belgachia–Dumdum',
    items: [
      { name: 'Shreebhumi (near Belgachia)' },
      { name: 'Tala Prattoy (near Belgachia)' },
      { name: 'Dumdum Park Bharat Chakra (Belgachia)' },
      { name: 'Amra Sobai Club (near Nagerbazar)' },
      { name: 'Dumdum Park Tarun Sangha' },
      { name: 'Dumdum Park Tarun Dal' },
    ],
  },

  {
    zone: 'Behala (Chowrasta / Sakher Bazar)',
    items: [
      { name: 'Barisha Yubak Brinda' },
      { name: 'Behala Club (B.C.)' },
      { name: 'Behala Sarbojanin (B.C.)' },
      { name: "Behala Players' Corner (B.L.)" },
      { name: 'Barisha Sadhanatri (S.B2)' },
      { name: 'Barisha Udayan Palli (S.B2)' },
      { name: 'Barisha Tapovan Club (S.B2)' },
      { name: 'SBI Park Sarbojanin (S.B2)' },
      { name: 'Barisha Youth Club (S.BZ)' },
    ],
  },

  {
    zone: 'Netaji (Tollygunge Side – Haridevpur)',
    items: [
      { name: 'Tarun Dal' },
      { name: 'Pally Unnayan Samity' },
      { name: 'Haridevpur Vivekananda Sporting Club' },
      { name: 'Haridevpur Adarsh Samity' },
      { name: 'Haridevpur New Sporting Club' },
      { name: 'Haridevpur Ajeya Sanghati' },
      { name: 'Haridevpur Vivekananda Park' },
      { name: 'Haridevpur 41 Pally' },
    ],
  },

  {
    zone: 'Jatin Das Park / Hazra',
    items: [
      { name: 'Maddox Square' },
      { name: 'Rupchand Mukherjee Lane Sarbojanin' },
      { name: '64 Pally' },
      { name: 'Hazra Park' },
      { name: 'Peyarar Bagan (near Maddox Square)' },
      { name: 'Bakul Bagan' },
      { name: 'Golmath Durga Puja Samiti', uncertain: true },
      { name: 'Abasar Sarbojanin' },
      { name: 'Kalighat Milan Sangha' },
      { name: 'Ballygunge Pally' },
    ],
  },

  {
    zone: 'Netaji Bhawan / Bhowanipore',
    items: [
      { name: '75 Pally' },
      { name: 'Chakraberia Sarbojanin' },
      { name: 'Northern Park' },
      { name: '68 Pally' },
      { name: 'Swadhin Sangha' },
    ],
  },

  {
    zone: 'Uncategorised',
    items: [
      { name: 'Bagbazar' },
      { name: 'Kumartuli' },
    ],
  },
];

/**
 * Seed database
 */
const seed = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error(
        'MONGO_URI missing. Please add it to your .env file.'
      );
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log('MongoDB connected for seeding');

    /*
     * WARNING:
     * These collections are cleared before inserting the seed data.
     * This is fine for your currently empty database.
     */
    console.log('Clearing existing data...');

    await Progress.deleteMany({});
    await Pandal.deleteMany({});
    await Zone.deleteMany({});

    /*
     * ---------------------------------------------------------
     * 1. Create Zones
     * ---------------------------------------------------------
     */
    const zoneDocuments = await Zone.insertMany(
      data.map((zoneEntry) => ({
        name: zoneEntry.zone,
      }))
    );

    console.log(`Created ${zoneDocuments.length} zones`);

    /*
     * Map zone name -> MongoDB ObjectId
     */
    const zoneMap = new Map(
      zoneDocuments.map((zone) => [zone.name, zone._id])
    );

    /*
     * ---------------------------------------------------------
     * 2. Prepare Pandals
     * ---------------------------------------------------------
     *
     * We keep visited/uncertain information temporarily in
     * pandalSeeds because "visited" actually belongs to the
     * Progress collection.
     */
    const pandalSeeds = [];

    for (const zoneEntry of data) {
      const zoneId = zoneMap.get(zoneEntry.zone);

      for (const item of zoneEntry.items) {
        pandalSeeds.push({
          name: item.name,
          zone: zoneId,
          maps: item.maps || '',
          adminNote: item.adminNote || '',
          uncertain: Boolean(item.uncertain),
          visited: Boolean(item.visited),
          note: item.note || '',
        });
      }
    }

    /*
     * ---------------------------------------------------------
     * 3. Create Pandals
     * ---------------------------------------------------------
     */
    const pandalDocuments = await Pandal.insertMany(
      pandalSeeds.map((pandal) => ({
        name: pandal.name,
        zone: pandal.zone,
        maps: pandal.maps,
        adminNote: pandal.adminNote,
        uncertain: pandal.uncertain,
      }))
    );

    console.log(`Created ${pandalDocuments.length} pandals`);

    /*
     * ---------------------------------------------------------
     * 4. Create Progress records
     * ---------------------------------------------------------
     *
     * Only create Progress documents for pandals that were
     * already marked as visited in the original tracker.
     */
    const progressDocuments = [];

    pandalSeeds.forEach((pandalSeed, index) => {
      if (pandalSeed.visited) {
        progressDocuments.push({
          pandalId: pandalDocuments[index]._id,
          visited: true,
          note: pandalSeed.note,
        });
      }
    });

    if (progressDocuments.length > 0) {
      await Progress.insertMany(progressDocuments);
    }

    console.log(
      `Created ${progressDocuments.length} progress records`
    );

    /*
     * ---------------------------------------------------------
     * Done
     * ---------------------------------------------------------
     */
    console.log('');
    console.log('====================================');
    console.log('Database seeded successfully!');
    console.log('====================================');
    console.log(`Zones:     ${zoneDocuments.length}`);
    console.log(`Pandals:   ${pandalDocuments.length}`);
    console.log(`Visited:   ${progressDocuments.length}`);
    console.log('====================================');

    await mongoose.connection.close();

    process.exit(0);
  } catch (error) {
    console.error('');
    console.error('Seed failed:', error.message);

    await mongoose.connection.close();

    process.exit(1);
  }
};

seed();