const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding gamification data...');

  // 1. Seed Achievements
  const achievements = [
    {
      title: 'First Step',
      description: 'Log in for the first time',
      type: 'STREAK',
      requirement_value: 1,
      rarity: 'COMMON',
      icon: '🎯'
    },
    {
      title: 'Quiz Master',
      description: 'Complete 10 quizzes',
      type: 'QUIZ',
      requirement_value: 10,
      rarity: 'RARE',
      icon: '🧠'
    },
    {
      title: 'Top Scorer',
      description: 'Score 90+ in a quiz',
      type: 'QUIZ',
      requirement_value: 90,
      rarity: 'EPIC',
      icon: '🏆'
    },
    {
      title: 'Social Butterfly',
      description: 'Post 5 messages in the forum',
      type: 'FORUM',
      requirement_value: 5,
      rarity: 'COMMON',
      icon: '🦋'
    },
    {
      title: 'Weekly Warrior',
      description: 'Maintain a 7-day streak',
      type: 'STREAK',
      requirement_value: 7,
      rarity: 'RARE',
      icon: '🔥'
    },
    {
      title: 'Level Up!',
      description: 'Reach Level 5',
      type: 'LEVEL',
      requirement_value: 5,
      rarity: 'RARE',
      icon: '🚀'
    }
  ];

  for (const ach of achievements) {
    await prisma.achievement.upsert({
      where: { id: ach.title.toLowerCase().replace(/ /g, '-') },
      update: ach,
      create: {
        id: ach.title.toLowerCase().replace(/ /g, '-'),
        ...ach
      }
    });
  }

  // 2. Seed Avatars
  const avatars = [
    {
      name: 'Novice Scholar',
      image_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=novice',
      rarity: 'COMMON',
      unlock_type: 'LEVEL',
      unlock_value: 1
    },
    {
      name: 'Code Wizard',
      image_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=wizard',
      rarity: 'RARE',
      unlock_type: 'LEVEL',
      unlock_value: 5
    },
    {
      name: 'Quiz Ninja',
      image_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=ninja',
      rarity: 'EPIC',
      unlock_type: 'STREAK',
      unlock_value: 15
    },
    {
      name: 'Legendary Mentor',
      image_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=legend',
      rarity: 'LEGENDARY',
      unlock_type: 'LEADERBOARD',
      unlock_value: 1
    }
  ];

  for (const av of avatars) {
    await prisma.avatar.upsert({
      where: { id: av.name.toLowerCase().replace(/ /g, '-') },
      update: av,
      create: {
        id: av.name.toLowerCase().replace(/ /g, '-'),
        ...av
      }
    });
  }

  // 3. Seed Missions
  const now = new Date();
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const missions = [
    {
      title: 'Daily Check-in',
      description: 'Login to LearnWave today',
      xp_reward: 20,
      type: 'DAILY',
      action_type: 'LOGIN',
      target_value: 1,
      active_from: now,
      active_to: endOfDay
    },
    {
      title: 'Quiz Challenge',
      description: 'Complete 1 quiz today',
      xp_reward: 50,
      type: 'DAILY',
      action_type: 'QUIZ_COMPLETED',
      target_value: 1,
      active_from: now,
      active_to: endOfDay
    }
  ];

  for (const m of missions) {
    await prisma.mission.upsert({
      where: { id: m.title.toLowerCase().replace(/ /g, '-') },
      update: m,
      create: {
        id: m.title.toLowerCase().replace(/ /g, '-'),
        ...m
      }
    });
  }

  console.log('✅ Gamification seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
