import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Beleqet database...');

  // ── Job Categories ─────────────────────────────────────────────────────────
  const rawJobCategories = [
    "Accounting And Finance", "Advisory And Consultancy", "Aeronautics And Aerospace",
    "Agriculture", "Architecture And Urban Planning", "Beauty And Grooming",
    "Broker And Case Closer", "Business And Commerce", "Chemical And Biomedical Engineering",
    "Clothing And Textile", "Construction And Civil Engineering", "Creative Art And Design",
    "Customer Service And Care", "Data Mining And Analytics", "Documentation And Writing Services",
    "Entertainment", "Environmental And Energy Engineering", "Event Management And Organization",
    "Fashion Design", "Food And Drink Preparation Or Service", "Gardening And Landscaping",
    "Health Care", "Horticulture", "Hospitality And Tourism", "Human Resource And Talent Management",
    "Information Technology", "Installation And Maintenance Technician", "Janitorial And Other Office Services",
    "Labor Work And Masonry", "Law", "Livestock And Animal Husbandry", "Logistic And Supply Chain",
    "Manufacturing And Production", "Marketing And Advertisement", "Mechanical And Electrical Engineering",
    "Media And Communication", "Multimedia Content Production", "Pharmaceutical",
    "Project Management And Administration", "Psychiatry, Psychology And Social Work",
    "Purchasing And Procurement", "Research And Data Analytics", "Sales And Promotion",
    "Secretarial And Office Management", "Security And Safety", "Shop And Office Attendant",
    "Software Design And Development", "Teaching And Tutor", "Training And Consultancy",
    "Training And Mentorship", "Translation And Transcription", "Transportation",
    "Transportation And Delivery", "Veterinary", "Woodwork And Carpentry"
  ];

  const categories = await Promise.all(
    rawJobCategories.map(cat => {
      const slug = cat.toLowerCase().replace(/[, ]+/g, '-').replace(/-+$/g, '');
      return prisma.jobCategory.upsert({
        where: { slug },
        update: {},
        create: { slug, label: cat, icon: 'briefcase' } // generic icon as default
      });
    })
  );
  console.log('✅ Job categories created');

  // ── Freelance Categories ───────────────────────────────────────────────────
  await Promise.all([
    prisma.freelanceCategory.upsert({ where: { slug: 'graphic-design' },    update: {}, create: { slug: 'graphic-design',    label: 'Graphic Design',      icon: 'palette' } }),
    prisma.freelanceCategory.upsert({ where: { slug: 'web-development' },   update: {}, create: { slug: 'web-development',   label: 'Web Development',     icon: 'code-2' } }),
    prisma.freelanceCategory.upsert({ where: { slug: 'digital-marketing' }, update: {}, create: { slug: 'digital-marketing', label: 'Digital Marketing',   icon: 'megaphone' } }),
    prisma.freelanceCategory.upsert({ where: { slug: 'video-animation' },   update: {}, create: { slug: 'video-animation',   label: 'Video & Animation',   icon: 'clapperboard' } }),
    prisma.freelanceCategory.upsert({ where: { slug: 'writing' },           update: {}, create: { slug: 'writing',           label: 'Writing & Translation', icon: 'pen-line' } }),
  ]);
  console.log('Freelance categories created');

  // ── Demo Employer & Company ──────────────────────────────────────────────
  const employerPassword = await bcrypt.hash('password123', 10);
  const employer = await prisma.user.upsert({
    where: { email: 'employer@beleqet.com' },
    update: {},
    create: {
      email: 'employer@beleqet.com',
      passwordHash: employerPassword,
      firstName: 'Demo',
      lastName: 'Employer',
      role: 'EMPLOYER',
      emailVerified: true,
      company: {
        create: {
          name: 'Tech Solutions PLC',
          description: 'A leading tech company in Addis Ababa.',
          website: 'https://techsolutions.com',
          logoUrl: 'https://via.placeholder.com/150',
          industry: 'IT & Software',
        }
      }
    },
    include: { company: true }
  });

  console.log('Demo employer and company created');

  // ── Demo Jobs ──────────────────────────────────────────────────────────────
  const softwareCategory = await prisma.jobCategory.findFirst({ where: { slug: 'software-design-and-development' } });
  const marketingCategory = await prisma.jobCategory.findFirst({ where: { slug: 'marketing-and-advertisement' } });

  if (softwareCategory && marketingCategory && employer.company) {
    await prisma.job.createMany({
      skipDuplicates: true,
      data: [
        {
          title: 'Senior Frontend Developer',
          description: 'We are looking for a Senior React Developer to join our team. You will be building scalable UIs with Next.js.',
          requirements: '3+ years experience, React, Next.js, Tailwind CSS',
          location: 'Addis Ababa',
          type: 'FULL_TIME',
          categoryId: softwareCategory.id,
          companyId: employer.company.id,
          status: 'PUBLISHED',
          featured: true,
          salaryMin: 40000,
          salaryMax: 60000,
          currency: 'ETB',
        },
        {
          title: 'Backend Node.js Engineer',
          description: 'Join us to build high-performance APIs using NestJS and PostgreSQL.',
          requirements: 'NestJS, Prisma, PostgreSQL, Docker',
          location: 'Remote',
          type: 'REMOTE',
          categoryId: softwareCategory.id,
          companyId: employer.company.id,
          status: 'PUBLISHED',
          featured: false,
          salaryMin: 50000,
          salaryMax: 80000,
          currency: 'ETB',
        },
        {
          title: 'Digital Marketing Specialist',
          description: 'Help us grow our brand presence online with SEO and social media campaigns.',
          requirements: 'SEO, Google Ads, Content Strategy',
          location: 'Addis Ababa',
          type: 'FULL_TIME',
          categoryId: marketingCategory.id,
          companyId: employer.company.id,
          status: 'PUBLISHED',
          featured: true,
          salaryMin: 25000,
          salaryMax: 35000,
          currency: 'ETB',
        }
      ]
    });
    console.log('Demo jobs created');
  }

  console.log('\n Database seeded successfully with Categories & Demo Jobs!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
