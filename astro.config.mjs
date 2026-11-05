// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
  site: 'https://gameboyghost.sh',
  integrations: [
    starlight({
      title: 'GameBoyGhost',
      description:
        "The operator's guide to a deterministic, auditable, agent-assisted ML pipeline that learns a Game Boy game.",
      customCss: ['./src/styles/custom.css'],
      components: {
        Banner: './src/components/StatusBanner.astro',
        Footer: './src/components/Footer.astro',
      },
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/foxmedik/GameBoyGhost' },
        { icon: 'youtube', label: 'YouTube', href: 'https://www.youtube.com/@GameboyGhost-dx' },
      ],
      sidebar: [
        {
          label: 'Start here',
          items: [
            { label: 'Status', slug: 'status' },
            { label: 'How to read this guide', slug: 'how-to-read' },
          ],
        },
        {
          label: 'Tour: the big picture',
          items: [
            { label: 'The pitch', slug: 'pitch' },
            { label: 'Architecture', slug: 'architecture' },
            { label: 'Principles, translated', slug: 'principles' },
            { label: 'War stories', slug: 'war-stories' },
          ],
        },
        {
          label: 'Operator: running it',
          items: [
            { label: 'Stack setup', slug: 'setup' },
            { label: 'The daily loop', slug: 'daily-loop' },
            { label: 'CLI reference', slug: 'cli' },
            { label: 'Shell and agent security', slug: 'security' },
            { label: 'Batch cookbook', slug: 'cookbook' },
          ],
        },
        {
          label: 'Builder: how it works',
          items: [
            { label: 'The campaign system', slug: 'campaigns' },
            { label: 'The learning stack', slug: 'learning-stack' },
            { label: 'The oracle up close', slug: 'oracle' },
            { label: 'The supervisor ("foreman")', slug: 'supervisor' },
            { label: 'Data and publishing', slug: 'data-publishing' },
          ],
        },
        {
          label: 'Reference',
          items: [
            { label: 'Glossary', slug: 'glossary' },
            { label: 'Appendix A: Command cheat sheet', slug: 'appendix-cheatsheet' },
            { label: 'Appendix B: AGENTS.md explained', slug: 'appendix-agents-md' },
            { label: 'Appendix C: Troubleshooting', slug: 'appendix-troubleshooting' },
          ],
        },
      ],
    }),
  ],
});
