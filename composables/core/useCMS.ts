import { ref } from 'vue'

export const useCMS = () => {
  const loading = ref(false)
  const saving = ref(false)

  // Expanded CMS Configuration for End-to-End Control
  const cmsConfig = ref({
    global: {
      siteName: 'SCPSN',
      logoUrl: 'https://scpsn.org.ng/wp-content/uploads/2021/10/logo.png',
      socialLinks: {
        facebook: 'https://facebook.com/scpsn',
        twitter: 'https://x.com/thescpsn?t=b82RnKCDUjkS1Ljx4cfuOA&s=09',
        linkedin: 'https://www.linkedin.com/groups/15128005',
        instagram: 'https://www.instagram.com/thescpsn'
      },
      navigation: {
        main: [
          { label: 'Home', to: '/' },
          { label: 'About Us', to: '/about' },
          { label: 'Events', to: '/events' },
          { label: 'Research', to: '/research' },
          { label: 'Membership', to: '/membership' },
          { label: 'Contact', to: '/contact' }
        ],
        footer: [
          { label: 'Privacy Policy', to: '/privacy' },
          { label: 'Terms of Service', to: '/terms' },
          { label: 'FAQ', to: '/faq' }
        ]
      }
    },
    public: {
      home: {
        slides: [
          { tag: 'Welcome to SCPSN', title: 'Precision in Cellular Pathology', desc: 'Empowering medical laboratory scientists specializing in Histopathology and Cytopathology through innovation and global excellence.', image: '' },
          { tag: 'Academic Mastery', title: 'The Future of Histology', desc: 'Setting the benchmark for laboratory practices in Nigeria and the West African sub-region through rigorous standardization.', image: '' },
          { tag: 'Scientific Innovation', title: 'Mastery in Diagnostics', desc: 'Access advanced research resources, international conference materials, and world-class scientific journals.', image: '' }
        ],
        stats: [
          { label: 'Qualified Scientists', value: '1,200' },
          { label: 'Scientific Events', value: '82' },
          { label: 'Lab Networks', value: '450' },
          { label: 'Awards Issued', value: '45' }
        ],
        pillars: [
          { title: 'Standardization', desc: 'Implementing national protocols for diagnostic precision and laboratory excellence.', image: '' },
          { title: 'Collaboration', desc: 'Fostering partnerships with global scientific bodies and research institutions.', image: '' },
          { title: 'Innovation', desc: 'Pioneering AI-driven diagnostics and cutting-edge molecular pathology research.', image: '' },
          { title: 'Integrity', desc: 'Upholding the highest ethical standards in laboratory medicine and scientific reporting.', image: '' }
        ],
        initiatives: [
          { title: 'Digital Pathology Expansion', desc: 'Implementing Al-driven diagnostic tools in laboratories across Nigeria.', image: '' },
          { title: 'Cancer Screening Project', desc: 'Collaborating with oncology centers for early histopathology detection.', image: '' },
          { title: 'Molecular Genetics Hub', desc: 'A dedicated research initiative for genomic cellular analysis.', image: '' }
        ],
        tiers: [
          { title: 'Full Member', price: '50,000', features: ['Voting rights', 'Journal access', 'Conference discounts'] },
          { title: 'Associate Member', price: '30,000', features: ['Journal access', 'Resource vault'] },
          { title: 'Student Member', price: '10,000', features: ['Learning materials', 'Mentorship'] }
        ],
        homeHeaders: {
          pillarsTitle: 'Advancing the Frontiers of Cellular Diagnosis',
          pillarsSubtitle: 'The Society for Cellular Pathology Scientists of Nigeria is committed to instituting excellence in laboratory medicine across Africa.',
          initiativesTitle: 'Strategic Initiatives',
          initiativesSubtitle: 'Leading key scientific transformations in the healthcare sector.'
        }
      },
      about: {
        mission: 'To promote the study, research, and application of pharmacology and allied sciences for the improvement of human and animal health.',
        vision: 'To be the leading scientific society driving excellence in pharmacological research and practice in Africa.',
        history: 'Founded in 19xx, SCPSN has been at the forefront of clinical pharmacology...',
        aboutImage: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&q=80'
      },
      contact: {
        email: 'info@scpsn.org.ng',
        phone: '+234 800 000 0000',
        address: 'National Secretariat, SCPSN HQ',
        mapEmbedUrl: ''
      }
    },
    member: {
      portal: {
        siteName: 'Scientific Hub',
        siteInitials: 'SC',
        sidebarLogo: '',
        heroBg: '',
        loginBg: '',
        welcomeTitle: 'Welcome Back,',
        welcomeSubtitle: 'Your credentials have been re-validated for the current diagnostic cycle.',
        announcementTitle: 'Scientific Abstract Due',
        announcementText: 'The International Scientific Congress abstract submission is currently open for members.',
        announcementLink: '/dashboard/abstracts',
        guidelinesUrl: 'https://scpsn.org.ng/guidelines'
      },
      pages: {
        abstracts: {
          title: 'Research Abstracts',
          subtitle: 'Submit and manage your scientific papers and conference abstracts.',
          deadlineText: 'Call for Papers is Open until May 2026'
        },
        library: {
          title: 'Scientific Library',
          subtitle: 'Access the latest pathological archives and research papers.'
        },
        support: {
          title: 'Support & Helpdesk',
          subtitle: 'Need help? Reach our administrative or technical teams.'
        },
        payments: {
          title: 'Financial Ledger',
          subtitle: 'Monitor and manage your membership dues and conference payments.'
        },
        portfolio: {
          title: 'Practitioner Profile',
          subtitle: 'Manage your scientific identity and registry credentials.'
        }
      }
    }
  })

  const loadCMS = async () => {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 800))
    } finally {
      loading.value = false
    }
  }

  const saveCMS = async (payload: any) => {
    saving.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 1200))
      cmsConfig.value = JSON.parse(JSON.stringify(payload))
      return true
    } catch (err) {
      throw new Error('Failed to save global CMS configuration.')
    } finally {
      saving.value = false
    }
  }

  return {
    loading,
    saving,
    cmsConfig,
    loadCMS,
    saveCMS
  }
}
